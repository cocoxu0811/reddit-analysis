/**
 * Reddit Search — 通过 Reddit 公开 JSON API 搜索帖子
 *
 * 不需要 API key，直接访问 reddit.com/search.json
 * 用于为内容生成提供真人范文（few-shot examples）
 */

export interface RedditSearchPost {
  title: string;
  selftext: string;
  subreddit: string;
  author: string;
  score: number;
  numComments: number;
  permalink: string;
  createdUtc: number;
}

export interface RedditSearchResult {
  query: string;
  subreddit: string | null;
  posts: RedditSearchPost[];
  fetchedAt: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) reddit-analysis-tool/1.0";

const THREE_MONTHS_SEC = 90 * 24 * 60 * 60;

/**
 * 判断帖子是否为低质量/不适合作为范文的内容。
 * 排除：mod 公告、AMA、纯链接帖、投票帖、周报等。
 */
function isLowQualityPost(post: RedditSearchPost): boolean {
  const t = post.title.toLowerCase();
  const b = post.selftext.toLowerCase();

  if (
    t.startsWith("[mod") ||
    t.startsWith("[meta") ||
    t.includes("weekly thread") ||
    t.includes("monthly thread") ||
    t.includes("daily discussion") ||
    t.includes("megathread") ||
    t.includes("ama ")  ||
    t.startsWith("ama:") ||
    t.startsWith("i am a ") ||
    t.startsWith("we are ")
  ) {
    return true;
  }

  if (
    b.includes("[removed]") ||
    b.includes("[deleted]") ||
    b.startsWith("http") ||
    b.startsWith("www.")
  ) {
    return true;
  }

  if (post.author === "AutoModerator" || post.author === "[deleted]") {
    return true;
  }

  return false;
}

/**
 * 帖子质量综合评分。
 * 综合考虑 score、评论数、新鲜度，优先选出"社区真正认可"的帖子。
 */
function postQualityScore(post: RedditSearchPost, nowSec: number): number {
  const ageDays = Math.max((nowSec - post.createdUtc) / 86400, 1);

  // 基础分 = score 的对数（避免几万分的热帖主导一切）
  const scoreFactor = Math.log10(Math.max(post.score, 1) + 1);

  // 互动深度 = 评论数的对数（有讨论 >> 纯点赞）
  const commentFactor = Math.log10(Math.max(post.numComments, 1) + 1);

  // 时效衰减：90 天内满分，之后线性衰减到 0.3
  const freshness = ageDays <= 90 ? 1 : Math.max(0.3, 1 - (ageDays - 90) / 365);

  // 正文长度奖励：200-1500 字符最佳
  const len = post.selftext.length;
  const lengthBonus =
    len >= 200 && len <= 1500
      ? 1
      : len > 1500 && len <= 3000
        ? 0.8
        : 0.5;

  return (scoreFactor * 2 + commentFactor * 1.5) * freshness * lengthBonus;
}

export interface SearchOptions {
  sort?: "relevance" | "top" | "new" | "comments";
  timeRange?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
}

/**
 * 搜索 Reddit 帖子。
 *
 * 默认搜索策略：按 top 排序，取最近一年的帖子，
 * 但后续 extractStyleExamples 会优先选最近 3 个月的高质量帖。
 *
 * 为什么 API 层面不直接限制为 3 个月？
 * Reddit 的 search API 只支持 hour/day/week/month/year/all，
 * 没有"3 个月"选项。如果用 month（1 个月），结果太少；
 * 如果用 year，再在本地用评分系统筛选，覆盖面更广。
 */
