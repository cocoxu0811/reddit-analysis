import { defineTool } from "eve/tools";
import { z } from "zod";
import { generateContentIdeas } from "../../lib/llm.js";

export default defineTool({
  description:
    "基于分析报告生成 Reddit 帖子创意，包含标题、正文和推荐 subreddit。数量由 count 参数控制。",
  inputSchema: z.object({
    report: z
      .object({
        summary: z.string(),
        painPoints: z.array(z.string()),
        praisedFeatures: z.array(z.string()),
        mentionedBrands: z.array(z.string()),
        highFrequencyWords: z.array(z.string()),
      })
      .describe("分析报告对象"),
    language: z.enum(["en", "zh"]).default("en").describe("输出语言"),
    tone: z
      .enum(["curious", "question", "recommend", "rant"])
      .default("question")
      .describe("帖子语气风格"),
    count: z
      .number()
      .min(1)
      .max(10)
      .default(6)
      .describe("生成帖子数量"),
  }),
  async execute({ report, language, tone, count }) {
    const ideas = await generateContentIdeas(report, language, tone, undefined, count);
    return { tone, language, count, ideas };
  },
});
