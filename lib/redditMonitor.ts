/**
 * Subreddit 新帖拉取 + 评论摘录 + 情绪/类别分类（启发式 + 可选 Gemini）
 */

import { ApifyClient } from "apify-client";
import { GoogleGenAI, Type } from "@google/genai";
import { fetchRedditApiJson } from "./redditLinkConvert.js";

/** 与 Instagram 竞品共用 APIFY_TOKEN；默认 trudax/reddit-scraper-lite（按 Apify 用量计费） */
const DEFAULT_APIFY_REDDIT_ACTOR = "trudax/reddit-scraper-lite";

/** 配置 APIFY_TOKEN 且未设 REDDIT_MONITOR_DIRECT=true 时，版块监控走 Apify，避免 Vercel 直连 Reddit 403 */
function useApifyMonitor(): boolean {
  return Boolean(process.env.APIFY_TOKEN?.trim()) && process.env.REDDIT_MONITOR_DIRECT !== "true";
}

export const EMOTION_LABELS = ["疑惑", "生气", "兴奋", "失望", "讽刺", "中性"] as const;
export const CATEGORY_LABELS = ["推荐", "吐槽", "讨论", "求助", "展示"] as const;

export type EmotionLabel = (typeof EMOTION_LABELS)[number];
export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

export interface MonitoredComment {
  id: string;
  body: string;
  author: string;
  score: number;
}

/** 从帖文+评论归纳：喜欢 / 不喜欢 / 诉求 / 抱怨（开启 AI 标注时为模型归纳，否则为关键词启发式） */
export interface UserIntentMarks {
  likes: string[];
  dislikes: string[];
  requests: string[];
  complaints: string[];
}

export interface MonitoredPost {
  id: string;
  title: string;
  body: string;
  url: string;
  author: string;
  createdAt: string;
  subreddit: string;
  flair: string | null;
  numComments: number;
  score: number;
  comments: MonitoredComment[];
  emotion: EmotionLabel;
  category: CategoryLabel;
  classificationSource: "heuristic" | "gemini";
  intentMarks: UserIntentMarks;
}

export function normalizeSubreddit(raw: string): string {
  const s = raw.trim().replace(/^r\//i, "").replace(/^\//, "");
  if (!/^[A-Za-z0-9_]+$/.test(s)) {
    throw new Error("Invalid subreddit name");
  }
  return s;
}

async function runRedditApifyDatasetForSub(sub: string, maxPostCount: number): Promise<Record<string, unknown>[]> {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error("缺少 APIFY_TOKEN：版块监控已改为通过 Apify 拉取 Reddit，请与 Instagram 竞品共用同一 Token。");
  }
  const actorId = process.env.APIFY_REDDIT_ACTOR?.trim() || DEFAULT_APIFY_REDDIT_ACTOR;
  const client = new ApifyClient({ token });
  const input: Record<string, unknown> = {
    startUrls: [{ url: `https://www.reddit.com/r/${encodeURIComponent(sub)}/new/` }],
    maxPostCount,
  };
  const run = await client.actor(actorId).call(input);
  if (!run.defaultDatasetId) return [];
  const { items } = await client.dataset(run.defaultDatasetId).listItems({ limit: 10000 });
  return (items ?? []) as Record<string, unknown>[];
}

function apifyPostBelongsToSub(raw: Record<string, unknown>, sub: string): boolean {
  const want = sub.toLowerCase();
  const parsed = String(raw.parsedCommunityName ?? "").toLowerCase();
  if (parsed && parsed === want) return true;
  const comm = String(raw.communityName ?? "");
  const m = comm.match(/^r\/([^/]+)/i);
  return m ? m[1].toLowerCase() === want : false;
}

async function fetchRedditJson(url: string): Promise<any> {
  return fetchRedditApiJson(url) as Promise<any>;
}

