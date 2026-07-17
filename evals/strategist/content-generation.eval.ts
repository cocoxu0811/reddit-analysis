import { defineEval } from "eve/evals";

export default defineEval({
  description: "内容生成前应先搜索 Reddit 学习社区风格，再调用生成工具",
  async test(t) {
    await t.send("帮我为 r/smallbusiness 写一篇关于跨境电商选品的帖子");
    t.succeeded();
    t.calledTool("search_reddit");
    t.calledTool("generate_content_from_prompt");
    t.toolOrder(["search_reddit", "generate_content_from_prompt"]);
  },
});
