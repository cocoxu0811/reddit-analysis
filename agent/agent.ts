import { defineAgent } from "eve";
import { getMiniMaxAgentModel } from "../lib/minimaxProvider.js";

export default defineAgent({
  model: getMiniMaxAgentModel(),
});