function walkComments(children: any[], acc: MonitoredComment[], max: number): void {
  if (!children || acc.length >= max) return;
  for (const child of children) {
    if (acc.length >= max) return;
    if (child?.kind === "t1" && child.data) {
      const d = child.data;
      const body = (d.body || "").trim();
      if (body && body !== "[deleted]" && body !== "[removed]") {
        acc.push({
          id: d.name || d.id || "",
          body: body.slice(0, 4000),
          author: d.author || "[deleted]",
          score: typeof d.ups === "number" ? d.ups : 0,
        });
      }
      if (d.replies?.data?.children?.length) {
        walkComments(d.replies.data.children, acc, max);
      }
    }
  }
}

const INTENT_MAX = 5;
const INTENT_MIN_CHARS = 8;
const INTENT_SNIP = 160;

function splitIntentChunks(text: string): string[] {
  const t = text.replace(/\r/g, "").replace(/\s+/g, " ").trim();
  if (!t) return [];
  const parts = t.split(/(?:[。！？]+|[.!?]+\s+|\n+)/g);
  const out: string[] = [];
  for (const p of parts) {
    const s = p.trim();
    if (s.length >= INTENT_MIN_CHARS) out.push(s.slice(0, 420));
  }
  if (out.length === 0 && t.length >= INTENT_MIN_CHARS) out.push(t.slice(0, 420));
  return out;
}

function normalizeIntentMarksFromAi(raw: {
  likes?: unknown;
  dislikes?: unknown;
  requests?: unknown;
  complaints?: unknown;
}): UserIntentMarks {
  const clamp = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim().slice(0, INTENT_SNIP))
      .filter((s) => s.length > 0)
      .slice(0, INTENT_MAX);
  };
  return {
    likes: clamp(raw.likes),
    dislikes: clamp(raw.dislikes),
    requests: clamp(raw.requests),
    complaints: clamp(raw.complaints),
  };
}

