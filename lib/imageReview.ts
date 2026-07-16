import { GoogleGenAI } from "@google/genai";
import type { ProductIdentityForPrompt } from "./platformStyles.js";

export type ReviewResult = {
  status: "passed" | "warning" | "failed";
  shapeOk: boolean;
  colorOk: boolean;
  brandOk: boolean;
  overallUsable: boolean;
  notes: string;
};

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

function bufferToBase64Part(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      mimeType: mimeType || "image/png",
      data: buffer.toString("base64"),
    },
  };
}

export function isReviewAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/**
 * Compare a generated image against the original product photo using Gemini Vision.
 * Returns a structured review with pass/warning/fail status.
 */
export async function reviewGeneratedImage(input: {
  originalBuffer: Buffer;
  originalMimeType: string;
  generatedBuffer: Buffer;
  generatedMimeType: string;
  productName?: string;
  identity?: ProductIdentityForPrompt;
}): Promise<ReviewResult> {
  const ai = getGeminiClient();
  if (!ai) {
    return { status: "warning", shapeOk: true, colorOk: true, brandOk: true, overallUsable: true, notes: "VLM review skipped: GEMINI_API_KEY not configured." };
  }

  const identityContext: string[] = [];
  if (input.productName) identityContext.push(`Product name: ${input.productName}`);
  const id = input.identity;
  if (id?.primaryColors?.length) identityContext.push(`Expected primary colors: ${id.primaryColors.join(", ")}`);
  if (id?.material) identityContext.push(`Material: ${id.material}`);
  if (id?.shapeKeywords) identityContext.push(`Shape: ${id.shapeKeywords}`);
  if (id?.brandElements) identityContext.push(`Brand elements: ${id.brandElements}`);
  if (id?.immutableFeatures) identityContext.push(`Must not change: ${id.immutableFeatures}`);

  const prompt = `You are a product image QA reviewer for e-commerce. Compare the ORIGINAL product photo (Image 1) with the AI-GENERATED version (Image 2).

${identityContext.length > 0 ? `Product reference:\n${identityContext.join("\n")}\n` : ""}
Evaluate these criteria:
1. SHAPE: Is the product shape/silhouette/proportions preserved? (no distortion, stretching, or missing parts)
2. COLOR: Are the product's actual colors accurate? (no color shift, wrong hues)
3. BRAND: Are brand elements (logo, text, distinctive features) preserved?
4. USABLE: Would this image be acceptable for a real e-commerce listing?

Respond in EXACTLY this JSON format, nothing else:
{"shapeOk":true/false,"colorOk":true/false,"brandOk":true/false,"overallUsable":true/false,"notes":"brief explanation of any issues"}`;

  try {
    const model = process.env.GEMINI_REVIEW_MODEL || "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            bufferToBase64Part(input.originalBuffer, input.originalMimeType),
            bufferToBase64Part(input.generatedBuffer, input.generatedMimeType),
            { text: prompt },
          ],
        },
      ],
    });

    const text = response.text?.trim() ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { status: "warning", shapeOk: true, colorOk: true, brandOk: true, overallUsable: true, notes: `VLM returned non-JSON: ${text.slice(0, 200)}` };
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      shapeOk?: boolean;
      colorOk?: boolean;
      brandOk?: boolean;
      overallUsable?: boolean;
      notes?: string;
    };

    const shapeOk = parsed.shapeOk !== false;
    const colorOk = parsed.colorOk !== false;
    const brandOk = parsed.brandOk !== false;
    const overallUsable = parsed.overallUsable !== false;
    const notes = String(parsed.notes ?? "");

    const allOk = shapeOk && colorOk && brandOk && overallUsable;
    const anyFail = !shapeOk || !colorOk;

    let status: ReviewResult["status"];
    if (allOk) status = "passed";
    else if (anyFail) status = "failed";
    else status = "warning";

    return { status, shapeOk, colorOk, brandOk, overallUsable, notes };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { status: "warning", shapeOk: true, colorOk: true, brandOk: true, overallUsable: true, notes: `VLM review error: ${msg}` };
  }
}
