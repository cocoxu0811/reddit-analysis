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
import { generatePlatformImage, generateTextImage } from "./imageGen.js";
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
import { stripModelThinking } from "./modelOutput.js";
import {
  buildGenerationStoragePath,
  uploadToStorage,
} from "../db/supabase.js";

const IMAGE_AGENT_SYSTEM_PROMPT = `你是一个专业的产品图片 AI 设计师。你帮助用户完成以下任务：

1. **生成电商平台适配图**：天猫、京东、Temu、Instagram 或自定义尺寸
2. **去除产品背景**：将产品从复杂背景中抠出
3. **风格变换与批量生成**：根据不同平台需求批量处理
4. **基于参考图保持一致性**：利用已采纳的生成结果保持跨平台视觉统一

生图路由：无参考素材时优先使用 MiniMax image-01 文生图；有产品素材时优先使用 Gemini 做产品图生图。

## 工作方式
- 你通过调用工具来执行具体任务，不自己编造图片
- 用户可能在侧栏预设了参数（平台、尺寸、数量、质量），如果用户消息中明确指定，以消息为准；否则使用侧栏预设值
- 生成前，你会自动搜索品牌规范和已采纳的历史生成，确保一致性
- 生成后，你会自动调用 VLM 审查工具检查质量

## 决策流程
1. 用户是否指定了产品素材？
   - 是 → 使用该素材进行图生图
   - 否 → 仍然可以根据用户描述直接进行文生图，不得要求必须选择素材
2. 确定平台和尺寸（从消息或侧栏参数获取）
3. 搜索品牌规范（如果知识库可用）
4. 调用 generate_platform_image 生成图片
5. 调用 review_image 质检
6. 向用户展示结果和质检报告

## 重要原则
- 产品形状、颜色、品牌元素必须保持准确
- 没有参考素材时，不得宣称完成了产品一致性质检
- 如果用户要求批量生成（count > 1），每次都使用相同的产品身份信息
- 每一次“生成/再生成/换平台”请求都必须在当前轮调用 generate_platform_image；禁止复用历史图片链接冒充新结果
- 如果工具返回失败，必须原样说明工具返回的具体错误；禁止猜测或虚构“计费限制”等原因
- 如果 review_image 返回 reviewed=false，必须说明“质检未执行成功”，不得把 null 或兜底字段描述为通过
- 用中文回复用户，除非用户用英文提问`;

export type SidebarParams = {
  platform?: string;
  size?: string;
  width?: number;
  height?: number;
  count?: number;
  quality?: string;
  selectedAssetId?: string;
};

function getMessageText(message: ModelMessage | undefined): string {
  if (!message) return "";
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.content)) return "";
  return message.content
    .map((part) =>
      typeof part === "object" &&
      part !== null &&
      "type" in part &&
      part.type === "text" &&
      "text" in part
        ? String(part.text)
        : "",
    )
    .join("\n");
}

function getLatestUserText(messages: ModelMessage[]): string {
  return getMessageText(
    [...messages].reverse().find((message) => message.role === "user"),
  );
}

function isExplicitGenerationRequest(text: string): boolean {
  if (/(?:不要|别|停止|取消).{0,8}(?:生成|生图|主图|图片)/i.test(text)) {
    return false;
  }
  return /生成|生图|出图|做图|画一?张|绘制|主图|适配图|生活方式图|再来一张|再生成|\b(?:generate|create|render|make)\b/i.test(
    text,
  );
}

function getReferencedAssetId(
  text: string,
  sidebarParams: SidebarParams,
): string | undefined {
  return (
    sidebarParams.selectedAssetId?.trim() ||
    text.match(/\[参考素材ID:\s*([^\]\s]+)\]/)?.[1]
  );
}

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

type GenerationPlatform = "tmall" | "jd" | "temu" | "instagram" | "custom";

type GenerationInput = {
  assetId?: string;
  platform?: GenerationPlatform;
  width?: number;
  height?: number;
  size?: "1:1" | "3:2" | "2:3" | "4:3" | "3:4" | "9:16" | "16:9";
  count: number;
  extraPrompt?: string;
  seed?: number;
  useCleanBg: boolean;
};

