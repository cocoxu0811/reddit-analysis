import type { Express, Request, Response } from "express";
import multer from "multer";
import {
  assertSupabaseReady,
  createAsset,
  createGenerationRecord,
  completeGenerationRecord,
  deleteAsset,
  downloadAssetBuffer,
  downloadCleanBuffer,
  failGenerationRecord,
  getAsset,
  getApprovedGenerations,
  listAssets,
  listGenerations,
  listPlatformStyles,
  listReferenceImages,
  addReferenceImage,
  deleteReferenceImage,
  setGenerationApproval,
  updateAssetClean,
  updateAssetIdentity,
  updateGenerationReview,
} from "./assetLibrary.js";
import { generatePlatformImage } from "./imageGen.js";
import { isPlatformId, type ProductIdentityForPrompt } from "./platformStyles.js";
import { isReviewAvailable, reviewGeneratedImage } from "./imageReview.js";
import { fetchBrandDnaForImageGen } from "./brandDna.js";
import { isRemoveBgAvailable, removeBackground } from "./removeBackground.js";


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
        identity: {
          primaryColors: parseTags(req.body?.primaryColors),
          material: String(req.body?.material ?? ""),
          shapeKeywords: String(req.body?.shapeKeywords ?? ""),
          brandElements: String(req.body?.brandElements ?? ""),
          immutableFeatures: String(req.body?.immutableFeatures ?? ""),
        },
      });
      res.json({ success: true, asset });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.patch("/api/assets/:id/identity", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const asset = await getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ success: false, error: "Asset not found" });
      }
      const body = req.body || {};
      const updated = await updateAssetIdentity(asset.id, {
        primaryColors: body.primaryColors !== undefined ? parseTags(body.primaryColors) : undefined,
        material: body.material !== undefined ? String(body.material) : undefined,
        shapeKeywords: body.shapeKeywords !== undefined ? String(body.shapeKeywords) : undefined,
        brandElements: body.brandElements !== undefined ? String(body.brandElements) : undefined,
        immutableFeatures: body.immutableFeatures !== undefined ? String(body.immutableFeatures) : undefined,
      });
      res.json({ success: true, asset: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update identity";
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
      const [generations, referenceImages] = await Promise.all([
        listGenerations(asset.id),
        listReferenceImages(asset.id),
      ]);
      res.json({ success: true, asset, generations, referenceImages });
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
      const { platform, extraPrompt, seed: reqSeed } = req.body || {};
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

      const [sourceBuffer, cleanBuffer] = await Promise.all([
        downloadAssetBuffer(asset),
        downloadCleanBuffer(asset),
      ]);

      const pending = await createGenerationRecord({
        assetId: asset.id,
        platformId: platform,
        promptUsed: "",
      });
      generationId = pending.id;

      const identityForPrompt: ProductIdentityForPrompt = {
        description: asset.description,
        primaryColors: asset.identity.primaryColors,
        material: asset.identity.material,
        shapeKeywords: asset.identity.shapeKeywords,
        brandElements: asset.identity.brandElements,
        immutableFeatures: asset.identity.immutableFeatures,
      };

      // Build approved-generation context for cross-platform consistency
      let approvedContext = "";
      try {
        const approved = await getApprovedGenerations(asset.id);
        if (approved.length > 0) {
          approvedContext = approved
            .filter((g) => g.platformId !== platform)
            .slice(0, 3)
            .map((g) => `${g.platformId}: ${g.promptUsed.slice(0, 300)}`)
            .join("\n");
        }
      } catch { /* non-blocking */ }

      // Inject brand DNA from RAG knowledge base
      let brandDnaBlock = "";
      try {
        brandDnaBlock = await fetchBrandDnaForImageGen({
          productName: asset.name,
          tags: asset.tags,
        });
      } catch { /* non-blocking */ }

      const combinedExtra = [
        typeof extraPrompt === "string" ? extraPrompt : "",
        brandDnaBlock,
      ].filter(Boolean).join("\n\n");

      const seed = typeof reqSeed === "number" ? reqSeed : null;

      const { buffer, promptUsed, mimeType } = await generatePlatformImage({
        sourceBuffer,
        cleanBuffer,
        mimeType: asset.mimeType,
        platformStyle,
        productName: asset.name,
        description: asset.description,
        extraPrompt: combinedExtra || undefined,
        identity: identityForPrompt,
        seed,
        approvedContext,
      });

      const generation = await completeGenerationRecord(generationId, {
        buffer,
        mimeType,
        promptUsed,
      });

      // Store seed if provided
      if (seed != null) {
        try {
          const supabase = (await import("../db/supabase.js")).getSupabaseAdmin();
          await supabase.from("asset_generations").update({ seed }).eq("id", generation.id);
        } catch { /* non-blocking */ }
      }

      let review = null;
      if (isReviewAvailable()) {
        try {
          const reviewResult = await reviewGeneratedImage({
            originalBuffer: sourceBuffer,
            originalMimeType: asset.mimeType,
            generatedBuffer: buffer,
            generatedMimeType: mimeType,
            productName: asset.name,
            identity: identityForPrompt,
          });
          await updateGenerationReview(generation.id, {
            status: reviewResult.status,
            notes: reviewResult.notes,
          });
          review = reviewResult;
        } catch {
          /* review is non-blocking */
        }
      }

      res.json({
        success: true,
        generation: {
          ...generation,
          seed,
          reviewStatus: review?.status ?? null,
          reviewNotes: review?.notes ?? null,
        },
        review,
      });
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

  // ── Reference images ──

  app.post("/api/assets/:id/references", upload.single("file"), async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const file = req.file;
      if (!file) return res.status(400).json({ success: false, error: "Missing file" });

      const asset = await getAsset(req.params.id);
      if (!asset) return res.status(404).json({ success: false, error: "Asset not found" });

      const label = String(req.body?.label ?? "").trim();
      const ref = await addReferenceImage({
        assetId: asset.id,
        label,
        buffer: file.buffer,
        mimeType: file.mimetype,
      });
      res.json({ success: true, referenceImage: ref });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add reference image";
      res.status(500).json({ success: false, error: message });
    }
  });

  app.delete("/api/assets/:id/references/:refId", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      await deleteReferenceImage(req.params.refId);
      res.json({ success: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete reference image";
      res.status(500).json({ success: false, error: message });
    }
  });

  // ── Generation approval ──

  app.patch("/api/generations/:id/approve", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      const approved = req.body?.approved !== false;
      await setGenerationApproval(req.params.id, approved);
      res.json({ success: true, approved });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update approval";
      res.status(500).json({ success: false, error: message });
    }
  });

  // ── Background removal ──

  app.post("/api/assets/:id/remove-bg", async (req: Request, res: Response) => {
    try {
      assertSupabaseReady();
      if (!isRemoveBgAvailable()) {
        return res.status(400).json({ success: false, error: "Background removal requires GEMINI_API_KEY" });
      }

      const asset = await getAsset(req.params.id);
      if (!asset) return res.status(404).json({ success: false, error: "Asset not found" });

      const sourceBuffer = await downloadAssetBuffer(asset);
      const { buffer, mimeType } = await removeBackground({
        buffer: sourceBuffer,
        mimeType: asset.mimeType,
      });

      const updated = await updateAssetClean(asset.id, { buffer, mimeType });
      res.json({ success: true, asset: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Background removal failed";
      res.status(500).json({ success: false, error: message });
    }
  });

}
