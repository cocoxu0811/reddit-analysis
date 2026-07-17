import { defineEval } from "eve/evals";

export default defineEval({
  description: "image-studio 模式下应自动委派给 image_designer 子 Agent",
  async test(t) {
    await t.send({
      message: "列出所有产品素材",
      clientContext: { mode: "image-studio" },
    });
    t.succeeded();
    t.calledSubagent("image_designer");
  },
});