/** 关键词启发式（未开启 Gemini 或 AI 调用失败时使用） */
export function extractIntentMarks(title: string, body: string, comments: MonitoredComment[]): UserIntentMarks {
  const chunks: string[] = [];
  if (title?.trim()) chunks.push(...splitIntentChunks(title));
  if (body?.trim()) chunks.push(...splitIntentChunks(body));
  for (const c of comments) {
    if (c.body?.trim()) chunks.push(...splitIntentChunks(c.body));
  }

  const RE_COMPLAINT =
    /抱怨|吐槽|受不了|气死|离谱|坑爹|骗人|垃圾|难用|太慢|卡死|卡爆|bug|崩了|失效|黑店|踩雷|别信|scam|sucks|terrible|worst|awful|broken|disappoint|fed up|garbage|rip-?off|frustrated/i;
  const RE_REQUEST =
    /求|请问|能不能|可不可以|希望|有没有|求助|建议|想要|需要|哪位大神|How (do|can|should|would)|looking for|can anyone|please (tell|help|share)|advice on|what('s| is) the best|anyone know|recommend/i;
  const RE_LIKE =
    /喜欢|好用|强推|安利|赞|满意|太棒|真香|值得|爱了|推荐它|love it|great|awesome|highly recommend|works well|impressed|game.?changer|worth (it|every)/i;
  const RE_DISLIKE =
    /不喜欢|讨厌|失望|鸡肋|不好用|别买|避雷|千万别|avoid|don't like|not worth|waste of|regret (buying|it)|worst purchase|overrated/i;

  const seen = new Set<string>();
  const push = (arr: string[], s: string) => {
    const t = s.trim().slice(0, INTENT_SNIP);
    const key = t.toLowerCase().slice(0, 96);
    if (t.length < INTENT_MIN_CHARS || seen.has(key)) return;
    seen.add(key);
    arr.push(t);
  };

  const likes: string[] = [];
  const dislikes: string[] = [];
  const requests: string[] = [];
  const complaints: string[] = [];

  for (const sent of chunks) {
    if (RE_COMPLAINT.test(sent) && complaints.length < INTENT_MAX) push(complaints, sent);
    if (RE_REQUEST.test(sent) && requests.length < INTENT_MAX) push(requests, sent);
    if (RE_DISLIKE.test(sent) && dislikes.length < INTENT_MAX) push(dislikes, sent);
    if (RE_LIKE.test(sent) && likes.length < INTENT_MAX) push(likes, sent);
  }

  return { likes, dislikes, requests, complaints };
}

/** 供分析页使用的 JSON：帖 + 评论条目，结构与 toAnalysisText 兼容 */
export function monitoredPostToAnalysisJson(post: MonitoredPost): string {
  const items: Record<string, unknown>[] = [
    {
      title: post.title,
      body: post.body || "",
      communityName: post.subreddit,
      flair: post.flair || "",
      dataType: "post",
    },
  ];
  for (const c of post.comments) {
    items.push({
      title: `Comment · u/${c.author}`,
      body: c.body,
      communityName: post.subreddit,
      flair: `score ${c.score}`,
      dataType: "comment",
    });
  }
  return JSON.stringify(items, null, 2);
}

async function buildMonitoredPostFromT3(
  p: any,
  sub: string,
  options: { useGemini?: boolean; delayMs?: number }
): Promise<MonitoredPost | null> {
  const permalink = p.permalink as string;
  if (!permalink) return null;
  const delay = options.delayMs ?? 180;

  const comments: MonitoredComment[] = [];
  try {
    const threadUrl = `https://www.reddit.com${permalink}.json?sort=top&depth=2&limit=40&raw_json=1`;
    const thread = await fetchRedditJson(threadUrl);
    if (Array.isArray(thread) && thread[1]?.data?.children) {
      walkComments(thread[1].data.children, comments, 35);
    }
  } catch {
    /* 单帖评论失败则跳过评论 */
  }

  const title = (p.title || "").slice(0, 500);
  const body = (p.selftext || "").slice(0, 8000);
  let emotion: EmotionLabel;
  let category: CategoryLabel;
  let classificationSource: "heuristic" | "gemini" = "heuristic";

  const h = classifyHeuristic(title, body, comments);
  emotion = h.emotion;
  category = h.category;

  let intentMarks = extractIntentMarks(title, body, comments);

  if (options.useGemini) {
    const g = await classifyGemini(title, body, comments);
    if (g) {
      emotion = g.emotion;
      category = g.category;
      classificationSource = "gemini";
      intentMarks = g.intentMarks;
    }
  }

  const postUrl = p.permalink ? `https://www.reddit.com${p.permalink}` : p.url ? String(p.url) : "";

  const result: MonitoredPost = {
    id: p.name || p.id || "",
    title,
    body,
    url: postUrl,
    author: p.author || "",
    createdAt: p.created_utc ? new Date(p.created_utc * 1000).toISOString() : "",
    subreddit: p.subreddit_name_prefixed || `r/${sub}`,
    flair: p.link_flair_text || null,
    numComments: typeof p.num_comments === "number" ? p.num_comments : comments.length,
    score: typeof p.ups === "number" ? p.ups : 0,
    comments,
    emotion,
    category,
    classificationSource,
    intentMarks,
  };

  await new Promise((r) => setTimeout(r, delay));
  return result;
}

/** 分页 /new，收集本地日 [startMs,endMs] 内的帖（最多 maxPosts 条）；Apify 模式下为一批帖子再按时间筛 */
async function collectT3ForDayRange(
  sub: string,
  startMs: number,
  endMs: number,
  maxPosts: number
): Promise<any[]> {
  if (useApifyMonitor()) {
    const rows = await runRedditApifyDatasetForSub(sub, Math.min(200, maxPosts * 10));
    const collected: Record<string, unknown>[] = [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      if (String(o.dataType) !== "post") continue;
      if (!apifyPostBelongsToSub(o, sub)) continue;
      const t = new Date(String(o.createdAt ?? 0)).getTime();
      if (t >= startMs && t <= endMs) {
        collected.push(o);
        if (collected.length >= maxPosts) return collected;
      }
    }
    return collected;
  }

  const MAX_PAGES = 22;
  const collected: any[] = [];
  let after: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    let url = `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`;
    if (after) url += `&after=${encodeURIComponent(after)}`;

    const listing = await fetchRedditJson(url);
    const children = listing?.data?.children || [];
    if (children.length === 0) break;

    let oldestInPage = Infinity;
    for (const ch of children) {
      if (ch.kind !== "t3" || !ch.data) continue;
      const p = ch.data;
      const t = (p.created_utc || 0) * 1000;
      oldestInPage = Math.min(oldestInPage, t);
      if (t >= startMs && t <= endMs) {
        collected.push(p);
        if (collected.length >= maxPosts) return collected;
      }
    }

    if (oldestInPage < startMs) break;

    after = listing?.data?.after;
    if (!after) break;
    await new Promise((r) => setTimeout(r, 150));
  }
  return collected;
}

