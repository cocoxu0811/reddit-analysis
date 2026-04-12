import { ApifyClient } from "apify-client";
import {
  DEFAULT_INSTAGRAM_HANDLES,
  DEFAULT_INSTAGRAM_RESULTS_LIMIT,
  instagramProfileUrl,
  type CompetitiveFileConfig,
} from "./config";

const ACTOR_ID = "apify/instagram-scraper";

/** 原创：日历打点；协作/转发：归在试点账号下但日历不打点 */
export type IgPostKind = "original" | "collaboration" | "repost";

export interface InstagramPostLite {
  url: string;
  shortCode?: string;
  type?: string;
  caption: string;
  ownerUsername: string;
  /** 从哪条试点主页 URL 爬取（与 inputUrl 对应）；分组应优先用此字段，避免协作帖/转发显示成「别的账号」 */
  sourceProfileHandle: string;
  postKind: IgPostKind;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
  displayUrl?: string;
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

function pickNum(obj: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return undefined;
}

function pickProfileInputUrl(raw: Record<string, unknown>): string | undefined {
  const top = pickString(raw, "inputUrl", "input_url", "pageUrl", "searchUrl");
  if (top) return top;
  const meta = raw.metadata;
  if (meta && typeof meta === "object") {
    const u = pickString(meta as Record<string, unknown>, "inputUrl", "pageUrl");
    if (u) return u;
  }
  const parent = raw.parent;
  if (parent && typeof parent === "object") {
    const u = pickString(parent as Record<string, unknown>, "inputUrl", "url");
    if (u) return u;
  }
  return undefined;
}

/**
 * 区分原创 / 协作 / 转发（启发式，依赖 Apify 原始字段）。
 * 协作：共同创作者等字段非空，或 productType 含 collab。
 * 转发：发帖人与试点主页不一致且无协作信号时，视为转发/分享类展示。
 */
export function classifyIgPostKind(
  raw: Record<string, unknown>,
  sourceHandle: string,
  ownerUsername: string
): IgPostKind {
  const s = sourceHandle.toLowerCase();
  const o = (ownerUsername || "").trim().toLowerCase();

  const coauthor =
    raw.coauthorProducers ??
    raw.coauthor_producers ??
    raw.coauthorProducerUsers ??
    raw.coAuthorProducers ??
    raw.coauthorUsers;
  if (Array.isArray(coauthor) && coauthor.length > 0) return "collaboration";

  const pt = String(raw.productType ?? raw.product_type ?? "").toLowerCase();
  if (pt.includes("collab")) return "collaboration";

  const titleOrType = `${raw.title ?? ""} ${raw.type ?? ""}`.toLowerCase();
  if (titleOrType.includes("collab")) return "collaboration";

  if (o && o !== s) {
    if (pt.includes("repost") || titleOrType.includes("repost") || titleOrType.includes("reshare")) {
      return "repost";
    }
    return "repost";
  }

  return "original";
}

/** 从 profile 类 URL 解析用户名，如 https://www.instagram.com/foo/ → foo；非 profile 链接返回空 */
export function handleFromInstagramProfileUrl(url: string | undefined): string {
  if (!url || !url.includes("instagram.com")) return "";
  const m = url.trim().match(/instagram\.com\/([^/?#]+)/i);
  if (!m) return "";
  const seg = m[1].toLowerCase();
  if (["p", "reel", "reels", "stories", "explore", "tv"].includes(seg)) return "";
  return seg.replace(/\/$/, "");
}

export function normalizeIgDatasetItem(raw: Record<string, unknown>): InstagramPostLite | null {
  const postUrl = pickString(raw, "url");
  const inputUrl = pickProfileInputUrl(raw);
  const url = postUrl || inputUrl;
  if (!url || !url.includes("instagram.com")) return null;
  const owner =
    pickString(raw, "ownerUsername", "ownerusername") ||
    pickString(raw, "username") ||
    "";
  const fromInput = handleFromInstagramProfileUrl(inputUrl);
  const sourceProfileHandle = (fromInput || owner || "unknown").toLowerCase();
  const caption = pickString(raw, "caption", "text") || "";
  let timestamp: string | undefined = pickString(raw, "timestamp");
  if (!timestamp) {
    const ts = raw.taken_at_timestamp ?? raw.takenAtTimestamp;
    if (typeof ts === "number" && Number.isFinite(ts)) {
      const ms = ts < 1e12 ? ts * 1000 : ts;
      timestamp = new Date(ms).toISOString();
    }
  }
  const postKind = classifyIgPostKind(raw, sourceProfileHandle, owner);
  return {
    url: postUrl || inputUrl || url,
    shortCode: pickString(raw, "shortCode", "shortcode"),
    type: pickString(raw, "type"),
    caption: caption.slice(0, 4000),
    ownerUsername: owner,
    sourceProfileHandle,
    postKind,
    likesCount: pickNum(raw, "likesCount", "likes", "likeCount"),
    commentsCount: pickNum(raw, "commentsCount", "comments", "commentCount"),
    timestamp,
    displayUrl: pickString(raw, "displayUrl", "display_url"),
  };
}

export function groupPostsByUsername(items: InstagramPostLite[]): Record<string, InstagramPostLite[]> {
  const out: Record<string, InstagramPostLite[]> = {};
  for (const p of items) {
    const key = (p.sourceProfileHandle || p.ownerUsername || "unknown").toLowerCase();
    if (!out[key]) out[key] = [];
    out[key].push(p);
  }
  return out;
}

export async function runInstagramScraper(
  token: string,
  handles: string[],
  options: { resultsLimit?: number } = {}
): Promise<{
  runId: string;
  defaultDatasetId: string;
  postsByUsername: Record<string, InstagramPostLite[]>;
}> {
  const resultsLimit = options.resultsLimit ?? DEFAULT_INSTAGRAM_RESULTS_LIMIT;
  const directUrls = handles.map((h) => instagramProfileUrl(h));

  const input: Record<string, unknown> = {
    directUrls,
    resultsType: "posts",
    resultsLimit,
    addParentData: true,
  };

  const client = new ApifyClient({ token });
  const run = await client.actor(ACTOR_ID).call(input);

  const runId = run.id;
  const defaultDatasetId = run.defaultDatasetId;
  const { items: rawItems } = await client.dataset(defaultDatasetId).listItems({ limit: 10000 });

  const items: InstagramPostLite[] = [];
  for (const row of rawItems) {
    if (!row || typeof row !== "object") continue;
    const n = normalizeIgDatasetItem(row as Record<string, unknown>);
    if (n) items.push(n);
  }

  let postsByUsername = groupPostsByUsername(items);
  /** 只保留本次请求的试点账号，去掉协作帖/转发里出现的「真实发帖人」分组 */
  const allowed = new Set(handles.map((h) => h.replace(/^@/, "").trim().toLowerCase()));
  postsByUsername = Object.fromEntries(
    Object.entries(postsByUsername).filter(([k]) => allowed.has(k.toLowerCase()))
  );

  return {
    runId,
    defaultDatasetId,
    postsByUsername,
  };
}

/** 从磁盘配置合并 handles / limit */
export function resolveInstagramParams(cfg: CompetitiveFileConfig | null): {
  handles: string[];
  resultsLimit: number;
} {
  const handles =
    cfg?.instagramHandles && cfg.instagramHandles.length > 0
      ? cfg.instagramHandles.map((h) => h.replace(/^@/, "").trim()).filter(Boolean)
      : [...DEFAULT_INSTAGRAM_HANDLES];
  const resultsLimit =
    typeof cfg?.instagramResultsLimit === "number" && cfg.instagramResultsLimit > 0
      ? Math.min(cfg.instagramResultsLimit, 200)
      : DEFAULT_INSTAGRAM_RESULTS_LIMIT;
  return { handles, resultsLimit };
}
