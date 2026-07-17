import { defineEval } from "eve/evals";

export default defineEval({
  description: "未指定 subreddit 时应调用 suggest_subreddits 推荐",
  async test(t) {
    await t.send("我想发一篇关于护肤品成分的科普帖，发在哪个社区比较好？");
    t.succeeded();
    t.calledTool("suggest_subreddits");
  },
});
