import fs from "fs/promises";
import path from "path";
import { getCompetitiveCacheKv, setCompetitiveCacheKv } from "../db/sqlite.js";
import {
  pollInstagramActorRun,
  resolveInstagramParams,
  runInstagramScraper,
  startInstagramActorRun,
} from "./instagramApify.js";

const ROOT = process.cwd();
export const COMPETITIVE_CONFIG_FILE = path.join(ROOT, ".data", "competitive-config.json");
/** Vercel 仅 /tmp 可写；缓存文件放 /tmp，配置仍读部署目录 .data */
export const COMPETITIVE_CACHE_FILE = process.env.VERCEL
  ? path.join("/tmp", "reddit-analysis", "competitive-cache.json")
  : path.join(ROOT, ".data", "competitive-cache.json");

export interface CompetitiveCacheV1 {
  version: 1;
  updatedAt: string;
  history?: Array<{
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
  }>;
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

function buildHistoryEntry(cache: CompetitiveCacheV1): NonNullable<CompetitiveCacheV1["history"]>[number] {
  return {
    updatedAt: cache.updatedAt,
    instagram: cache.instagram ? { ...cache.instagram } : undefined,
  };
}

function mergeWithHistory(
  prev: CompetitiveCacheV1 | null,
  next: CompetitiveCacheV1,
  keep = 20
): CompetitiveCacheV1 {
  const hist = [buildHistoryEntry(next), ...(prev?.history || [])].slice(0, keep);
  return { ...next, history: hist };
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
  try {
    await fs.mkdir(path.dirname(COMPETITIVE_CACHE_FILE), { recursive: true });
    await fs.writeFile(COMPETITIVE_CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (e) {
    console.error("[competitive] cache file write failed:", e);
  }
  try {
    setCompetitiveCacheKv(cache);
  } catch (e) {
    console.error("[competitive] sqlite write failed:", e);
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

  const prev = await readCompetitiveCache();
  const next = mergeWithHistory(prev, base);
  await writeCompetitiveCache(next);
  return next;
}

/**
 * HTTP「立即同步」第一步：只投递 Apify Actor（秒级返回），避免 Vercel 单函数 10s/60s 上限内阻塞整段爬取。
 */
export async function competitiveSyncStart(): Promise<{ runId: string; defaultDatasetId: string }> {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing APIFY_TOKEN");
  }
  const fileCfg = await loadCompetitiveConfig();
  const { handles, resultsLimit } = resolveInstagramParams(fileCfg || {});
  return startInstagramActorRun(token, handles, { resultsLimit });
}

export type CompetitiveSyncPollResult =
  | { phase: "running"; status: string }
  | { phase: "done"; cache: CompetitiveCacheV1 };

/**
 * HTTP 轮询：单次请求内只查状态 +（若已完成）拉 Dataset 写缓存，保持短时。
 */
export async function competitiveSyncPoll(runId: string): Promise<CompetitiveSyncPollResult> {
  const token = process.env.APIFY_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing APIFY_TOKEN");
  }
  const fileCfg = await loadCompetitiveConfig();
  const { handles, resultsLimit } = resolveInstagramParams(fileCfg || {});

  const outcome = await pollInstagramActorRun(token, runId.trim(), handles);
  const now = new Date().toISOString();

  if (outcome.kind === "running") {
    return { phase: "running", status: outcome.status };
  }

  if (outcome.kind === "failed") {
    const cache: CompetitiveCacheV1 = {
      version: 1,
      updatedAt: now,
      instagram: {
        fetchedAt: now,
        runId,
        resultsLimit,
        handles,
        error: `${outcome.status}: ${outcome.message}`,
        postsByUsername: {},
      },
    };
    const prev = await readCompetitiveCache();
    const next = mergeWithHistory(prev, cache);
    await writeCompetitiveCache(next);
    return { phase: "done", cache: next };
  }

  const cache: CompetitiveCacheV1 = {
    version: 1,
    updatedAt: now,
    instagram: {
      fetchedAt: now,
      runId: outcome.runId,
      defaultDatasetId: outcome.defaultDatasetId,
      resultsLimit,
      handles,
      postsByUsername: outcome.postsByUsername,
    },
  };
  const prev = await readCompetitiveCache();
  const next = mergeWithHistory(prev, cache);
  await writeCompetitiveCache(next);
  return { phase: "done", cache: next };
}
