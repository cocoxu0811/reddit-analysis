import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_INSTAGRAM_HANDLES } from '../competitive/config';
import { CompetitiveIgCalendar } from './CompetitiveIgCalendar';
import { buildInstagramSocialDashboard, weekdayLabel } from './socialDashboard';
import {
  Upload,
  FileText,
  Settings,
  Loader2,
  Database,
  AlertCircle,
  Languages,
  LayoutTemplate,
  History,
  PenSquare,
  Sparkles,
  Rss,
  Plus,
  Minus,
  ArrowRight,
  BarChart2,
  LayoutDashboard,
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { GoogleGenAI, Type } from '@google/genai';

interface Report {
  summary: string;
  painPoints: string[];
  praisedFeatures: string[];
  mentionedBrands: string[];
  highFrequencyWords: string[];
}

interface HistoryRecord {
  id: string;
  createdAt: string;
  language: 'en' | 'zh';
  sourceType: 'link' | 'file_or_paste' | 'monitor';
  sourceLabel: string;
  inputText: string;
  report: Report;
}

/** Reddit 发帖草案：标题栏 + 正文（口语、分段、提问、TL;DR/Edit 等常见结构） */
interface TopicContent {
  postTitle: string;
  postBody: string;
  /** 仅供参考的版块方向，实际发帖前请核对各 sub 规则 */
  suggestedSubreddit?: string;
}

interface ContentIdea {
  title: string;
  angle: string;
  basedOn: string[];
  content: TopicContent;
}

interface RedditConvertResponse {
  sourceUrl: string;
  convertedAt: string;
  itemCount: number;
  items: Array<Record<string, any>>;
}

interface MonitorPostRow {
  id: string;
  title: string;
  body: string;
  url: string;
  author: string;
  createdAt: string;
  subreddit: string;
  flair: string | null;
  numComments: number;
  score: number;
  comments: Array<{ id: string; body: string; author: string; score: number }>;
  emotion: string;
  category: string;
  classificationSource: 'heuristic' | 'gemini';
  /** 旧缓存可能没有；新拉取帖文会带服务端归纳的四类句摘 */
  intentMarks?: {
    likes: string[];
    dislikes: string[];
    requests: string[];
    complaints: string[];
  };
}

/** 与 redditMonitor.monitoredPostToAnalysisJson 一致，避免客户端引入服务端模块 */
function buildMonitorJsonForAnalysis(post: MonitorPostRow): string {
  const items: Record<string, unknown>[] = [
    {
      title: post.title,
      body: post.body || '',
      communityName: post.subreddit,
      flair: post.flair || '',
      dataType: 'post',
    },
  ];
  for (const c of post.comments) {
    items.push({
      title: `Comment · u/${c.author}`,
      body: c.body,
      communityName: post.subreddit,
      flair: `score ${c.score}`,
      dataType: 'comment',
    });
  }
  return JSON.stringify(items, null, 2);
}

/** 与 <input type="date"> 一致：本地日历的 YYYY-MM-DD */
function localDateYmd(): string {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function localDayBounds(ymd: string): { startMs: number; endMs: number } | null {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd.trim())) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d, 23, 59, 59, 999);
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null;
  return { startMs, endMs };
}

