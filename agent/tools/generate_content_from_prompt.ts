import { defineTool } from "eve/tools";
import { z } from "zod";
import { generateContentFromPrompt } from "../../lib/llm.js";

export default defineTool({
  description:
    "基于用户指令和目标 subreddit 直接生成 Reddit 帖子创意。不需要分析报告。可传入真人帖子范文作为风格参考。",
  inputSchema: z.object({
    subreddit: z.string().describe("目标 subreddit，例如 'r/startups'"),
    instruction: z.string().describe("用户的内容生成指令"),
    language: z.enum(["en", "zh"]).default("en").describe("输出语言"),
    tone: z
      .enum(["curious", "question", "recommend", "rant"])
      .default("question")
      .describe("帖子语气风格"),
    examplePosts: z
      .array(z.string())
      .default([])
      .describe("来自 search_reddit 的真人帖子范文，用于风格参考"),
    count: z
      .number()
      .min(1)
      .max(10)
      .default(6)
      .describe("生成帖子数量"),
  }),
  async execute({ subreddit, instruction, language, tone, examplePosts, count }) {
    const ideas = await generateContentFromPrompt(
      subreddit,
      instruction,
      language,
      tone,
      undefined,
      examplePosts,
      count
    );
    return { subreddit, tone, language, count, ideas };
  },
});
