/**
 * 本地 SQLite（.data/app.db），与 JSON 双写；读时优先 DB，空则回读 JSON 并回填。
 * 使用 Node.js 内置 node:sqlite（需 Node ≥ 22.5），无需原生编译依赖。
 */
import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

/** 与 server 写入的 .data/*.json 一致：请在项目根目录启动（npm run dev / node dist/server.cjs） */
export const DATA_DIR = path.join(process.cwd(), ".data");
export const DB_PATH = path.join(DATA_DIR, "app.db");

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!db) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new DatabaseSync(DB_PATH, { enableForeignKeyConstraints: true });
    db.exec("PRAGMA journal_mode = WAL;");
    initSchema(db);
  }
  return db;
}

function initSchema(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS analysis_history (
      id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL,
      language TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_label TEXT NOT NULL,
      input_text TEXT NOT NULL,
      report_json TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_analysis_history_created ON analysis_history(created_at DESC);

    CREATE TABLE IF NOT EXISTS kv_store (
      k TEXT PRIMARY KEY NOT NULL,
      v TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

const KV_MONITOR = "monitor_cache_json";
const KV_COMPETITIVE = "competitive_cache_v1_json";

export type HistoryRow = {
  id: string;
  createdAt: string;
  language: string;
  sourceType: string;
  sourceLabel: string;
  inputText: string;
  report: unknown;
};

function rowToRecord(r: {
  id: string;
  created_at: string;
  language: string;
  source_type: string;
  source_label: string;
  input_text: string;
  report_json: string;
}): HistoryRow {
  return {
    id: r.id,
    createdAt: r.created_at,
    language: r.language,
    sourceType: r.source_type,
    sourceLabel: r.source_label,
    inputText: r.input_text,
    report: JSON.parse(r.report_json),
  };
}

export function loadHistoryFromDb(): HistoryRow[] {
  const database = getDb();
  const stmt = database.prepare(
    `SELECT id, created_at, language, source_type, source_label, input_text, report_json
     FROM analysis_history ORDER BY datetime(created_at) DESC`
  );
  const rows = stmt.all() as Array<{
    id: string;
    created_at: string;
    language: string;
    source_type: string;
    source_label: string;
    input_text: string;
    report_json: string;
  }>;
  return rows.map(rowToRecord);
}

export function replaceHistoryInDb(records: HistoryRow[]): void {
  const database = getDb();
  database.exec("BEGIN IMMEDIATE;");
  try {
    database.prepare(`DELETE FROM analysis_history`).run();
    const ins = database.prepare(
      `INSERT INTO analysis_history (id, created_at, language, source_type, source_label, input_text, report_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (const r of records) {
      ins.run(
        r.id,
        r.createdAt,
        r.language,
        r.sourceType,
        r.sourceLabel,
        r.inputText,
        JSON.stringify(r.report)
      );
    }
    database.exec("COMMIT;");
  } catch (e) {
    database.exec("ROLLBACK;");
    throw e;
  }
}

export function getKvJson(key: string): unknown | null {
  const database = getDb();
  const row = database.prepare(`SELECT v FROM kv_store WHERE k = ?`).get(key) as { v: string } | undefined;
  if (!row?.v) return null;
  try {
    return JSON.parse(row.v);
  } catch {
    return null;
  }
}

export function setKvJson(key: string, value: unknown): void {
  const database = getDb();
  const now = new Date().toISOString();
  const v = JSON.stringify(value);
  database
    .prepare(
      `INSERT INTO kv_store (k, v, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(k) DO UPDATE SET v = excluded.v, updated_at = excluded.updated_at`
    )
    .run(key, v, now);
}

export function setMonitorCacheKv(payload: unknown): void {
  setKvJson(KV_MONITOR, payload);
}

export function getMonitorCacheKv(): unknown | null {
  return getKvJson(KV_MONITOR);
}

export function setCompetitiveCacheKv(payload: unknown): void {
  setKvJson(KV_COMPETITIVE, payload);
}

export function getCompetitiveCacheKv(): unknown | null {
  return getKvJson(KV_COMPETITIVE);
}
