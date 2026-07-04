import type { Express, Request, Response } from "express";
import {
  assertKnowledgeReady,
  deleteKnowledgeDocument,
  ingestGeneratedIdeas,
  ingestKnowledgeDocument,
  isKnowledgeConfigured,
  isKnowledgeSourceType,
  KNOWLEDGE_SOURCE_TYPES,
  listKnowledgeDocuments,
  searchKnowledge,
} from "./knowledge.js";

export function registerKnowledgeRoutes(app: Express): void {
  app.get("/api/knowledge/status", (_req: Request, res: Response) => {
    res.json({
      success: true,
      configured: isKnowledgeConfigured(),
      sourceTypes: KNOWLEDGE_SOURCE_TYPES,
    });
  });

  app.get("/api/knowledge", async (_req: Request, res: Response) => {
    try {
      assertKnowledgeReady();
      const documents = await listKnowledgeDocuments();
      res.json({ success: true, documents, configured: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to list knowledge";
      res.status(isKnowledgeConfigured() ? 500 : 503).json({ success: false, error: message, configured: false });
    }
  });

  app.post("/api/knowledge/ingest", async (req: Request, res: Response) => {
    try {
      assertKnowledgeReady();
      const { title, content, sourceType, tags, language, performanceWeight } = req.body || {};
      if (!title || typeof title !== "string") {
        return res.status(400).json({ success: false, error: "Missing title" });
      }
      if (!content || typeof content !== "string") {
        return res.status(400).json({ success: false, error: "Missing content" });
      }
      if (!isKnowledgeSourceType(sourceType)) {
        return res.status(400).json({ success: false, error: "Invalid sourceType" });
      }
      const doc = await ingestKnowledgeDocument({
        title,
        content,
        sourceType,
        tags: Array.isArray(tags) ? tags.map(String) : undefined,
        language: language === "zh" ? "zh" : "en",
        performanceWeight: typeof performanceWeight === "number" ? performanceWeight : undefined,
      });
      res.json({ success: true, document: doc });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ingest failed";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.post("/api/knowledge/ingest-ideas", async (req: Request, res: Response) => {
    try {
      assertKnowledgeReady();
      const { ideas, language = "en", performanceWeight, tags } = req.body || {};
      if (!Array.isArray(ideas) || ideas.length === 0) {
        return res.status(400).json({ success: false, error: "Missing ideas[]" });
      }
      const document = await ingestGeneratedIdeas({
        ideas: ideas.map((x: Record<string, unknown>) => ({
          title: String(x.title ?? ""),
          postTitle: String(x.postTitle ?? x.title ?? ""),
          postBody: String(x.postBody ?? ""),
          angle: String(x.angle ?? ""),
        })),
        language: language === "zh" ? "zh" : "en",
        performanceWeight: typeof performanceWeight === "number" ? performanceWeight : undefined,
        tags: Array.isArray(tags) ? tags.map(String) : undefined,
      });
      res.json({ success: true, document });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ingest ideas failed";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.post("/api/knowledge/search", async (req: Request, res: Response) => {
    try {
      assertKnowledgeReady();
      const { query, topK, sourceType, language } = req.body || {};
      if (!query || typeof query !== "string") {
        return res.status(400).json({ success: false, error: "Missing query" });
      }
      const matches = await searchKnowledge({
        query,
        topK: typeof topK === "number" ? topK : 5,
        sourceType: isKnowledgeSourceType(sourceType) ? sourceType : undefined,
        language: language === "zh" ? "zh" : language === "en" ? "en" : undefined,
      });
      res.json({ success: true, matches });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Search failed";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/knowledge/:id", async (req: Request, res: Response) => {
    try {
      assertKnowledgeReady();
      await deleteKnowledgeDocument(req.params.id);
      res.json({ success: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Delete failed";
      res.status(500).json({ success: false, error: message });
    }
  });
}
