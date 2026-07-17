import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  getAsset,
  downloadAssetBuffer,
  updateGenerationReview,
  type ProductAsset,
} from "../../../../lib/assetLibrary.js";
import {
  isReviewAvailable,
  reviewGeneratedImage,
} from "../../../../lib/imageReview.js";
import type { ProductIdentityForPrompt } from "../../../../lib/platformStyles.js";

function buildIdentityForPrompt(asset: ProductAsset): ProductIdentityForPrompt {
  return {
    description: asset.description,
    primaryColors: asset.identity.primaryColors,
    material: asset.identity.material,
    shapeKeywords: asset.identity.shapeKeywords,
    brandElements: asset.identity.brandElements,
    immutableFeatures: asset.identity.immutableFeatures,
  };
}

export default defineTool({
  description:
    "用 VLM（视觉语言模型）审查生成的图片，对比原图检查产品形状、颜色、品牌元素是否保持一致。返回通过/警告/失败状态。",
  inputSchema: z.object({
    assetId: z.string().describe("原始产品素材 ID"),
    generationId: z.string().describe("要审查的生成记录 ID"),
  }),
  async execute({ assetId, generationId }) {
    if (!isReviewAvailable()) {
      return { status: "warning", notes: "VLM review not available: GEMINI_API_KEY not configured" };
    }
    const asset = await getAsset(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);

    const { getSupabaseAdmin } = await import("../../../../db/supabase.js");
    const supabase = getSupabaseAdmin();
    const { data: genRow } = await supabase
      .from("asset_generations")
      .select("storage_path, public_url")
      .eq("id", generationId)
      .single();
    if (!genRow?.storage_path) throw new Error("Generation not found or has no image");

    const { downloadFromStorage } = await import("../../../../db/supabase.js");
    const [originalBuffer, generatedBuffer] = await Promise.all([
      downloadAssetBuffer(asset),
      downloadFromStorage(genRow.storage_path),
    ]);

    const identity = buildIdentityForPrompt(asset);
    const result = await reviewGeneratedImage({
      originalBuffer,
      originalMimeType: asset.mimeType,
      generatedBuffer,
      generatedMimeType: "image/png",
      productName: asset.name,
      identity,
    });

    await updateGenerationReview(generationId, {
      status: result.status,
      notes: result.notes,
    });

    return result;
  },
});
