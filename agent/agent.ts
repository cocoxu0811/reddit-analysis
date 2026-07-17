import { defineAgent } from "eve";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default defineAgent({
  model: google(process.env.GEMINI_AGENT_MODEL || "gemini-2.5-flash"),
});
