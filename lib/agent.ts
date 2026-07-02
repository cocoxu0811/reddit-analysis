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
  generateContentFromPrompt,
  suggestSubredditsForIdeas,
} from "./llm.js";
import {
  scanSubreddit,
  scanMultipleSubreddits,
  type MonitoredPost,
} from "./redditMonitor.js";
import { readCompetitiveCache } from "../competitive/runDaily.js";
import {
  searchRedditPosts,
  extractStyleExamples,
  type RedditSearchPost,
} from "./redditSearch.js";

function formatPostAge(createdUtc: number): string {
  const days = Math.floor((Date.now() / 1000 - createdUtc) / 86400);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${(days / 365).toFixed(1)}y ago`;
}

function getGoogleProvider() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  return createGoogleGenerativeAI({ apiKey });
}

const STRATEGIST_SYSTEM_PROMPT = `你是一个 AI Marketing Strategist（营销策略师）。你帮助用户完成以下任务：

1. **Reddit 社区调研**：扫描指定 subreddit 的最新帖子，分析社区讨论趋势、用户痛点、热门话题
2. **数据分析报告**：基于 Reddit 数据集生成结构化分析报告（摘要、痛点、好评特性、品牌、高频词）
3. **内容创作**：基于分析报告或用户指令生成 Reddit 帖子草稿
4. **Subreddit 推荐**：为内容创意推荐最匹配的 subreddit
5. **竞品分析**：查看 Instagram 竞品监控数据

## 工作方式
- 你通过调用工具来执行具体任务，而不是自己编造数据
- 当用户的请求涉及多个步骤时，你会按顺序调用工具并整合结果
- 你用中文回复用户，除非用户用英文提问

## 内容生成的决策流程（重要）
当用户要求生成 Reddit 内容时，你必须遵循以下决策树：

1. 用户指定了目标 subreddit 吗？
   - 是 → 进入步骤 2
   - 否 → 先询问用户目标 subreddit，或根据主题用 suggest_subreddits 推荐

2. **先搜索再生成**：调用 search_reddit 搜索该 subreddit 中与主题相关的高赞帖子
   - 搜索目的：获取真人写作范文，学习社区的语气、用词、结构
   - 搜索关键词：从用户指令中提取核心主题词

3. 搜索完成后，将搜索结果传给 generate_content_from_prompt 作为风格参考
   - 如果搜索结果为空或太少（< 2 条），仍然生成内容，但跳过风格参考

4. 生成完成后，检查建议的 subreddit 是否合理

## 什么时候不需要搜索
- 用户明确说"不需要搜索"或"直接生成"
- 用户提供了自己的分析报告（走 generate_content_ideas 工具，已有数据支撑）
- 纯粹的数据分析、竞品查看等非内容生成任务

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

  search_reddit: tool({
    description:
      "搜索 Reddit 帖子。用于在生成内容前获取目标社区的真人帖子范文，学习写作风格和社区文化。返回帖子标题、正文、评分等信息。",
    inputSchema: z.object({
      query: z
        .string()
        .min(1)
        .describe("搜索关键词，例如 'SaaS validation' 或 'best CRM for small team'"),
      subreddit: z
        .string()
        .optional()
        .describe("限定搜索的 subreddit（不含 r/ 前缀），不传则全站搜索"),
      sort: z
        .enum(["relevance", "top", "new", "comments"])
        .default("top")
        .describe("排序方式"),
      timeRange: z
        .enum(["hour", "day", "week", "month", "year", "all"])
        .default("year")
        .describe("时间范围"),
      limit: z
        .number()
        .min(1)
        .max(15)
        .default(10)
        .describe("API 返回帖子数量（搜多一些，筛选后才有足够的高质量范文）"),
    }),
    execute: async ({ query, subreddit, sort, timeRange, limit }) => {
      const result = await searchRedditPosts(query, subreddit, sort, timeRange, limit);
      const styleExamples = extractStyleExamples(result.posts, {
        maxExamples: 3,
        minScore: 20,
        minComments: 3,
        preferRecentMonths: 3,
      });
      return {
        query: result.query,
        subreddit: result.subreddit,
        fetchedAt: result.fetchedAt,
        postCount: result.posts.length,
        qualifiedExampleCount: styleExamples.length,
        posts: result.posts.map((p) => ({
          title: p.title,
          subreddit: p.subreddit,
          author: p.author,
          score: p.score,
          numComments: p.numComments,
          ageLabel: formatPostAge(p.createdUtc),
          body: p.selftext.slice(0, 500) + (p.selftext.length > 500 ? "..." : ""),
        })),
        styleExamples,
      };
    },
  }),

  generate_content_from_prompt: tool({
    description:
      "基于用户指令和目标 subreddit 直接生成 6 条 Reddit 帖子创意。不需要分析报告。可传入从 search_reddit 获取的真人帖子范文作为风格参考，大幅提升内容的真实感。",
    inputSchema: z.object({
      subreddit: z.string().describe("目标 subreddit，例如 'r/startups'"),
      instruction: z.string().describe("用户的内容生成指令"),
      language: z.enum(["en", "zh"]).default("en").describe("输出语言"),
      tone: z
        .enum(["curious", "question", "recommend", "rant"])
        .default("question")
        .describe("帖子语气风格"),
      examplePosts: z
        .array(z.string())
        .default([])
        .describe("来自 search_reddit 的真人帖子范文，用于风格参考。每个元素是一段格式化的帖子文本。"),
    }),
    execute: async ({ subreddit, instruction, language, tone, examplePosts }) => {
      const ideas = await generateContentFromPrompt(
        subreddit,
        instruction,
        language,
        tone,
        undefined,
        examplePosts
      );
      return { subreddit, tone, language, ideas };
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
    stopWhen: isStepCount(options.maxSteps ?? 8),
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