export function classifyHeuristic(
  title: string,
  body: string,
  comments: MonitoredComment[]
): { emotion: EmotionLabel; category: CategoryLabel } {
  const text = `${title}\n${body}\n${comments.map((c) => c.body).join("\n")}`.toLowerCase();
  const t = `${title}\n${body}`;

  const emotionScore: Record<string, number> = Object.fromEntries(EMOTION_LABELS.map((e) => [e, 0])) as any;
  const catScore: Record<string, number> = Object.fromEntries(CATEGORY_LABELS.map((c) => [c, 0])) as any;

  emotionScore["中性"] = 1;
  catScore["讨论"] = 1;

  // 疑惑
  if (/[?？]/.test(t) || /\b(how|why|what|when|where|which|求助|请问|不懂|疑惑|怎么|如何)\b/i.test(text)) {
    emotionScore["疑惑"] += 4;
  }
  // 生气
  if (
    /\b(fuck|shit|hate|scam|garbage|worst|terrible|awful|angry|ridiculous)\b/i.test(text) ||
    /(气死|离谱|垃圾|骗人|恶心|受不了|坑爹|愤怒)/.test(text)
  ) {
    emotionScore["生气"] += 5;
  }
  if (/!{2,}/.test(t) || text.includes("!!!")) {
    emotionScore["生气"] += 2;
  }
  // 兴奋
  if (/\b(love|amazing|awesome|finally|great|perfect|best)\b/i.test(text) || /(太棒|爱了|强推|真香|爽)/.test(text)) {
    emotionScore["兴奋"] += 3;
  }
  // 失望
  if (/\b(disappoint|unfortunately|sadly|regret)\b/i.test(text) || /(失望|遗憾|后悔|凉了)/.test(text)) {
    emotionScore["失望"] += 3;
  }
  // 讽刺
  if (/\/s\b|lol sure|obviously|呵呵|笑死|懂的都懂/i.test(text)) {
    emotionScore["讽刺"] += 3;
  }

  // 求助
  if (/\b(help|advice|suggestions|recommend me|what should)\b/i.test(text) || /(求助|帮帮我|怎么办|请教)/.test(text)) {
    catScore["求助"] += 4;
  }
  // 推荐
  if (/\b(recommend|review|best \w+|top \d|must try)\b/i.test(text) || /(推荐|安利|种草|好评|值得买)/.test(text)) {
    catScore["推荐"] += 3;
  }
  // 吐槽
  if (/\b(rant|complain|sucks|hate this)\b/i.test(text) || /(吐槽|踩雷|别买|难用)/.test(text)) {
    catScore["吐槽"] += 4;
  }
  // 展示
  if (/\b(showcase|my build|i made|built a|here is my)\b/i.test(text) || /(晒|成果|我做的|开箱)/.test(text)) {
    catScore["展示"] += 3;
  }
  // 讨论
  if (/\b(discussion|thoughts|opinion|debate|agree|disagree)\b/i.test(text) || /(讨论|大家怎么看|理性讨论)/.test(text)) {
    catScore["讨论"] += 3;
  }

  const pickMax = (m: Record<string, number>, labels: readonly string[]) => {
    let best = labels[0];
    let v = m[best] ?? 0;
    for (const k of labels) {
      if ((m[k] ?? 0) > v) {
        v = m[k]!;
        best = k;
      }
    }
    return best as any;
  };

  return {
    emotion: pickMax(emotionScore, EMOTION_LABELS),
    category: pickMax(catScore, CATEGORY_LABELS),
  };
}

