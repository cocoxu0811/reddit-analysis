import OpenAI from "openai";

const DEFAULT_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;

let client: OpenAI | null = null;

function getOpenAiClient(): OpenAI {
  if (!client) {
    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) throw new Error("Missing OPENAI_API_KEY");
    client = new OpenAI({ apiKey: key });
  }
  return client;
}

export function isEmbeddingAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getEmbeddingModel(): string {
  return process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_MODEL;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const openai = getOpenAiClient();
  const model = getEmbeddingModel();
  const response = await openai.embeddings.create({
    model,
    input: texts,
  });
  const sorted = [...response.data].sort((a, b) => a.index - b.index);
  return sorted.map((row) => {
    if (row.embedding.length !== EMBEDDING_DIM) {
      throw new Error(`Unexpected embedding dimension: ${row.embedding.length}`);
    }
    return row.embedding;
  });
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
