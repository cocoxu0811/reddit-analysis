import { defineEval } from "eve/evals";

export default defineEval({
  description: "图片生成请求应委派给 image_designer 子 Agent",
  async test(t) {
    await t.send("帮我把这个产品图生成一张天猫主图");
    t.succeeded();
    t.calledSubagent("image_designer");
  },
});
