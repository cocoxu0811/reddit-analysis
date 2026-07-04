import {
  isKnowledgeConfigured,
  searchKnowledge,
  type KnowledgeChunkMatch,
  type KnowledgeSourceType,
} from "./knowledge.js";

const SOURCE_LABELS: Record<KnowledgeSourceType, { en: string; zh: string }> = {
  brand_guide: { en: "Brand guide", zh: "品牌指南" },
  product_desc: { en: "Product description", zh: "产品描述" },
  history_copy: { en: "Historical copy", zh: "历史文案" },
  subreddit_rules: { en: "Subreddit rules", zh: "版块规则" },
  campaign_strategy: { en: "Campaign strategy", zh: "Campaign 策略" },
};

export function buildRagQueryFromReport(report: {
  summary: string;
  painPoints: string[];
  praisedFeatures: string[];
  mentionedBrands: string[];
  highFrequencyWords: string[];
}): string {
  return [
    report.summary,
    ...report.painPoints.slice(0, 4),
    ...report.praisedFeatures.slice(0, 3),
    ...report.mentionedBrands.slice(0, 4),
    ...report.highFrequencyWords.slice(0, 6),
  ]
    .filter(Boolean)
    .join(" ")
    .slice(0, 2000);
}

export function buildRagQueryFromPrompt(subreddit: string, instruction: string): string {
  return `${subreddit} ${instruction}`.trim().slice(0, 2000);
}

export async function retrieveRagMatches(input: {
  query: string;
  language: "en" | "zh";
  topK?: number;
  sourceTypes?: KnowledgeSourceType[];
}): Promise<KnowledgeChunkMatch[]> {
  if (!isKnowledgeConfigured()) return [];
  const query = input.query.trim();
  if (!query) return [];

  const topK = input.topK ?? 5;
  const sourceTypes = input.sourceTypes?.length
    ? input.sourceTypes
    : (["brand_guide", "product_desc", "history_copy", "campaign_strategy"] as KnowledgeSourceType[]);

  const perType = Math.max(2, Math.ceil(topK / sourceTypes.length));
  const seen = new Set<string>();
  const merged: KnowledgeChunkMatch[] = [];

  for (const sourceType of sourceTypes) {
    const rows = await searchKnowledge({
      query,
      topK: perType,
      sourceType,
      language: input.language,
    });
    for (const row of rows) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      merged.push(row);
    }
  }

  merged.sort((a, b) => b.combinedScore - a.combinedScore);
  return merged.slice(0, topK);
}

export function formatRagContextBlock(
  matches: KnowledgeChunkMatch[],
  language: "en" | "zh"
): string {
  if (matches.length === 0) return "";

  const header =
    language === "zh"
      ? "## 知识库参考（RAG 检索 — 借鉴语气与事实，勿逐字抄袭）"
      : "## Knowledge base references (RAG — borrow voice and facts, do NOT copy verbatim)";

  const lines = matches.map((match, index) => {
    const label = SOURCE_LABELS[match.sourceType]?.[language] ?? match.sourceType;
    const score = match.combinedScore.toFixed(2);
    return `[${index + 1}] (${label}, score ${score}) ${match.title}\n${match.content.slice(0, 900)}`;
  });

  return `\n${header}\n${lines.join("\n\n")}\n`;
}

export async function buildRagPromptSection(input: {
  query: string;
  language: "en" | "zh";
  topK?: number;
}): Promise<string> {
  const matches = await retrieveRagMatches({
    query: input.query,
    language: input.language,
    topK: input.topK ?? 5,
  });
  return formatRagContextBlock(matches, input.language);
}
