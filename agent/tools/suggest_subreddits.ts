import { defineTool } from "eve/tools";
import { z } from "zod";
import { suggestSubredditsForIdeas } from "../../lib/llm.js";

export default defineTool({
  description:
    "为一组内容创意推荐最匹配的 subreddit。基于内容主题、角度和正文来判断最适合发布的社区。",
  inputSchema: z.object({
    ideas: z
      .array(
        z.object({
          title: z.string(),
          angle: z.string(),
          postTitle: z.string(),
          postBody: z.string(),
          currentSuggestedSubreddit: z.string().optional(),
        })
      )
      .min(1)
      .describe("内容创意列表"),
    language: z.enum(["en", "zh"]).default("en").describe("语言"),
  }),
  async execute({ ideas, language }) {
    const suggestions = await suggestSubredditsForIdeas(ideas, language);
    return {
      suggestions: ideas.map((idea, i) => ({
        title: idea.title,
        suggestedSubreddit: suggestions[i] || "r/AskReddit",
      })),
    };
  },
});
