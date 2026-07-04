import "../lib/loadEnv.js";
import express from "express";
import { Client } from "@notionhq/client";
import path from "path";
import fs from "fs/promises";
import { scanSubreddit, scanMultipleSubreddits } from "../lib/redditMonitor.js";
import {
  generateRedditAnalysisReport,
  generateContentIdeas,
  generateContentFromPrompt,
  normalizeAiProvider,
  suggestSubredditsForIdeas,
} from "../lib/llm.js";
import { chat as agentChat, type ChatResult } from "../lib/agent.js";
import { registerAssetRoutes } from "../lib/registerAssetRoutes.js";
import { registerKnowledgeRoutes } from "../lib/registerKnowledgeRoutes.js";
import { ingestGeneratedIdeas, isKnowledgeConfigured } from "../lib/knowledge.js";
import type { ModelMessage } from "ai";
/** 竞品模块会拉 sqlite（node:sqlite，需 Node 22+）；勿静态 import，否则 Vercel 上未加载 Node 22 时整包 /api 启动失败 */

/** 本地：.data/monitor-cache.json；Vercel 只读 /var/task，可写目录为 /tmp */
const MONITOR_CACHE_FILE = process.env.VERCEL
  ? path.join("/tmp", "reddit-analysis", "monitor-cache.json")
  : path.join(process.cwd(), ".data", "monitor-cache.json");

const app = express();
let memoryHistory: any[] = [];

app.use(express.json({ limit: "50mb" }));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: "Missing messages[]" });
    }

    const coreMessages: ModelMessage[] = messages.map((m: any) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: String(m.content ?? ""),
    }));

    const result: ChatResult = await agentChat(coreMessages);

    res.json({
      success: true,
      response: result.response,
      toolCalls: result.toolCalls.map((tc) => ({
        tool: tc.toolName,
        input: tc.input,
        output: tc.output,
      })),
    });
  } catch (error: any) {
    console.error("[agent] chat error:", error);
    res.status(500).json({ success: false, error: error.message || "Agent chat failed" });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { datasetText, language = "en", aiProvider = "gemini" } = req.body || {};
    const text = typeof datasetText === "string" ? datasetText.trim() : "";
    if (!text) {
      return res.status(400).json({ success: false, error: "Missing datasetText" });
    }
    const provider = normalizeAiProvider(aiProvider);
    const report = await generateRedditAnalysisReport(
      text,
      language === "zh" ? "zh" : "en",
      provider
    );
    res.json({ success: true, provider, report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Analysis failed" });
  }
});

app.post("/api/content/subreddits", async (req, res) => {
  try {
    const { ideas = [], language = "en", aiProvider = "gemini" } = req.body || {};
    if (!Array.isArray(ideas) || ideas.length === 0) {
      return res.status(400).json({ success: false, error: "Missing ideas[]" });
    }
    const provider = normalizeAiProvider(aiProvider);
    const suggestedSubreddits = await suggestSubredditsForIdeas(
      ideas.map((x: any) => ({
        title: String(x?.title ?? ""),
        angle: String(x?.angle ?? ""),
        postTitle: String(x?.postTitle ?? ""),
        postBody: String(x?.postBody ?? ""),
        currentSuggestedSubreddit: String(x?.currentSuggestedSubreddit ?? ""),
      })),
      language === "zh" ? "zh" : "en",
      provider
    );
    res.json({ success: true, provider, suggestedSubreddits });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Subreddit suggestion failed" });
  }
});

