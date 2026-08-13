import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createMiniMaxProvider() {
  const baseURL = (
    process.env.MINIMAX_BASE_URL?.trim() || "https://api.minimax.io/v1"
  ).replace(/\/+$/, "");

  return createOpenAICompatible({
    name: "minimax",
    // Eve imports agent definitions during build discovery, where deployment
    // secrets are intentionally unavailable. The real key is read again when
    // the runtime process loads this module.
    apiKey: process.env.MINIMAX_API_KEY?.trim() || "missing-minimax-api-key",
    baseURL,
  });
}

export function getMiniMaxAgentModel() {
  return createMiniMaxProvider().chatModel(
    process.env.MINIMAX_AGENT_MODEL?.trim() || "MiniMax-M3",
  );
}
