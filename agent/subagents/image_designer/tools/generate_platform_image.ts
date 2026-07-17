import { defineTool } from "eve/tools";
import { once } from "eve/tools/approval";
import { z } from "zod";
import {
  getAsset,
  downloadAssetBuffer,
  downloadCleanBuffer,
  createGenerationRecord,
  completeGenerationRecord,
  failGenerationRecord,
  getApprovedGenerations,
  listPlatformStyles,
  type ProductAsset,
} from "../../../../lib/assetLibrary.js";
import { generatePlatformImage } from "../../../../lib/imageGen.js";
import {
  PLATFORM_STYLE_FALLBACKS,
  type PlatformStyle,
  type ProductIdentityForPrompt,
} from "../../../../lib/platformStyles.js";
import { fetchBrandDnaForImageGen } from "../../../../lib/brandDna.js";

async function resolveStyle(
  platform?: string,
  sizeStr?: string,
  width?: number,
  height?: number,
): Promise<PlatformStyle> {
  if (platform && platform !== "custom") {
    try {
      const styles = await listPlatformStyles();
      const match = styles.find((s) => s.id === platform);
      if (match) return match;
    } catch { /* fallback */ }
    const fb = PLATFORM_STYLE_FALLBACKS.find((s) => s.id === platform);
    if (fb) return fb;
  }

  let resolvedSize = "1024x1024";
  if (width && height) {
    resolvedSize = `${width}x${height}`;
  } else if (sizeStr) {
    const map: Record<string, string> = {
      "1:1": "1024x1024", "3:2": "1536x1024", "2:3": "1024x1536",
      "4:3": "1024x768", "3:4": "768x1024", "9:16": "1024x1536",
      "16:9": "1536x1024",
    };
    resolvedSize = map[sizeStr] ?? "1024x1024";
  }

  return {
    id: "custom" as any,
    nameZh: "自定义",
    nameEn: "Custom",
    aspectRatio: sizeStr ?? "1:1",
    size: resolvedSize,
    promptTemplate:
      "Transform this product photo: professional product photography, clean composition, high quality, sharp details, accurate product representation.",
    negativeHints: "distorted, blurry, wrong colors",
    sortOrder: 99,
  };
}

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
    "根据平台、尺寸、prompt 等参数为指定产品素材生成电商适配图。支持天猫、京东、Temu、Instagram或自定义尺寸。消耗 API 额度，需要审批。",
  inputSchema: z.object({
    assetId: z.string().describe("产品素材 ID"),
    platform: z
      .enum(["tmall", "jd", "temu", "instagram", "custom"])
      .optional()
      .describe("目标平台"),
    width: z.number().optional().describe("自定义宽度（px）"),
    height: z.number().optional().describe("自定义高度（px）"),
    size: z
      .enum(["1:1", "3:2", "2:3", "4:3", "3:4", "9:16", "16:9"])
      .optional()
      .describe("预设比例"),
    count: z.number().min(1).max(10).default(1).describe("生成数量"),
    extraPrompt: z.string().optional().describe("额外生成指令"),
    seed: z.number().optional().describe("随机种子"),
    useCleanBg: z.boolean().default(true).describe("是否优先使用去背景版本"),
  }),
  approval: once(),
  async execute({ assetId, platform, width, height, size, count, extraPrompt, seed, useCleanBg }) {
    const asset = await getAsset(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);

    const platformStyle = await resolveStyle(platform, size, width, height);
    const [sourceBuffer, cleanBuffer] = await Promise.all([
      downloadAssetBuffer(asset),
      useCleanBg ? downloadCleanBuffer(asset) : Promise.resolve(null),
    ]);

    const identity = buildIdentityForPrompt(asset);

    let approvedContext = "";
    try {
      const approved = await getApprovedGenerations(assetId);
      if (approved.length > 0) {
        approvedContext = approved
          .filter((g) => g.platformId !== platform)
          .slice(0, 3)
          .map((g) => `${g.platformId}: ${g.promptUsed.slice(0, 300)}`)
          .join("\n");
      }
    } catch { /* non-blocking */ }

    let brandDna = "";
    try {
      brandDna = await fetchBrandDnaForImageGen({
        productName: asset.name,
        tags: asset.tags,
      });
    } catch { /* non-blocking */ }

    const combinedExtra = [extraPrompt, brandDna].filter(Boolean).join("\n\n");

    const results: Array<{
      generationId: string;
      publicUrl: string | null;
      status: string;
      promptUsed: string;
      error?: string;
    }> = [];

    for (let i = 0; i < count; i++) {
      const pending = await createGenerationRecord({
        assetId,
        platformId: (platform ?? "custom") as any,
        promptUsed: "",
      });
      try {
        const { buffer, promptUsed, mimeType } = await generatePlatformImage({
          sourceBuffer,
          cleanBuffer,
          mimeType: asset.mimeType,
          platformStyle,
          productName: asset.name,
          description: asset.description,
          extraPrompt: combinedExtra || undefined,
          identity,
          seed: seed != null ? seed + i : null,
          approvedContext,
        });

        const gen = await completeGenerationRecord(pending.id, { buffer, mimeType, promptUsed });
        results.push({
          generationId: gen.id,
          publicUrl: gen.publicUrl,
          status: "completed",
          promptUsed,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await failGenerationRecord(pending.id, msg).catch(() => {});
        results.push({
          generationId: pending.id,
          publicUrl: null,
          status: "failed",
          promptUsed: "",
          error: msg,
        });
      }
    }

    return {
      assetName: asset.name,
      platform: platform ?? "custom",
      count: results.length,
      results,
    };
  },
});
