/**
 * Strategist Agent — Chat Agent + Function Calling
 *
 * 将现有的 Reddit 监控/分析/内容生成/竞品分析等功能注册为 tools，
 * 通过 Vercel AI SDK 的 generateText + tools 实现对话式调度。
 */

import {
  generateText,
  tool,
  isStepCount,
  type ModelMessage,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import {
  generateRedditAnalysisReport,
  generateContentIdeas,
  suggestSubredditsForIdeas,
} from "./llm.js";
import {
  scanSubreddit,
  scanMultipleSubreddits,
  type MonitoredPost,
} from "./redditMonitor.js";
import { readCompetitiveCache } from "../competitive/runDaily.js";

function getGoogleProvider() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  return createGoogleGenerativeAI({ apiKey });
}

const STRATEGIST_SYSTEM_PROMPT = `你是一个 AI Marketing Strategist（营销策略师）。你帮助用户完成以下任务：

1. **Reddit 社区调研**：扫描指定 subreddit 的最新帖子，分析社区讨论趋势、用户痛点、热门话题
2. **数据分析报告**：基于 Reddit 数据集生成结构化分析报告（摘要、痛点、好评特性、品牌、高频词）
3. **内容创作**：基于分析报告生成 Reddit 帖子草稿（支持多种语气：疑惑/提问/推荐/吐槽）
4. **Subreddit 推荐**：为内容创意推荐最匹配的 subreddit
5. **竞品分析**：查看 Instagram 竞品监控数据

## 工作方式
- 你通过调用工具来执行具体任务，而不是自己编造数据
- 当用户的请求涉及多个步骤时，你会按顺序调用工具并整合结果
- 你用中文回复用户，除非用户用英文提问
- 对于内容生成，你会先确认目标 subreddit 和语气，再调用工具生成

## 重要原则
- 生成的内容必须像真实 Reddit 用户写的，避免营销感
- 推荐的 subreddit 必须与内容主题匹配
- 分析结果要给出可执行的建议，不要只是罗列数据`;

