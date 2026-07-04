import { getSupabaseAdmin, isSupabaseConfigured } from "../db/supabase.js";
import { embedText, embedTexts, isEmbeddingAvailable } from "./embeddings.js";

export const KNOWLEDGE_SOURCE_TYPES = [
  "brand_guide",
  "product_desc",
  "history_copy",
  "subreddit_rules",
  "campaign_strategy",
] as const;

export type KnowledgeSourceType = (typeof KNOWLEDGE_SOURCE_TYPES)[number];

export type KnowledgeDocument = {
  id: string;
  title: string;
  sourceType: KnowledgeSourceType;
  tags: string[];
  language: "en" | "zh";
  performanceWeight: number;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeChunkMatch = {
  id: string;
  documentId: string;
  title: string;
  content: string;
  sourceType: KnowledgeSourceType;
  tags: string[];
  performanceWeight: number;
  similarity: number;
  combinedScore: number;
};

const CHUNK_CHAR_LIMIT = 1400;

export function isKnowledgeConfigured(): boolean {
  return isSupabaseConfigured() && isEmbeddingAvailable();
}

export function assertKnowledgeReady(): void {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!isEmbeddingAvailable()) {
    throw new Error("OpenAI embeddings are not configured. Set OPENAI_API_KEY.");
  }
}

export function isKnowledgeSourceType(value: unknown): value is KnowledgeSourceType {
  return typeof value === "string" && (KNOWLEDGE_SOURCE_TYPES as readonly string[]).includes(value);
}

function mapDocumentRow(row: Record<string, unknown>): KnowledgeDocument {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    sourceType: String(row.source_type) as KnowledgeSourceType,
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    language: String(row.language ?? "en") as "en" | "zh",
    performanceWeight: Number(row.performance_weight ?? 0.5),
    chunkCount: Number(row.chunk_count ?? 0),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function mapMatchRow(row: Record<string, unknown>): KnowledgeChunkMatch {
  return {
    id: String(row.id),
    documentId: String(row.document_id),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    sourceType: String(row.source_type) as KnowledgeSourceType,
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    performanceWeight: Number(row.performance_weight ?? 0.5),
    similarity: Number(row.similarity ?? 0),
    combinedScore: Number(row.combined_score ?? 0),
  };
}

/** Split long text into paragraph-aware chunks for embedding. */
export function chunkText(text: string, maxChars = CHUNK_CHAR_LIMIT): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let buffer = "";

  const flush = () => {
    const t = buffer.trim();
    if (t) chunks.push(t);
    buffer = "";
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      flush();
      for (let i = 0; i < paragraph.length; i += maxChars) {
        chunks.push(paragraph.slice(i, i + maxChars).trim());
      }
      continue;
    }
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (candidate.length > maxChars) {
      flush();
      buffer = paragraph;
    } else {
      buffer = candidate;
    }
  }
  flush();
  return chunks.filter(Boolean);
}

export async function listKnowledgeDocuments(limit = 50): Promise<KnowledgeDocument[]> {
  assertKnowledgeReady();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapDocumentRow(row as Record<string, unknown>));
}

export async function ingestKnowledgeDocument(input: {
  title: string;
  content: string;
  sourceType: KnowledgeSourceType;
  tags?: string[];
  language?: "en" | "zh";
  performanceWeight?: number;
}): Promise<KnowledgeDocument> {
  assertKnowledgeReady();
  const chunks = chunkText(input.content);
  if (chunks.length === 0) throw new Error("Content is empty");

  const supabase = getSupabaseAdmin();
  const performanceWeight = Math.min(1, Math.max(0, input.performanceWeight ?? 0.5));
  const language = input.language ?? "en";
  const tags = input.tags ?? [];

  const { data: doc, error: docError } = await supabase
    .from("knowledge_documents")
    .insert({
      title: input.title.trim(),
      source_type: input.sourceType,
      tags,
      language,
      performance_weight: performanceWeight,
      chunk_count: chunks.length,
    })
    .select("*")
    .single();
  if (docError || !doc) throw new Error(docError?.message ?? "Failed to create document");

  const embeddings = await embedTexts(chunks);
  const rows = chunks.map((content, index) => ({
    document_id: doc.id,
    chunk_index: index,
    title: input.title.trim(),
    content,
    source_type: input.sourceType,
    tags,
    language,
    performance_weight: performanceWeight,
    metadata: { chunkTotal: chunks.length },
    embedding: embeddings[index],
  }));

  const { error: chunkError } = await supabase.from("knowledge_chunks").insert(rows);
  if (chunkError) {
    await supabase.from("knowledge_documents").delete().eq("id", doc.id);
    throw new Error(chunkError.message);
  }

  return mapDocumentRow(doc as Record<string, unknown>);
}

export async function deleteKnowledgeDocument(id: string): Promise<void> {
  assertKnowledgeReady();
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("knowledge_documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function searchKnowledge(input: {
  query: string;
  topK?: number;
  sourceType?: KnowledgeSourceType;
  language?: "en" | "zh";
}): Promise<KnowledgeChunkMatch[]> {
  if (!isKnowledgeConfigured()) return [];
  const query = input.query.trim();
  if (!query) return [];

  const embedding = await embedText(query);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("match_knowledge_chunks", {
    query_embedding: embedding,
    match_count: input.topK ?? 5,
    filter_source_type: input.sourceType ?? null,
    filter_language: input.language ?? null,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapMatchRow(row as Record<string, unknown>));
}

export async function ingestGeneratedIdeas(input: {
  ideas: Array<{ title: string; postTitle: string; postBody: string; angle?: string }>;
  language: "en" | "zh";
  performanceWeight?: number;
  tags?: string[];
}): Promise<KnowledgeDocument | null> {
  if (!isKnowledgeConfigured() || input.ideas.length === 0) return null;

  const body = input.ideas
    .map(
      (idea, i) =>
        `[Example ${i + 1}]\nTitle: ${idea.postTitle}\nAngle: ${idea.angle ?? idea.title}\nBody:\n${idea.postBody}`
    )
    .join("\n\n---\n\n");

  return ingestKnowledgeDocument({
    title: `Generated copy batch (${new Date().toISOString().slice(0, 10)})`,
    content: body,
    sourceType: "history_copy",
    tags: input.tags ?? ["reddit", "generated"],
    language: input.language,
    performanceWeight: input.performanceWeight ?? 0.55,
  });
}