app.post("/api/content/ideas", async (req, res) => {
  try {
    const {
      report,
      language = "en",
      tone = "question",
      aiProvider = "gemini",
      useRag = true,
      persistToKnowledge = false,
    } = req.body || {};
    if (!report || typeof report !== "object") {
      return res.status(400).json({ success: false, error: "Missing report" });
    }
    const lang = language === "zh" ? "zh" : "en";
    const provider = normalizeAiProvider(aiProvider);
    const ideas = await generateContentIdeas(
      report as any,
      lang,
      String(tone),
      provider,
      6,
      { useRag: useRag !== false }
    );
    let knowledgeSaved = false;
    if (persistToKnowledge && isKnowledgeConfigured()) {
      try {
        await ingestGeneratedIdeas({ ideas, language: lang });
        knowledgeSaved = true;
      } catch (e) {
        console.warn("[knowledge] persist ideas failed:", e);
      }
    }
    res.json({ success: true, provider, ideas, ragEnabled: useRag !== false, knowledgeSaved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Content idea generation failed" });
  }
});

app.post("/api/content/generate", async (req, res) => {
  try {
    const {
      subreddit = "",
      instruction = "",
      language = "en",
      tone = "question",
      aiProvider = "gemini",
      count = 6,
      useRag = true,
      persistToKnowledge = false,
    } = req.body || {};

    const sub = String(subreddit).trim();
    const instr = String(instruction).trim();
    if (!sub || !instr) {
      return res
        .status(400)
        .json({ success: false, error: "Missing subreddit or instruction" });
    }

    const lang = language === "zh" ? "zh" : "en";
    const provider = normalizeAiProvider(aiProvider);
    const ideas = await generateContentFromPrompt(
      sub,
      instr,
      lang,
      String(tone),
      provider,
      [],
      Number(count) || 6,
      { useRag: useRag !== false }
    );
    let knowledgeSaved = false;
    if (persistToKnowledge && isKnowledgeConfigured()) {
      try {
        await ingestGeneratedIdeas({ ideas, language: lang, tags: [sub.replace(/^r\//i, "")] });
        knowledgeSaved = true;
      } catch (e) {
        console.warn("[knowledge] persist generate failed:", e);
      }
    }
    res.json({ success: true, provider, ideas, ragEnabled: useRag !== false, knowledgeSaved });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, error: error.message || "Content generation failed" });
  }
});

app.get("/api/history", (_req, res) => {
  res.json({ success: true, records: memoryHistory });
});

app.post("/api/history", (req, res) => {
  const { record } = req.body || {};
  if (!record?.id) {
    return res.status(400).json({ success: false, error: "Invalid history record" });
  }
  memoryHistory = [record, ...memoryHistory.filter((x) => x.id !== record.id)].slice(0, 100);
  return res.json({ success: true, records: memoryHistory });
});

app.delete("/api/history", (_req, res) => {
  memoryHistory = [];
  return res.json({ success: true });
});

/** Reddit 链接转换见独立函数 api/reddit/convert.ts（避免经 Express 整包加载失败） */

registerAssetRoutes(app);
registerKnowledgeRoutes(app);

app.post("/api/notion/export", async (req, res) => {
  try {
    const { apiKey, databaseId, report, language = 'en' } = req.body;

    if (!apiKey || !databaseId || !report) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Auto-extract database ID if user pasted a full Notion URL
    let cleanDatabaseId = databaseId.trim();
    if (cleanDatabaseId.includes("notion.so")) {
      // Match a 32-character hex string which is the Notion database ID
      const match = cleanDatabaseId.match(/([a-f0-9]{32})/i);
      if (match) {
        cleanDatabaseId = match[1];
      }
    }

    const notion = new Client({ auth: apiKey });

    const headers = language === 'zh' ? {
      summary: "1. 讨论内容总结",
      painPoints: "2. 用户痛点",
      praisedFeatures: "3. 产品特点",
      mentionedBrands: "4. 提及品牌",
      highFreqWords: "5. 高频词汇"
    } : {
      summary: "1. Discussion Summary",
      painPoints: "2. User Pain Points",
      praisedFeatures: "3. Praised Features",
      mentionedBrands: "4. Mentioned Brands/Products",
      highFreqWords: "5. High Frequency Words"
    };

    const chunkText = (text: string) => {
      if (!text) return [{ type: "text", text: { content: "" } }];
      const chunks = [];
      for (let i = 0; i < text.length; i += 2000) {
        chunks.push({
          type: "text",
          text: { content: text.substring(i, i + 2000) },
        });
      }
      return chunks;
    };

    // Create a new page in the database
    const response = await notion.pages.create({
      parent: { database_id: cleanDatabaseId },
      properties: {
        "标题": {
          title: [
            {
              text: {
                content: `Reddit Analysis Report - ${new Date().toLocaleDateString()}`.substring(0, 2000),
              },
            },
          ],
        },
        "讨论内容总结": {
          rich_text: chunkText(report.summary),
        },
        "用户痛点": {
          rich_text: chunkText((report.painPoints || []).map((p: string) => `• ${p}`).join('\n')),
        },
        "产品特点": {
          rich_text: chunkText((report.praisedFeatures || []).map((p: string) => `• ${p}`).join('\n')),
        },
        "提及品牌": {
          multi_select: (report.mentionedBrands || [])
            .filter((brand: string) => brand.trim().length > 0)
            .map((brand: string) => ({
              name: brand.replace(/,/g, '').substring(0, 100)
            })),
        },
        "高频词汇": {
          multi_select: (report.highFrequencyWords || [])
            .filter((word: string) => word.trim().length > 0)
            .map((word: string) => ({
              name: word.replace(/,/g, '').substring(0, 100)
            })),
        }
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.summary } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: chunkText(report.summary),
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.painPoints } }],
          },
        },
        ...(report.painPoints || []).map((point: string) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: chunkText(point),
          },
        })),
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.praisedFeatures } }],
          },
        },
        ...(report.praisedFeatures || []).map((feature: string) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: chunkText(feature),
          },
        })),
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.mentionedBrands } }],
          },
        },
        ...(report.mentionedBrands || []).map((brand: string) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: chunkText(brand),
          },
        })),
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.highFreqWords } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: chunkText((report.highFrequencyWords || []).join(", ")),
          },
        },
      ],
    });

    res.json({ success: true, url: (response as any).url });
  } catch (error: any) {
    console.error("Notion export error:", error);
    res.status(500).json({ error: error.message || "Failed to export to Notion" });
  }
});

