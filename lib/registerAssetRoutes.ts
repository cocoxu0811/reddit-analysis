import type { Express, Request, Response } from "express";
import multer from "multer";
import {
  assertSupabaseReady,
  createAsset,
  createGenerationRecord,
  completeGenerationRecord,
  deleteAsset,
  downloadAssetBuffer,
  failGenerationRecord,
  getAsset,
  listAssets,
  listGenerations,
  listPlatformStyles,
} from "./assetLibrary.js";
import { generatePlatformImage } from "./imageGen.js";
import { isPlatformId } from "./platformStyles.js";

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
    else cb(new Error("Only PNG, JPEG, and WebP images are allowed"));
  },
});

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return t.split(/[,，]/).map((x) => x.trim()).filter(Boolean);
    }
  }
  return [];
}

export function registerAssetRoutes(app: Express): void {
  app.get("/api/platform-styles", async (_req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const styles = await listPlatformStyles();
      res.json({ success: true, styles });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load platform styles";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.get("/api/assets", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const limit = Math.min(Number(req.query.limit) || 50, 100);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      const assets = await listAssets(limit, offset);
      res.json({ success: true, assets });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to list assets";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.post("/api/assets/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, error: "Missing file" });
      }
      const name = String(req.body?.name ?? file.originalname ?? "Untitled").trim();
      if (!name) {
        return res.status(400).json({ success: false, error: "Missing name" });
      }
      const description = String(req.body?.description ?? "").trim();
      const tags = parseTags(req.body?.tags);

      const asset = await createAsset({
        name,
        description,
        buffer: file.buffer,
        mimeType: file.mimetype,
        tags,
      });
      res.json({ success: true, asset });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.get("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const asset = await getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ success: false, error: "Asset not found" });
      }
      const generations = await listGenerations(asset.id);
      res.json({ success: true, asset, generations });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load asset";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      await deleteAsset(req.params.id);
      res.json({ success: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete asset";
      const status = message.includes("not found") ? 404 : 500;
      res.status(status).json({ success: false, error: message });
    }
  });

  app.get("/api/assets/:id/generations", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const asset = await getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ success: false, error: "Asset not found" });
      }
      const generations = await listGenerations(asset.id);
      res.json({ success: true, generations });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load generations";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.post("/api/assets/:id/generate", async (req: Request, res: Response) => {
    let generationId: string | null = null;
    try {
      assertSupabaseReady();
      const { platform, extraPrompt } = req.body || {};
      if (!isPlatformId(platform)) {
        return res.status(400).json({ success: false, error: "Invalid or missing platform" });
      }

      const asset = await getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ success: false, error: "Asset not found" });
      }

      const styles = await listPlatformStyles();
      const platformStyle = styles.find((s) => s.id === platform);
      if (!platformStyle) {
        return res.status(400).json({ success: false, error: "Unknown platform style" });
      }

      const sourceBuffer = await downloadAssetBuffer(asset);
      const pending = await createGenerationRecord({
        assetId: asset.id,
        platformId: platform,
        promptUsed: "",
      });
      generationId = pending.id;

      const { buffer, promptUsed, mimeType } = await generatePlatformImage({
        sourceBuffer,
        mimeType: asset.mimeType,
        platformStyle,
        productName: asset.name,
        extraPrompt: typeof extraPrompt === "string" ? extraPrompt : undefined,
      });

      const generation = await completeGenerationRecord(generationId, {
        buffer,
        mimeType,
        promptUsed,
      });

      res.json({ success: true, generation });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Generation failed";
      if (generationId) {
        try {
          await failGenerationRecord(generationId, message);
        } catch {
          /* ignore */
        }
      }
      res.status(500).json({ success: false, error: message });
    }
  });
}
