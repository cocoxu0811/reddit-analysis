/**
 * Image Agent — AI 产品图片设计师
 *
 * 使用 Vercel AI SDK generateText + tools 实现对话式产品图生成。
 * Tools: list_product_assets, generate_platform_image, remove_background,
 *        review_image, search_brand_guidelines
 */

import {
  generateText,
  tool,
  isStepCount,
  type ModelMessage,
} from "ai";
import { z } from "zod";
import {
  listAssets,
  getAsset,
  downloadAssetBuffer,
  downloadCleanBuffer,
  createGenerationRecord,
  completeGenerationRecord,
  failGenerationRecord,
  getApprovedGenerations,
  updateGenerationReview,
  listPlatformStyles,
  type ProductAsset,
} from "./assetLibrary.js";
import { generatePlatformImage } from "./imageGen.js";
import {
  PLATFORM_STYLE_FALLBACKS,
  type PlatformStyle,
  type ProductIdentityForPrompt,
} from "./platformStyles.js";
import { isReviewAvailable, reviewGeneratedImage } from "./imageReview.js";
import { fetchBrandDnaForImageGen } from "./brandDna.js";
import { isRemoveBgAvailable, removeBackground } from "./removeBackground.js";
import { updateAssetClean } from "./assetLibrary.js";
import { getMiniMaxAgentModel } from "./minimaxProvider.js";

const IMAGE_AGENT_SYSTEM_PROMPT = `你是一个专业的产品图片 AI 设计师。你帮助用户完成以下任务：

1. **生成电商平台适配图**：天猫、京东、Temu、Instagram 或自定义尺寸
2. **去除产品背景**：将产品从复杂背景中抠出
3. **风格变换与批量生成**：根据不同平台需求批量处理
4. **基于参考图保持一致性**：利用已采纳的生成结果保持跨平台视觉统一

## 工作方式
- 你通过调用工具来执行具体任务，不自己编造图片
- 用户可能在侧栏预设了参数（平台、尺寸、数量、质量），如果用户消息中明确指定，以消息为准；否则使用侧栏预设值
- 生成前，你会自动搜索品牌规范和已采纳的历史生成，确保一致性
- 生成后，你会自动调用 VLM 审查工具检查质量

## 决策流程
1. 用户是否指定了产品素材？
   - 是 → 直接使用该素材 ID
   - 否 → 调用 list_product_assets 让用户选择
2. 确定平台和尺寸（从消息或侧栏参数获取）
3. 搜索品牌规范（如果知识库可用）
4. 调用 generate_platform_image 生成图片
5. 调用 review_image 质检
6. 向用户展示结果和质检报告

## 重要原则
- 产品形状、颜色、品牌元素必须保持准确
- 如果用户要求批量生成（count > 1），每次都使用相同的产品身份信息
- 用中文回复用户，除非用户用英文提问`;

export type SidebarParams = {
  platform?: string;
  size?: string;
  width?: number;
  height?: number;
  count?: number;
  quality?: string;
};

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

