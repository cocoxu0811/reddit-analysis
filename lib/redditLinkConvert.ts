/**
 * Reddit JSON 链接转换（纯逻辑，供 server / api 共用）
 *
 * 说明：Reddit 对数据中心 IP（含 Vercel）常返回 403 HTML；old.reddit.com + 合规 UA 可缓解，但不能保证云端可用。
 */

function mapUtmStrip(url: URL) {
  url.searchParams.delete("utm_source");
  url.searchParams.delete("utm_medium");
  url.searchParams.delete("utm_campaign");
}

/** 将常见 reddit 主机统一为用于拉取 .json 的主机（优先 old，403 时可回退 www） */
export function buildRedditJsonUrl(rawUrl: string, hostname: "old.reddit.com" | "www.reddit.com"): string {
  const url = new URL(rawUrl);
  if (!url.hostname.toLowerCase().includes("reddit.com")) {
    throw new Error("Only reddit.com links are supported");
  }
  mapUtmStrip(url);
  url.hostname = hostname;
  if (!url.pathname.endsWith(".json")) {
    url.pathname = url.pathname.replace(/\/$/, "") + ".json";
  }
  if (!url.searchParams.has("limit")) {
    url.searchParams.set("limit", "50");
  }
  return url.toString();
}

/** @deprecated 使用 buildRedditJsonUrl；保留别名以免外部引用断裂 */
export function normalizeRedditJsonUrl(rawUrl: string): string {
  return buildRedditJsonUrl(rawUrl, "old.reddit.com");
}

function buildRedditFetchHeaders(jsonUrl: string): Record<string, string> {
  const contact =
    typeof process !== "undefined" && process.env?.REDDIT_UA_CONTACT?.trim()
      ? String(process.env.REDDIT_UA_CONTACT).trim()
      : "https://github.com/cocoxu0811/reddit-analysis";
  /** Reddit API 惯例：唯一 UA + 联系方式，见 https://github.com/reddit-archive/reddit/wiki/API */
  const ua = `reddit-analysis/1.0 (script; contact: ${contact})`;
  const origin = new URL(jsonUrl).origin;
  return {
    "User-Agent": ua,
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: `${origin}/`,
    "Cache-Control": "no-cache",
  };
}

function looksLikeHtml(body: string): boolean {
  const s = body.slice(0, 200).toLowerCase();
  return s.includes("<!doctype") || s.includes("<html") || s.includes("<body");
}

function formatRedditError(status: number, body: string): string {
  if (status === 403 || looksLikeHtml(body)) {
    return [
      "Reddit 返回 403 或 HTML 页面：匿名 .json 接口常会拦截云函数/数据中心出口 IP（如 Vercel），与 User-Agent 无关。",
      "可行做法：在本地执行 npm run dev 后再做链接转换；或在环境变量 REDDIT_UA_CONTACT 中填写项目/联系方式（仍不保证云端可用）。",
      "Anonymous Reddit JSON often blocks datacenter IPs; try locally or a residential network.",
    ].join(" ");
  }
  const snippet = body.length > 280 ? `${body.slice(0, 280)}…` : body;
  return `Reddit HTTP ${status}: ${snippet}`;
}

export function flattenRedditPayload(payload: unknown): Array<Record<string, unknown>> {
  const items: Array<Record<string, unknown>> = [];
  const listing = Array.isArray(payload) ? payload : [payload];

  const addPost = (child: { data?: Record<string, unknown>; kind?: string }) => {
    const d = child?.data || {};
    items.push({
      dataType: "post",
      id: d.name || d.id || "",
      parsedId: d.id || "",
      url: d.permalink
        ? `https://www.reddit.com${d.permalink}`
        : String((d as { url_overridden_by_dest?: string }).url_overridden_by_dest || d.url || ""),
      title: d.title || "",
      body: d.selftext || "",
      username: d.author || "",
      communityName: d.subreddit_name_prefixed || "",
      parsedCommunityName: d.subreddit || "",
      flair: d.link_flair_text || "",
      upVotes: d.ups || 0,
      numberOfComments: d.num_comments || 0,
      over18: Boolean(d.over_18),
      createdAt: d.created_utc ? new Date((d.created_utc as number) * 1000).toISOString() : "",
    });
  };

  const addComment = (child: { data?: Record<string, unknown>; kind?: string }) => {
    const d = child?.data || {};
    items.push({
      dataType: "comment",
      id: d.name || d.id || "",
      parsedId: d.id || "",
      postId: d.link_id || "",
      parentId: d.parent_id || "",
      url: d.permalink ? `https://www.reddit.com${d.permalink}` : "",
      body: d.body || "",
      username: d.author || "",
      communityName: d.subreddit_name_prefixed || "",
      category: d.subreddit || "",
      upVotes: d.ups || 0,
      numberOfreplies:
        d.replies && (d.replies as { data?: { children?: unknown[] } }).data?.children
          ? (d.replies as { data: { children: unknown[] } }).data.children.length
          : 0,
      createdAt: d.created_utc ? new Date((d.created_utc as number) * 1000).toISOString() : "",
    });
  };

  const walk = (node: unknown) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object" && node !== null) {
      const o = node as {
        kind?: string;
        data?: { children?: unknown; replies?: { data?: { children?: unknown[] } } };
      };
      if (o.kind === "t3") addPost(o as { data?: Record<string, unknown> });
      if (o.kind === "t1") addComment(o as { data?: Record<string, unknown> });
      if (o.data?.children) walk(o.data.children);
      if (o.data?.replies?.data?.children) walk(o.data.replies.data.children);
    }
  };

  walk(listing);
  return items;
}

async function fetchRedditJsonOnce(jsonUrl: string): Promise<Response> {
  return fetch(jsonUrl, {
    headers: buildRedditFetchHeaders(jsonUrl),
    redirect: "follow",
  });
}

export async function fetchRedditJsonForConvert(sourceUrl: string) {
  let jsonUrl = buildRedditJsonUrl(sourceUrl, "old.reddit.com");
  let response = await fetchRedditJsonOnce(jsonUrl);

  if (response.status === 403) {
    jsonUrl = buildRedditJsonUrl(sourceUrl, "www.reddit.com");
    response = await fetchRedditJsonOnce(jsonUrl);
  }

  const text = await response.text();
  if (!response.ok) {
    throw new Error(formatRedditError(response.status, text));
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(formatRedditError(response.status || 502, text));
  }

  const items = flattenRedditPayload(payload);
  return {
    sourceUrl,
    jsonUrl,
    convertedAt: new Date().toISOString(),
    itemCount: items.length,
    items,
  };
}
