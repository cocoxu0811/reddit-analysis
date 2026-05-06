import { GoogleGenAI, Type } from "@google/genai";

export type AiProvider = "gemini" | "minimax";

export interface RedditAnalysisReport {
  summary: string;
  painPoints: string[];
  praisedFeatures: string[];
  mentionedBrands: string[];
  highFrequencyWords: string[];
}

export interface SubredditSuggestionInput {
  title: string;
  angle: string;
  postTitle: string;
  postBody: string;
  currentSuggestedSubreddit?: string;
}

export function normalizeAiProvider(raw: unknown): AiProvider {
  const s = String(raw ?? "").trim().toLowerCase();
  if (s === "minimax" || s === "minimax2.7" || s === "minimax-2.7") return "minimax";
  return "gemini";
}

export function getDefaultAiProvider(): AiProvider {
  const configured = process.env.AI_PROVIDER || process.env.LLM_PROVIDER;
  if (configured) return normalizeAiProvider(configured);
  if (process.env.MINIMAX_API_KEY && !process.env.GEMINI_API_KEY) return "minimax";
  return "gemini";
}

function parseJsonObject(raw: string): Record<string, unknown> {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error("AI response was not valid JSON");
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function generateJsonWithGemini(
  prompt: string,
  schema: Record<string, unknown>,
  model = process.env.GEMINI_MODEL || "gemini-3.1-pro-preview"
): Promise<Record<string, unknown>> {
  const ai = new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") });
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: normalizeGeminiSchema(schema),
    },
  });
  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return parseJsonObject(text);
}

function normalizeGeminiSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeGeminiSchema);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (key === "type" && typeof raw === "string") {
      out[key] = raw.toUpperCase();
    } else {
      out[key] = normalizeGeminiSchema(raw);
    }
  }
  return out;
}

async function generateJsonWithMiniMax(
  prompt: string,
  model = process.env.MINIMAX_MODEL || "MiniMax-M2.7"
): Promise<Record<string, unknown>> {
  const apiKey = requireEnv("MINIMAX_API_KEY");
  const baseUrl = (process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON API. Return only one valid JSON object. No markdown, no code fences, no commentary.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`MiniMax API failed (${response.status}): ${message || response.statusText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("No response from MiniMax");
  return parseJsonObject(text);
}

export async function generateJsonObject(
  prompt: string,
  schema: Record<string, unknown>,
  provider: AiProvider = getDefaultAiProvider(),
  options: { geminiModel?: string; minimaxModel?: string } = {}
): Promise<Record<string, unknown>> {
  if (provider === "minimax") {
    return generateJsonWithMiniMax(prompt, options.minimaxModel);
  }
  return generateJsonWithGemini(prompt, schema, options.geminiModel);
}

function clampStringArray(raw: unknown, max = 8): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function normalizeRedditAnalysisReport(raw: Record<string, unknown>): RedditAnalysisReport {
  return {
    summary: typeof raw.summary === "string" ? raw.summary.trim() : "",
    painPoints: clampStringArray(raw.painPoints),
    praisedFeatures: clampStringArray(raw.praisedFeatures),
    mentionedBrands: clampStringArray(raw.mentionedBrands, 12),
    highFrequencyWords: clampStringArray(raw.highFrequencyWords, 20),
  };
}

export async function generateRedditAnalysisReport(
  datasetText: string,
  language: "en" | "zh",
  provider: AiProvider = getDefaultAiProvider()
): Promise<RedditAnalysisReport> {
  const prompt = `
Analyze the following Reddit dataset (posts and comments) and provide a structured report based on this framework:
1. Summary: Summarize the discussions in these posts and comments.
2. Pain Points: Main user pain points, most frequent complaints or issues.
3. Praised Features: Product features users recommend or praise (functionality, design, appearance, etc.).
4. Mentioned Brands: Most frequently mentioned products or brand names.
5. High Frequency Words: Most commonly used vocabulary or high-frequency words when describing products and issues.

IMPORTANT:
- The final output MUST be in ${language === "zh" ? "Simplified Chinese" : "English"}.
- Output must be strict JSON with keys: summary, painPoints, praisedFeatures, mentionedBrands, highFrequencyWords.
- Array fields must contain strings only.

Dataset:
${datasetText.substring(0, 30000)}
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Summary of discussions" },
      painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Main user pain points" },
      praisedFeatures: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Praised product features",
      },
      mentionedBrands: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Mentioned brands or products",
      },
      highFrequencyWords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "High frequency words",
      },
    },
    required: ["summary", "painPoints", "praisedFeatures", "mentionedBrands", "highFrequencyWords"],
  };

  return normalizeRedditAnalysisReport(await generateJsonObject(prompt, schema, provider));
}

function normalizeSubredditName(raw: unknown): string {
  const s = String(raw ?? "")
    .trim()
    .replace(/^r\//i, "")
    .replace(/^\/+/, "")
    .replace(/[^A-Za-z0-9_]/g, "");
  return s ? `r/${s}` : "";
}

export async function suggestSubredditsForIdeas(
  ideas: SubredditSuggestionInput[],
  language: "en" | "zh",
  provider: AiProvider = getDefaultAiProvider()
): Promise<string[]> {
  if (ideas.length === 0) return [];
  const prompt = `
你是 Reddit 运营顾问。请根据每条选题草案，推荐最匹配的 subreddit。

输出要求：
- 仅输出 JSON：{ "suggestedSubreddits": ["r/xxx", ...] }
- 数组长度必须与输入 ideas 数量一致。
- 每个值必须是 "r/xxx" 形式（只允许字母/数字/下划线）。
- 只返回真实存在且活跃的大众版块；不要返回 NSFW 之外不相关版块。
- 若主题明显偏成人/情趣用品（如 sextoys、vibrators、dildos、sexual wellness），优先对应成人讨论版块。
- 语言为 ${language === "zh" ? "简体中文语境" : "English context"}，但 subreddit 名必须保持英文原名。

ideas:
${JSON.stringify(
    ideas.map((x) => ({
      title: x.title,
      angle: x.angle,
      postTitle: x.postTitle,
      postBody: x.postBody.slice(0, 1800),
      currentSuggestedSubreddit: x.currentSuggestedSubreddit || "",
    })),
    null,
    2
  )}
`;

  const raw = await generateJsonObject(
    prompt,
    {
      type: "object",
      properties: {
        suggestedSubreddits: { type: "array", items: { type: "string" } },
      },
      required: ["suggestedSubreddits"],
    },
    provider
  );
  const arr = Array.isArray(raw.suggestedSubreddits) ? raw.suggestedSubreddits : [];
  const normalized = arr.map((x) => normalizeSubredditName(x)).filter(Boolean);
  while (normalized.length < ideas.length) normalized.push("r/AskReddit");
  return normalized.slice(0, ideas.length);
}
