import { defineAgent } from "eve";
import { getMiniMaxAgentModel } from "../../../lib/minimaxProvider.js";

export default defineAgent({
  description:
    "专业的产品图片 AI 设计师。负责电商平台适配图生成、产品去背景、VLM 质检、品牌规范搜索。Strategist 在用户需要图片生成时将任务委派给此子 Agent。",
  model: getMiniMaxAgentModel(),
});
