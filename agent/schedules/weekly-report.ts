import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  cron: "0 10 * * 1",
  markdown: `
执行周度营销总结任务：

1. 调用 search_reddit 搜索过去一周各核心 subreddit 的高赞帖子（sort: top, time_filter: week）
2. 调用 analyze_reddit_data 对搜索结果进行深度分析
3. 调用 generate_content_ideas 基于分析结果生成下周内容创意
4. 生成一份完整的周报，包含：
   - 本周 Reddit 社区趋势总结
   - 用户讨论热点和情绪变化
   - 竞品动态回顾
   - 下周内容创作建议（包含 3-5 个具体选题）
   - 推荐发布时间和目标 subreddit
`.trim(),
});
