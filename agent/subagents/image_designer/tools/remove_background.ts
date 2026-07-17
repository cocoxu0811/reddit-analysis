import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  getAsset,
  downloadAssetBuffer,
  updateAssetClean,
} from "../../../../lib/assetLibrary.js";
import {
  isRemoveBgAvailable,
  removeBackground,
} from "../../../../lib/removeBackground.js";

export default defineTool({
  description:
    "去除产品图片的背景，生成纯白底的产品抠图。后续生成时会自动优先使用抠图版本。",
  inputSchema: z.object({
    assetId: z.string().describe("产品素材 ID"),
  }),
  async execute({ assetId }) {
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
});