async function classifyGemini(
  title: string,
  body: string,
  comments: MonitoredComment[]
): Promise<{ emotion: EmotionLabel; category: CategoryLabel; intentMarks: UserIntentMarks } | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const sample = comments
    .slice(0, 12)
    .map((c) => c.body.slice(0, 500))
    .join("\n---\n");

  const prompt = `你是 Reddit 内容分析助手。根据帖子标题、正文和评论摘录，输出 JSON。

1) 情绪 emotion：必须且只能从以下选一：${EMOTION_LABELS.join("、")}
2) 类别 category：必须且只能从以下选一：${CATEGORY_LABELS.join("、")}
3) 用户倾向（基于全文理解，不要用固定关键词表；中英文帖均可）：
   - likes：用户明确表达满意、推荐、喜欢、称赞的要点（短句，尽量贴近原文）
   - dislikes：明确否定、不推荐、失望、认为不值得的要点
   - requests：求助、求建议、询问、希望实现的功能或信息需求
   - complaints：抱怨、吐槽、对问题/体验的不满
   每个数组最多 5 条；无相关内容则该数组为空 []。不要编造帖中未体现的内容。

标题：${title.slice(0, 500)}
正文：${(body || "").slice(0, 3500)}
评论摘录：${sample.slice(0, 4500)}`;

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: { type: Type.STRING },
            category: { type: Type.STRING },
            likes: { type: Type.ARRAY, items: { type: Type.STRING } },
            dislikes: { type: Type.ARRAY, items: { type: Type.STRING } },
            requests: { type: Type.ARRAY, items: { type: Type.STRING } },
            complaints: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["emotion", "category", "likes", "dislikes", "requests", "complaints"],
        },
      },
    });
    const raw = response.text;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      emotion?: string;
      category?: string;
      likes?: unknown;
      dislikes?: unknown;
      requests?: unknown;
      complaints?: unknown;
    };
    const emotion = EMOTION_LABELS.includes(parsed.emotion as EmotionLabel)
      ? (parsed.emotion as EmotionLabel)
      : null;
    const category = CATEGORY_LABELS.includes(parsed.category as CategoryLabel)
      ? (parsed.category as CategoryLabel)
      : null;
    if (!emotion || !category) return null;
    const intentMarks = normalizeIntentMarksFromAi(parsed);
    return { emotion, category, intentMarks };
  } catch (e) {
    console.warn("Gemini classification failed:", e);
  }
  return null;
}

/** Apify Dataset 中 dataType=post 的条目 → MonitoredPost（不另拉评论线程，避免再请求 Reddit） */
async function apifyRowToMonitoredPost(
  raw: Record<string, unknown>,
  sub: string,
  options: { useGemini?: boolean; delayMs?: number }
): Promise<MonitoredPost | null> {
  if (String(raw.dataType) !== "post") return null;
  if (!apifyPostBelongsToSub(raw, sub)) return null;

  const title = String(raw.title ?? "").slice(0, 500);
  const body = String(raw.body ?? "").slice(0, 8000);
  const comments: MonitoredComment[] = [];
  let emotion: EmotionLabel;
  let category: CategoryLabel;
  let classificationSource: "heuristic" | "gemini" = "heuristic";

  const h = classifyHeuristic(title, body, comments);
  emotion = h.emotion;
  category = h.category;
  let intentMarks = extractIntentMarks(title, body, comments);

  if (options.useGemini) {
    const g = await classifyGemini(title, body, comments);
    if (g) {
      emotion = g.emotion;
      category = g.category;
      classificationSource = "gemini";
      intentMarks = g.intentMarks;
    }
  }

  let createdAt = "";
  try {
    const d = new Date(String(raw.createdAt ?? ""));
    createdAt = Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    createdAt = new Date().toISOString();
  }

  const flairRaw = raw.linkFlair ?? raw.authorFlair ?? raw.link_flair_text;
  const delay = options.delayMs ?? 180;
  await new Promise((r) => setTimeout(r, delay));

  return {
    id: String(raw.id ?? raw.parsedId ?? ""),
    title,
    body,
    url: String(raw.url ?? ""),
    author: String(raw.username ?? ""),
    createdAt,
    subreddit: String(raw.communityName ?? `r/${sub}`),
    flair: flairRaw != null && String(flairRaw).trim() ? String(flairRaw) : null,
    numComments: typeof raw.numberOfComments === "number" ? raw.numberOfComments : 0,
    score: typeof raw.upVotes === "number" ? raw.upVotes : 0,
    comments,
    emotion,
    category,
    classificationSource,
    intentMarks,
  };
}

