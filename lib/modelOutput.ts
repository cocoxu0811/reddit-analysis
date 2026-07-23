const THINK_BLOCK_PATTERN = /<(?:think|thinking)>[\s\S]*?<\/(?:think|thinking)>\s*/gi;

/**
 * MiniMax reasoning models may place private reasoning inside XML-like tags
 * when accessed through an OpenAI-compatible endpoint. Never expose those
 * blocks in user-facing responses.
 */
export function stripModelThinking(text: string): string {
  return text.replace(THINK_BLOCK_PATTERN, "").trim();
}