/** 将时间戳格式化为本地 YYYY-MM-DD，避免 toISOString() 用 UTC 导致日期错位 */
function formatLocalYmd(ms: number): string {
  const n = new Date(ms);
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Instagram 竞品帖：按本地日期的起止时间筛选（与 localDayBounds 一致） */
function igPostPassesTimeFilter(tsStr: string, dateFrom: string, dateTo: string): boolean {
  if (!dateFrom && !dateTo) return true;
  const t = new Date(tsStr).getTime();
  if (Number.isNaN(t)) return false;
  if (dateFrom) {
    const b = localDayBounds(dateFrom);
    if (b && t < b.startMs) return false;
  }
  if (dateTo) {
    const b = localDayBounds(dateTo);
    if (b && t > b.endMs) return false;
  }
  return true;
}

function igGetBucket(
  by: Record<string, Array<Record<string, unknown>>>,
  pilot: string
): Array<Record<string, unknown>> {
  const k = pilot.toLowerCase();
  if (by[k]) return by[k];
  const f = Object.keys(by).find((x) => x.toLowerCase() === k);
  return f ? by[f] : [];
}

/** 离线演示：模拟帖子 JSON + 与之一致的分析报告（无需 Gemini / Notion） */
const DEMO_SAMPLE_JSON = JSON.stringify(
  [
    {
      title: 'Switched my 5-person team from spreadsheets to a lightweight CRM — what did I miss?',
      body:
        'We tried HubSpot free tier first but the UI felt heavy. Now testing Attio and Notion databases side by side. Biggest pain: duplicate contacts when importing from Gmail. Streak was okay but reporting is weak. Pricing jumps hard after 3 seats.',
      communityName: 'r/smallbusiness',
      flair: 'Software',
    },
    {
      title: 'Notion as a CRM: genius or ticking time bomb?',
      body:
        'Love the flexibility and templates. Hate permissions for external clients and lack of native email sync. Comments in threads get messy after 200+ rows. Considering moving pipelines back to HubSpot if we land enterprise clients.',
      communityName: 'r/Notion',
      flair: 'Discussion',
    },
    {
      title: 'Honest review after 6 months on Attio',
      body:
        'Best parts: relationship graph and clean UX. Worst: onboarding took forever, and mobile app still feels beta. Compared to Pipedrive the automation is weaker but the design is miles ahead. Support replied within 24h which matters.',
      communityName: 'r/SaaS',
      flair: 'Review',
    },
  ],
  null,
  2
);

function getDemoReport(lang: 'en' | 'zh'): Report {
  if (lang === 'zh') {
    return {
      summary:
        '讨论集中在小型团队从表格或轻量工具迁移到 CRM 的过程：用户普遍关心价格阶梯、席位限制、与 Gmail 的联系人重复导入、权限与外部协作，以及 Notion 等灵活工具在长期可维护性上的取舍。对 Attio、HubSpot、Pipedrive、Streak 等有明确对比与真实使用时长反馈。',
      painPoints: [
        '从 Gmail 导入导致联系人重复，清洗成本高',
        '免费档之后价格跳涨，小团队预算压力大',
        'Notion 做 CRM 时权限与外协流程不够顺手',
        '线索一多，评论与线程变乱，检索与复盘困难',
        '部分产品移动端体验弱，外勤场景受限',
      ],
      praisedFeatures: [
        'Attio 的关系图谱与界面清晰度被多次提及',
        'Notion 模板与灵活性适合早期流程试错',
        '客服响应速度（如 24 小时内回复）影响续费意愿',
        '与 Pipedrive 相比更现代的设计与观感',
        '轻量 CRM 比传统套件上手更快',
      ],
      mentionedBrands: ['Notion', 'HubSpot', 'Attio', 'Pipedrive', 'Streak', 'Gmail'],
      highFrequencyWords: ['CRM', 'pricing', 'permissions', 'import', 'templates', 'onboarding', 'automation'],
    };
  }
  return {
    summary:
      'Threads focus on small teams moving off spreadsheets into CRMs: pricing tiers, seat limits, duplicate contacts when importing from Gmail, external sharing permissions, and whether flexible tools like Notion scale. Attio, HubSpot, Pipedrive, and Streak are compared with concrete time-on-tool feedback.',
    painPoints: [
      'Duplicate contacts after Gmail import — cleanup is painful',
      'Sharp price jumps after free tiers for tiny teams',
      'Notion-as-CRM struggles with permissions and client workflows',
      'Threads and comments get messy past a few hundred rows',
      'Weak mobile experience for road-warrior use cases',
    ],
    praisedFeatures: [
      'Attio relationship graph and UI clarity',
      'Notion templates and flexibility for early process iteration',
      'Support response time (e.g. within 24h) driving retention',
      'More modern feel vs Pipedrive for some workflows',
      'Lightweight CRMs faster to adopt than full suites',
    ],
    mentionedBrands: ['Notion', 'HubSpot', 'Attio', 'Pipedrive', 'Streak', 'Gmail'],
    highFrequencyWords: ['CRM', 'pricing', 'permissions', 'import', 'templates', 'onboarding', 'automation'],
  };
}

function buildIdeasWithDrafts(report: Report, lang: 'en' | 'zh'): ContentIdea[] {
  const pains = report.painPoints.slice(0, 5);
  const features = report.praisedFeatures.slice(0, 5);
  const brands = report.mentionedBrands.slice(0, 5);
  const words = report.highFrequencyWords.slice(0, 5);
  const summaryHint =
    report.summary.length > 200 ? `${report.summary.slice(0, 200)}…` : report.summary;

  const ideas: ContentIdea[] = [];

  if (pains.length && features.length) {
    ideas.push({
      title:
        lang === 'zh'
          ? `从「${pains[0]}」到「${features[0]}」：用户真实需求驱动的选品指南`
          : `From “${pains[0]}” to “${features[0]}”: a practical buying guide`,
      angle:
        lang === 'zh'
          ? `用 Reddit 用户的高频痛点切入，给出可执行的产品筛选框架，再用被称赞特征验证方案有效性。`
          : `Start from recurring pain, add a lightweight selection framework, then validate with praised features.`,
      basedOn: [pains[0], features[0]],
      content:
        lang === 'zh'
          ? {
              postTitle: `纠结选型：一边被「${pains[0]}」折磨，一边又羡慕别人说的「${features[0]}」——你们怎么平衡的？`,
              postBody: `潜水挺久了，最近刷帖发现不少人跟我一样卡在同一个点：嘴上都在夸「${features[0]}」，真自己用起来却被「${pains[0]}」搞崩心态。

**背景（我整理的讨论共识）**  
${summaryHint}

**我现在的具体情况**  
• 团队不大，预算也紧，试过和 ${brands.slice(0, 2).join('、') || '几款常见工具'} 打交道，总觉得要么贵要么不顺手。  
• 我知道「${features[0]}」很重要，但不知道值不值得为了它牺牲别的（比如迁移成本、权限、协作）。

**想请教 sub 里的朋友**  
1) 你们是怎么在「少踩 ${pains[0]} 的坑」和「拿到 ${features[0]}」之间做取舍的？  
2) 有没有「低成本试错」的流程？比如先试用、再小范围上线？

**TL;DR：** 求真实经验，不要广告口吻；有好 workflow 我按评论补一版「编辑：更新」。

---  
（发帖前请读版规；若标题超长可自行缩短。）`,
              suggestedSubreddit: 'r/smallbusiness',
            }
          : {
              postTitle: `How do you balance “${pains[0]}” vs wanting “${features[0]}”? Small team, tight budget.`,
              postBody: `Long-time lurker — seeing the same tension in threads: people praise “${features[0]}” but still rant about “${pains[0]}” day-to-day.

**What I’m seeing in recent discussions (paraphrased)**  
${summaryHint}

**My situation**  
• Small team, not trying to buy an enterprise stack. Messed with ${brands.slice(0, 2).join(' / ') || 'a few tools'} and keep bouncing between price jumps and “almost there” UX.  
• I care about “${features[0]}” but not if it means ignoring “${pains[0]}” forever.

**Questions for this sub**  
1) What tradeoffs did you actually make — and what would you skip if you did it again?  
2) Any lightweight trial playbook (pilot team, migration checklist, permission gotchas)?

**TL;DR:** Looking for lived experience, not vendor pitches. Will edit the post with a summary if people share solid workflows.

---  
(Check sub rules + title length before posting.)`,
              suggestedSubreddit: 'r/smallbusiness',
            },
    });
  }

  if (pains.length >= 2) {
    ideas.push({
      title:
        lang === 'zh'
          ? `为什么用户总在抱怨「${pains[1]}」？拆解背后的使用场景与决策误区`
          : `Why people keep complaining about “${pains[1]}”: scenes and decision traps`,
      angle:
        lang === 'zh'
          ? `从抱怨词背后挖场景，分析「信息不足-预期偏差-购买后落差」的链路，并给出内容教育机会。`
          : `Trace scenes behind the rant: information gap → wrong expectation → post-purchase gap, then teach.`,
      basedOn: [pains[1]],
      content:
        lang === 'zh'
          ? {
              postTitle: `是不是只有我一个人被「${pains[1]}」坑过？想听听你们当时缺了哪条信息`,
              postBody: `开贴想聊透一点：不是单纯吐槽「${pains[1]}」，而是想搞明白——**到底哪一步信息不够，才会做出后悔的决策**。

我注意到讨论里这个词经常和 ${brands[0] || '某些产品'}、以及「${words[0] || '相关话题'}」绑在一起出现。

**我理解的链条是**  
① 触发场景 → ② 当时手里有哪些信息 → ③ 结果和预期差在哪  
（欢迎指正）

**想请大家补充真实故事**  
• 你第一次遇到「${pains[1]}」是在什么岗位/团队规模？  
• 如果重来一次，你会先查清哪三件事再问采购/老板？

**TL;DR：** 收集「信息缺口」案例，后面我整理成 checklist 发编辑更新。

**编辑：** 若版主觉得像问卷我可以改标题。`,
              suggestedSubreddit: 'r/Entrepreneur',
            }
          : {
              postTitle: `Did anyone else get burned by “${pains[1]}” because they were missing context? What would you check first next time?`,
              postBody: `Not looking for a pile-on — trying to understand *where the info gap actually is* when people hit “${pains[1]}”.

In the threads I read, it keeps showing up next to ${brands[0] || 'certain tools'} and “${words[0] || 'related keywords'}”.

**My mental model**  
1) What triggered it  
2) What you knew (and didn’t) at decision time  
3) Where reality diverged from expectations  

**Ask**  
• What role / team size were you in when it first hit?  
• If you could rerun the decision, what 3 questions would you force an answer to before buying?

**TL;DR:** Collecting “missing info” stories — I’ll edit in a checklist if this gets traction.

**Edit:** Happy to rephrase if mods want less survey-like tone.`,
              suggestedSubreddit: 'r/Entrepreneur',
            },
    });
  }

  if (features.length >= 2) {
    ideas.push({
      title:
        lang === 'zh'
          ? `用户最认可的产品特征：${features.slice(0, 2).join(' + ')} 真的更重要吗？`
          : `Most praised traits: ${features.slice(0, 2).join(' + ')} — do they actually matter more?`,
      angle:
        lang === 'zh'
          ? `对比「用户说喜欢」与「讨论频次」，提炼产品文案与页面结构应强化的卖点。`
          : `Contrast stated likes with frequency to sharpen copy and page hierarchy.`,
      basedOn: features.slice(0, 2),
      content:
        lang === 'zh'
          ? {
              postTitle: `[Discussion] 大家都在吹「${features[0]}」和「${features[1]}」，但对小团队来说优先级到底怎么排？`,
              postBody: `抛个讨论：社区里「${features[0]}」「${features[1]}」出现频率都很高，但**高频 ≠ 对你当下阶段最重要**。

一点背景（摘自近期讨论概括）：  
${summaryHint.slice(0, 160)}${report.summary.length > 160 ? '…' : ''}

**我困惑的点**  
• 如果首页/落地页只能强调一个，你会押「${features[0]}」还是「${features[1]}」？为什么？  
• ${brands.slice(0, 3).join(' / ')} 这几家，你们觉得谁在叙事上把这两个点绑得最自然？

**互动**  
欢迎用「行业 + 团队人数 + 你选的优先级」格式回复，我后面整理成对照表（会 **编辑** 到主楼）。

**TL;DR：** 求优先级，不求站队吵架。`,
              suggestedSubreddit: 'r/SaaS',
            }
          : {
              postTitle: `[Discussion] Everyone praises “${features[0]}” and “${features[1]}” — what would *you* prioritize on a tiny team?`,
              postBody: `Hot take request: both “${features[0]}” and “${features[1]}” show up constantly, but frequency ≠ what actually moves the needle for your stage.

Quick context from what people are saying lately:  
${summaryHint.slice(0, 160)}${report.summary.length > 160 ? '…' : ''}

**What I’m stuck on**  
• If your landing page can only hero *one*, which wins for you — and why?  
• Among ${brands.slice(0, 3).join(' / ')}, who ties the story together best?

**Drop answers like:** industry + headcount + your priority order. I’ll **edit** a summary table into the post if this gets replies.

**TL;DR:** Prioritization debate, not brand war.`,
              suggestedSubreddit: 'r/SaaS',
            },
    });
  }

  if (brands.length) {
    ideas.push({
      title:
        lang === 'zh'
          ? `高频被提及品牌观察：${brands.slice(0, 3).join(' / ')}`
          : `Brands in the conversation: ${brands.slice(0, 3).join(' / ')}`,
      angle:
        lang === 'zh'
          ? `不做简单榜单，而分析各品牌在讨论里对应的需求标签、用户心智与可借鉴策略。`
          : `Skip a leaderboard — map brands to demand tags, mental models, and tactics to borrow.`,
      basedOn: brands.slice(0, 3),
      content:
        lang === 'zh'
          ? {
              postTitle: `客观问一句：${brands.slice(0, 3).join(' / ')} 在解决「${pains[0] || '核心痛点'}」这件事上，各自强项/短板是啥？`,
              postBody: `不想做营销号对比表，只想从**真实使用场景**聊聊：当大家提到 ${brands.slice(0, 3).join('、')} 时，到底在解决什么问题？

**我观察到的关键词**  
和「${words[0] || '讨论里常出现的词'}」、以及「${features[0] || '被夸的特征'}」经常同框出现。

**请你按这个格式回（越具体越好）**  
• 用过哪家 / 多久  
• 最爽的一点 & 最想骂的一点  
• 如果你是竞品，会抄哪条叙事、会避开哪个坑

**TL;DR：** 求体验不谈信仰；有数据更好。

**编辑：** 若涉及具体报价请打码，避免违反 sub 规则。`,
              suggestedSubreddit: 'r/B2BSaaS',
            }
          : {
              postTitle: `Honest thread: ${brands.slice(0, 3).join(' vs ')} — what actually worked for “${pains[0] || 'your main pain'}”?`,
              postBody: `Trying to keep this non-shill. When people mention ${brands.slice(0, 3).join(', ')}, what job are they hiring those tools for?

Signals I’m seeing cluster with “${words[0] || 'common terms'}” and praise around “${features[0] || 'praised traits'}”.

**Reply template (the more specific the better)**  
• Which product + rough tenure  
• Best part / worst part  
• If you were competing, what narrative would you steal vs avoid

**TL;DR:** Experience > tribalism. Numbers welcome.

**Edit:** Redact pricing if needed to stay within sub rules.`,
              suggestedSubreddit: 'r/B2BSaaS',
            },
    });
  }

  if (words.length) {
    ideas.push({
      title:
        lang === 'zh'
          ? `从高频词「${words[0]}」出发：做一篇能转化的长文`
          : `Start from “${words[0]}”: a post built to convert`,
      angle:
        lang === 'zh'
          ? `把高频词转成内容漏斗：问题定义 → 方案对比 → 场景推荐 → 风险 → 行动建议。`
          : `Turn the term into a funnel: problem → compare → scenarios → risks → actions.`,
      basedOn: words.slice(0, 3),
      content:
        lang === 'zh'
          ? {
              postTitle: `求助：想把「${words[0]}」/${words[1] || '…'}/${words[2] || '…'} 这几个点讲清楚，又怕写成软文——怎么写才像真人？`,
              postBody: `最近在整理社区讨论，发现「${words[0]}」老是和 ${brands[0] || '某些品牌'}、以及「${pains[0] || '典型痛点'}」一起出现。

**我想讨论的是**  
不是堆功能介绍，而是：**读者到底在哪个阶段会搜 / 会焦虑这些词**？

**正文结构草案（欢迎拍砖）**  
1) 先把问题定义清楚：${words[0]} 在你行业里到底指什么  
2) 对比几种常见路径（轻量 / 标准 / 重）  
3) 哪些坑和「${pains[0] || '风险'}」强相关  
4) 给一条可执行的下一步（试用/迁移/协作）

**TL;DR：** 想写成「像 sub 里长帖」那种，不是 landing page。

**编辑：** 会按评论调整用词，避免广告感。`,
              suggestedSubreddit: 'r/marketing',
            }
          : {
              postTitle: `Help me write a *human* post about “${words[0]}” (and “${words[1] || '…'}”) without sounding like a landing page`,
              postBody: `Aggregating threads — “${words[0]}” keeps clustering with ${brands[0] || 'certain brands'} and “${pains[0] || 'the usual pain'}”.

**What I want to discuss**  
Not feature soup — *when* people actually search or stress about these terms in their workflow.

**Draft outline (tear it apart)**  
1) Define what “${words[0]}” means in your context  
2) Compare a few paths (light vs standard vs heavy)  
3) Risks tied to “${pains[0] || 'failure modes'}”  
4) One concrete next step (trial / migration / collaboration norms)

**TL;DR:** Trying to sound like a real long-form sub post, not marketing.

**Edit:** Will revise wording based on feedback.`,
              suggestedSubreddit: 'r/marketing',
            },
    });
  }

  if (pains.length && brands.length) {
    ideas.push({
      title:
        lang === 'zh'
          ? `用户痛点 × 品牌讨论：如何找到下一篇高互动选题`
          : `Pain × brand threads: finding your next high-engagement topic`,
      angle:
        lang === 'zh'
          ? `将痛点与品牌交叉，定位「高讨论、低满足」的空白主题，指导排期。`
          : `Cross pains with brands to spot high-talk, low-answer gaps for the calendar.`,
      basedOn: [pains[0], brands[0]],
      content:
        lang === 'zh'
          ? {
              postTitle: `「${pains[0]}」+「${brands[0]}」这格子里，是不是讨论很热但高质量答案很少？你们缺啥？`,
              postBody: `想做个**矩阵向**的讨论：一边是痛点（我这边最关心「${pains[0]}」），一边是品牌/产品线（比如「${brands[0]}」）。

社区里经常各说各话：有人夸「${features[0] || '某些优点'}」，但同一批人还在抱怨「${pains[0]}」没解决——我好奇这是不是典型的「热但浅」。

**想收集的评论**  
• 你觉得现有回答缺的是：对比数据？流程？还是权限/协作细节？  
• 如果只能让我写一篇深度帖，你最想先看哪类内容（算账 / 迁移 / 权限）？

**TL;DR：** 用评论告诉我「空白答案」长什么样，我整理后 **编辑** 主楼。

**编辑：** 不引战，只聊信息缺口。`,
              suggestedSubreddit: 'r/CustomerSuccess',
            }
          : {
              postTitle: `Is the “${pains[0]}” + “${brands[0]}” thread hot but shallow? What answer is still missing?`,
              postBody: `Matrix-style prompt: pain axis (“${pains[0]}”) vs brand/product line (“${brands[0]}”).

People praise “${features[0] || 'certain strengths'}” but still say “${pains[0]}” isn’t solved — sounds like a high-talk, low-depth cell.

**What I want from comments**  
• What’s missing in existing answers: data, playbooks, permissions reality?  
• If you could demand one deep post, would it be ROI, migration, or governance?

**TL;DR:** Tell me what “good enough” looks like — I’ll **edit** a summary into the OP.

**Edit:** Not trying to start a flame war — info gaps only.`,
              suggestedSubreddit: 'r/CustomerSuccess',
            },
    });
  }

  return ideas.slice(0, 6);
}

const translations = {
  en: {
    title: "Reddit Analyzer",
    dataInput: "Data Input",
    uploadText: "Upload JSON, CSV or Text file",
    pasteRedditLink: "Paste Reddit link",
    redditLinkPlaceholder: "https://www.reddit.com/r/...",
    convertToJsonBtn: "Convert to JSON",
    jsonAreaPlaceholder: "JSON data will appear here, or you can paste raw data...",
    dragDrop: "or drag and drop",
    orPaste: "or paste data",
    placeholder: "Paste your Reddit posts and comments here...",
    analyzeBtn: "Analyze Data",
    analyzingBtn: "Analyzing Data...",
    reportTitle: "Analysis Report",
    exportBtn: "Export to Notion",
    summary: "Summary of Discussions",
    painPoints: "Main User Pain Points",
    praisedFeatures: "Praised Product Features",
    mentionedBrands: "Mentioned Brands",
    highFreqWords: "High Frequency Words",
    emptyState: "Upload data and click analyze to see the report",
    settingsTitle: "Notion Export Settings",
    historyTitle: "History",
    historyEmpty: "No history yet",
    restoreHistory: "View analysis",
    clearHistory: "Clear history",
    navAnalyze: "Input & Analyze",
    navHistory: "History Data",
    navContent: "Content Generator",
    historyDetailEmpty: "Select one history item to view its report",
    contentTitle: "Topics & Reddit-style posts",
    contentEmpty: "Analyze data first, or select a history record with report.",
    regenerate: "Regenerate Ideas",
    basedOnReport: "Generated from current report",
    basedOnHistory: "Generated from selected history report",
    settingsHelp: "To export to Notion, you need an Internal Integration Token and the ID of the database you want to export to. The integration must be added to the database via the \"Share\" menu.",
    apiKeyLabel: "Notion API Key (Internal Integration Token)",
    dbIdLabel: "Database ID",
    cancel: "Cancel",
    save: "Save Settings",
    toastCsvSuccess: "CSV loaded successfully",
    toastJsonSuccess: "JSON loaded successfully",
    toastJsonError: "Invalid JSON file",
    toastFileSuccess: "File loaded successfully",
    toastLinkRequired: "Please paste a Reddit link first",
    toastConvertSuccess: "Reddit link converted to JSON",
    toastConvertFail: "Failed to convert Reddit link",
    toastNoData: "Please provide some data to analyze",
    toastAnalyzeSuccess: "Analysis complete!",
    toastAnalyzeFail: "Analysis failed",
    toastExportConfig: "Please configure Notion API Key and Database ID in settings",
    toastExportSuccess: "Successfully exported to Notion!",
    toastExportFail: "Export failed",
    toastSettingsSaved: "Settings saved",
    loadDemoBtn: "Load sample data (no API)",
    toastDemoLoaded: "Sample report loaded. Open Content Generator for blog ideas.",
    contentDraftSection: "Reddit-style title + body",
    redditPostTitleLabel: "Post title",
    redditPostBodyLabel: "Post body",
    redditSubredditHint: "Suggested sub (verify rules first)",
    navMonitor: "Subreddit monitor",
    monitorTitle: "New posts & labels",
    monitorSubredditLabel: "Subreddits",
    monitorSubredditPlaceholder: "smallbusiness",
    monitorAddSubreddit: "Add subreddit",
    monitorFetchBtn: "Fetch /new",
    monitorLoading: "Fetching…",
    monitorFetchedAt: "Last fetch",
    monitorEmotion: "Emotion",
    monitorCategory: "Type",
    monitorComments: "Comments (top excerpt)",
    monitorBody: "Post body",
    monitorUseGemini: "AI labels & user intents (needs GEMINI_API_KEY on server)",
    monitorLimit: "Max posts",
    monitorFilterAll: "All",
    monitorEmpty:
      "Enter a subreddit and tap Fetch. Production uses Apify (same APIFY_TOKEN as Instagram) so Reddit does not block cloud IPs. Without a token, local dev falls back to direct Reddit JSON.",
    monitorHelp:
      "Latest mode uses /new. By-date mode collects posts whose timestamps fall on the selected local calendar day (may paginate). Each card can Open in Analyze — run Analyze to save to History, then use Content Generator.",
    monitorCompetitiveHint:
      "For Reddit competitive listening, use this page: add target subreddits, fetch posts, then use filters and Analyze. Instagram pilot accounts are under Competitive intel.",
    monitorSourceHeuristic: "Rules",
    monitorSourceGemini: "Gemini",
    toastMonitorOk: "Feed updated",
    toastMonitorFail: "Fetch failed",
    monitorModeNew: "Latest (/new)",
    monitorModeDay: "By local date",
    monitorDateLabel: "Date",
    monitorToAnalyze: "Open in Analyze",
    toastMonitorToAnalyze: "Data filled — click Analyze to run and save to history",
    sourceMonitor: "Monitor",
    navCompetitive: "Competitive intel",
    competitiveTitle: "Instagram competitive",
    competitiveHelp:
      "Pilot brand feeds via Apify actor apify/instagram-scraper. Configure handles in .data/competitive-config.json. Requires APIFY_TOKEN.",
    competitiveSync: "Sync now",
    competitiveSyncing: "Running Apify…",
    competitiveLastRun: "Last update",
    competitiveIg: "Instagram (pilot accounts)",
    competitiveIgError: "Instagram scrape error",
    competitiveIgEmpty: "No data yet. Click Sync (requires APIFY_TOKEN in .env).",
    competitiveCronNote: "Daily: COMPETITIVE_CRON (default 06:00 Asia/Shanghai). Reddit: use Subreddit monitor.",
    competitiveLikes: "Likes",
    competitiveComments: "Comments",
    competitiveFilterAccounts: "Accounts",
    competitiveFilterDateFrom: "From",
    competitiveFilterDateTo: "To",
    competitiveFilterReset: "Reset filters",
    competitiveFilterAllAccounts: "All",
    competitiveFilterNoMatch: "No posts match the filters.",
    competitiveTagCollab: "Collab",
    competitiveTagRepost: "Repost",
    competitiveCalendarTitle: "Original posts calendar (dots)",
    competitiveCalendarPrev: "Prev",
    competitiveCalendarNext: "Next",
    competitiveCalendarWeekdays: "Dots = days with original posts only (excl. collab/repost). Colors match selected accounts.",
    competitiveCalendarLegend: "Dot colors (selected pilots)",
    monitorIntentSection: "User signals",
    monitorIntentByAi: "AI summary",
    monitorIntentByKeyword: "keyword rules",
    monitorIntentLikes: "Positive",
    monitorIntentDislikes: "Negative",
    monitorIntentRequests: "Asks / wants",
    monitorIntentComplaints: "Complaints",
    navGroupReddit: "Reddit",
    navGroupInstagram: "Instagram",
    navSocial: "Social analytics",
    socialDashTitle: "Social analytics",
    socialDashIntro:
      "Aggregated from pilot Instagram accounts (same cache as Competitive intel). Four layers: accounts, content mix, engagement, cadence.",
    socialSec1Title: "1 · Accounts",
    socialSec1PostsSample: "Posts in sample",
    socialSec1FetchAt: "IG cache time",
    socialSec1FollowersNote: "Follower counts are not in the current scrape; use account-level post volume as a proxy.",
    socialSec2Title: "2 · Content mix",
    socialSec2Kind: "Post kind",
    socialSec2Media: "Media type",
    socialSec3Title: "3 · Engagement",
    socialSec3TotalLikes: "Total likes",
    socialSec3TotalComments: "Total comments",
    socialSec3AvgLikes: "Avg likes / post (with metric)",
    socialSec3AvgComments: "Avg comments / post (with metric)",
    socialSec3ByAccount: "By account (avg)",
    socialSec4Title: "4 · Cadence & activity",
    socialSec4Span: "Date span",
    socialSec4Days: "Calendar span (days)",
    socialSec4Ppw: "Posts per week (approx.)",
    socialSec4PeakDay: "Busiest weekday",
    socialDashEmpty: "No Instagram cache yet. Open Competitive intel and run Sync, or wait for the cron job.",
    socialKindOriginal: "Original",
    socialKindCollab: "Collab",
    socialKindRepost: "Repost",
    socialKindUnknown: "Unknown",
  },
  zh: {
    title: "Reddit 数据分析器",
    dataInput: "数据输入",
    uploadText: "上传 JSON, CSV 或文本文件",
    pasteRedditLink: "粘贴 Reddit 链接",
    redditLinkPlaceholder: "https://www.reddit.com/r/...",
    convertToJsonBtn: "转化为 JSON",
    jsonAreaPlaceholder: "JSON 数据将显示在这里，您也可以直接粘贴原始数据...",
    dragDrop: "或拖拽文件到此处",
    orPaste: "或粘贴数据",
    placeholder: "在此粘贴您的 Reddit 帖子和评论...",
    analyzeBtn: "分析数据",
    analyzingBtn: "正在分析数据...",
    reportTitle: "分析报告",
    exportBtn: "导出至 Notion",
    summary: "讨论内容总结",
    painPoints: "主要用户痛点",
    praisedFeatures: "用户称赞的产品特点",
    mentionedBrands: "提及的品牌/产品",
    highFreqWords: "高频词汇",
    emptyState: "上传数据并点击分析以查看报告",
    settingsTitle: "Notion 导出设置",
    historyTitle: "历史记录",
    historyEmpty: "暂无历史记录",
    restoreHistory: "查看分析",
    clearHistory: "清空历史",
    navAnalyze: "数据输入与分析",
    navHistory: "历史数据",
    navContent: "内容生成",
    historyDetailEmpty: "请选择一条历史记录查看当时分析",
    contentTitle: "选题与 Reddit 发帖草案",
    contentEmpty: "请先完成一次分析，或在历史页选择一条有报告的数据。",
    regenerate: "重新生成",
    basedOnReport: "基于当前分析报告生成",
    basedOnHistory: "基于选中历史报告生成",
    settingsHelp: "要导出到 Notion，您需要一个内部集成令牌 (Integration Token) 以及目标数据库的 ID。必须通过“共享”菜单将集成添加到该数据库。",
    apiKeyLabel: "Notion API Key (内部集成令牌)",
    dbIdLabel: "数据库 ID",
    cancel: "取消",
    save: "保存设置",
    toastCsvSuccess: "CSV 加载成功",
    toastJsonSuccess: "JSON 加载成功",
    toastJsonError: "无效的 JSON 文件",
    toastFileSuccess: "文件加载成功",
    toastLinkRequired: "请先粘贴 Reddit 链接",
    toastConvertSuccess: "Reddit 链接已转换为 JSON",
    toastConvertFail: "Reddit 链接转换失败",
    toastNoData: "请提供要分析的数据",
    toastAnalyzeSuccess: "分析完成！",
    toastAnalyzeFail: "分析失败",
    toastExportConfig: "请在设置中配置 Notion API Key 和数据库 ID",
    toastExportSuccess: "成功导出至 Notion！",
    toastExportFail: "导出失败",
    toastSettingsSaved: "设置已保存",
    loadDemoBtn: "加载示例数据（无需 API）",
    toastDemoLoaded: "已加载示例报告，可切换到「内容生成」查看选题与角度。",
    contentDraftSection: "Reddit 标题 + 正文草案",
    redditPostTitleLabel: "帖子标题",
    redditPostBodyLabel: "正文（Text post）",
    redditSubredditHint: "参考版块（发帖前请核对版规）",
    navMonitor: "版块监控",
    monitorTitle: "新帖与分类",
    monitorSubredditLabel: "版块名",
    monitorSubredditPlaceholder: "smallbusiness",
    monitorAddSubreddit: "添加版块",
    monitorFetchBtn: "拉取最新帖",
    monitorLoading: "拉取中…",
    monitorFetchedAt: "上次拉取",
    monitorEmotion: "情绪",
    monitorCategory: "类别",
    monitorComments: "评论摘录",
    monitorBody: "帖子正文",
    monitorUseGemini: "使用 AI 标注情绪/类别与用户倾向（需服务端 GEMINI_API_KEY）",
    monitorLimit: "最多帖数",
    monitorFilterAll: "全部",
    monitorEmpty:
      "输入版块名并点击拉取。线上默认经 Apify 拉取（与 Instagram 竞品共用 APIFY_TOKEN），避免 Reddit 拦截云出口；本地未配置 Token 时仍直连 Reddit JSON。请勿过高频率请求。",
    monitorHelp:
      "「最新帖」走 /new；「按本地日期」只收录所选日 0:00～23:59 内发布的帖（会分页）。每条可点「去分析」填入分析页；分析成功后会写入历史，再去「内容生成」即可。",
    monitorCompetitiveHint:
      "Reddit 侧竞品声量请在本页完成：添加目标版块 → 拉取帖子 → 用筛选与「去分析」。Instagram 试点账号在「竞品监控」页查看。",
    monitorSourceHeuristic: "规则",
    monitorSourceGemini: "Gemini",
    toastMonitorOk: "已更新列表",
    toastMonitorFail: "拉取失败",
    monitorModeNew: "最新帖 (/new)",
    monitorModeDay: "按本地日期",
    monitorDateLabel: "选择日期",
    monitorToAnalyze: "去分析",
    toastMonitorToAnalyze: "已填入数据，请点击「分析数据」生成报告并写入历史",
    sourceMonitor: "监控",
    navCompetitive: "竞品监控",
    competitiveTitle: "Instagram 竞品",
    competitiveHelp:
      "试点品牌动态，经 Apify「apify/instagram-scraper」拉取；账号列表可在 .data/competitive-config.json 覆盖。需配置 APIFY_TOKEN。",
    competitiveSync: "立即同步",
    competitiveSyncing: "正在执行 Apify…",
    competitiveLastRun: "最近更新",
    competitiveIg: "Instagram（试点账号）",
    competitiveIgError: "Instagram 拉取错误",
    competitiveIgEmpty: "暂无数据。请点击同步（需在 .env 配置 APIFY_TOKEN）。",
    competitiveCronNote: "定时任务：COMPETITIVE_CRON（默认每日 6:00 北京时间）。Reddit 请用「版块监控」。",
    competitiveLikes: "点赞",
    competitiveComments: "评论数",
    competitiveFilterAccounts: "试点账号",
    competitiveFilterDateFrom: "开始日期",
    competitiveFilterDateTo: "结束日期",
    competitiveFilterReset: "重置筛选",
    competitiveFilterAllAccounts: "全选",
    competitiveFilterNoMatch: "当前筛选下没有符合条件的帖子。",
    competitiveTagCollab: "协作",
    competitiveTagRepost: "转发",
    competitiveCalendarTitle: "原创发帖日历（彩色点）",
    competitiveCalendarPrev: "上月",
    competitiveCalendarNext: "下月",
    competitiveCalendarWeekdays: "圆点表示当日有原创帖（不含协作/转发）；颜色与下方勾选的试点账号对应。",
    competitiveCalendarLegend: "圆点颜色说明（已选账号）",
    monitorIntentSection: "用户倾向",
    monitorIntentByAi: "AI 归纳",
    monitorIntentByKeyword: "关键词规则",
    monitorIntentLikes: "喜欢",
    monitorIntentDislikes: "不喜欢",
    monitorIntentRequests: "诉求",
    monitorIntentComplaints: "抱怨",
    navGroupReddit: "Reddit",
    navGroupInstagram: "Instagram",
    navSocial: "社媒分析",
    socialDashTitle: "社媒分析",
    socialDashIntro:
      "基于 Instagram 试点账号缓存（与「竞品监控」同源）。四个维度：账号层、内容层、互动指标、节奏与活动。",
    socialSec1Title: "一、账号层",
    socialSec1PostsSample: "样本内发帖数",
    socialSec1FetchAt: "缓存时间",
    socialSec1FollowersNote: "当前拉取未含粉丝数，可用样本内发帖量作横向对比参考。",
    socialSec2Title: "二、内容结构",
    socialSec2Kind: "帖子类型",
    socialSec2Media: "媒体类型",
    socialSec3Title: "三、互动指标",
    socialSec3TotalLikes: "总点赞",
    socialSec3TotalComments: "总评论",
    socialSec3AvgLikes: "均赞（有数据的帖）",
    socialSec3AvgComments: "均评（有数据的帖）",
    socialSec3ByAccount: "分账号均值",
    socialSec4Title: "四、节奏与活动",
    socialSec4Span: "日期范围",
    socialSec4Days: "跨度（天）",
    socialSec4Ppw: "约每周发帖",
    socialSec4PeakDay: "发帖最多星期",
    socialDashEmpty: "暂无 Instagram 数据。请在「竞品监控」中同步，或等待定时任务。",
    socialKindOriginal: "原创",
    socialKindCollab: "协作",
    socialKindRepost: "转发",
    socialKindUnknown: "未标注",
  }
};

export default function App() {
  const HISTORY_STORAGE_KEY = 'redditAnalysisHistory';
  const [language, setLanguage] = useState<'en' | 'zh'>('zh');
  const [activePage, setActivePage] = useState<
    'analyze' | 'history' | 'content' | 'monitor' | 'competitive' | 'social'
  >('analyze');
  const [inputText, setInputText] = useState('');
  const [redditUrl, setRedditUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => {
    try {
      const raw = localStorage.getItem('redditAnalysisHistory');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [notionApiKey, setNotionApiKey] = useState(localStorage.getItem('notionApiKey') || '');
  const [notionDbId, setNotionDbId] = useState(localStorage.getItem('notionDbId') || '');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [monitorSubreddits, setMonitorSubreddits] = useState<string[]>(() => {
    try {
      const j = localStorage.getItem('monitorSubreddits');
      if (j) {
        const parsed = JSON.parse(j) as unknown;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((x) => String(x));
        }
      }
      const legacy = localStorage.getItem('monitorSubreddit');
      if (legacy?.trim()) return [legacy.trim()];
    } catch {
      /* ignore */
    }
    return [''];
  });
  const [monitorLimit, setMonitorLimit] = useState(12);
  const [monitorUseGemini, setMonitorUseGemini] = useState(false);
  const [monitorPosts, setMonitorPosts] = useState<MonitorPostRow[]>([]);
  const [monitorFetchedAt, setMonitorFetchedAt] = useState<string | null>(null);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedMonitorId, setExpandedMonitorId] = useState<string | null>(null);
  const [monitorMode, setMonitorMode] = useState<'new' | 'day'>('new');
  const [monitorDay, setMonitorDay] = useState(() => localDateYmd());
  const monitorSubredditsRef = useRef(monitorSubreddits);
  monitorSubredditsRef.current = monitorSubreddits;
  /** 从板块监控「去分析」带入；分析成功写入历史后清空 */
  const [pendingMonitorMeta, setPendingMonitorMeta] = useState<{ label: string } | null>(null);
  const [competitiveCache, setCompetitiveCache] = useState<Record<string, unknown> | null>(null);
  const [competitiveLoading, setCompetitiveLoading] = useState(false);
  const [competitiveSyncing, setCompetitiveSyncing] = useState(false);
  /** Instagram 竞品：按账号勾选（key 小写）；缺省为 true */
  const [igFilterSelections, setIgFilterSelections] = useState<Record<string, boolean>>({});
  const [igDateFrom, setIgDateFrom] = useState('');
  const [igDateTo, setIgDateTo] = useState('');
  const [igCalendarMonth, setIgCalendarMonth] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });

  const t = translations[language];
  const socialDashboard = useMemo(() => {
    const ig = competitiveCache?.instagram;
    if (!ig || typeof ig !== 'object') return null;
    return buildInstagramSocialDashboard(
      ig as {
        fetchedAt?: string;
        handles?: string[];
        postsByUsername?: Record<string, Array<Record<string, unknown>>>;
      }
    );
  }, [competitiveCache]);
  const selectedHistory = historyRecords.find((x) => x.id === selectedHistoryId) || null;
  const contentSourceReport = report || selectedHistory?.report || null;

  useEffect(() => {
    const syncHistoryFromBackend = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (res.ok && Array.isArray(data.records)) {
          setHistoryRecords(data.records);
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data.records));
        }
      } catch {
        // keep local cache fallback
      }
    };
    syncHistoryFromBackend();
  }, []);

  useEffect(() => {
    const loadMonitorCache = async () => {
      try {
        const res = await fetch('/api/monitor/cache');
        const data = await res.json();
        if (Array.isArray(data.posts)) {
          setMonitorPosts(data.posts);
          setMonitorFetchedAt(data.fetchedAt || null);
          if (data.mode === 'day' && data.dayRange?.startMs) {
            setMonitorMode('day');
            setMonitorDay(formatLocalYmd(Number(data.dayRange.startMs)));
          } else if (data.mode === 'new') {
            setMonitorMode('new');
          }
          if (Array.isArray(data.subreddits) && data.subreddits.length > 0) {
            setMonitorSubreddits(data.subreddits.map((s: string) => String(s)));
          } else if (data.subreddit && typeof data.subreddit === 'string') {
            setMonitorSubreddits([data.subreddit]);
          }
        }
      } catch {
        /* ignore */
      }
    };
    loadMonitorCache();
  }, []);

  useEffect(() => {
    if (activePage !== 'competitive' && activePage !== 'social') return;
    let cancelled = false;
    setCompetitiveLoading(true);
    fetch('/api/competitive/cache')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success) setCompetitiveCache((data.cache as Record<string, unknown>) ?? null);
      })
      .catch(() => {
        if (!cancelled) setCompetitiveCache(null);
      })
      .finally(() => {
        if (!cancelled) setCompetitiveLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activePage]);

  useEffect(() => {
    const ig = competitiveCache?.instagram as { handles?: string[] } | undefined;
    const pilotList = (ig?.handles && ig.handles.length > 0 ? ig.handles : [...DEFAULT_INSTAGRAM_HANDLES]).map((h) =>
      String(h).toLowerCase()
    );
    setIgFilterSelections((prev) => {
      const next: Record<string, boolean> = { ...prev };
      for (const k of pilotList) {
        if (next[k] === undefined) next[k] = true;
      }
      for (const key of Object.keys(next)) {
        if (!pilotList.includes(key)) delete next[key];
      }
      return next;
    });
  }, [competitiveCache]);

  useEffect(() => {
    const selected = historyRecords.find((x) => x.id === selectedHistoryId) || null;
    const src = report || selected?.report || null;
    if (!src) {
      setContentIdeas([]);
      return;
    }
    setContentIdeas(buildIdeasWithDrafts(src, language));
  }, [language, report, selectedHistoryId, historyRecords]);

  const persistHistory = (nextRecords: HistoryRecord[]) => {
    setHistoryRecords(nextRecords);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextRecords));
  };

  const saveHistoryRecord = (newRecord: HistoryRecord) => {
    const deduped = historyRecords.filter((x) => x.id !== newRecord.id);
    const next = [newRecord, ...deduped].slice(0, 30);
    persistHistory(next);
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record: newRecord }),
    }).catch(() => {
      // keep local history when backend unavailable
    });
  };

  const handleRestoreHistory = (record: HistoryRecord) => {
    setLanguage(record.language);
    setInputText(record.inputText);
    setReport(record.report);
    if (record.sourceType === 'link' || record.sourceType === 'monitor') {
      setRedditUrl(record.sourceLabel);
    }
    setPendingMonitorMeta(null);
    setSelectedHistoryId(record.id);
    setActivePage('history');
  };

  const handleClearHistory = () => {
    persistHistory([]);
    fetch('/api/history', { method: 'DELETE' }).catch(() => {
      // keep local clear when backend unavailable
    });
  };

  const generateContentIdeas = (baseReport: Report | null) => {
    if (!baseReport) {
      setContentIdeas([]);
      return;
    }
    setContentIdeas(buildIdeasWithDrafts(baseReport, language));
  };

  const toAnalysisText = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    try {
      const parsed = JSON.parse(trimmed);
      const sourceArray = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.items)
          ? parsed.items
          : [parsed];
      return sourceArray
        .map((item: any) => {
          if (typeof item !== 'object' || item === null) return String(item);
          if ('title' in item || 'body' in item) {
            return [item.title, item.body, item.communityName, item.flair]
              .filter(Boolean)
              .join(' ');
          }
          return Object.values(item).join(' ');
        })
        .join('\n');
    } catch {
      return trimmed;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setInputText(JSON.stringify(json, null, 2));
          setPendingMonitorMeta(null);
          toast.success(t.toastJsonSuccess);
        } catch (error) {
          toast.error(t.toastJsonError);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        complete: (results) => {
          const text = results.data.map((row: any) => Object.values(row).join(' ')).join('\n');
          setInputText(text);
          setPendingMonitorMeta(null);
          toast.success(t.toastCsvSuccess);
        },
        error: (error) => {
          toast.error(`${t.toastAnalyzeFail}: ${error.message}`);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target?.result as string);
        setPendingMonitorMeta(null);
        toast.success(t.toastFileSuccess);
      };
      reader.readAsText(file);
    }
  };

  const handleConvertRedditLink = async () => {
    if (!redditUrl.trim()) {
      toast.error(t.toastLinkRequired);
      return;
    }
    setIsConverting(true);
    try {
      const response = await fetch('/api/reddit/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: redditUrl.trim() }),
      });
      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await response.text();
        throw new Error(
          text.slice(0, 120) || `Expected JSON, got ${ct || 'unknown'} (HTTP ${response.status})`
        );
      }
      const data = (await response.json()) as RedditConvertResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'convert failed');
      }
      setInputText(JSON.stringify(data, null, 2));
      setPendingMonitorMeta(null);
      toast.success(t.toastConvertSuccess);
    } catch (error: any) {
      toast.error(`${t.toastConvertFail}: ${error.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleLoadDemo = () => {
    setRedditUrl('');
    setInputText(DEMO_SAMPLE_JSON);
    setReport(getDemoReport(language));
    setPendingMonitorMeta(null);
    toast.success(t.toastDemoLoaded);
  };

  const handleAnalyze = async () => {
    const normalizedInput = toAnalysisText(inputText);
    if (!normalizedInput.trim()) {
      toast.error(t.toastNoData);
      return;
    }

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Analyze the following Reddit dataset (posts and comments) and provide a structured report based on this framework:
        1. Summary: Summarize the discussions in these posts and comments.
        2. Pain Points: Main user pain points, most frequent complaints or issues.
        3. Praised Features: Product features users recommend or praise (functionality, design, appearance, etc.).
        4. Mentioned Brands: Most frequently mentioned products or brand names.
        5. High Frequency Words: Most commonly used vocabulary or high-frequency words when describing products and issues.

        IMPORTANT: The final output MUST be in ${language === 'zh' ? 'Simplified Chinese' : 'English'}.

        Dataset:
        ${normalizedInput.substring(0, 30000)} // Truncating to avoid token limits if too large
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Summary of discussions" },
              painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Main user pain points" },
              praisedFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Praised product features" },
              mentionedBrands: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mentioned brands or products" },
              highFrequencyWords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High frequency words" }
            },
            required: ["summary", "painPoints", "praisedFeatures", "mentionedBrands", "highFrequencyWords"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsedReport = JSON.parse(resultText) as Report;
        setReport(parsedReport);
        const fromMonitor = Boolean(pendingMonitorMeta);
        const hasUrl = Boolean(redditUrl.trim());
        const record: HistoryRecord = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          language,
          sourceType: fromMonitor ? 'monitor' : hasUrl ? 'link' : 'file_or_paste',
          sourceLabel: fromMonitor ? pendingMonitorMeta!.label : hasUrl ? redditUrl.trim() : 'manual_input',
          inputText,
          report: parsedReport,
        };
        saveHistoryRecord(record);
        setPendingMonitorMeta(null);
        toast.success(t.toastAnalyzeSuccess);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`${t.toastAnalyzeFail}: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportToNotion = async () => {
    if (!report) return;
    if (!notionApiKey || !notionDbId) {
      toast.error(t.toastExportConfig);
      setShowSettings(true);
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch('/api/notion/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: notionApiKey,
          databaseId: notionDbId,
          report,
          language
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t.toastExportSuccess);
      } else {
        throw new Error(data.error || 'Failed to export');
      }
    } catch (error: any) {
      toast.error(`${t.toastExportFail}: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('notionApiKey', notionApiKey);
    localStorage.setItem('notionDbId', notionDbId);
    setShowSettings(false);
    toast.success(t.toastSettingsSaved);
  };

  const openMonitorPostForAnalyze = (post: MonitorPostRow) => {
    setPendingMonitorMeta({ label: post.url });
    setInputText(buildMonitorJsonForAnalysis(post));
    setRedditUrl(post.url);
    setReport(null);
    setActivePage('analyze');
    toast.success(t.toastMonitorToAnalyze);
  };

  const handleMonitorScan = async () => {
    const rows = monitorSubredditsRef.current;
    const subs = rows
      .map((s) => s.replace(/[\u200b\ufeff]/g, '').trim())
      .map((s) => s.replace(/^r\//i, '').trim())
      .filter(Boolean);
    if (subs.length === 0) {
      toast.error(language === 'zh' ? '请至少填写一个版块名' : 'Enter at least one subreddit');
      return;
    }
    if (monitorMode === 'day') {
      const bounds = localDayBounds(monitorDay);
      if (!bounds) {
        toast.error(language === 'zh' ? '请选择有效日期' : 'Pick a valid date');
        return;
      }
    }
    localStorage.setItem('monitorSubreddits', JSON.stringify(subs));
    setMonitorLoading(true);
    try {
      const body: Record<string, unknown> = {
        subreddits: subs,
        subreddit: subs[0],
        limit: monitorLimit,
        useGemini: monitorUseGemini,
        mode: monitorMode,
      };
      if (monitorMode === 'day') {
        const b = localDayBounds(monitorDay)!;
        body.dayStartMs = b.startMs;
        body.dayEndMs = b.endMs;
      }
      const res = await fetch('/api/monitor/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Request failed');
      }
      setMonitorPosts(Array.isArray(data.posts) ? data.posts : []);
      setMonitorFetchedAt(data.fetchedAt || null);
      if (data.mode === 'day' && data.dayRange?.startMs) {
        setMonitorMode('day');
        setMonitorDay(formatLocalYmd(Number(data.dayRange.startMs)));
      } else if (data.mode === 'new') {
        setMonitorMode('new');
      }
      if (Array.isArray(data.subreddits) && data.subreddits.length > 0) {
        setMonitorSubreddits(data.subreddits.map((s: string) => String(s)));
        localStorage.setItem('monitorSubreddits', JSON.stringify(data.subreddits));
      }
      toast.success(t.toastMonitorOk);
    } catch (error: any) {
      toast.error(`${t.toastMonitorFail}: ${error.message}`);
    } finally {
      setMonitorLoading(false);
    }
  };

  const handleCompetitiveSync = async () => {
    setCompetitiveSyncing(true);
    const parseJsonOrThrow = async (res: Response, label: string) => {
      const text = await res.text();
      if (!text.trim()) {
        throw new Error(
          language === 'zh'
            ? '响应为空：请确认访问的是 http://localhost:3000（npm run dev / tsx server.ts），不要单独用仅 Vite 的端口。'
            : 'Empty response: open the app at http://localhost:3000 (npm run dev), not a Vite-only dev port.'
        );
      }
      try {
        return JSON.parse(text) as Record<string, unknown>;
      } catch {
        throw new Error(
          language === 'zh'
            ? `${label}：服务器返回非 JSON（HTTP ${res.status}）。若部署在 Vercel，请查看 Functions 日志；Apify 仍在后台运行时请等待下方轮询。`
            : `${label}: Non-JSON (HTTP ${res.status}). Check Vercel function logs.`
        );
      }
    };

    try {
      const startRes = await fetch('/api/competitive/sync', { method: 'POST', cache: 'no-store' });
      const startData = await parseJsonOrThrow(startRes, language === 'zh' ? '启动同步' : 'Start sync');
      if (!startRes.ok || !startData.success) {
        throw new Error(String(startData.error || 'Sync start failed'));
      }
      const runId = typeof startData.runId === 'string' ? startData.runId : '';
      if (!runId) {
        throw new Error(language === 'zh' ? '未返回 runId' : 'Missing runId');
      }

      /** Apify 在云端执行数分钟；后端用短请求轮询，避免单 HTTP 超过 Vercel 限时 */
      const maxPolls = 200;
      const intervalMs = 3000;
      for (let i = 0; i < maxPolls; i++) {
        if (i > 0) {
          await new Promise((r) => setTimeout(r, intervalMs));
        }
        const pollRes = await fetch(`/api/competitive/sync?runId=${encodeURIComponent(runId)}`, {
          cache: 'no-store',
        });
        const pollData = await parseJsonOrThrow(pollRes, language === 'zh' ? '轮询状态' : 'Poll');
        if (!pollRes.ok || !pollData.success) {
          throw new Error(String(pollData.error || 'Poll failed'));
        }
        if (pollData.phase === 'done' && pollData.cache) {
          setCompetitiveCache(pollData.cache as Record<string, unknown>);
          const ig = pollData.cache as { instagram?: { error?: string } };
          if (ig.instagram?.error) {
            toast.error(language === 'zh' ? ig.instagram.error : ig.instagram.error);
          } else {
            toast.success(language === 'zh' ? '竞品数据已更新' : 'Competitive cache updated');
          }
          return;
        }
        if (pollData.phase !== 'running') {
          throw new Error(String(pollData.error || 'Unexpected poll response'));
        }
      }
      throw new Error(
        language === 'zh'
          ? '轮询超时（约 10 分钟）：请稍后重试或到 Apify Console 查看 Run 是否仍在执行。'
          : 'Polling timed out (~10 min). Retry or check the run in Apify Console.'
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(language === 'zh' ? `同步失败: ${msg}` : `Sync failed: ${msg}`);
    } finally {
      setCompetitiveSyncing(false);
    }
  };

  const filteredMonitorPosts = monitorPosts.filter((p) => {
    if (filterEmotion !== 'all' && p.emotion !== filterEmotion) return false;
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    return true;
  });

  const emotionBadgeClass = (e: string) => {
    const map: Record<string, string> = {
      疑惑: 'bg-sky-100 text-sky-900 border-sky-200 shadow-sm',
      生气: 'bg-red-100 text-red-900 border-red-200 shadow-sm',
      兴奋: 'bg-amber-100 text-amber-900 border-amber-200 shadow-sm',
      失望: 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm',
      讽刺: 'bg-violet-100 text-violet-900 border-violet-200 shadow-sm',
      中性: 'bg-stone-100 text-stone-700 border-stone-200 shadow-sm',
    };
    return map[e] || map['中性'];
  };

  const categoryBadgeClass = (c: string) => {
    const map: Record<string, string> = {
      推荐: 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-sm',
      吐槽: 'bg-orange-50 text-orange-900 border-orange-200 shadow-sm',
      讨论: 'bg-blue-50 text-blue-900 border-blue-200 shadow-sm',
      求助: 'bg-cyan-50 text-cyan-900 border-cyan-200 shadow-sm',
      展示: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200 shadow-sm',
    };
    return map[c] || 'bg-stone-50 text-stone-800 border-stone-200';
  };

  const contentIdeaTagClass = (i: number) => {
    const styles = [
      'bg-reddit-100 text-reddit-900 border border-reddit-200/90',
      'bg-emerald-100 text-emerald-900 border border-emerald-200/90',
      'bg-sky-100 text-sky-900 border border-sky-200/90',
      'bg-violet-100 text-violet-900 border border-violet-200/90',
      'bg-amber-100 text-amber-950 border border-amber-200/90',
    ];
    return styles[i % styles.length];
  };

  const renderReportContent = (reportData: Report | null, showExport: boolean) => (
    reportData ? (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold tracking-tight">{t.reportTitle}</h2>
          {showExport && (
            <button
              onClick={handleExportToNotion}
              disabled={isExporting}
              className="px-4 py-2 bg-reddit-700 hover:bg-reddit-800 disabled:bg-reddit-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-reddit-900/15"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {t.exportBtn}
            </button>
          )}
        </div>

        <div className="bg-sky-50 border border-sky-100 border-l-4 border-l-sky-500 p-6 rounded-2xl shadow-sm ring-1 ring-sky-200/40">
          <h3 className="text-sky-900 font-semibold mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              1
            </span>
            {t.summary}
          </h3>
          <p className="text-sky-950/90 text-sm leading-relaxed">{reportData.summary}</p>
        </div>

        <div className="bg-rose-50 border border-rose-100 border-l-4 border-l-rose-500 p-6 rounded-2xl shadow-sm ring-1 ring-rose-200/40">
          <h3 className="text-rose-900 font-semibold mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              2
            </span>
            {t.painPoints}
          </h3>
          <ul className="space-y-2">
            {reportData.painPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-950/90">
                <span className="text-rose-500 mt-1 font-bold">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 border-l-4 border-l-emerald-500 p-6 rounded-2xl shadow-sm ring-1 ring-emerald-200/40">
          <h3 className="text-emerald-900 font-semibold mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              3
            </span>
            {t.praisedFeatures}
          </h3>
          <ul className="space-y-2">
            {reportData.praisedFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-950/90">
                <span className="text-emerald-500 mt-1 font-bold">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-violet-50 border border-violet-100 border-l-4 border-l-violet-500 p-6 rounded-2xl shadow-sm ring-1 ring-violet-200/40">
            <h3 className="text-violet-900 font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                4
              </span>
              {t.mentionedBrands}
            </h3>
            <div className="flex flex-wrap gap-2">
              {reportData.mentionedBrands.map((brand, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-violet-200/80 text-violet-950 border border-violet-300/60 shadow-sm"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 border-l-4 border-l-amber-500 p-6 rounded-2xl shadow-sm ring-1 ring-amber-200/40">
            <h3 className="text-amber-950 font-semibold mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                5
              </span>
              {t.highFreqWords}
            </h3>
            <div className="flex flex-wrap gap-2">
              {reportData.highFrequencyWords.map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-200/90 text-amber-950 border border-amber-400/50 shadow-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-stone-400 space-y-4 py-20 border-2 border-dashed border-stone-200 rounded-2xl bg-[#F9F8F6]/50">
        <FileText className="w-12 h-12 text-stone-300" />
        <p>{t.emptyState}</p>
      </div>
    )
  );

  return (
    <div className="h-screen bg-gradient-to-b from-reddit-50/60 via-[#F9F8F6] to-insta-50/30 text-stone-900 font-sans flex flex-col overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200/90 shrink-0">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-reddit-600 to-reddit-800 rounded-lg flex items-center justify-center shadow-md shadow-reddit-900/25 ring-1 ring-white/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-stone-800">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(lang => lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-200 rounded-full transition-colors"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? '中' : 'EN'}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-stone-500 hover:bg-stone-200 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 shrink-0 border-r border-stone-200/90 bg-white/95 backdrop-blur-sm p-4 overflow-y-auto shadow-[2px_0_12px_-4px_rgba(124,45,18,0.08)]">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-reddit-800 bg-reddit-100 rounded-md px-2 py-1 mb-2 inline-block">
                {t.navGroupReddit}
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActivePage('monitor')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === 'monitor'
                      ? 'bg-reddit-700 text-white shadow-md shadow-reddit-900/20 ring-1 ring-reddit-500/40'
                      : 'text-stone-700 hover:bg-reddit-50'
                  }`}
                >
                  <Rss className="w-4 h-4 shrink-0" />
                  {t.navMonitor}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('analyze')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === 'analyze'
                      ? 'bg-reddit-700 text-white shadow-md shadow-reddit-900/20 ring-1 ring-reddit-500/40'
                      : 'text-stone-700 hover:bg-reddit-50'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4 shrink-0" />
                  {t.navAnalyze}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('history')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === 'history'
                      ? 'bg-reddit-700 text-white shadow-md shadow-reddit-900/20 ring-1 ring-reddit-500/40'
                      : 'text-stone-700 hover:bg-reddit-50'
                  }`}
                >
                  <History className="w-4 h-4 shrink-0" />
                  {t.navHistory}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('content')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === 'content'
                      ? 'bg-reddit-700 text-white shadow-md shadow-reddit-900/20 ring-1 ring-reddit-500/40'
                      : 'text-stone-700 hover:bg-reddit-50'
                  }`}
                >
                  <PenSquare className="w-4 h-4 shrink-0" />
                  {t.navContent}
                </button>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-insta-900 bg-insta-100 rounded-md px-2 py-1 mb-2 inline-block">
                {t.navGroupInstagram}
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActivePage('competitive')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === 'competitive'
                      ? 'bg-insta-700 text-white shadow-md shadow-insta-900/25 ring-1 ring-insta-400/40'
                      : 'text-stone-700 hover:bg-insta-50'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 shrink-0" />
                  {t.navCompetitive}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('social')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === 'social'
                      ? 'bg-insta-700 text-white shadow-md shadow-insta-900/25 ring-1 ring-insta-400/40'
                      : 'text-stone-700 hover:bg-insta-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {t.navSocial}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {activePage === 'analyze' ? (
          <section className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col">
              <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-6">
                <h2 className="text-lg font-medium flex items-center gap-2 text-stone-800 shrink-0">
                  <FileText className="w-5 h-5 text-stone-600" />
                  {t.dataInput}
                </h2>

                <div className="flex-1 flex flex-col space-y-4">
                  <div className="shrink-0 border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".csv,.txt,.json"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-stone-700">{t.uploadText}</p>
                    <p className="text-xs text-stone-500 mt-1">{t.dragDrop}</p>
                  </div>

                  <div className="shrink-0 border border-stone-200 rounded-xl p-4 bg-white">
                    <p className="text-xs text-stone-500 mb-2">{t.pasteRedditLink}</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={redditUrl}
                        onChange={(e) => setRedditUrl(e.target.value)}
                        placeholder={t.redditLinkPlaceholder}
                        className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-reddit-500/40 focus:border-reddit-500 text-sm bg-white"
                      />
                      <button
                        onClick={handleConvertRedditLink}
                        disabled={isConverting}
                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 disabled:bg-stone-100 text-stone-700 rounded-lg text-sm font-medium whitespace-nowrap"
                      >
                        {isConverting ? <Loader2 className="w-4 h-4 animate-spin" /> : t.convertToJsonBtn}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-stone-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-stone-500 uppercase tracking-wider">{t.orPaste}</span>
                    </div>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.jsonAreaPlaceholder}
                    className="w-full flex-1 min-h-[200px] p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-reddit-500/40 focus:border-reddit-500 resize-none text-sm bg-white shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={handleLoadDemo}
                    className="shrink-0 w-full py-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    {t.loadDemoBtn}
                  </button>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="shrink-0 w-full py-3.5 bg-reddit-700 hover:bg-reddit-800 disabled:bg-reddit-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-md shadow-reddit-900/20 ring-1 ring-reddit-500/30"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.analyzingBtn}
                      </>
                    ) : (
                      t.analyzeBtn
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto bg-white">
              <div className="max-w-2xl mx-auto w-full h-full">
                {renderReportContent(report, true)}
              </div>
            </div>
          </section>
        ) : activePage === 'history' ? (
          <section className="flex-1 p-6 lg:p-8 overflow-hidden bg-[#F9F8F6]">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-full">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium text-stone-800">{t.historyTitle}</h2>
                  <button onClick={handleClearHistory} className="text-xs text-stone-500 hover:text-stone-700">
                    {t.clearHistory}
                  </button>
                </div>
                {historyRecords.length === 0 ? (
                  <p className="text-sm text-stone-400">{t.historyEmpty}</p>
                ) : (
                  <div className="space-y-2">
                    {historyRecords.map((record) => (
                      <button
                        key={record.id}
                        onClick={() => setSelectedHistoryId(record.id)}
                        className={`w-full text-left p-3 border rounded-lg transition-colors ${
                          selectedHistoryId === record.id
                            ? 'border-reddit-600 bg-reddit-50 ring-1 ring-reddit-200/70 shadow-sm'
                            : 'border-stone-200 hover:bg-reddit-50/40 hover:border-reddit-200'
                        }`}
                      >
                        <div className="text-xs text-stone-500 mb-1">{new Date(record.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-stone-800 line-clamp-1">
                          {record.sourceType === 'link'
                            ? record.sourceLabel
                            : record.sourceType === 'monitor'
                              ? `${t.sourceMonitor} · ${record.sourceLabel}`
                              : t.restoreHistory}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 overflow-y-auto">
                {selectedHistory ? (
                  <>
                    <div className="mb-4 text-xs text-stone-500">
                      {new Date(selectedHistory.createdAt).toLocaleString()} ·{' '}
                      {selectedHistory.sourceType === 'link'
                        ? selectedHistory.sourceLabel
                        : selectedHistory.sourceType === 'monitor'
                          ? `${t.sourceMonitor} · ${selectedHistory.sourceLabel}`
                          : 'manual_input'}
                    </div>
                    {renderReportContent(selectedHistory.report, false)}
                  </>
                ) : (
                  <div className="h-full min-h-[300px] flex items-center justify-center text-stone-400">
                    {t.historyDetailEmpty}
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : activePage === 'content' ? (
          <section className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">{t.contentTitle}</h2>
                <button
                  onClick={() => generateContentIdeas(contentSourceReport)}
                  className="px-4 py-2 bg-reddit-700 hover:bg-reddit-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-reddit-900/15 ring-1 ring-reddit-500/25"
                >
                  {t.regenerate}
                </button>
              </div>

              <div className="text-sm text-stone-500">
                {report ? t.basedOnReport : selectedHistory ? t.basedOnHistory : t.contentEmpty}
              </div>

              {!contentSourceReport ? (
                <div className="h-[260px] flex items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl">
                  {t.contentEmpty}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {contentIdeas.map((idea, idx) => (
                    <article
                      key={`${idea.title}-${idx}`}
                      className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-md ring-1 ring-reddit-100/80 border-t-4 border-t-reddit-500"
                    >
                      <div className="p-4 border-b border-stone-200/80 bg-gradient-to-br from-white to-reddit-50/40">
                        <div className="text-xs font-semibold text-reddit-800 bg-reddit-100 border border-reddit-200/80 rounded-full px-2.5 py-0.5 w-fit mb-2">
                          主题 {idx + 1}
                        </div>
                        <h3 className="text-base font-semibold text-stone-800 mb-2 leading-snug">{idea.title}</h3>
                        <p className="text-sm text-stone-600 leading-relaxed mb-3">{idea.angle}</p>
                        <div className="flex flex-wrap gap-2">
                          {idea.basedOn.map((tag, i) => (
                            <span
                              key={`${tag}-${i}`}
                              className={`px-2 py-1 rounded-md text-xs font-medium shadow-sm ${contentIdeaTagClass(i)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 space-y-4 bg-stone-50/80">
                        <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-reddit-600" />
                          {t.contentDraftSection}
                        </h4>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">{t.redditPostTitleLabel}</div>
                          <p className="text-sm font-medium text-stone-900 leading-snug bg-white border border-stone-200 rounded-lg px-3 py-2">
                            {idea.content.postTitle}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">{t.redditPostBodyLabel}</div>
                          <div className="text-sm text-stone-800 leading-relaxed bg-white border border-stone-200 rounded-lg px-3 py-3 whitespace-pre-wrap font-sans">
                            {idea.content.postBody}
                          </div>
                        </div>

                        {idea.content.suggestedSubreddit ? (
                          <p className="text-xs text-stone-500">
                            <span className="font-medium text-stone-600">{t.redditSubredditHint}:</span>{' '}
                            {idea.content.suggestedSubreddit}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : activePage === 'monitor' ? (
          <section className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8 bg-[#F9F8F6]">
            <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-800">{t.monitorTitle}</h2>
                <p className="text-sm text-stone-500 mt-1">{t.monitorHelp}</p>
                <div className="mt-3 p-3 rounded-lg bg-sky-50 border border-sky-100 border-l-4 border-l-sky-500 text-sm text-sky-950 leading-relaxed shadow-sm ring-1 ring-sky-200/40">
                  {t.monitorCompetitiveHint}
                </div>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="text-xs font-medium text-stone-600">
                    {language === 'zh' ? '拉取方式' : 'Fetch mode'}
                  </span>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="monitorMode"
                      checked={monitorMode === 'new'}
                      onChange={() => setMonitorMode('new')}
                    />
                    {t.monitorModeNew}
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="monitorMode"
                      checked={monitorMode === 'day'}
                      onChange={() => {
                        setMonitorMode('day');
                        setMonitorDay((d) =>
                          d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : localDateYmd()
                        );
                      }}
                    />
                    {t.monitorModeDay}
                  </label>
                  {monitorMode === 'day' ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-stone-500">{t.monitorDateLabel}</span>
                      <input
                        type="date"
                        value={monitorDay}
                        onChange={(e) => setMonitorDay(e.target.value)}
                        className="border border-stone-300 rounded-lg px-2 py-1.5 text-sm bg-white"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-xs font-medium text-stone-600">{t.monitorSubredditLabel}</label>
                    <button
                      type="button"
                      onClick={() => setMonitorSubreddits((rows) => [...rows, ''])}
                      title={t.monitorAddSubreddit}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-lg font-medium leading-none"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {monitorSubreddits.map((row, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => {
                            const v = e.target.value;
                            setMonitorSubreddits((prev) => prev.map((s, i) => (i === idx ? v : s)));
                          }}
                          placeholder={t.monitorSubredditPlaceholder}
                          className="flex-1 min-w-0 p-2.5 border border-stone-300 rounded-lg text-sm"
                        />
                        {monitorSubreddits.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setMonitorSubreddits((prev) => prev.filter((_, i) => i !== idx))
                            }
                            title={language === 'zh' ? '移除此行' : 'Remove row'}
                            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-red-50 text-stone-500 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-stone-600 mb-1">{t.monitorLimit}</label>
                  <select
                    value={monitorLimit}
                    onChange={(e) => setMonitorLimit(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm bg-white"
                  >
                    {[5, 8, 10, 12, 15, 20, 25].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer pb-1">
                  <input
                    type="checkbox"
                    checked={monitorUseGemini}
                    onChange={(e) => setMonitorUseGemini(e.target.checked)}
                    className="rounded border-stone-400"
                  />
                  {t.monitorUseGemini}
                </label>
                <button
                  type="button"
                  onClick={handleMonitorScan}
                  disabled={monitorLoading}
                  className="px-4 py-2.5 bg-reddit-700 hover:bg-reddit-800 disabled:bg-reddit-300 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-reddit-900/15 ring-1 ring-reddit-500/25"
                >
                  {monitorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rss className="w-4 h-4" />}
                  {monitorLoading ? t.monitorLoading : t.monitorFetchBtn}
                </button>
                </div>
              </div>

              {monitorFetchedAt ? (
                <p className="text-xs text-stone-500">
                  {t.monitorFetchedAt}: {new Date(monitorFetchedAt).toLocaleString()}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-stone-500">{t.monitorEmotion}:</span>
                <select
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                  className="text-sm border border-stone-300 rounded-lg px-2 py-1 bg-white"
                >
                  <option value="all">{t.monitorFilterAll}</option>
                  {['疑惑', '生气', '兴奋', '失望', '讽刺', '中性'].map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-stone-500 ml-2">{t.monitorCategory}:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm border border-stone-300 rounded-lg px-2 py-1 bg-white"
                >
                  <option value="all">{t.monitorFilterAll}</option>
                  {['推荐', '吐槽', '讨论', '求助', '展示'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                {filteredMonitorPosts.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl bg-white text-sm px-4 text-center">
                    {t.monitorEmpty}
                  </div>
                ) : (
                  filteredMonitorPosts.map((p) => (
                    <article
                      key={p.id}
                      className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm border-l-4 border-l-reddit-300 ring-1 ring-stone-100/80"
                    >
                      <div className="p-4 border-b border-stone-100 flex flex-wrap items-start gap-2 justify-between">
                        <div className="flex-1 min-w-0">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base font-semibold text-stone-900 hover:text-reddit-700 leading-snug"
                          >
                            {p.title}
                          </a>
                          <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span>{p.subreddit.startsWith('r/') ? p.subreddit : `r/${p.subreddit}`}</span>
                            <span>u/{p.author}</span>
                            <span>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</span>
                            <span>↑{p.score}</span>
                            <span>💬{p.numComments}</span>
                            {p.flair ? (
                              <span className="text-reddit-800 bg-reddit-100 px-1.5 py-0.5 rounded border border-reddit-200/80 text-[11px] font-medium">
                                {p.flair}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-md border ${emotionBadgeClass(p.emotion)}`}>
                            {t.monitorEmotion}: {p.emotion}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-md border ${categoryBadgeClass(p.category)}`}>
                            {t.monitorCategory}: {p.category}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-md border shadow-sm ${
                              p.classificationSource === 'gemini'
                                ? 'bg-violet-50 text-violet-900 border-violet-200'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            {p.classificationSource === 'gemini' ? t.monitorSourceGemini : t.monitorSourceHeuristic}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 pb-3 border-b border-stone-100">
                        <button
                          type="button"
                          onClick={() => openMonitorPostForAnalyze(p)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-reddit-700 text-white hover:bg-reddit-800 transition-colors shadow-sm shadow-reddit-900/15 ring-1 ring-reddit-500/25"
                        >
                          <ArrowRight className="w-4 h-4" />
                          {t.monitorToAnalyze}
                        </button>
                      </div>

                      {(() => {
                        const im = p.intentMarks ?? {
                          likes: [],
                          dislikes: [],
                          requests: [],
                          complaints: [],
                        };
                        const blocks: {
                          key: keyof typeof im;
                          label: string;
                          ring: string;
                          bar: string;
                          bg: string;
                          itemBorder: string;
                        }[] = [
                          {
                            key: 'likes',
                            label: t.monitorIntentLikes,
                            ring: 'ring-emerald-200/90',
                            bar: 'border-l-emerald-500',
                            bg: 'bg-emerald-50/90',
                            itemBorder: 'border-emerald-200',
                          },
                          {
                            key: 'dislikes',
                            label: t.monitorIntentDislikes,
                            ring: 'ring-rose-200/90',
                            bar: 'border-l-rose-500',
                            bg: 'bg-rose-50/90',
                            itemBorder: 'border-rose-200',
                          },
                          {
                            key: 'requests',
                            label: t.monitorIntentRequests,
                            ring: 'ring-sky-200/90',
                            bar: 'border-l-sky-500',
                            bg: 'bg-sky-50/90',
                            itemBorder: 'border-sky-200',
                          },
                          {
                            key: 'complaints',
                            label: t.monitorIntentComplaints,
                            ring: 'ring-orange-200/90',
                            bar: 'border-l-orange-500',
                            bg: 'bg-orange-50/90',
                            itemBorder: 'border-orange-200',
                          },
                        ];
                        return (
                          <div className="px-4 py-3 bg-stone-50/90 border-b border-stone-100">
                            <div className="text-xs font-medium text-stone-600 mb-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-stone-200 text-stone-700 shadow-sm">
                                {t.monitorIntentSection}
                              </span>
                              <span className="text-stone-400 font-normal">
                                {' '}
                                — {p.classificationSource === 'gemini' ? t.monitorIntentByAi : t.monitorIntentByKeyword}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {blocks.map(({ key, label, ring, bar, bg, itemBorder }) => (
                                <div
                                  key={key}
                                  className={`rounded-lg border border-stone-200/80 p-2.5 shadow-sm ring-1 ${ring} ${bg} border-l-4 ${bar}`}
                                >
                                  <div className="text-[11px] font-semibold text-stone-700 mb-1.5">{label}</div>
                                  {im[key].length === 0 ? (
                                    <p className="text-xs text-stone-400">—</p>
                                  ) : (
                                    <ul className="space-y-1">
                                      {im[key].map((line, i) => (
                                        <li
                                          key={i}
                                          className={`text-xs text-stone-800 leading-snug pl-2 border-l-2 ${itemBorder} bg-white/60 rounded-r`}
                                        >
                                          {line}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      {p.body ? (
                        <div className="px-4 py-3 bg-stone-50/80 border-b border-stone-100">
                          <div className="text-xs font-medium text-stone-500 mb-1">{t.monitorBody}</div>
                          <div className="text-sm text-stone-800 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                            {p.body}
                          </div>
                        </div>
                      ) : null}

                      <div className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => setExpandedMonitorId((id) => (id === p.id ? null : p.id))}
                          className="text-xs text-stone-600 hover:text-stone-900"
                        >
                          {expandedMonitorId === p.id ? '▼' : '▶'} {t.monitorComments} ({p.comments.length})
                        </button>
                        {expandedMonitorId === p.id ? (
                          <ul className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                            {p.comments.map((c) => (
                              <li key={c.id} className="text-sm border-l-2 border-reddit-300 bg-reddit-50/30 pl-3 py-1 rounded-r">
                                <span className="text-xs text-stone-500">u/{c.author} ↑{c.score}</span>
                                <p className="text-stone-800 whitespace-pre-wrap mt-0.5">{c.body}</p>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : activePage === 'competitive' ? (
          <section className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8 bg-[#F9F8F6]">
            <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 shrink-0">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-800 flex flex-wrap items-center gap-2">
                    {t.competitiveTitle}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-insta-100 text-insta-900 border border-insta-200/80 shadow-sm">
                      Instagram
                    </span>
                  </h2>
                  <p className="text-sm text-stone-500 mt-1 max-w-2xl">{t.competitiveHelp}</p>
                  <p className="text-xs text-stone-400 mt-2">{t.competitiveCronNote}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCompetitiveSync}
                  disabled={competitiveSyncing}
                  className="px-4 py-2.5 bg-insta-700 hover:bg-insta-800 disabled:bg-insta-300 text-white rounded-lg text-sm font-medium flex items-center gap-2 shrink-0 shadow-md shadow-insta-900/25 ring-1 ring-insta-400/35"
                >
                  {competitiveSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  {competitiveSyncing ? t.competitiveSyncing : t.competitiveSync}
                </button>
              </div>

              {competitiveLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-6 pr-1 min-h-0">
                  <p className="text-xs text-stone-500">
                    {t.competitiveLastRun}:{' '}
                    {competitiveCache?.updatedAt
                      ? new Date(String(competitiveCache.updatedAt)).toLocaleString()
                      : '—'}
                  </p>

                  <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-md ring-1 ring-insta-100/50 border-t-4 border-t-insta-500">
                    <h3 className="text-sm font-semibold text-insta-950 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-insta-500 shadow-sm" aria-hidden />
                      {t.competitiveIg}
                    </h3>
                    {(() => {
                      const ig = competitiveCache?.instagram as
                        | {
                            error?: string;
                            postsByUsername?: Record<string, Array<Record<string, unknown>>>;
                            fetchedAt?: string;
                            handles?: string[];
                          }
                        | undefined;
                      if (ig?.error) {
                        return (
                          <div className="text-sm text-red-800 bg-red-50 border border-red-100 border-l-4 border-l-red-500 rounded-lg px-3 py-2 shadow-sm ring-1 ring-red-100/60">
                            {t.competitiveIgError}: {ig.error}
                          </div>
                        );
                      }
                      const by = ig?.postsByUsername || {};
                      const pilotHandles: string[] =
                        ig?.handles && ig.handles.length > 0
                          ? ig.handles.map((h) => String(h))
                          : [...DEFAULT_INSTAGRAM_HANDLES];
                      const accountKeys = pilotHandles.map((h) => h.toLowerCase());
                      const totalInCache = pilotHandles.reduce((n, ph) => n + igGetBucket(by, ph).length, 0);

                      const rowsByAccount = pilotHandles
                        .filter((uname) => igFilterSelections[uname.toLowerCase()] !== false)
                        .map((uname) => ({
                          uname,
                          rows: igGetBucket(by, uname).filter((row) => {
                            const ts = row.timestamp ? String(row.timestamp) : '';
                            if (!ts && (igDateFrom || igDateTo)) return false;
                            if (!ts) return true;
                            return igPostPassesTimeFilter(ts, igDateFrom, igDateTo);
                          }),
                        }));
                      const totalFilteredPosts = rowsByAccount.reduce((s, x) => s + x.rows.length, 0);

                      return (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-end gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100">
                            <div className="flex-1 min-w-[200px]">
                              <div className="text-xs font-medium text-stone-600 mb-2">{t.competitiveFilterAccounts}</div>
                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next: Record<string, boolean> = {};
                                    for (const k of accountKeys) next[k] = true;
                                    setIgFilterSelections(next);
                                  }}
                                  className="text-xs text-orange-700 hover:underline"
                                >
                                  {t.competitiveFilterAllAccounts}
                                </button>
                                {pilotHandles.map((uname) => {
                                  const key = uname.toLowerCase();
                                  return (
                                    <label key={key} className="inline-flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={igFilterSelections[key] !== false}
                                        onChange={(e) =>
                                          setIgFilterSelections((prev) => ({
                                            ...prev,
                                            [key]: e.target.checked,
                                          }))
                                        }
                                        className="rounded border-stone-400"
                                      />
                                      @{uname}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <label className="text-xs text-stone-600 flex items-center gap-1">
                                {t.competitiveFilterDateFrom}
                                <input
                                  type="date"
                                  value={igDateFrom}
                                  onChange={(e) => setIgDateFrom(e.target.value)}
                                  className="border border-stone-300 rounded-lg px-2 py-1 text-sm bg-white"
                                />
                              </label>
                              <label className="text-xs text-stone-600 flex items-center gap-1">
                                {t.competitiveFilterDateTo}
                                <input
                                  type="date"
                                  value={igDateTo}
                                  onChange={(e) => setIgDateTo(e.target.value)}
                                  className="border border-stone-300 rounded-lg px-2 py-1 text-sm bg-white"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setIgDateFrom('');
                                  setIgDateTo('');
                                  const next: Record<string, boolean> = {};
                                  for (const k of accountKeys) next[k] = true;
                                  setIgFilterSelections(next);
                                }}
                                className="text-xs px-2 py-1 rounded-md border border-stone-300 bg-white hover:bg-stone-100 text-stone-700"
                              >
                                {t.competitiveFilterReset}
                              </button>
                            </div>
                          </div>

                          <CompetitiveIgCalendar
                            pilotOrder={pilotHandles}
                            postsByUsername={by}
                            selectedLower={igFilterSelections}
                            dateFrom={igDateFrom}
                            dateTo={igDateTo}
                            monthY={igCalendarMonth.y}
                            monthM={igCalendarMonth.m}
                            onPrevMonth={() =>
                              setIgCalendarMonth(({ y, m }) =>
                                m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }
                              )
                            }
                            onNextMonth={() =>
                              setIgCalendarMonth(({ y, m }) =>
                                m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }
                              )
                            }
                            language={language}
                            labels={{
                              title: t.competitiveCalendarTitle,
                              prev: t.competitiveCalendarPrev,
                              next: t.competitiveCalendarNext,
                              weekdays: t.competitiveCalendarWeekdays,
                              legend: t.competitiveCalendarLegend,
                            }}
                          />

                          {totalInCache === 0 ? (
                            <p className="text-sm text-stone-400">{t.competitiveIgEmpty}</p>
                          ) : null}

                          <div className="space-y-6">
                            {totalInCache > 0 && totalFilteredPosts === 0 ? (
                              <p className="text-sm text-stone-500 text-center py-6">{t.competitiveFilterNoMatch}</p>
                            ) : (
                              rowsByAccount.map(({ uname, rows }) =>
                                rows.length === 0 ? null : (
                                  <div key={uname}>
                                    <div className="text-xs font-medium text-orange-800 mb-2">@{uname}</div>
                                    <div className="space-y-2 max-h-72 overflow-y-auto">
                                      {rows.map((row, idx) => {
                                        const caption = String(row.caption || '').slice(0, 200);
                                        const url = String(row.url || '#');
                                        const likes = row.likesCount;
                                        const cc = row.commentsCount;
                                        const ts = row.timestamp ? String(row.timestamp) : '';
                                        const pk = (row.postKind as string) || 'original';
                                        return (
                                          <div
                                            key={`${uname}-${idx}-${url}`}
                                            className="text-xs border border-stone-100 rounded-lg p-2 bg-stone-50/80"
                                          >
                                            <div className="flex flex-wrap items-start gap-2">
                                              <a
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-medium text-stone-900 hover:text-orange-700 line-clamp-2 flex-1 min-w-0"
                                              >
                                                {caption || '(no caption)'}
                                              </a>
                                              {pk === 'collaboration' ? (
                                                <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-900 border border-violet-200 text-[10px] font-semibold shadow-sm">
                                                  {t.competitiveTagCollab}
                                                </span>
                                              ) : null}
                                              {pk === 'repost' ? (
                                                <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-200 text-[10px] font-semibold shadow-sm">
                                                  {t.competitiveTagRepost}
                                                </span>
                                              ) : null}
                                            </div>
                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-stone-500">
                                              {ts ? <span>{new Date(ts).toLocaleString()}</span> : null}
                                              <span>
                                                {t.competitiveLikes}: {typeof likes === 'number' ? likes : '—'}
                                              </span>
                                              <span>
                                                {t.competitiveComments}: {typeof cc === 'number' ? cc : '—'}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )
                              )
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : activePage === 'social' ? (
          <section className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8 bg-[#F9F8F6]">
            <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 shrink-0">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-800 flex flex-wrap items-center gap-2">
                    {t.socialDashTitle}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-insta-100 text-insta-900 border border-insta-200/80 shadow-sm">
                      Instagram
                    </span>
                  </h2>
                  <p className="text-sm text-stone-500 mt-1 max-w-2xl">{t.socialDashIntro}</p>
                  <p className="text-xs text-stone-400 mt-2">
                    {t.competitiveLastRun}:{' '}
                    {competitiveCache?.updatedAt
                      ? new Date(String(competitiveCache.updatedAt)).toLocaleString()
                      : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCompetitiveSync}
                  disabled={competitiveSyncing}
                  className="px-4 py-2.5 bg-insta-700 hover:bg-insta-800 disabled:bg-insta-300 text-white rounded-lg text-sm font-medium flex items-center gap-2 shrink-0 shadow-md shadow-insta-900/25 ring-1 ring-insta-400/35"
                >
                  {competitiveSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  {competitiveSyncing ? t.competitiveSyncing : t.competitiveSync}
                </button>
              </div>

              {competitiveLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                </div>
              ) : !socialDashboard ? (
                <p className="text-sm text-stone-500 py-8">{t.socialDashEmpty}</p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                  <p className="text-xs text-stone-500">
                    {t.socialSec1FetchAt}:{' '}
                    {socialDashboard.fetchedAt
                      ? new Date(String(socialDashboard.fetchedAt)).toLocaleString()
                      : '—'}
                  </p>
                  <p className="text-xs text-stone-400">{t.socialSec1FollowersNote}</p>

                  <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-md ring-1 ring-insta-100/50 border-t-4 border-t-insta-500">
                    <h3 className="text-sm font-semibold text-insta-950 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-insta-500 shadow-sm" aria-hidden />
                      {t.socialSec1Title}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-stone-500 border-b border-stone-100">
                            <th className="py-2 pr-4 font-medium">@</th>
                            <th className="py-2 font-medium">{t.socialSec1PostsSample}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {socialDashboard.accountRows.map((row) => (
                            <tr key={row.handle} className="border-b border-stone-50 last:border-0">
                              <td className="py-2 pr-4 text-stone-800">{row.handle}</td>
                              <td className="py-2 text-stone-700 tabular-nums">{row.postsInSample}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-md ring-1 ring-violet-100/60 border-t-4 border-t-violet-500">
                    <h3 className="text-sm font-semibold text-violet-950 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-violet-500 shadow-sm" aria-hidden />
                      {t.socialSec2Title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-stone-500 mb-2">{t.socialSec2Kind}</div>
                        <ul className="space-y-1.5 text-sm text-stone-700">
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                              {t.socialKindOriginal}
                            </span>
                            <span className="tabular-nums font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {socialDashboard.contentMix.original}
                            </span>
                          </li>
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden />
                              {t.socialKindCollab}
                            </span>
                            <span className="tabular-nums font-semibold text-violet-800 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                              {socialDashboard.contentMix.collaboration}
                            </span>
                          </li>
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                              {t.socialKindRepost}
                            </span>
                            <span className="tabular-nums font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                              {socialDashboard.contentMix.repost}
                            </span>
                          </li>
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" aria-hidden />
                              {t.socialKindUnknown}
                            </span>
                            <span className="tabular-nums font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                              {socialDashboard.contentMix.unknown}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-stone-500 mb-2">{t.socialSec2Media}</div>
                        {Object.keys(socialDashboard.mediaTypeMix).length === 0 ? (
                          <p className="text-sm text-stone-400">—</p>
                        ) : (
                          <ul className="space-y-1.5 text-sm text-stone-700">
                            {Object.entries(socialDashboard.mediaTypeMix)
                              .sort((a, b) => Number(b[1]) - Number(a[1]))
                              .map(([k, v]) => (
                                <li key={k} className="flex justify-between gap-2">
                                  <span className="truncate">{k}</span>
                                  <span className="tabular-nums shrink-0">{v}</span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-md ring-1 ring-cyan-100/60 border-t-4 border-t-cyan-500">
                    <h3 className="text-sm font-semibold text-cyan-950 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-sm" aria-hidden />
                      {t.socialSec3Title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 ring-1 ring-rose-100/50">
                        <div className="text-xs text-rose-700 font-medium">{t.socialSec3TotalLikes}</div>
                        <div className="text-lg font-semibold text-rose-950 tabular-nums">
                          {Math.round(socialDashboard.engagement.totalLikes).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg bg-sky-50 border border-sky-100 px-3 py-2 ring-1 ring-sky-100/50">
                        <div className="text-xs text-sky-700 font-medium">{t.socialSec3TotalComments}</div>
                        <div className="text-lg font-semibold text-sky-950 tabular-nums">
                          {Math.round(socialDashboard.engagement.totalComments).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 ring-1 ring-orange-100/50">
                        <div className="text-xs text-orange-800 font-medium">{t.socialSec3AvgLikes}</div>
                        <div className="text-lg font-semibold text-orange-950 tabular-nums">
                          {socialDashboard.engagement.avgLikes.toFixed(1)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 ring-1 ring-teal-100/50">
                        <div className="text-xs text-teal-800 font-medium">{t.socialSec3AvgComments}</div>
                        <div className="text-lg font-semibold text-teal-950 tabular-nums">
                          {socialDashboard.engagement.avgComments.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-stone-500 mb-2">{t.socialSec3ByAccount}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-stone-500 border-b border-stone-100">
                            <th className="py-2 pr-4 font-medium">@</th>
                            <th className="py-2 pr-4 font-medium">{t.competitiveLikes} ∅</th>
                            <th className="py-2 font-medium">{t.competitiveComments} ∅</th>
                            <th className="py-2 pl-2 font-medium text-right">n</th>
                          </tr>
                        </thead>
                        <tbody>
                          {socialDashboard.engagement.byAccount.map((row) => (
                            <tr key={row.handle} className="border-b border-stone-50 last:border-0">
                              <td className="py-2 pr-4 text-stone-800">{row.handle}</td>
                              <td className="py-2 pr-4 tabular-nums">{row.avgLikes.toFixed(1)}</td>
                              <td className="py-2 tabular-nums">{row.avgComments.toFixed(1)}</td>
                              <td className="py-2 pl-2 text-right tabular-nums text-stone-500">{row.n}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-md ring-1 ring-amber-100/60 border-t-4 border-t-amber-500">
                    <h3 className="text-sm font-semibold text-amber-950 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm" aria-hidden />
                      {t.socialSec4Title}
                    </h3>
                    <dl className="grid sm:grid-cols-2 gap-3 text-sm text-stone-700">
                      <div className="flex justify-between gap-2 border-b border-stone-50 pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-stone-500">{t.socialSec4Span}</dt>
                        <dd className="tabular-nums text-right">
                          {socialDashboard.cadence.dateMin && socialDashboard.cadence.dateMax
                            ? `${socialDashboard.cadence.dateMin} → ${socialDashboard.cadence.dateMax}`
                            : '—'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-50 pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-stone-500">{t.socialSec4Days}</dt>
                        <dd className="tabular-nums text-right">{socialDashboard.cadence.spanDays || '—'}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-stone-50 pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-stone-500">{t.socialSec4Ppw}</dt>
                        <dd className="tabular-nums text-right">
                          {socialDashboard.cadence.spanDays > 0
                            ? socialDashboard.cadence.postsPerWeek.toFixed(2)
                            : '—'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-stone-500">{t.socialSec4PeakDay}</dt>
                        <dd className="text-right">
                          {socialDashboard.cadence.busiestWeekday
                            ? `${weekdayLabel(socialDashboard.cadence.busiestWeekday.index, language)} (${
                                socialDashboard.cadence.busiestWeekday.count
                              })`
                            : '—'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#F9F8F6] rounded-2xl max-w-md w-full p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-semibold mb-4 text-stone-800">{t.settingsTitle}</h2>
            
            <div className="space-y-4">
              <div className="bg-stone-200/50 text-stone-800 p-3 rounded-lg text-xs flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t.settingsHelp}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.apiKeyLabel}</label>
                <input 
                  type="password" 
                  value={notionApiKey}
                  onChange={(e) => setNotionApiKey(e.target.value)}
                  placeholder="secret_..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-reddit-500/40 focus:border-reddit-500 text-sm bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.dbIdLabel}</label>
                <input 
                  type="text" 
                  value={notionDbId}
                  onChange={(e) => setNotionDbId(e.target.value)}
                  placeholder="e.g. 1234567890abcdef1234567890abcdef"
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-reddit-500/40 focus:border-reddit-500 text-sm bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-lg text-sm font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                onClick={saveSettings}
                className="px-4 py-2 bg-reddit-700 hover:bg-reddit-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-reddit-900/15 ring-1 ring-reddit-500/25"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
