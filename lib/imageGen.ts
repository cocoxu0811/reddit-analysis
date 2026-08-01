import { GoogleGenAI } from "@google/genai";
import {
  buildPlatformPrompt,
  type PlatformId,
  type PlatformStyle,
  type ProductIdentityForPrompt,
} from "./platformStyles.js";
import {
  generateMiniMaxSubjectImage,
  generateMiniMaxTextImage,
  isMiniMaxImageAvailable,
  type ImageGenSkillHints,
} from "./minimaxImage.js";

export type ImageGenProvider = "minimax" | "gemini";

export type ImageGenResult = {
  buffer: Buffer;
  promptUsed: string;
  mimeType: string;
  provider: ImageGenProvider;
  model: string;
};

function requireGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return key;
}

const SUPPORTED_ASPECT_RATIOS = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
] as const;

function resolveAspectRatio(style: PlatformStyle): string {
  if (
    SUPPORTED_ASPECT_RATIOS.includes(
      style.aspectRatio as (typeof SUPPORTED_ASPECT_RATIOS)[number],
    )
  ) {
    return style.aspectRatio;
  }

  const [width, height] = style.size.split("x").map(Number);
  if (!width || !height) return "1:1";

  const target = width / height;
  return SUPPORTED_ASPECT_RATIOS.reduce((closest, candidate) => {
    const [w, h] = candidate.split(":").map(Number);
    const [closestW, closestH] = closest.split(":").map(Number);
    return Math.abs(w / h - target) < Math.abs(closestW / closestH - target)
      ? candidate
      : closest;
  }, "1:1" as (typeof SUPPORTED_ASPECT_RATIOS)[number]);
}

function resolveTextImageProvider(): ImageGenProvider {
  const preferred = process.env.IMAGE_TEXT_PROVIDER?.trim().toLowerCase();
  if (preferred === "gemini") return "gemini";
  if (preferred === "minimax") {
    if (!isMiniMaxImageAvailable()) {
      throw new Error("IMAGE_TEXT_PROVIDER=minimax but MINIMAX_API_KEY is missing");
    }
    return "minimax";
  }
  // Default: MiniMax image-01 when available, otherwise Gemini.
  return isMiniMaxImageAvailable() ? "minimax" : "gemini";
}

function resolveI2IProvider(): ImageGenProvider {
  const preferred = process.env.IMAGE_I2I_PROVIDER?.trim().toLowerCase();
  if (preferred === "gemini") return "gemini";
  if (preferred === "minimax") {
    if (!isMiniMaxImageAvailable()) {
      throw new Error("IMAGE_I2I_PROVIDER=minimax but MINIMAX_API_KEY is missing");
    }
    return "minimax";
  }
  // Default: MiniMax image-01 for both T2I and I2I when available.
  return isMiniMaxImageAvailable() ? "minimax" : "gemini";
}

function applySkillDirectives(
  prompt: string,
  skillHints?: ImageGenSkillHints,
): string {
  const directives = skillHints?.styleDirectives?.trim();
  if (!directives) return prompt;
  return `${prompt}\n\n[SKILL DIRECTIVES]\n${directives}`;
}

async function generateGeminiTextImage(input: {
  promptUsed: string;
  aspectRatio: string;
}): Promise<ImageGenResult> {
  const client = new GoogleGenAI({ apiKey: requireGeminiKey() });
  const model =
    process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";
  const response = await client.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: input.promptUsed }],
      },
    ],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: input.aspectRatio,
        imageSize: process.env.GEMINI_IMAGE_SIZE?.trim() || "1K",
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        buffer: Buffer.from(part.inlineData.data, "base64"),
        promptUsed: input.promptUsed,
        mimeType: part.inlineData.mimeType || "image/png",
        provider: "gemini",
        model,
      };
    }
  }

  const reason = response.candidates?.[0]?.finishReason;
  throw new Error(
    `Gemini did not return an image${reason ? ` (finish reason: ${reason})` : ""}`,
  );
}