export async function scanSubreddit(
  rawSub: string,
  limit: number,
  options: { useGemini?: boolean; delayMs?: number } = {}
): Promise<{ subreddit: string; fetchedAt: string; posts: MonitoredPost[] }> {
  const sub = normalizeSubreddit(rawSub);
  const lim = Math.min(Math.max(limit || 10, 1), 25);

  if (useApifyMonitor()) {
    const rows = await runRedditApifyDatasetForSub(sub, lim);
    const posts: MonitoredPost[] = [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const built = await apifyRowToMonitoredPost(row, sub, options);
      if (built) posts.push(built);
    }
    return {
      subreddit: sub,
      fetchedAt: new Date().toISOString(),
      posts,
    };
  }

  const listingUrl = `https://www.reddit.com/r/${sub}/new.json?limit=${lim}&raw_json=1`;
  const listing = await fetchRedditJson(listingUrl);
  const children = listing?.data?.children || [];

  const posts: MonitoredPost[] = [];

  for (const ch of children) {
    if (ch.kind !== "t3" || !ch.data) continue;
    const built = await buildMonitoredPostFromT3(ch.data, sub, options);
    if (built) posts.push(built);
  }

  return {
    subreddit: sub,
    fetchedAt: new Date().toISOString(),
    posts,
  };
}

function tryNormalizeSub(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    return normalizeSubreddit(t);
  } catch {
    return null;
  }
}

/** 依次扫描多个版块，合并帖子并按时间倒序 */
export async function scanMultipleSubreddits(
  rawSubs: string[],
  limit: number,
  options: {
    useGemini?: boolean;
    delayMs?: number;
    delayBetweenSubsMs?: number;
    /** 浏览器本地日 0:00～23:59.999 的毫秒时间戳；设置则只拉该日内的帖 */
    dayRange?: { startMs: number; endMs: number } | null;
  } = {}
): Promise<{
  subreddits: string[];
  fetchedAt: string;
  posts: MonitoredPost[];
  dayRange?: { startMs: number; endMs: number };
}> {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const raw of rawSubs) {
    const n = tryNormalizeSub(raw);
    if (n && !seen.has(n.toLowerCase())) {
      seen.add(n.toLowerCase());
      list.push(n);
    }
  }
  if (list.length === 0) {
    throw new Error("No valid subreddit names");
  }

  const allPosts: MonitoredPost[] = [];
  const between = options.delayBetweenSubsMs ?? 400;
  const lim = Math.min(Math.max(limit || 10, 1), 50);

  if (options.dayRange) {
    const { startMs, endMs } = options.dayRange;
    if (endMs < startMs) {
      throw new Error("Invalid day range");
    }

    for (let i = 0; i < list.length; i++) {
      const sub = list[i];
      const rawPosts = await collectT3ForDayRange(sub, startMs, endMs, lim);
      for (const p of rawPosts) {
        const built = useApifyMonitor()
          ? await apifyRowToMonitoredPost(p as Record<string, unknown>, sub, options)
          : await buildMonitoredPostFromT3(p, sub, options);
        if (built) allPosts.push(built);
      }
      if (i < list.length - 1) {
        await new Promise((r) => setTimeout(r, between));
      }
    }

    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      subreddits: list,
      fetchedAt: new Date().toISOString(),
      posts: allPosts,
      dayRange: options.dayRange,
    };
  }

  for (let i = 0; i < list.length; i++) {
    const sub = list[i];
    const { posts } = await scanSubreddit(sub, lim, options);
    allPosts.push(...posts);
    if (i < list.length - 1) {
      await new Promise((r) => setTimeout(r, between));
    }
  }

  allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    subreddits: list,
    fetchedAt: new Date().toISOString(),
    posts: allPosts,
  };
}
