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

export type ProductIdentityForPrompt = {
  description?: string;
  primaryColors?: string[];
  material?: string;
  shapeKeywords?: string;
  brandElements?: string;
  immutableFeatures?: string;
};

/**
 * 4-layer prompt architecture for generation consistency:
 *   Layer 1 — Product Identity (shared across all platforms)
 *   Layer 2 — Platform Style (background, lighting, composition)
 *   Layer 3 — User Instructions (extra prompt from UI)
 *   Layer 4 — Negative Constraints (what to avoid)
 */
export function buildPlatformPrompt(
  style: PlatformStyle,
  options: {
    productName?: string;
    extraPrompt?: string;
    identity?: ProductIdentityForPrompt;
  } = {}
): string {
  const sections: string[] = [];

  // ── Layer 1: Product Identity (immutable anchor) ──
  const idParts: string[] = [];
  if (options.productName?.trim()) {
    idParts.push(`Product: ${options.productName.trim()}.`);
  }
  const id = options.identity;
  if (id) {
    if (id.description?.trim()) {
      idParts.push(`Description: ${id.description.trim()}.`);
    }
    if (id.primaryColors?.length) {
      idParts.push(`Primary colors: ${id.primaryColors.join(", ")}. These exact colors MUST be preserved.`);
    }
    if (id.material?.trim()) {
      idParts.push(`Material/texture: ${id.material.trim()}.`);
    }
    if (id.shapeKeywords?.trim()) {
      idParts.push(`Shape: ${id.shapeKeywords.trim()}. The product shape and proportions MUST remain accurate.`);
    }
    if (id.brandElements?.trim()) {
      idParts.push(`Brand elements to preserve: ${id.brandElements.trim()}.`);
    }
    if (id.immutableFeatures?.trim()) {
      idParts.push(`CRITICAL — do NOT alter: ${id.immutableFeatures.trim()}.`);
    }
  }
  if (idParts.length > 0) {
    sections.push(`[PRODUCT IDENTITY]\n${idParts.join("\n")}`);
  }

  // ── Layer 2: Platform Visual Style ──
  sections.push(`[PLATFORM STYLE]\n${style.promptTemplate}`);

  // ── Layer 3: User Instructions ──
  if (options.extraPrompt?.trim()) {
    sections.push(`[ADDITIONAL INSTRUCTIONS]\n${options.extraPrompt.trim()}`);
  }

  // ── Layer 4: Negative Constraints ──
  const negParts: string[] = [];
  if (style.negativeHints?.trim()) {
    negParts.push(style.negativeHints.trim());
  }
  negParts.push("distorted product shape, wrong product colors, missing brand logo, altered product proportions");
  sections.push(`[AVOID]\n${negParts.join(", ")}.`);

  return sections.join("\n\n");
}

export function parseOpenAiSize(size: string): "1024x1024" | "1024x1536" | "1536x1024" | "auto" {
  if (size === "1024x1280" || size === "1024x1536") return "1024x1536";
  if (size === "1280x1024" || size === "1536x1024") return "1536x1024";
  if (size === "1024x1024") return "1024x1024";
  return "auto";
}
