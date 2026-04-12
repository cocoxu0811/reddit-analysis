/**
 * 社媒分析看板：从竞品 Instagram 缓存聚合指标（账号 / 内容 / 互动 / 节奏）
 */
import { DEFAULT_INSTAGRAM_HANDLES } from "../competitive/config";

export type IgPostRow = Record<string, unknown>;

function igGetBucket(by: Record<string, IgPostRow[]>, pilot: string): IgPostRow[] {
  const k = pilot.toLowerCase();
  if (by[k]) return by[k];
  const f = Object.keys(by).find((x) => x.toLowerCase() === k);
  return f ? by[f] : [];
}

function formatLocalYmd(ms: number): string {
  const n = new Date(ms);
  const y = n.getFullYear();
  const mo = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

function weekdayIndexLocal(ms: number): number {
  return new Date(ms).getDay();
}

const WEEKDAY_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface InstagramSocialDashboard {
  fetchedAt: string | null;
  pilotHandles: string[];
  /** 1 账号层 */
  accountRows: Array<{
    handle: string;
    postsInSample: number;
  }>;
  /** 2 内容结构 */
  contentMix: {
    original: number;
    collaboration: number;
    repost: number;
    unknown: number;
  };
  mediaTypeMix: Record<string, number>;
  /** 3 互动 */
  engagement: {
    totalLikes: number;
    totalComments: number;
    postsWithMetrics: number;
    avgLikes: number;
    avgComments: number;
    byAccount: Array<{ handle: string; avgLikes: number; avgComments: number; n: number }>;
  };
  /** 4 节奏 */
  cadence: {
    dateMin: string | null;
    dateMax: string | null;
    spanDays: number;
    postsPerWeek: number;
    busiestWeekday: { index: number; count: number } | null;
  };
}

export function buildInstagramSocialDashboard(
  ig:
    | {
        fetchedAt?: string;
        handles?: string[];
        postsByUsername?: Record<string, IgPostRow[]>;
      }
    | undefined
    | null
): InstagramSocialDashboard | null {
  if (!ig?.postsByUsername) return null;

  const pilotHandles =
    ig.handles && ig.handles.length > 0 ? ig.handles.map((h) => String(h)) : [...DEFAULT_INSTAGRAM_HANDLES];
  const by = ig.postsByUsername;

  const allPosts: IgPostRow[] = [];
  for (const h of pilotHandles) {
    allPosts.push(...igGetBucket(by, h));
  }

  if (allPosts.length === 0) {
    return {
      fetchedAt: ig.fetchedAt || null,
      pilotHandles,
      accountRows: pilotHandles.map((handle) => ({ handle, postsInSample: 0 })),
      contentMix: { original: 0, collaboration: 0, repost: 0, unknown: 0 },
      mediaTypeMix: {},
      engagement: {
        totalLikes: 0,
        totalComments: 0,
        postsWithMetrics: 0,
        avgLikes: 0,
        avgComments: 0,
        byAccount: pilotHandles.map((handle) => ({ handle, avgLikes: 0, avgComments: 0, n: 0 })),
      },
      cadence: { dateMin: null, dateMax: null, spanDays: 0, postsPerWeek: 0, busiestWeekday: null },
    };
  }

  const accountRows = pilotHandles.map((handle) => ({
    handle,
    postsInSample: igGetBucket(by, handle).length,
  }));

  let original = 0,
    collaboration = 0,
    repost = 0,
    unknown = 0;
  const mediaTypeMix: Record<string, number> = {};
  let totalLikes = 0,
    totalComments = 0;
  let nLikes = 0,
    nComments = 0;
  const timestamps: number[] = [];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

  for (const row of allPosts) {
    const pk = (row.postKind as string) || "original";
    if (pk === "collaboration") collaboration++;
    else if (pk === "repost") repost++;
    else if (pk === "original") original++;
    else unknown++;

    const mt = String(row.type || "unknown");
    mediaTypeMix[mt] = (mediaTypeMix[mt] || 0) + 1;

    const lc = row.likesCount;
    const cc = row.commentsCount;
    if (typeof lc === "number" && Number.isFinite(lc)) {
      totalLikes += lc;
      nLikes++;
    }
    if (typeof cc === "number" && Number.isFinite(cc)) {
      totalComments += cc;
      nComments++;
    }

    const ts = row.timestamp ? String(row.timestamp) : "";
    if (ts) {
      const ms = new Date(ts).getTime();
      if (!Number.isNaN(ms)) {
        timestamps.push(ms);
        weekdayCounts[weekdayIndexLocal(ms)]++;
      }
    }
  }

  const postsWithMetrics = allPosts.length;
  const avgLikes = nLikes > 0 ? totalLikes / nLikes : 0;
  const avgComments = nComments > 0 ? totalComments / nComments : 0;

  const byAccount = pilotHandles.map((handle) => {
    const rows = igGetBucket(by, handle);
    let sL = 0,
      sC = 0,
      cL = 0,
      cC = 0;
    for (const row of rows) {
      if (typeof row.likesCount === "number" && Number.isFinite(row.likesCount)) {
        sL += row.likesCount;
        cL++;
      }
      if (typeof row.commentsCount === "number" && Number.isFinite(row.commentsCount)) {
        sC += row.commentsCount;
        cC++;
      }
    }
    return {
      handle,
      avgLikes: cL > 0 ? sL / cL : 0,
      avgComments: cC > 0 ? sC / cC : 0,
      n: rows.length,
    };
  });

  timestamps.sort((a, b) => a - b);
  const dateMin = timestamps.length ? formatLocalYmd(timestamps[0]) : null;
  const dateMax = timestamps.length ? formatLocalYmd(timestamps[timestamps.length - 1]) : null;
  let spanDays = 0;
  if (timestamps.length >= 2) {
    spanDays = Math.max(
      1,
      Math.ceil((timestamps[timestamps.length - 1] - timestamps[0]) / (86400 * 1000)) + 1
    );
  } else if (timestamps.length === 1) {
    spanDays = 1;
  }
  const weeks = spanDays / 7;
  const postsPerWeek = weeks > 0 ? allPosts.length / weeks : allPosts.length;

  let bestI = 0;
  for (let i = 1; i < 7; i++) {
    if (weekdayCounts[i] > weekdayCounts[bestI]) bestI = i;
  }
  const busiestWeekday =
    allPosts.length > 0 && weekdayCounts[bestI] > 0 ? { index: bestI, count: weekdayCounts[bestI] } : null;

  return {
    fetchedAt: ig.fetchedAt || null,
    pilotHandles,
    accountRows,
    contentMix: { original, collaboration, repost, unknown },
    mediaTypeMix,
    engagement: {
      totalLikes,
      totalComments,
      postsWithMetrics,
      avgLikes,
      avgComments,
      byAccount,
    },
    cadence: {
      dateMin,
      dateMax,
      spanDays,
      postsPerWeek,
      busiestWeekday,
    },
  };
}

export function weekdayLabel(i: number, lang: "en" | "zh"): string {
  return lang === "zh" ? WEEKDAY_ZH[i] ?? String(i) : WEEKDAY_EN[i] ?? String(i);
}