export async function generatePlatformImage(input: {
  sourceBuffer: Buffer;
  cleanBuffer?: Buffer | null;
  mimeType: string;
  platformStyle: PlatformStyle;
  productName?: string;
  description?: string;
  extraPrompt?: string;
  identity?: ProductIdentityForPrompt;
  seed?: number | null;
  approvedContext?: string;
  skillHints?: ImageGenSkillHints;
}): Promise<ImageGenResult> {
  const identityForPrompt: ProductIdentityForPrompt = {
    ...input.identity,
    description: input.description || input.identity?.description,
  };

  let extraParts = input.extraPrompt ?? "";
  if (input.approvedContext?.trim()) {
    extraParts = `${extraParts}\n\n[APPROVED REFERENCE]\nPreviously approved generations for this product had these characteristics — maintain visual consistency:\n${input.approvedContext.trim()}`.trim();
  }
  if (input.seed != null) {
    extraParts = `${extraParts}\n\n[VARIATION SEED]\nUse ${input.seed} as a creative variation reference while preserving the product identity.`.trim();
  }

  const promptUsed = applySkillDirectives(
    buildPlatformPrompt(input.platformStyle, {
      productName: input.productName,
      extraPrompt: extraParts || undefined,
      identity: identityForPrompt,
    }),
    input.skillHints,
  );

  const aspectRatio = resolveAspectRatio(input.platformStyle);
  const sourceImg = input.cleanBuffer ?? input.sourceBuffer;
  const provider = resolveI2IProvider();

  if (provider === "minimax") {
    const result = await generateMiniMaxSubjectImage({
      prompt: `${promptUsed}\n\nPreserve the product/subject identity from the reference image while applying the platform style.`,
      aspectRatio,
      referenceBuffer: sourceImg,
      referenceMimeType: input.mimeType || "image/png",
      seed: input.seed,
      skillHints: input.skillHints,
    });
    return {
      buffer: result.buffer,
      promptUsed,
      mimeType: result.mimeType,
      provider: "minimax",
      model: result.model,
    };
  }

  const client = new GoogleGenAI({ apiKey: requireGeminiKey() });
  const model =
    process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";
  const response = await client.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: input.mimeType || "image/png",
              data: sourceImg.toString("base64"),
            },
          },
          {
            text: `${promptUsed}\n\nEdit the supplied product image according to these instructions. Return a newly generated image, not a textual description.`,
          },
        ],
      },
    ],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio,
        imageSize: process.env.GEMINI_IMAGE_SIZE?.trim() || "1K",
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        buffer: Buffer.from(part.inlineData.data, "base64"),
        promptUsed,
        mimeType: part.inlineData.mimeType || "image/png",
        provider: "gemini",
        model,
      };
    }
  }

  const reason = response.candidates?.[0]?.finishReason;
  throw new Error(
    `Gemini did not return an image${reason ? ` (finish reason: ${reason})` : ""}`,
  );
}

export async function generateTextImage(input: {
  prompt: string;
  platformStyle: PlatformStyle;
  seed?: number | null;
  skillHints?: ImageGenSkillHints;
}): Promise<ImageGenResult> {
  const variationHint =
    input.seed == null
      ? ""
      : `\n\n[VARIATION]\nCreate variation ${input.seed}; keep the requested subject and composition requirements.`;
  const promptUsed = applySkillDirectives(
    [
      "[TASK]",
      "Create a new image from the user's text description. There is no reference image.",
      "",
      "[USER REQUEST]",
      input.prompt.trim(),
      "",
      "[TARGET STYLE]",
      input.platformStyle.promptTemplate,
      input.platformStyle.negativeHints
        ? `\n[AVOID]\n${input.platformStyle.negativeHints}`
        : "",
      variationHint,
      "",
      "Return a newly generated image only, not a textual description.",
    ]
      .filter(Boolean)
      .join("\n"),
    input.skillHints,
  );

  const aspectRatio = resolveAspectRatio(input.platformStyle);
  const provider = resolveTextImageProvider();

  if (provider === "minimax") {
    try {
      const result = await generateMiniMaxTextImage({
        prompt: promptUsed,
        aspectRatio,
        seed: input.seed,
        skillHints: input.skillHints,
      });
      return {
        buffer: result.buffer,
        promptUsed,
        mimeType: result.mimeType,
        provider: "minimax",
        model: result.model,
      };
    } catch (error) {
      // Optional safety net when MiniMax is preferred but temporarily unavailable.
      if (process.env.IMAGE_TEXT_FALLBACK?.trim().toLowerCase() === "gemini") {
        return generateGeminiTextImage({ promptUsed, aspectRatio });
      }
      throw error;
    }
  }

  return generateGeminiTextImage({ promptUsed, aspectRatio });
}

export type { PlatformId, ImageGenSkillHints };
