import { defineEval } from "eve/evals";

export default defineEval({
  description: "Strategist 收到扫描 subreddit 请求时应调用 scan_subreddit 工具",
  async test(t) {
    await t.send("帮我扫描 r/ecommerce 最近的帖子");
    t.succeeded();
    t.calledTool("scan_subreddit");
  },
});
