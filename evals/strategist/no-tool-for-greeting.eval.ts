import { defineEval } from "eve/evals";

export default defineEval({
  description: "简单问候不应调用任何工具",
  async test(t) {
    await t.send("你好！你能做什么？");
    t.succeeded();
    t.usedNoTools();
  },
});
