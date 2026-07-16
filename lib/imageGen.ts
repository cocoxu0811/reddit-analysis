import OpenAI, { toFile } from "openai";
import {
  buildPlatformPrompt,
  parseOpenAiSize,
  type PlatformId,
  type PlatformStyle,
  type ProductIdentityForPrompt,
} from "./platformStyles.js";

function requireOpenAiKey(): string {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error("Missing OPENAI_API_KEY");
  return key;
}

function mimeToExt(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  return "png";
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
  const client = new OpenAI({ apiKey: requireOpenAiKey() });

  const identityForPrompt: ProductIdentityForPrompt = {
    ...input.identity,
    description: input.description || input.identity?.description,
  };

  let extraParts = input.extraPrompt ?? "";
  if (input.approvedContext?.trim()) {
    extraParts = `${extraParts}\n\n[APPROVED REFERENCE]\nPreviously approved generations for this product had these characteristics — maintain visual consistency:\n${input.approvedContext.trim()}`.trim();
  }

  const promptUsed = buildPlatformPrompt(input.platformStyle, {
    productName: input.productName,
    extraPrompt: extraParts || undefined,
    identity: identityForPrompt,
  });

  const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
  const size = parseOpenAiSize(input.platformStyle.size);

  const sourceImg = input.cleanBuffer ?? input.sourceBuffer;
  const imageFile = await toFile(
    sourceImg,
    `source.${mimeToExt(input.mimeType)}`,
    { type: input.mimeType }
  );

  const response = await client.images.edit({
    model,
    image: imageFile,
    prompt: promptUsed,
    size,
    ...(input.seed != null ? { seed: input.seed } : {}),
  });

  const first = response.data?.[0];
  if (!first) throw new Error("OpenAI returned no image data");

  if (first.b64_json) {
    return {
      buffer: Buffer.from(first.b64_json, "base64"),
      promptUsed,
      mimeType: "image/png",
    };
  }

  if (first.url) {
    const res = await fetch(first.url);
    if (!res.ok) throw new Error(`Failed to download generated image: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";
    return {
      buffer: Buffer.from(arrayBuffer),
      promptUsed,
      mimeType: contentType.split(";")[0] || "image/png",
    };
  }

  throw new Error("OpenAI image response missing b64_json and url");
}

export type { PlatformId };
