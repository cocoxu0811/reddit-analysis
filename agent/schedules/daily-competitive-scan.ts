import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  cron: "0 9 * * 1-5",
  markdown: `
执行每日竞品扫描任务：

1. 调用 get_competitive_data 获取最新的 Instagram 竞品监控数据
2. 调用 scan_subreddit 扫描以下核心 subreddit 的最新动态：
   - r/ecommerce
   - r/smallbusiness
   - r/dropship
3. 将扫描结果与昨日数据对比，总结关键变化
4. 生成一份结构化的每日竞品简报，包含：
   - 竞品社媒动态摘要
   - Reddit 社区热点话题
   - 值得关注的用户痛点或需求
   - 建议的应对策略

注意：只报告有实质变化的内容，不要重复已知信息。
`.trim(),
});