export async function searchRedditPosts(
  query: string,
  subreddit?: string,
  sort: SearchOptions["sort"] = "top",
  timeRange: SearchOptions["timeRange"] = "year",
  limit: number = 10
): Promise<RedditSearchResult> {
  const clampedLimit = Math.min(Math.max(limit, 1), 25);
  const params = new URLSearchParams({
    q: query,
    sort,
    t: timeRange,
    limit: String(clampedLimit),
    raw_json: "1",
    restrict_sr: subreddit ? "on" : "off",
    type: "link",
  });

  const base = subreddit
    ? `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/search.json`
    : `https://www.reddit.com/search.json`;

  const url = `${base}?${params}`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`Reddit search failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as any;
  const children: any[] = json?.data?.children ?? [];

  const posts: RedditSearchPost[] = children
    .filter((c: any) => c.kind === "t3" && c.data?.selftext)
    .map((c: any) => ({
      title: c.data.title ?? "",
      selftext: c.data.selftext ?? "",
      subreddit: c.data.subreddit ?? "",
      author: c.data.author ?? "[deleted]",
      score: c.data.score ?? 0,
      numComments: c.data.num_comments ?? 0,
      permalink: c.data.permalink ?? "",
      createdUtc: c.data.created_utc ?? 0,
    }));

  return {
    query,
    subreddit: subreddit ?? null,
    posts,
    fetchedAt: new Date().toISOString(),
  };
}

export interface ExampleOptions {
  maxExamples?: number;
  minScore?: number;
  minComments?: number;
  minBodyLength?: number;
  maxBodyLength?: number;
  preferRecentMonths?: number;
}

/**
 * 从搜索结果中提取最适合作为 few-shot 范文的帖子。
 *
 * 筛选规则（优先级从高到低）：
 * 1. 排除低质量帖子（mod、AMA、deleted、bot 帖）
 * 2. 正文长度 200-3000 字符（太短没学习价值，太长浪费 token）
 * 3. score ≥ 20（社区真正认可的内容）
 * 4. 至少 3 条评论（有互动 = 社区觉得值得讨论）
 * 5. 优先最近 3 个月的帖子（写作风格更贴近当前社区氛围）
 * 6. 综合质量评分排序：score × comments × freshness × length
 */
export function extractStyleExamples(
  posts: RedditSearchPost[],
  options: ExampleOptions = {}
): string[] {
  const {
    maxExamples = 3,
    minScore = 20,
    minComments = 3,
    minBodyLength = 200,
    maxBodyLength = 3000,
    preferRecentMonths = 3,
  } = options;

  const nowSec = Date.now() / 1000;
  const recentCutoff = nowSec - preferRecentMonths * 30 * 86400;

  const qualified = posts.filter(
    (p) =>
      !isLowQualityPost(p) &&
      p.selftext.length >= minBodyLength &&
      p.selftext.length <= maxBodyLength &&
      p.score >= minScore &&
      p.numComments >= minComments
  );

  // 分成两组：近期帖子 vs 较老帖子
  const recent = qualified.filter((p) => p.createdUtc >= recentCutoff);
  const older = qualified.filter((p) => p.createdUtc < recentCutoff);

  // 各自按质量评分排序
  const scoredRecent = recent
    .map((p) => ({ post: p, quality: postQualityScore(p, nowSec) }))
    .sort((a, b) => b.quality - a.quality);

  const scoredOlder = older
    .map((p) => ({ post: p, quality: postQualityScore(p, nowSec) }))
    .sort((a, b) => b.quality - a.quality);

  // 优先填充近期帖子，不够再用较老的补
  const selected = [
    ...scoredRecent.slice(0, maxExamples),
    ...scoredOlder.slice(0, Math.max(0, maxExamples - scoredRecent.length)),
  ].slice(0, maxExamples);

  return selected.map(({ post: p }, i) => {
    const ageLabel = formatAge(nowSec - p.createdUtc);
    return (
      `Example ${i + 1} (r/${p.subreddit}, score: ${p.score}, ` +
      `${p.numComments} comments, ${ageLabel} ago):\n` +
      `Title: "${p.title}"\n` +
      `Body: "${p.selftext.slice(0, 800)}${p.selftext.length > 800 ? "..." : ""}"`
    );
  });
}

function formatAge(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  if (days < 1) return "today";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}
