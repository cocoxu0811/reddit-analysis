/**
 * Reddit JSON 链接转换（纯逻辑，供 server / api 共用）
 */
export function normalizeRedditJsonUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  if (!url.hostname.includes("reddit.com")) {
    throw new Error("Only reddit.com links are supported");
  }
  url.searchParams.delete("utm_source");
  url.searchParams.delete("utm_medium");
  url.searchParams.delete("utm_campaign");
  if (!url.pathname.endsWith(".json")) {
    url.pathname = url.pathname.replace(/\/$/, "") + ".json";
  }
  if (!url.searchParams.has("limit")) {
    url.searchParams.set("limit", "50");
  }
  return url.toString();
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
      const o = node as { kind?: string; data?: { children?: unknown; replies?: { data?: { children?: unknown[] } } } };
      if (o.kind === "t3") addPost(o as { data?: Record<string, unknown> });
      if (o.kind === "t1") addComment(o as { data?: Record<string, unknown> });
      if (o.data?.children) walk(o.data.children);
      if (o.data?.replies?.data?.children) walk(o.data.replies.data.children);
    }
  };

  walk(listing);
  return items;
}

export async function fetchRedditJsonForConvert(sourceUrl: string) {
  const jsonUrl = normalizeRedditJsonUrl(sourceUrl);
  const response = await fetch(jsonUrl, {
    headers: {
      "User-Agent": "reddit-analysis-tool/1.0 (reddit-analysis; +https://github.com/cocoxu0811/reddit-analysis)",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Reddit HTTP ${response.status}: ${text.slice(0, 400)}`);
  }
  const payload = await response.json();
  const items = flattenRedditPayload(payload);
  return {
    sourceUrl,
    jsonUrl,
    convertedAt: new Date().toISOString(),
    itemCount: items.length,
    items,
  };
}
