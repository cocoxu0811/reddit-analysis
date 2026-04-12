import fs from "fs/promises";
import path from "path";
import { getCompetitiveCacheKv, setCompetitiveCacheKv } from "../db/sqlite";
import { resolveInstagramParams, runInstagramScraper } from "./instagramApify";

const ROOT = process.cwd();
export const COMPETITIVE_CONFIG_FILE = path.join(ROOT, ".data", "competitive-config.json");
export const COMPETITIVE_CACHE_FILE = path.join(ROOT, ".data", "competitive-cache.json");

export interface CompetitiveCacheV1 {
  version: 1;
  updatedAt: string;
  instagram?: {
    fetchedAt: string;
    runId?: string;
    defaultDatasetId?: string;
    resultsLimit: number;
    handles: string[];
    error?: string;
    postsByUsername: Record<string, import("./instagramApify").InstagramPostLite[]>;
  };
}

async function readJsonFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function loadCompetitiveConfig(): Promise<import("./config").CompetitiveFileConfig | null> {
  return readJsonFile(COMPETITIVE_CONFIG_FILE);
}

export async function readCompetitiveCache(): Promise<CompetitiveCacheV1 | null> {
  try {
    const fromDb = getCompetitiveCacheKv() as CompetitiveCacheV1 | null;
    if (fromDb && fromDb.version === 1) return fromDb;
  } catch {
    /* sqlite 未就绪时仅读文件 */
  }
  const c = await readJsonFile<CompetitiveCacheV1>(COMPETITIVE_CACHE_FILE);
  if (!c || c.version !== 1) return null;
  try {
    setCompetitiveCacheKv(c);
  } catch (e) {
    console.warn("[competitive] sqlite backfill skipped:", e);
  }
  return c;
}

export async function writeCompetitiveCache(cache: CompetitiveCacheV1): Promise<void> {
  await fs.mkdir(path.dirname(COMPETITIVE_CACHE_FILE), { recursive: true });
  await fs.writeFile(COMPETITIVE_CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  try {
    setCompetitiveCacheKv(cache);
  } catch (e) {
    console.error("[competitive] sqlite write failed (json saved):", e);
  }
}

/**
 * 每日任务：仅 Instagram（Apify）。Reddit 侧竞品请使用「版块监控」拉取。
 */
export async function runCompetitiveDaily(): Promise<CompetitiveCacheV1> {
  const token = process.env.APIFY_TOKEN?.trim();
  const fileCfg = await loadCompetitiveConfig();
  const { handles, resultsLimit } = resolveInstagramParams(fileCfg || {});

  const now = new Date().toISOString();
  const base: CompetitiveCacheV1 = {
    version: 1,
    updatedAt: now,
  };

  if (!token) {
    base.instagram = {
      fetchedAt: now,
      resultsLimit,
      handles,
      error: "Missing APIFY_TOKEN",
      postsByUsername: {},
    };
  } else {
    try {
      const ig = await runInstagramScraper(token, handles, { resultsLimit });
      base.instagram = {
        fetchedAt: now,
        runId: ig.runId,
        defaultDatasetId: ig.defaultDatasetId,
        resultsLimit,
        handles,
        postsByUsername: ig.postsByUsername,
      };
    } catch (e: any) {
      base.instagram = {
        fetchedAt: now,
        resultsLimit,
        handles,
        error: e?.message || String(e),
        postsByUsername: {},
      };
    }
  }

  await writeCompetitiveCache(base);
  return base;
}
