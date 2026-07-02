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
  // 国际版: https://api.minimax.io/v1  中国大陆版: https://api.minimax.chat/v1
  const baseUrl = (process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1").replace(/\/+$/, "");
  const endpoint = `${baseUrl}/chat/completions`;

  const response = await fetch(endpoint, {
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
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    const keyHint = `key=${apiKey.slice(0, 6)}…`;
    const urlHint = `url=${endpoint}`;
    throw new Error(
      `MiniMax API failed (${response.status}): ${message || response.statusText}\n` +
        `[调试信息] ${urlHint}, ${keyHint}\n` +
        `[常见原因] 国际版 Key 请使用 https://api.minimax.io/v1；` +
        `中国大陆版 Key 请在 Vercel 中将 MINIMAX_BASE_URL 设为 https://api.minimax.chat/v1`
    );
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

// ─── Content idea generation ──────────────────────────────────────────────────

export interface ContentIdeaOutput {
  title: string;
  angle: string;
  basedOn: string[];
  postTitle: string;
  postBody: string;
  suggestedSubreddit: string;
}

const TONE_DESC: Record<string, { zh: string; en: string }> = {
  curious: {
    zh: "疑惑向：语气困惑、真诚，提出'为什么'疑问，承认不确定性",
    en: "curious: confused, genuine, ask why, admit uncertainty",
  },
  question: {
    zh: "提问向：真诚发问，征求社区经验，无预设答案",
    en: "question: honest ask, seek lived experience, no predetermined answer",
  },
  recommend: {
    zh: "推荐向：以踩坑过来人视角，分享经验与顺序感，避免广告味",
    en: "recommend: veteran who was burned, share lessons & sequencing, anti-shill",
  },
  rant: {
    zh: "吐槽向：情绪化但可讨论，有反差与张力，最后落脚可执行建议",
    en: "rant: heated but discussable, contrast & tension, end with actionable ask",
  },
};

const ANTI_PATTERN_RULES = `
## NEVER do these (common AI tells that kill authenticity)
- Never start with "So," or "Hey everyone," or "I've been thinking about..."
- Never use transition words like "Furthermore", "Moreover", "Additionally", "In conclusion"
- Never write perfectly balanced paragraphs with clean topic sentences
- Never summarize your own post at the end
- Never use "game-changer", "deep dive", "at the end of the day", "invaluable", "landscape"
- Never use numbered lists or bullet points for emotional/personal posts
- Never hedge every statement with "it might be worth considering"
- Never use corporate/marketing phrases like "leverage", "synergy", "unlock potential"
- Never start consecutive sentences with the same word
- Never write a "perfect" post — real humans ramble, self-correct, and go off-topic`;

const POST_STRUCTURE_RULES = `
## Post structure (invisible to the reader — do NOT label these sections)
Each postBody must follow this narrative arc naturally:
1. HOOK (1-2 sentences): A specific, personal moment that triggered the post.
   Examples: "just got off a call that made me question everything",
   "ok so I've been lurking here for months and finally need to ask"
2. CONTEXT (2-3 sentences): Minimal background — just enough so strangers get it.
   Drop details mid-sentence like a real person would.
3. BODY: The actual question/rant/recommendation. Include at least one of:
   - A tangent or self-correction ("wait actually that's not quite right...")
   - A parenthetical aside ("(my co-founder disagrees but whatever)")
   - An incomplete thought trailed off with "..." or "idk"
4. CLOSE: End with an open question OR a trailing thought — NEVER a summary or CTA.
   Good: "anyone dealt with this?", "idk maybe I'm overthinking this",
   "sorry for the wall of text lol", "curious what you all think"
   Bad: "In summary...", "Hope this helps!", "Let me know your thoughts below!"`;

const PERSONA_RULES = `
## Persona variation (critical for authenticity)
Each of the 6 posts must be written by a DIFFERENT persona. Internally assign:
- Post 1: newcomer / first-time poster, slightly nervous, over-explains context
- Post 2: experienced veteran, blunt and concise, uses community slang
- Post 3: frustrated user who has tried everything, emotionally raw
- Post 4: analytical thinker, includes specific numbers/dates, methodical
- Post 5: casual lurker finally posting, self-deprecating humor, apologetic
- Post 6: passionate advocate, genuine enthusiasm (not shill-ish), uses caps sparingly
Each persona affects: vocabulary, sentence length, paragraph count, punctuation style,
level of formality, and emotional register. Do NOT mention or label the persona.`;

export async function generateContentIdeas(
  report: RedditAnalysisReport,
  language: "en" | "zh",
  tone: string,
  provider: AiProvider = getDefaultAiProvider()
): Promise<ContentIdeaOutput[]> {
  const td = TONE_DESC[tone] ?? TONE_DESC.question;
  const toneDesc = language === "zh" ? td.zh : td.en;
  const langNote =
    language === "zh"
      ? "所有文字（title、angle、postTitle、postBody）必须用简体中文。"
      : "All text (title, angle, postTitle, postBody) must be in English.";

  const prompt = `
You are a Reddit content strategist. Based on this Reddit community analysis, generate 6 distinct post ideas that fit the **exact domain** of the discussions.

## Analysis Report
- Summary: ${report.summary.slice(0, 500)}
- Pain Points: ${report.painPoints.slice(0, 5).join(" | ")}
- Praised Features: ${report.praisedFeatures.slice(0, 5).join(" | ")}
- Mentioned Brands: ${report.mentionedBrands.slice(0, 5).join(" | ")}
- High-Frequency Words: ${report.highFrequencyWords.slice(0, 5).join(" | ")}

## Tone for ALL 6 ideas
${toneDesc}
${ANTI_PATTERN_RULES}
${POST_STRUCTURE_RULES}
${PERSONA_RULES}

## Critical Rules
1. **Match the domain exactly.** Infer the community topic (adult toys, fitness, gaming, cooking, SaaS, etc.) purely from the analysis above and write accordingly. Never import irrelevant jargon (e.g. "migration", "permissions", "KPI", "landing page", "team bandwidth" in an adult-toys context).
2. Each idea must be genuinely distinct — different hook, different angle, different aspect of the data.
3. postBody must be 120-250 words, written like a real Reddit user (first-person, honest, imperfect).
4. suggestedSubreddit must be a real, active subreddit matching the domain (e.g. r/SexToys, r/tifu, r/relationship_advice — NOT r/SaaS or r/smallbusiness unless the data is about SaaS/business).
5. ${langNote}

## Output — strict JSON only
Return a JSON object with key "ideas" containing an array of exactly 6 objects:
{
  "ideas": [
    {
      "title": "short idea label (≤15 words)",
      "angle": "one-sentence content angle / hook strategy",
      "basedOn": ["pain or feature or brand this idea references"],
      "postTitle": "Reddit post title (≤15 words)",
      "postBody": "full post body text",
      "suggestedSubreddit": "r/ExampleSubreddit"
    }
  ]
}
`;

  const raw = await generateJsonObject(
    prompt,
    {
      type: "object",
      properties: {
        ideas: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              angle: { type: "string" },
              basedOn: { type: "array", items: { type: "string" } },
              postTitle: { type: "string" },
              postBody: { type: "string" },
              suggestedSubreddit: { type: "string" },
            },
            required: ["title", "angle", "basedOn", "postTitle", "postBody", "suggestedSubreddit"],
          },
        },
      },
      required: ["ideas"],
    },
    provider
  );

  const ideas = Array.isArray(raw.ideas) ? (raw.ideas as ContentIdeaOutput[]) : [];
  return ideas.slice(0, 6);
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

// ─── Prompt-based content generation (no report required) ─────────────────────

export async function generateContentFromPrompt(
  subreddit: string,
  userInstruction: string,
  language: "en" | "zh",
  tone: string = "question",
  provider: AiProvider = getDefaultAiProvider(),
  examplePosts: string[] = []
): Promise<ContentIdeaOutput[]> {
  const td = TONE_DESC[tone] ?? TONE_DESC.question;
  const toneDesc = language === "zh" ? td.zh : td.en;
  const langNote =
    language === "zh"
      ? "所有文字（title、angle、postTitle、postBody）必须用简体中文。"
      : "All text (title, angle, postTitle, postBody) must be in English.";

  const examplesBlock =
    examplePosts.length > 0
      ? `
## Real posts from this community (study the writing style, DO NOT copy content)
Observe how these real Reddit users write — their sentence structure, vocabulary,
emotional register, imperfections, and formatting. Your output must match this
voice and feel, NOT the content.

${examplePosts.join("\n\n---\n\n")}

## Style patterns to extract from the examples above
- How do they start posts? (mid-thought? with a question? with context?)
- Do they use perfect grammar or casual/broken sentences?
- How long are their paragraphs?
- Do they use hedging language? Self-deprecation? Humor?
- How do they end — open question, trailing thought, or call-to-action?
Match these patterns in your output.
`
      : "";

  const prompt = `
You are a Reddit content strategist. Generate 6 distinct post ideas for the subreddit **${subreddit}** based on the user's instruction below.

## User Instruction
${userInstruction}

## Target Subreddit
${subreddit}

## Tone for ALL 6 ideas
${toneDesc}
${examplesBlock}
${ANTI_PATTERN_RULES}
${POST_STRUCTURE_RULES}
${PERSONA_RULES}

## Critical Rules
1. All posts must feel native to ${subreddit} — match the community's culture, vocabulary, and discussion style.
2. Each idea must be genuinely distinct — different hook, different angle.
3. postBody must be 120-250 words, written like a real Reddit user (first-person, honest, imperfect).
4. suggestedSubreddit should be ${subreddit} for most ideas, but you may suggest 1-2 alternative subreddits if they fit better.
5. ${langNote}
6. Do NOT sound like marketing or AI-generated content. Write like a real person with real experiences.

## Output — strict JSON only
Return a JSON object with key "ideas" containing an array of exactly 6 objects:
{
  "ideas": [
    {
      "title": "short idea label (≤15 words)",
      "angle": "one-sentence content angle / hook strategy",
      "basedOn": ["relevant topic or keyword this idea references"],
      "postTitle": "Reddit post title (≤15 words)",
      "postBody": "full post body text",
      "suggestedSubreddit": "r/ExampleSubreddit"
    }
  ]
}
`;

  const raw = await generateJsonObject(
    prompt,
    {
      type: "object",
      properties: {
        ideas: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              angle: { type: "string" },
              basedOn: { type: "array", items: { type: "string" } },
              postTitle: { type: "string" },
              postBody: { type: "string" },
              suggestedSubreddit: { type: "string" },
            },
            required: ["title", "angle", "basedOn", "postTitle", "postBody", "suggestedSubreddit"],
          },
        },
      },
      required: ["ideas"],
    },
    provider
  );

  const ideas = Array.isArray(raw.ideas) ? (raw.ideas as ContentIdeaOutput[]) : [];
  return ideas.slice(0, 6);
}
