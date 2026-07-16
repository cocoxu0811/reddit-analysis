import { GoogleGenAI } from "@google/genai";

export function isRemoveBgAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/**
 * Remove the background from a product image using Gemini's image generation,
 * producing a clean product cutout on a pure white background.
 */
export async function removeBackground(input: {
  buffer: Buffer;
  mimeType: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is required for background removal");

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: input.mimeType || "image/png",
              data: input.buffer.toString("base64"),
            },
          },
          {
            text: "Remove the background from this product image completely. Output ONLY the product on a pure white (#FFFFFF) background. Preserve every detail of the product: exact colors, textures, shape, logos, text, and proportions. Do not alter, crop, or resize the product itself. The result should look like a professional product cutout photo on white.",
          },
        ],
      },
    ],
    config: {
      responseModalities: ["image", "text"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        buffer: Buffer.from(part.inlineData.data, "base64"),
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }

  throw new Error("Gemini did not return an image for background removal");
}