type GenerationOutput = {
  assetName: string;
  platform: GenerationPlatform;
  count: number;
  provider?: "minimax" | "gemini";
  model?: string;
  results: Array<{
    generationId: string;
    publicUrl: string | null;
    status: string;
    promptUsed: string;
    error?: string;
    provider?: "minimax" | "gemini";
    model?: string;
  }>;
};

function resolveRequestedPlatform(
  text: string,
  sidebarParams: SidebarParams,
): GenerationPlatform {
  if (/天猫|淘宝|\btmall\b/i.test(text)) return "tmall";
  if (/京东|\bjd\b|jd\.com/i.test(text)) return "jd";
  if (/\bte\s*mu\b/i.test(text)) return "temu";
  if (/instagram|\bins\b/i.test(text)) return "instagram";
  const preset = sidebarParams.platform;
  return preset === "tmall" ||
    preset === "jd" ||
    preset === "temu" ||
    preset === "instagram" ||
    preset === "custom"
    ? preset
    : "custom";
}

function resolveRequestedSize(
  text: string,
  sidebarParams: SidebarParams,
): GenerationInput["size"] {
  const explicit = text.match(/\b(1:1|3:2|2:3|4:3|3:4|9:16|16:9)\b/)?.[1];
  const size = explicit || sidebarParams.size;
  return size === "1:1" ||
    size === "3:2" ||
    size === "2:3" ||
    size === "4:3" ||
    size === "3:4" ||
    size === "9:16" ||
    size === "16:9"
    ? size
    : undefined;
}

function resolveRequestedCount(text: string, sidebarParams: SidebarParams): number {
  const explicit = text.match(/(?:生成|生图|再来|做)\s*(\d{1,2})\s*张/i)?.[1];
  const count = explicit ? Number(explicit) : (sidebarParams.count ?? 1);
  return Math.max(1, Math.min(10, Number.isFinite(count) ? count : 1));
}

function cleanGenerationPrompt(text: string): string {
  return text.replace(/\[参考素材ID:\s*[^\]\s]+\]\s*/g, "").trim();
}

