export const PLATFORM_IDS = ["tmall", "jd", "temu", "instagram"] as const;
export type PlatformId = (typeof PLATFORM_IDS)[number];

export type PlatformStyle = {
  id: PlatformId;
  nameZh: string;
  nameEn: string;
  aspectRatio: string;
  size: string;
  promptTemplate: string;
  negativeHints?: string;
  sortOrder: number;
};

/** Fallback when DB unavailable; keep in sync with supabase/migrations/001_asset_library.sql */
export const PLATFORM_STYLE_FALLBACKS: PlatformStyle[] = [
  {
    id: "tmall",
    nameZh: "天猫",
    nameEn: "Tmall",
    aspectRatio: "1:1",
    size: "1024x1024",
    promptTemplate:
      "Transform this product photo into a Tmall/Taobao main product image: pure white background (#FFFFFF), product centered with generous padding, clean e-commerce look, soft even studio lighting, no clutter, space reserved for Chinese selling points overlay, photorealistic, sharp product details preserved.",
    negativeHints: "busy background, text watermark, low quality, distorted product",
    sortOrder: 1,
  },
  {
    id: "jd",
    nameZh: "京东",
    nameEn: "JD.com",
    aspectRatio: "1:1",
    size: "1024x1024",
    promptTemplate:
      "Transform this product photo into a JD.com main product image: crisp white background, product centered, slightly higher contrast and punchy colors, professional e-commerce photography, sturdy premium feel, sharp edges, no decorative clutter, suitable for Chinese marketplace listing.",
    negativeHints: "messy background, cartoon style, blurry, wrong colors",
    sortOrder: 2,
  },
  {
    id: "temu",
    nameZh: "Temu",
    nameEn: "Temu",
    aspectRatio: "1:1",
    size: "1024x1024",
    promptTemplate:
      "Transform this product photo into a Temu-style promotional product image: vibrant saturated colors, eye-catching deal/shopping vibe, subtle promotional sticker feel, bold composition, high energy, product still clearly visible and accurate, marketplace thumbnail optimized.",
    negativeHints: "dull colors, luxury minimal, unreadable product",
    sortOrder: 3,
  },
  {
    id: "instagram",
    nameZh: "Instagram",
    nameEn: "Instagram",
    aspectRatio: "4:5",
    size: "1024x1280",
    promptTemplate:
      "Transform this product photo into an Instagram lifestyle post: natural soft daylight, authentic UGC aesthetic, product in a real-life context or styled flat lay, warm inviting mood, subtle depth of field, not overly commercial, social-media ready vertical composition.",
    negativeHints: "white e-commerce background, heavy text, stock photo cliché",
    sortOrder: 4,
  },
];

export function isPlatformId(value: unknown): value is PlatformId {
  return typeof value === "string" && (PLATFORM_IDS as readonly string[]).includes(value);
}

export function buildPlatformPrompt(
  style: PlatformStyle,
  options: { productName?: string; extraPrompt?: string } = {}
): string {
  const parts = [style.promptTemplate];
  if (options.productName?.trim()) {
    parts.push(`Product name: ${options.productName.trim()}.`);
  }
  if (style.negativeHints?.trim()) {
    parts.push(`Avoid: ${style.negativeHints.trim()}.`);
  }
  if (options.extraPrompt?.trim()) {
    parts.push(`Additional requirements: ${options.extraPrompt.trim()}.`);
  }
  parts.push("Keep the product identity, shape, and branding accurate.");
  return parts.join(" ");
}

export function parseOpenAiSize(size: string): "1024x1024" | "1024x1536" | "1536x1024" | "auto" {
  if (size === "1024x1280" || size === "1024x1536") return "1024x1536";
  if (size === "1280x1024" || size === "1536x1024") return "1536x1024";
  if (size === "1024x1024") return "1024x1024";
  return "auto";
}
