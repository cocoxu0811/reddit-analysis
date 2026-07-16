import { isKnowledgeConfigured, searchKnowledge, type KnowledgeChunkMatch } from "./knowledge.js";

/**
 * Pull brand visual guidelines from the RAG knowledge base.
 * Returns a formatted text block suitable for injection into image generation prompts.
 */
export async function fetchBrandDnaForImageGen(input: {
  productName?: string;
  tags?: string[];
  language?: "en" | "zh";
}): Promise<string> {
  if (!isKnowledgeConfigured()) return "";

  const queryParts = ["brand visual style guide color palette photography"];
  if (input.productName) queryParts.push(input.productName);
  if (input.tags?.length) queryParts.push(input.tags.join(" "));

  const query = queryParts.join(" ").slice(0, 1500);

  const matches: KnowledgeChunkMatch[] = [];

  try {
    const brandHits = await searchKnowledge({
      query,
      topK: 3,
      sourceType: "brand_guide",
      language: input.language,
    });
    matches.push(...brandHits);
  } catch { /* non-blocking */ }

  try {
    const productHits = await searchKnowledge({
      query,
      topK: 2,
      sourceType: "product_desc",
      language: input.language,
    });
    matches.push(...productHits);
  } catch { /* non-blocking */ }

  if (matches.length === 0) return "";

  matches.sort((a, b) => b.combinedScore - a.combinedScore);
  const topMatches = matches.slice(0, 4);
  const minScore = 0.25;
  const relevant = topMatches.filter((m) => m.combinedScore >= minScore);
  if (relevant.length === 0) return "";

  const lines = relevant.map(
    (m) => `- (${m.sourceType}) ${m.content.slice(0, 500)}`
  );

  return `[BRAND DNA — from knowledge base]\n${lines.join("\n")}`;
}