async function executeReferenceGeneration(
  input: GenerationInput & { assetId: string },
): Promise<GenerationOutput> {
  const {
    assetId,
    platform,
    width,
    height,
    size,
    count,
    extraPrompt,
    seed,
    useCleanBg,
  } = input;
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
        .filter((generation) => generation.platformId !== platform)
        .slice(0, 3)
        .map(
          (generation) =>
            `${generation.platformId}: ${generation.promptUsed.slice(0, 300)}`,
        )
        .join("\n");
    }
  } catch {
    /* non-blocking */
  }

  let brandDna = "";
  try {
    brandDna = await fetchBrandDnaForImageGen({
      productName: asset.name,
      tags: asset.tags,
    });
  } catch {
    /* non-blocking */
  }

  const combinedExtra = [extraPrompt, brandDna].filter(Boolean).join("\n\n");
  const results: GenerationOutput["results"] = [];

  for (let index = 0; index < count; index++) {
    if (platform === "custom") {
      try {
        const generated = await generatePlatformImage({
          sourceBuffer,
          cleanBuffer,
          mimeType: asset.mimeType,
          platformStyle,
          productName: asset.name,
          description: asset.description,
          extraPrompt: combinedExtra || undefined,
          identity,
          seed: seed != null ? seed + index : null,
          approvedContext,
        });
        const storagePath = buildGenerationStoragePath(generated.mimeType);
        const { publicUrl } = await uploadToStorage(
          storagePath,
          generated.buffer,
          generated.mimeType,
        );
        results.push({
          generationId: storagePath,
          publicUrl,
          status: "completed",
          promptUsed: generated.promptUsed,
          provider: generated.provider,
          model: generated.model,
        });
      } catch (error) {
        results.push({
          generationId: "",
          publicUrl: null,
          status: "failed",
          promptUsed: "",
          error: error instanceof Error ? error.message : String(error),
        });
      }
      continue;
    }

    const pending = await createGenerationRecord({
      assetId,
      platformId: platform,
      promptUsed: "",
    });
    try {
      const generated = await generatePlatformImage({
        sourceBuffer,
        cleanBuffer,
        mimeType: asset.mimeType,
        platformStyle,
        productName: asset.name,
        description: asset.description,
        extraPrompt: combinedExtra || undefined,
        identity,
        seed: seed != null ? seed + index : null,
        approvedContext,
      });
      const generation = await completeGenerationRecord(pending.id, {
        buffer: generated.buffer,
        mimeType: generated.mimeType,
        promptUsed: generated.promptUsed,
      });
      results.push({
        generationId: generation.id,
        publicUrl: generation.publicUrl,
        status: "completed",
        promptUsed: generated.promptUsed,
        provider: generated.provider,
        model: generated.model,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await failGenerationRecord(pending.id, message).catch(() => {});
      results.push({
        generationId: pending.id,
        publicUrl: null,
        status: "failed",
        promptUsed: "",
        error: message,
      });
    }
  }

  const firstSuccess = results.find((item) => item.status === "completed");
  return {
    assetName: asset.name,
    platform: platform ?? "custom",
    count: results.length,
    provider: firstSuccess?.provider,
    model: firstSuccess?.model,
    results,
  };
}

async function executePromptGeneration(
  input: GenerationInput & { extraPrompt: string },
): Promise<GenerationOutput> {
  const platform = input.platform ?? "custom";
  const platformStyle = await resolveStyle(
    platform,
    input.size,
    input.width,
    input.height,
  );
  const results: GenerationOutput["results"] = [];

  for (let index = 0; index < input.count; index++) {
    try {
      const generated = await generateTextImage({
        prompt: input.extraPrompt,
        platformStyle,
        seed: input.seed != null ? input.seed + index : index + 1,
      });
      const storagePath = buildGenerationStoragePath(generated.mimeType);
      const { publicUrl } = await uploadToStorage(
        storagePath,
        generated.buffer,
        generated.mimeType,
      );
      results.push({
        generationId: storagePath,
        publicUrl,
        status: "completed",
        promptUsed: generated.promptUsed,
        provider: generated.provider,
        model: generated.model,
      });
    } catch (error) {
      results.push({
        generationId: "",
        publicUrl: null,
        status: "failed",
        promptUsed: "",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const firstSuccess = results.find((item) => item.status === "completed");
  return {
    assetName: "文本生成",
    platform,
    count: results.length,
    provider: firstSuccess?.provider,
    model: firstSuccess?.model,
    results,
  };
}

async function executeReferenceReview(input: {
  assetId: string;
  generationId: string;
}) {
  if (!isReviewAvailable()) {
    return {
      status: "warning" as const,
      reviewed: false,
      notes: "VLM review not available: GEMINI_API_KEY not configured",
    };
  }
  const asset = await getAsset(input.assetId);
  if (!asset) throw new Error(`Asset ${input.assetId} not found`);

  const { getSupabaseAdmin, downloadFromStorage } = await import(
    "../db/supabase.js"
  );
  const supabase = getSupabaseAdmin();
  const { data: generation } = await supabase
    .from("asset_generations")
    .select("storage_path")
    .eq("id", input.generationId)
    .single();
  if (!generation?.storage_path) {
    throw new Error("Generation not found or has no image");
  }

  const [originalBuffer, generatedBuffer] = await Promise.all([
    downloadAssetBuffer(asset),
    downloadFromStorage(generation.storage_path),
  ]);
  const result = await reviewGeneratedImage({
    originalBuffer,
    originalMimeType: asset.mimeType,
    generatedBuffer,
    generatedMimeType: "image/png",
    productName: asset.name,
    identity: buildIdentityForPrompt(asset),
  });
  await updateGenerationReview(input.generationId, {
    status: result.status,
    notes: result.notes,
  });
  return result;
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
      "根据平台、尺寸、prompt 等参数生成图片。assetId 可选：有素材时图生图，无素材时根据文字直接生图。",
    inputSchema: z.object({
      assetId: z.string().optional().describe("可选的产品素材 ID"),
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
    execute: async (input) =>
      input.assetId
        ? executeReferenceGeneration({
            ...input,
            assetId: input.assetId,
          })
        : executePromptGeneration({
            ...input,
            extraPrompt:
              input.extraPrompt?.trim() ||
              "Create a polished, professional product image.",
          }),
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
    execute: executeReferenceReview,
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

async function runDirectGeneration(
  latestUserText: string,
  referencedAssetId: string | undefined,
  sidebarParams: SidebarParams,
): Promise<ImageChatResult> {
  const platform = resolveRequestedPlatform(latestUserText, sidebarParams);
  const prompt = cleanGenerationPrompt(latestUserText);
  const generationInput: GenerationInput = {
    assetId: referencedAssetId,
    platform,
    size: resolveRequestedSize(latestUserText, sidebarParams),
    width: sidebarParams.width,
    height: sidebarParams.height,
    count: resolveRequestedCount(latestUserText, sidebarParams),
    extraPrompt: prompt,
    useCleanBg: true,
  };
  const generation = referencedAssetId
    ? await executeReferenceGeneration({
        ...generationInput,
        assetId: referencedAssetId,
      })
    : await executePromptGeneration({
        ...generationInput,
        extraPrompt: prompt,
      });

  const toolCalls: ImageChatResult["toolCalls"] = [
    {
      toolName: "generate_platform_image",
      input: generationInput,
      output: generation,
    },
  ];
  const generatedImages: ImageChatResult["generatedImages"] = [];
  const errors: string[] = [];
  for (const result of generation.results) {
    if (result.status === "completed" && result.publicUrl) {
      generatedImages.push({
        publicUrl: result.publicUrl,
        platform: generation.platform,
        generationId: result.generationId,
      });
    } else if (result.error) {
      errors.push(result.error);
    }
  }

  if (generatedImages.length === 0) {
    return {
      response: `图片生成失败：\n${[...new Set(errors)]
        .map((error) => `- ${error}`)
        .join("\n") || "- Gemini 未返回图片"}`,
      toolCalls,
      generatedImages,
    };
  }

  const providerLabel =
    generation.provider === "minimax"
      ? `MiniMax ${generation.model || "image-01"}`
      : generation.provider === "gemini"
        ? `Gemini ${generation.model || "image"}`
        : "当前生图模型";

  let reviewSummary = referencedAssetId
    ? "本轮尚未执行 VLM 质检，不能宣称质检通过。"
    : `未提供参考素材，本轮使用 ${providerLabel} 文生图；无法执行与原素材的一致性质检。`;
  if (referencedAssetId) {
    const reviewTarget = generatedImages.find(
      (image) => !image.generationId.startsWith("generations/"),
    );
    if (reviewTarget) {
      try {
        const review = await executeReferenceReview({
          assetId: referencedAssetId,
          generationId: reviewTarget.generationId,
        });
        toolCalls.push({
          toolName: "review_image",
          input: {
            assetId: referencedAssetId,
            generationId: reviewTarget.generationId,
          },
          output: review,
        });
        if (review.reviewed === false) {
          reviewSummary = `VLM 质检未执行成功：${review.notes}`;
        } else {
          const reviewLabel =
            review.status === "passed"
              ? "通过"
              : review.status === "failed"
                ? "未通过"
                : "存在警告";
          reviewSummary = `VLM 质检结果：${reviewLabel}${
            review.notes ? `（${review.notes}）` : ""
          }`;
        }
      } catch (error) {
        reviewSummary = `VLM 质检未执行成功：${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    }
  }

  const partialFailure =
    errors.length > 0
      ? `\n另有 ${errors.length} 个生成任务失败：${[
          ...new Set(errors),
        ].join("；")}`
      : "";
  return {
    response: `已通过 ${providerLabel} 真实生成 ${generatedImages.length} 张 ${
      generation.platform
    } 图片。${partialFailure}\n\n${reviewSummary}`,
    toolCalls,
    generatedImages,
  };
}

export async function imageChat(
  messages: ModelMessage[],
  sidebarParams: SidebarParams = {},
  options: { maxSteps?: number } = {},
): Promise<ImageChatResult> {
  const latestUserText = getLatestUserText(messages);
  const referencedAssetId = getReferencedAssetId(
    latestUserText,
    sidebarParams,
  );
  const generationRequested = isExplicitGenerationRequest(latestUserText);
  if (generationRequested) {
    return runDirectGeneration(
      latestUserText,
      referencedAssetId,
      sidebarParams,
    );
  }
  const sidebarContext = [];
  if (sidebarParams.platform) sidebarContext.push(`预设平台: ${sidebarParams.platform}`);
  if (sidebarParams.size) sidebarContext.push(`预设尺寸: ${sidebarParams.size}`);
  if (sidebarParams.width && sidebarParams.height) sidebarContext.push(`预设宽高: ${sidebarParams.width}x${sidebarParams.height}`);
  if (sidebarParams.count) sidebarContext.push(`预设数量: ${sidebarParams.count}`);
  if (sidebarParams.quality) sidebarContext.push(`预设质量: ${sidebarParams.quality}`);
  if (referencedAssetId) {
    sidebarContext.push(`当前选中的产品素材 ID: ${referencedAssetId}`);
  }

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
  const generationErrors: string[] = [];
  const reviewResults: Array<{
    reviewed?: boolean;
    status?: string;
    notes?: string;
  }> = [];
  let generationAttempted = false;
  for (const tc of toolCalls) {
    if (tc.toolName === "generate_platform_image" && tc.output) {
      generationAttempted = true;
      const out = tc.output as {
        results?: Array<{
          publicUrl?: string | null;
          generationId?: string;
          status?: string;
          error?: string;
        }>;
        platform?: string;
      };
      for (const r of out.results ?? []) {
        if (r.publicUrl && r.status === "completed") {
          generatedImages.push({
            publicUrl: r.publicUrl,
            platform: String(out.platform ?? "custom"),
            generationId: r.generationId ?? "",
          });
        } else if (r.status === "failed" && r.error) {
          generationErrors.push(r.error);
        }
      }
    } else if (tc.toolName === "review_image" && tc.output) {
      reviewResults.push(
        tc.output as {
          reviewed?: boolean;
          status?: string;
          notes?: string;
        },
      );
    }
  }

  const uniqueErrors = [...new Set(generationErrors)];
  let response = stripModelThinking(result.text);
  if (generationRequested && !generationAttempted) {
    response = referencedAssetId
      ? "本轮未执行图片生成工具，因此没有产生新图片。请重试。"
      : "本轮没有产生新图片。请先选择产品素材，再提交生成请求。";
  } else if (uniqueErrors.length > 0 && generatedImages.length === 0) {
    response = `图片生成失败：\n${uniqueErrors.map((error) => `- ${error}`).join("\n")}`;
  } else if (generatedImages.length > 0) {
    const platforms = [...new Set(generatedImages.map((image) => image.platform))];
    const latestReview = reviewResults.at(-1);
    const generationSummary = [
      `已真实生成 ${generatedImages.length} 张 ${platforms.join("、")} 图片。`,
      uniqueErrors.length > 0
        ? `另有 ${uniqueErrors.length} 个生成任务失败：${uniqueErrors.join("；")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (!latestReview) {
      response = `${generationSummary}\n\n本轮尚未执行 VLM 质检，不能宣称质检通过。`;
    } else if (latestReview.reviewed === false) {
      response = `${generationSummary}\n\nVLM 质检未执行成功：${latestReview.notes || "未知错误"}`;
    } else {
      const reviewLabel =
        latestReview.status === "passed"
          ? "通过"
          : latestReview.status === "failed"
            ? "未通过"
            : "存在警告";
      response = `${generationSummary}\n\nVLM 质检结果：${reviewLabel}${
        latestReview.notes ? `（${latestReview.notes}）` : ""
      }`;
    }
  }

  return {
    response,
    toolCalls,
    generatedImages,
  };
}