export const strategistTools = {
  scan_subreddit: tool({
    description:
      "扫描一个或多个 subreddit 的最新帖子，获取帖子内容、评论、情绪分类和用户意图标注。用于了解社区最新讨论动态。",
    inputSchema: z.object({
      subreddits: z
        .array(z.string())
        .min(1)
        .describe(
          "要扫描的 subreddit 名称列表，例如 ['startups', 'SaaS']，不需要 r/ 前缀"
        ),
      limit: z
        .number()
        .min(1)
        .max(25)
        .default(10)
        .describe("每个 subreddit 获取的帖子数量"),
      useAi: z
        .boolean()
        .default(true)
        .describe("是否使用 AI 标注情绪和分类"),
    }),
    execute: async ({ subreddits, limit, useAi }) => {
      if (subreddits.length === 1) {
        const result = await scanSubreddit(subreddits[0], limit, {
          useGemini: useAi,
          aiProvider: "gemini",
        });
        return {
          subreddits: [result.subreddit],
          fetchedAt: result.fetchedAt,
          postCount: result.posts.length,
          posts: result.posts.map(summarizePost),
        };
      }
      const result = await scanMultipleSubreddits(subreddits, limit, {
        useGemini: useAi,
        aiProvider: "gemini",
      });
      return {
        subreddits: result.subreddits,
        fetchedAt: result.fetchedAt,
        postCount: result.posts.length,
        posts: result.posts.map(summarizePost),
      };
    },
  }),

  analyze_reddit_data: tool({
    description:
      "对 Reddit 帖子和评论数据进行深度分析，生成结构化报告：讨论摘要、用户痛点、被赞特性、提及品牌、高频词汇。输入是帖子/评论的纯文本数据集。",
    inputSchema: z.object({
      datasetText: z
        .string()
        .min(10)
        .describe("Reddit 帖子和评论的文本数据集"),
      language: z.enum(["en", "zh"]).default("en").describe("输出语言"),
    }),
    execute: async ({ datasetText, language }) => {
      return await generateRedditAnalysisReport(datasetText, language);
    },
  }),

  generate_content_ideas: tool({
    description:
      "基于分析报告生成 6 个 Reddit 帖子创意，包含标题、正文和推荐 subreddit。支持 4 种语气：curious（疑惑）、question（提问）、recommend（推荐）、rant（吐槽）。",
    inputSchema: z.object({
      report: z
        .object({
          summary: z.string(),
          painPoints: z.array(z.string()),
          praisedFeatures: z.array(z.string()),
          mentionedBrands: z.array(z.string()),
          highFrequencyWords: z.array(z.string()),
        })
        .describe("分析报告对象"),
      language: z.enum(["en", "zh"]).default("en").describe("输出语言"),
      tone: z
        .enum(["curious", "question", "recommend", "rant"])
        .default("question")
        .describe("帖子语气风格"),
    }),
    execute: async ({ report, language, tone }) => {
      const ideas = await generateContentIdeas(report, language, tone);
      return { tone, language, ideas };
    },
  }),

  suggest_subreddits: tool({
    description:
      "为一组内容创意推荐最匹配的 subreddit。基于内容主题、角度和正文来判断最适合发布的社区。",
    inputSchema: z.object({
      ideas: z
        .array(
          z.object({
            title: z.string(),
            angle: z.string(),
            postTitle: z.string(),
            postBody: z.string(),
            currentSuggestedSubreddit: z.string().optional(),
          })
        )
        .min(1)
        .describe("内容创意列表"),
      language: z.enum(["en", "zh"]).default("en").describe("语言"),
    }),
    execute: async ({ ideas, language }) => {
      const suggestions = await suggestSubredditsForIdeas(ideas, language);
      return {
        suggestions: ideas.map((idea, i) => ({
          title: idea.title,
          suggestedSubreddit: suggestions[i] || "r/AskReddit",
        })),
      };
    },
  }),

  get_competitive_data: tool({
    description:
      "获取 Instagram 竞品监控的最新缓存数据，包括各竞品账号的帖子、互动数据和内容分类。",
    inputSchema: z.object({}),
    execute: async () => {
      const cache = await readCompetitiveCache();
      if (!cache?.instagram) {
        return { available: false as const, message: "暂无竞品数据缓存" };
      }
      const ig = cache.instagram;
      const handles = ig.handles || [];
      const summary = handles.map((h) => {
        const posts = ig.postsByUsername?.[h.toLowerCase()] || [];
        return {
          handle: h,
          postCount: posts.length,
          recentPosts: posts.slice(0, 3).map((p) => ({
            caption: (p.caption || "").slice(0, 100),
            likes: p.likesCount,
            comments: p.commentsCount,
            type: p.type,
            timestamp: p.timestamp,
          })),
        };
      });
      return {
        available: true as const,
        fetchedAt: ig.fetchedAt,
        handles,
        summary,
      };
    },
  }),
};

function summarizePost(post: MonitoredPost) {
  return {
    title: post.title,
    subreddit: post.subreddit,
    author: post.author,
    score: post.score,
    numComments: post.numComments,
    emotion: post.emotion,
    category: post.category,
    body:
      post.body.slice(0, 300) + (post.body.length > 300 ? "..." : ""),
    intentMarks: post.intentMarks,
    topComments: post.comments.slice(0, 3).map((c) => ({
      body: c.body.slice(0, 200),
      score: c.score,
    })),
  };
}

export interface ChatResult {
  response: string;
  toolCalls: Array<{
    toolName: string;
    input: unknown;
    output: unknown;
  }>;
}

export async function chat(
  messages: ModelMessage[],
  options: { maxSteps?: number } = {}
): Promise<ChatResult> {
  const google = getGoogleProvider();
  const model = google(
    process.env.GEMINI_AGENT_MODEL || "gemini-2.5-flash"
  );

  const result = await generateText({
    model,
    system: STRATEGIST_SYSTEM_PROMPT,
    messages,
    tools: strategistTools,
    stopWhen: isStepCount(options.maxSteps ?? 5),
  });

  const toolCalls = (result.steps || []).flatMap((step) =>
    step.staticToolCalls.map((tc, i) => ({
      toolName: tc.toolName,
      input: tc.input,
      output: step.staticToolResults?.[i]?.output ?? null,
    }))
  );

  return {
    response: result.text,
    toolCalls,
  };
}
