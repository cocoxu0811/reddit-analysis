import { defineTool } from "eve/tools";
import { z } from "zod";
import { generateRedditAnalysisReport } from "../../lib/llm.js";

export default defineTool({
  description:
    "对 Reddit 帖子和评论数据进行深度分析，生成结构化报告：讨论摘要、用户痛点、被赞特性、提及品牌、高频词汇。",
  inputSchema: z.object({
    datasetText: z
      .string()
      .min(10)
      .describe("Reddit 帖子和评论的文本数据集"),
    language: z.enum(["en", "zh"]).default("en").describe("输出语言"),
  }),
  async execute({ datasetText, language }) {
    return await generateRedditAnalysisReport(datasetText, language);
  },
});