app.get("/api/monitor/cache", async (_req, res) => {
  try {
    const raw = await fs.readFile(MONITOR_CACHE_FILE, "utf-8");
    res.json(JSON.parse(raw));
  } catch {
    res.json({ subreddit: null, subreddits: [], fetchedAt: null, posts: [] });
  }
});

const normalizeMonitorSubreddits = (body: Record<string, unknown> | undefined): string[] => {
  if (!body || typeof body !== "object") return [];
  const rawList = body.subreddits ?? body.subreddit;
  if (Array.isArray(rawList)) {
    return rawList
      .map((x) => String(x ?? "").replace(/[\u200b\ufeff]/g, "").trim())
      .filter(Boolean);
  }
  if (typeof rawList === "string") {
    const t = rawList.replace(/[\u200b\ufeff]/g, "").trim();
    if (!t) return [];
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x ?? "").trim()).filter(Boolean);
      }
    } catch {
      /* fallthrough */
    }
    return t
      .split(/[,，\s]+/)
      .map((s) => s.replace(/^r\//i, "").trim())
      .filter(Boolean);
  }
  return [];
};

const coerceMs = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

app.post("/api/monitor/scan", async (req, res) => {
  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const {
      limit = 12,
      useGemini = false,
      aiProvider = "gemini",
      mode = "new",
      dayStartMs: rawStart,
      dayEndMs: rawEnd,
    } = body;

    const subsList = normalizeMonitorSubreddits(body);

    const dayStartMs = coerceMs(rawStart);
    const dayEndMs = coerceMs(rawEnd);
    const dayRange =
      mode === "day" && dayStartMs !== null && dayEndMs !== null
        ? { startMs: dayStartMs, endMs: dayEndMs }
        : null;

    if (mode === "day" && !dayRange) {
      return res.status(400).json({
        success: false,
        error: "day mode requires valid dayStartMs and dayEndMs (numbers)",
      });
    }

    if (subsList.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "Missing subreddit(s): request body had no subreddit names. Send JSON like {\"subreddits\":[\"askreddit\"]}.",
      });
    }

    const opts = {
      useGemini: Boolean(useGemini),
      aiProvider: normalizeAiProvider(aiProvider),
      dayRange: dayRange || null,
    };
    let result: Record<string, unknown>;

    if (subsList.length === 1 && !dayRange) {
      const one = await scanSubreddit(subsList[0], Number(limit), {
        useGemini: Boolean(useGemini),
        aiProvider: normalizeAiProvider(aiProvider),
      });
      result = {
        subreddits: [one.subreddit],
        subreddit: one.subreddit,
        fetchedAt: one.fetchedAt,
        posts: one.posts,
        mode: "new",
      };
    } else {
      result = await scanMultipleSubreddits(subsList, Number(limit), opts);
    }

    try {
      await fs.mkdir(path.dirname(MONITOR_CACHE_FILE), { recursive: true });
      await fs.writeFile(MONITOR_CACHE_FILE, JSON.stringify({ success: true, mode, ...result }, null, 2), "utf-8");
    } catch (e) {
      console.error("[monitor] cache write skipped:", e);
    }
    res.json({ success: true, mode, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Monitor scan failed" });
  }
});

app.get("/api/competitive/cache", async (_req, res) => {
  try {
    const { readCompetitiveCache } = await import("../competitive/runDaily.js");
    const cache = await readCompetitiveCache();
    res.json({ success: true, cache: cache || null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load competitive cache" });
  }
});

/** Instagram：先 POST 投递 Apify，再 GET ?runId= 轮询（避免 Vercel 单请求内长时间阻塞导致 HTML 500） */
app.post("/api/competitive/sync", async (_req, res) => {
  try {
    const { competitiveSyncStart } = await import("../competitive/runDaily.js");
    const { runId, defaultDatasetId } = await competitiveSyncStart();
    res.json({ success: true, phase: "started", runId, defaultDatasetId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Competitive sync start failed" });
  }
});

app.get("/api/competitive/sync", async (req, res) => {
  try {
    const runId = typeof req.query.runId === "string" ? req.query.runId.trim() : "";
    if (!runId) {
      return res.status(400).json({ success: false, error: "Missing runId query parameter" });
    }
    const { competitiveSyncPoll } = await import("../competitive/runDaily.js");
    const result = await competitiveSyncPoll(runId);
    if (result.phase === "running") {
      return res.json({ success: true, phase: "running", status: result.status });
    }
    return res.json({ success: true, phase: "done", cache: result.cache });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Competitive sync poll failed" });
  }
});

export default app;
