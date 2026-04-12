/**
 * 竞品监控默认 Instagram 账号（可被 .data/competitive-config.json 覆盖）
 */
export const DEFAULT_INSTAGRAM_HANDLES = [
  "womanizerglobal",
  "hellonancy_official",
  "lelo_official",
  "magic_wands",
  "satisfyercom",
  "tenga_pr",
  "tenga_global",
] as const;

export function instagramProfileUrl(handle: string): string {
  const h = handle.replace(/^@/, "").trim();
  return `https://www.instagram.com/${encodeURIComponent(h)}/`;
}

export interface CompetitiveFileConfig {
  /** 覆盖默认的 IG 账号列表 */
  instagramHandles?: string[];
  /** 每个主页拉取最近帖数量上限（Actor resultsLimit） */
  instagramResultsLimit?: number;
}

export const DEFAULT_INSTAGRAM_RESULTS_LIMIT = 25;
