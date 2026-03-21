import express from "express";
import { Client } from "@notionhq/client";

const app = express();

app.use(express.json({ limit: "50mb" }));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/notion/export", async (req, res) => {
  try {
    const { apiKey, databaseId, report, language = 'en' } = req.body;

    if (!apiKey || !databaseId || !report) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Auto-extract database ID if user pasted a full Notion URL
    let cleanDatabaseId = databaseId.trim();
    if (cleanDatabaseId.includes("notion.so")) {
      // Match a 32-character hex string which is the Notion database ID
      const match = cleanDatabaseId.match(/([a-f0-9]{32})/i);
      if (match) {
        cleanDatabaseId = match[1];
      }
    }

    const notion = new Client({ auth: apiKey });

    const headers = language === 'zh' ? {
      summary: "1. 讨论内容总结",
      painPoints: "2. 用户痛点",
      praisedFeatures: "3. 产品特点",
      mentionedBrands: "4. 提及品牌",
      highFreqWords: "5. 高频词汇"
    } : {
      summary: "1. Discussion Summary",
      painPoints: "2. User Pain Points",
      praisedFeatures: "3. Praised Features",
      mentionedBrands: "4. Mentioned Brands/Products",
      highFreqWords: "5. High Frequency Words"
    };

    const chunkText = (text: string) => {
      if (!text) return [{ type: "text", text: { content: "" } }];
      const chunks = [];
      for (let i = 0; i < text.length; i += 2000) {
        chunks.push({
          type: "text",
          text: { content: text.substring(i, i + 2000) },
        });
      }
      return chunks;
    };

    // Create a new page in the database
    const response = await notion.pages.create({
      parent: { database_id: cleanDatabaseId },
      properties: {
        "标题": {
          title: [
            {
              text: {
                content: `Reddit Analysis Report - ${new Date().toLocaleDateString()}`.substring(0, 2000),
              },
            },
          ],
        },
        "讨论内容总结": {
          rich_text: chunkText(report.summary),
        },
        "用户痛点": {
          rich_text: chunkText((report.painPoints || []).map((p: string) => `• ${p}`).join('\n')),
        },
        "产品特点": {
          rich_text: chunkText((report.praisedFeatures || []).map((p: string) => `• ${p}`).join('\n')),
        },
        "提及品牌": {
          multi_select: (report.mentionedBrands || [])
            .filter((brand: string) => brand.trim().length > 0)
            .map((brand: string) => ({
              name: brand.replace(/,/g, '').substring(0, 100)
            })),
        },
        "高频词汇": {
          multi_select: (report.highFrequencyWords || [])
            .filter((word: string) => word.trim().length > 0)
            .map((word: string) => ({
              name: word.replace(/,/g, '').substring(0, 100)
            })),
        }
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.summary } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: chunkText(report.summary),
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.painPoints } }],
          },
        },
        ...(report.painPoints || []).map((point: string) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: chunkText(point),
          },
        })),
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.praisedFeatures } }],
          },
        },
        ...(report.praisedFeatures || []).map((feature: string) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: chunkText(feature),
          },
        })),
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.mentionedBrands } }],
          },
        },
        ...(report.mentionedBrands || []).map((brand: string) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: chunkText(brand),
          },
        })),
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: headers.highFreqWords } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: chunkText((report.highFrequencyWords || []).join(", ")),
          },
        },
      ],
    });

    res.json({ success: true, url: (response as any).url });
  } catch (error: any) {
    console.error("Notion export error:", error);
    res.status(500).json({ error: error.message || "Failed to export to Notion" });
  }
});

export default app;
