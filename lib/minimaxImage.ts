/**
 * MiniMax image-01 / image-01-live client.
 * Docs: POST /v1/image_generation (T2I + character subject_reference I2I)
 */

export type MiniMaxImageModel = "image-01" | "image-01-live";

export type MiniMaxLiveStyle = {
  styleType: "漫画" | "元气" | "中世纪" | "水彩" | string;
  styleWeight?: number;
};

/** Future skill-tuning knobs for image generation. */
export type ImageGenSkillHints = {
  styleDirectives?: string;
  promptOptimizer?: boolean;
  aigcWatermark?: boolean;
  liveStyle?: MiniMaxLiveStyle;
  model?: MiniMaxImageModel;
};

const MINIMAX_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "4:3",
  "3:2",
  "2:3",
  "3:4",
  "9:16",
  "21:9",
] as const;

type MiniMaxAspectRatio = (typeof MINIMAX_ASPECT_RATIOS)[number];

function requireMiniMaxKey(): string {
  const key = process.env.MINIMAX_API_KEY?.trim();
  if (!key) throw new Error("Missing MINIMAX_API_KEY");
  return key;
}

export function isMiniMaxImageAvailable(): boolean {
  return Boolean(process.env.MINIMAX_API_KEY?.trim());
}

function getMiniMaxApiRoot(): string {
  return (
    process.env.MINIMAX_BASE_URL?.trim() || "https://api.minimax.io/v1"
  ).replace(/\/+$/, "");
}

export function resolveMiniMaxAspectRatio(aspectRatio: string): MiniMaxAspectRatio {
  if (
    MINIMAX_ASPECT_RATIOS.includes(
      aspectRatio as (typeof MINIMAX_ASPECT_RATIOS)[number],
    )
  ) {
    return aspectRatio as MiniMaxAspectRatio;
  }

  // Closest supported ratio for common ecommerce sizes Gemini accepts (e.g. 4:5).
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) return "1:1";
  const target = w / h;
  return MINIMAX_ASPECT_RATIOS.reduce((closest, candidate) => {
    const [cw, ch] = candidate.split(":").map(Number);
    const [bw, bh] = closest.split(":").map(Number);
    return Math.abs(cw / ch - target) < Math.abs(bw / bh - target)
      ? candidate
      : closest;
  }, "1:1" as MiniMaxAspectRatio);
}

function truncatePrompt(prompt: string, max = 1500): string {
  const trimmed = prompt.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

type MiniMaxImageGenerationResponse = {
  id?: string;
  data?: {
    image_urls?: string[];
    image_base64?: string[];
  };
  metadata?: {
    success_count?: number | string;
    failed_count?: number | string;
  };
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
};

async function decodeImagePayload(
  payload: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (payload.startsWith("data:")) {
    const match = payload.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid MiniMax data URL");
    return {
      mimeType: match[1] || "image/png",
      buffer: Buffer.from(match[2], "base64"),
    };
  }

  if (/^https?:\/\//i.test(payload)) {
    const res = await fetch(payload);
    if (!res.ok) {
      throw new Error(`Failed to download MiniMax image URL: HTTP ${res.status}`);
    }
    const mimeType = res.headers.get("content-type")?.split(";")[0] || "image/png";
    return {
      buffer: Buffer.from(await res.arrayBuffer()),
      mimeType,
    };
  }

  return {
    buffer: Buffer.from(payload, "base64"),
    mimeType: "image/png",
  };
}

async function callMiniMaxImageGeneration(body: Record<string, unknown>): Promise<{
  buffer: Buffer;
  mimeType: string;
  taskId?: string;
}> {
  const apiKey = requireMiniMaxKey();
  const endpoint = `${getMiniMaxApiRoot()}/image_generation`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as MiniMaxImageGenerationResponse;
  const statusCode = json.base_resp?.status_code;
  if (!res.ok || (statusCode != null && statusCode !== 0)) {
    const msg =
      json.base_resp?.status_msg ||
      `MiniMax image generation failed (HTTP ${res.status}, code ${statusCode ?? "n/a"})`;
    throw new Error(msg);
  }

  const base64 = json.data?.image_base64?.[0];
  const url = json.data?.image_urls?.[0];
  if (!base64 && !url) {
    throw new Error("MiniMax did not return an image");
  }

  const decoded = await decodeImagePayload(base64 || url!);
  return {
    ...decoded,
    taskId: json.id,
  };
}

export async function generateMiniMaxTextImage(input: {
  prompt: string;
  aspectRatio: string;
  seed?: number | null;
  skillHints?: ImageGenSkillHints;
}): Promise<{ buffer: Buffer; mimeType: string; model: string }> {
  const model =
    input.skillHints?.model ||
    (process.env.MINIMAX_IMAGE_MODEL?.trim() as MiniMaxImageModel | undefined) ||
    "image-01";

  const body: Record<string, unknown> = {
    model,
    prompt: truncatePrompt(input.prompt),
    aspect_ratio: resolveMiniMaxAspectRatio(input.aspectRatio),
    response_format: "base64",
    n: 1,
    prompt_optimizer: input.skillHints?.promptOptimizer ?? false,
    aigc_watermark: input.skillHints?.aigcWatermark ?? false,
  };

  if (input.seed != null) body.seed = input.seed;

  if (model === "image-01-live" && input.skillHints?.liveStyle) {
    body.style = {
      style_type: input.skillHints.liveStyle.styleType,
      style_weight: input.skillHints.liveStyle.styleWeight ?? 0.8,
    };
  }

  const result = await callMiniMaxImageGeneration(body);
  return {
    buffer: result.buffer,
    mimeType: result.mimeType,
    model,
  };
}

/**
 * MiniMax I2I currently only documents subject_reference type=character.
 * Exposed for experiments; product ecommerce consistency still prefers Gemini.
 */
export async function generateMiniMaxSubjectImage(input: {
  prompt: string;
  aspectRatio: string;
  referenceBuffer: Buffer;
  referenceMimeType: string;
  seed?: number | null;
  skillHints?: ImageGenSkillHints;
}): Promise<{ buffer: Buffer; mimeType: string; model: string }> {
  const model =
    input.skillHints?.model ||
    (process.env.MINIMAX_IMAGE_MODEL?.trim() as MiniMaxImageModel | undefined) ||
    "image-01";
  const mime = input.referenceMimeType || "image/png";
  const dataUrl = `data:${mime};base64,${input.referenceBuffer.toString("base64")}`;

  const body: Record<string, unknown> = {
    model,
    prompt: truncatePrompt(input.prompt),
    aspect_ratio: resolveMiniMaxAspectRatio(input.aspectRatio),
    response_format: "base64",
    n: 1,
    prompt_optimizer: input.skillHints?.promptOptimizer ?? false,
    aigc_watermark: input.skillHints?.aigcWatermark ?? false,
    subject_reference: [
      {
        type: "character",
        image_file: dataUrl,
      },
    ],
  };

  if (input.seed != null) body.seed = input.seed;

  const result = await callMiniMaxImageGeneration(body);
  return {
    buffer: result.buffer,
    mimeType: result.mimeType,
    model,
  };
}
