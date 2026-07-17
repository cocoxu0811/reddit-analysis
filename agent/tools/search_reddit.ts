import { defineTool } from "eve/tools";
import { z } from "zod";
import { searchRedditPosts, extractStyleExamples } from "../../lib/redditSearch.js";

function formatPostAge(createdUtc: number): string {
  const days = Math.floor((Date.now() / 1000 - createdUtc) / 86400);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${(days / 365).toFixed(1)}y ago`;
}

export default defineTool({
  description:
    "搜索 Reddit 帖子。用于在生成内容前获取目标社区的真人帖子范文，学习写作风格和社区文化。",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .describe("搜索关键词"),
    subreddit: z
      .string()
      .optional()
      .describe("限定搜索的 subreddit（不含 r/ 前缀）"),
    sort: z
      .enum(["relevance", "top", "new", "comments"])
      .default("top")
      .describe("排序方式"),
    timeRange: z
      .enum(["hour", "day", "week", "month", "year", "all"])
      .default("year")
      .describe("时间范围"),
    limit: z
      .number()
      .min(1)
      .max(15)
      .default(10)
      .describe("返回帖子数量"),
  }),
  async execute({ query, subreddit, sort, timeRange, limit }) {
    const result = await searchRedditPosts(query, subreddit, sort, timeRange, limit);
    const styleExamples = extractStyleExamples(result.posts, {
      maxExamples: 3,
      minScore: 20,
      minComments: 3,
      preferRecentMonths: 3,
    });
    return {
      query: result.query,
      subreddit: result.subreddit,
      fetchedAt: result.fetchedAt,
      postCount: result.posts.length,
      qualifiedExampleCount: styleExamples.length,
      posts: result.posts.map((p) => ({
        title: p.title,
        subreddit: p.subreddit,
        author: p.author,
        score: p.score,
        numComments: p.numComments,
        ageLabel: formatPostAge(p.createdUtc),
        body: p.selftext.slice(0, 500) + (p.selftext.length > 500 ? "..." : ""),
      })),
      styleExamples,
    };
  },
});