export const imageAgentTools = {
  list_product_assets: tool({
    description:
      "列出素材库中的产品图片。返回产品名称、描述、缩略图URL等信息，供用户选择要生成的产品。",
    inputSchema: z.object({
      limit: z.number().min(1).max(50).default(20).describe("返回数量"),
    }),
    execute: async ({ limit }) => {
      const assets = await listAssets(limit, 0);
      return {
        count: assets.length,
        assets: assets.map((a) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          publicUrl: a.publicUrl,
          hasClean: Boolean(a.cleanPublicUrl),
          tags: a.tags,
          generationCount: a.generationCount ?? 0,
        })),
      };
    },
  }),

  generate_platform_image: tool({
    description:
      "根据平台、尺寸、prompt 等参数为指定产品素材生成电商适配图。支持天猫、京东、Temu、Instagram或自定义尺寸。可指定生成数量（1-10）。",
    inputSchema: z.object({
      assetId: z.string().describe("产品素材 ID"),
      platform: z
        .enum(["tmall", "jd", "temu", "instagram", "custom"])
        .optional()
        .describe("目标平台"),
      width: z.number().optional().describe("自定义宽度（px），仅 platform=custom 时使用"),
      height: z.number().optional().describe("自定义高度（px），仅 platform=custom 时使用"),
      size: z
        .enum(["1:1", "3:2", "2:3", "4:3", "3:4", "9:16", "16:9"])
        .optional()
        .describe("预设比例"),
      count: z.number().min(1).max(10).default(1).describe("生成数量"),
      extraPrompt: z.string().optional().describe("额外生成指令"),
      seed: z.number().optional().describe("随机种子，用于可复现生成"),
      useCleanBg: z.boolean().default(true).describe("是否优先使用去背景版本"),
    }),
    execute: async ({ assetId, platform, width, height, size, count, extraPrompt, seed, useCleanBg }) => {
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
  }),

  remove_background: tool({
    description:
      "去除产品图片的背景，生成纯白底的产品抠图。后续生成时会自动优先使用抠图版本。",
    inputSchema: z.object({
      assetId: z.string().describe("产品素材 ID"),
    }),
    execute: async ({ assetId }) => {
      if (!isRemoveBgAvailable()) {
        return { success: false, error: "Background removal requires GEMINI_API_KEY" };
      }
      const asset = await getAsset(assetId);
      if (!asset) throw new Error(`Asset ${assetId} not found`);

      const sourceBuffer = await downloadAssetBuffer(asset);
      const { buffer, mimeType } = await removeBackground({
        buffer: sourceBuffer,
        mimeType: asset.mimeType,
      });

      const updated = await updateAssetClean(assetId, { buffer, mimeType });
      return {
        success: true,
        assetName: updated.name,
        cleanUrl: updated.cleanPublicUrl,
      };
    },
  }),

  review_image: tool({
    description:
      "用 VLM（视觉语言模型）审查生成的图片，对比原图检查产品形状、颜色、品牌元素是否保持一致。返回通过/警告/失败状态。",
    inputSchema: z.object({
      assetId: z.string().describe("原始产品素材 ID"),
      generationId: z.string().describe("要审查的生成记录 ID"),
    }),
    execute: async ({ assetId, generationId }) => {
      if (!isReviewAvailable()) {
        return { status: "warning", notes: "VLM review not available: GEMINI_API_KEY not configured" };
      }
      const asset = await getAsset(assetId);
      if (!asset) throw new Error(`Asset ${assetId} not found`);

      const { getSupabaseAdmin } = await import("../db/supabase.js");
      const supabase = getSupabaseAdmin();
      const { data: genRow } = await supabase
        .from("asset_generations")
        .select("storage_path, public_url")
        .eq("id", generationId)
        .single();
      if (!genRow?.storage_path) throw new Error("Generation not found or has no image");

      const { downloadFromStorage } = await import("../db/supabase.js");
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
  }),

  search_brand_guidelines: tool({
    description:
      "从 RAG 知识库搜索品牌视觉规范（色彩、风格、摄影要求等），用于指导图片生成保持品牌一致性。",
    inputSchema: z.object({
      productName: z.string().optional().describe("产品名称"),
      tags: z.array(z.string()).default([]).describe("相关标签"),
    }),
    execute: async ({ productName, tags }) => {
      const result = await fetchBrandDnaForImageGen({ productName, tags });
      if (!result) {
        return { found: false, message: "No brand guidelines found in knowledge base" };
      }
      return { found: true, guidelines: result };
    },
  }),
};

export interface ImageChatResult {
  response: string;
  toolCalls: Array<{
    toolName: string;
    input: unknown;
    output: unknown;
  }>;
  generatedImages: Array<{
    publicUrl: string;
    platform: string;
    generationId: string;
  }>;
}

export async function imageChat(
  messages: ModelMessage[],
  sidebarParams: SidebarParams = {},
  options: { maxSteps?: number } = {},
): Promise<ImageChatResult> {
  const sidebarContext = [];
  if (sidebarParams.platform) sidebarContext.push(`预设平台: ${sidebarParams.platform}`);
  if (sidebarParams.size) sidebarContext.push(`预设尺寸: ${sidebarParams.size}`);
  if (sidebarParams.width && sidebarParams.height) sidebarContext.push(`预设宽高: ${sidebarParams.width}x${sidebarParams.height}`);
  if (sidebarParams.count) sidebarContext.push(`预设数量: ${sidebarParams.count}`);
  if (sidebarParams.quality) sidebarContext.push(`预设质量: ${sidebarParams.quality}`);

  const systemWithParams = sidebarContext.length > 0
    ? `${IMAGE_AGENT_SYSTEM_PROMPT}\n\n## 用户侧栏预设参数\n${sidebarContext.join("\n")}\n（仅在用户消息中未明确指定时使用这些预设值）`
    : IMAGE_AGENT_SYSTEM_PROMPT;

  const result = await generateText({
    model: getMiniMaxAgentModel(),
    system: systemWithParams,
    messages,
    tools: imageAgentTools,
    stopWhen: isStepCount(options.maxSteps ?? 8),
  });

  const toolCalls = (result.steps || []).flatMap((step) =>
    step.staticToolCalls.map((tc, i) => ({
      toolName: tc.toolName,
      input: tc.input,
      output: step.staticToolResults?.[i]?.output ?? null,
    }))
  );

  const generatedImages: ImageChatResult["generatedImages"] = [];
  for (const tc of toolCalls) {
    if (tc.toolName === "generate_platform_image" && tc.output) {
      const out = tc.output as { results?: Array<{ publicUrl?: string | null; generationId?: string; status?: string }>; platform?: string };
      for (const r of out.results ?? []) {
        if (r.publicUrl && r.status === "completed") {
          generatedImages.push({
            publicUrl: r.publicUrl,
            platform: String(out.platform ?? "custom"),
            generationId: r.generationId ?? "",
          });
        }
      }
    }
  }

  return {
    response: result.text,
    toolCalls,
    generatedImages,
  };
}
