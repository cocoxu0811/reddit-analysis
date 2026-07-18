import { GoogleGenAI } from "@google/genai";
import {
  buildPlatformPrompt,
  type PlatformId,
  type PlatformStyle,
  type ProductIdentityForPrompt,
} from "./platformStyles.js";

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
}): Promise<{ buffer: Buffer; promptUsed: string; mimeType: string }> {
  const client = new GoogleGenAI({ apiKey: requireGeminiKey() });

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

  const promptUsed = buildPlatformPrompt(input.platformStyle, {
    productName: input.productName,
    extraPrompt: extraParts || undefined,
    identity: identityForPrompt,
  });

  const model =
    process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";
  const sourceImg = input.cleanBuffer ?? input.sourceBuffer;
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
        aspectRatio: resolveAspectRatio(input.platformStyle),
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
      };
    }
  }

  const reason = response.candidates?.[0]?.finishReason;
  throw new Error(
    `Gemini did not return an image${reason ? ` (finish reason: ${reason})` : ""}`,
  );
}

export type { PlatformId };
