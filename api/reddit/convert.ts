/**
 * Vercel 独立函数：仅处理 Reddit 链接转 JSON，不加载 Express / sqlite / 大依赖，避免 FUNCTION_INVOCATION_FAILED。
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { fetchRedditJsonForConvert } from "../../lib/redditLinkConvert";

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body != null && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  const raw = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer | string) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed" });
    return;
  }
  try {
    const body = await readJsonBody(req);
    const url = typeof body.url === "string" ? body.url : "";
    if (!url.trim()) {
      json(res, 400, { error: "Missing reddit url" });
      return;
    }
    const data = await fetchRedditJsonForConvert(url.trim());
    json(res, 200, data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    json(res, 500, { error: msg || "Failed to convert reddit link" });
  }
}
