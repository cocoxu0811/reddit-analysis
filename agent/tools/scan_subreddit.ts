import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  scanSubreddit,
  scanMultipleSubreddits,
  type MonitoredPost,
} from "../../lib/redditMonitor.js";

function summarizePost(post: MonitoredPost) {
  return {
    title: post.title,
    subreddit: post.subreddit,
    author: post.author,
    score: post.score,
    numComments: post.numComments,
    emotion: post.emotion,
    category: post.category,
    body: post.body.slice(0, 300) + (post.body.length > 300 ? "..." : ""),
    intentMarks: post.intentMarks,
    topComments: post.comments.slice(0, 3).map((c) => ({
      body: c.body.slice(0, 200),
      score: c.score,
    })),
  };
}

export default defineTool({
  description:
    "扫描一个或多个 subreddit 的最新帖子，获取帖子内容、评论、情绪分类和用户意图标注。用于了解社区最新讨论动态。",
  inputSchema: z.object({
    subreddits: z
      .array(z.string())
      .min(1)
      .describe("要扫描的 subreddit 名称列表，例如 ['startups', 'SaaS']"),
    limit: z
      .number()
      .min(1)
      .max(25)
      .default(10)
      .describe("每个 subreddit 获取的帖子数量"),
    useAi: z
      .boolean()
      .default(true)
      .describe("是否使用 AI 标注情绪和分类"),
  }),
  async execute({ subreddits, limit, useAi }) {
    if (subreddits.length === 1) {
      const result = await scanSubreddit(subreddits[0], limit, {
        useGemini: useAi,
        aiProvider: "gemini",
      });
      return {
        subreddits: [result.subreddit],
        fetchedAt: result.fetchedAt,
        postCount: result.posts.length,
        posts: result.posts.map(summarizePost),
      };
    }
    const result = await scanMultipleSubreddits(subreddits, limit, {
      useGemini: useAi,
      aiProvider: "gemini",
    });
    return {
      subreddits: result.subreddits,
      fetchedAt: result.fetchedAt,
      postCount: result.posts.length,
      posts: result.posts.map(summarizePost),
    };
  },
});
