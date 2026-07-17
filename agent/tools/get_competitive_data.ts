import { defineTool } from "eve/tools";
import { z } from "zod";
import { readCompetitiveCache } from "../../competitive/runDaily.js";

export default defineTool({
  description:
    "获取 Instagram 竞品监控的最新缓存数据，包括各竞品账号的帖子、互动数据和内容分类。",
  inputSchema: z.object({}),
  async execute() {
    const cache = await readCompetitiveCache();
    if (!cache?.instagram) {
      return { available: false as const, message: "暂无竞品数据缓存" };
    }
    const ig = cache.instagram;
    const handles = ig.handles || [];
    const summary = handles.map((h) => {
      const posts = ig.postsByUsername?.[h.toLowerCase()] || [];
      return {
        handle: h,
        postCount: posts.length,
        recentPosts: posts.slice(0, 3).map((p) => ({
          caption: (p.caption || "").slice(0, 100),
          likes: p.likesCount,
          comments: p.commentsCount,
          type: p.type,
          timestamp: p.timestamp,
        })),
      };
    });
    return {
      available: true as const,
      fetchedAt: ig.fetchedAt,
      handles,
      summary,
    };
  },
});
