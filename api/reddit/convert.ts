/**
 * Vercel 独立函数：仅处理 Reddit 链接转 JSON，不加载 Express / sqlite / 大依赖。
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRedditJsonForConvert } from "../../lib/redditLinkConvert.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = req.body as Record<string, unknown> | undefined;
    const url = typeof body?.url === "string" ? body.url : "";
    if (!url.trim()) {
      return res.status(400).json({ error: "Missing reddit url" });
    }
    const data = await fetchRedditJsonForConvert(url.trim());
    return res.status(200).json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: msg || "Failed to convert reddit link" });
  }
}
