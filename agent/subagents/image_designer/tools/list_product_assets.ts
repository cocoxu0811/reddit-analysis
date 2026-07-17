import { defineTool } from "eve/tools";
import { z } from "zod";
import { listAssets } from "../../../../lib/assetLibrary.js";

export default defineTool({
  description:
    "列出素材库中的产品图片。返回产品名称、描述、缩略图URL等信息，供用户选择要生成的产品。",
  inputSchema: z.object({
    limit: z.number().min(1).max(50).default(20).describe("返回数量"),
  }),
  async execute({ limit }) {
    const assets = await listAssets(limit, 0);
    return {
      count: assets.length,
      assets: assets.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        publicUrl: a.publicUrl,
        hasClean: Boolean(a.cleanPublicUrl),
        tags: a.tags,
        generationCount: a.generationCount ?? 0,
      })),
    };
  },
});
