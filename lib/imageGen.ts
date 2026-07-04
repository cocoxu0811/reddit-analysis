import OpenAI, { toFile } from "openai";
import {
  buildPlatformPrompt,
  parseOpenAiSize,
  type PlatformId,
  type PlatformStyle,
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
  mimeType: string;
  platformStyle: PlatformStyle;
  productName?: string;
  extraPrompt?: string;
}): Promise<{ buffer: Buffer; promptUsed: string; mimeType: string }> {
  const client = new OpenAI({ apiKey: requireOpenAiKey() });
  const promptUsed = buildPlatformPrompt(input.platformStyle, {
    productName: input.productName,
    extraPrompt: input.extraPrompt,
  });

  const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
  const size = parseOpenAiSize(input.platformStyle.size);

  const imageFile = await toFile(
    input.sourceBuffer,
    `source.${mimeToExt(input.mimeType)}`,
    { type: input.mimeType }
  );

  const response = await client.images.edit({
    model,
    image: imageFile,
    prompt: promptUsed,
    size,
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
