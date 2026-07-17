import { defineTool } from "eve/tools";
import { z } from "zod";
import { fetchBrandDnaForImageGen } from "../../../../lib/brandDna.js";

export default defineTool({
  description:
    "从 RAG 知识库搜索品牌视觉规范（色彩、风格、摄影要求等），用于指导图片生成保持品牌一致性。",
  inputSchema: z.object({
    productName: z.string().optional().describe("产品名称"),
    tags: z.array(z.string()).default([]).describe("相关标签"),
  }),
  async execute({ productName, tags }) {
    const result = await fetchBrandDnaForImageGen({ productName, tags });
    if (!result) {
      return { found: false, message: "No brand guidelines found in knowledge base" };
    }
    return { found: true, guidelines: result };
  },
});
