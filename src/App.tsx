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
import {
  buildIdeasWithDrafts,
  CONTENT_TONE_IDS,
  DEFAULT_CONTENT_TONE,
  type ContentIdea,
  type ContentToneId,
} from './contentToneDrafts';

type AiProvider = 'gemini' | 'minimax';

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
  classificationSource: 'heuristic' | AiProvider;
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
    aiProviderLabel: "AI model",
    aiProviderGemini: "Gemini",
    aiProviderMinimax: "MiniMax 2.7",
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
    contentEmpty: "Analyze data first, select a history record, or use the prompt box below.",
    regenerate: "Regenerate Ideas",
    promptPlaceholder: "e.g. r/startups Write 6 posts about how to validate a SaaS idea",
    promptGenerate: "Generate",
    promptHint: "Enter r/subreddit + your instruction to generate content directly, no analysis report needed.",
    basedOnPrompt: "Generated from prompt",
    contentToneLabel: "Draft tone",
    contentToneHint:
      "Applies to every card below: curious doubt, straight ask, “what worked for me,” or vent — typical Reddit moods.",
    toneCurious: "Curious / 疑惑",
    toneQuestion: "Question / 提问",
    toneRecommend: "Recommend / 推荐",
    toneRant: "Rant / 吐槽",
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
    monitorUseGemini: "AI labels & user intents (uses selected AI model on server)",
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
    monitorSourceMinimax: "MiniMax 2.7",
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
    competitiveHistoryTitle: "Sync history",
    competitiveHistoryEmpty: "No sync history yet.",
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
    aiProviderLabel: "AI 模型",
    aiProviderGemini: "Gemini",
    aiProviderMinimax: "MiniMax 2.7",
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
    contentEmpty: "请先完成一次分析、选择历史记录，或使用下方输入框直接生成。",
    regenerate: "重新生成",
    promptPlaceholder: "例如：r/startups 帮我写6条关于如何验证SaaS想法的帖子",
    promptGenerate: "生成",
    promptHint: "输入 r/subreddit + 指令即可直接生成内容，无需分析报告。",
    basedOnPrompt: "基于输入指令生成",
    contentToneLabel: "发帖语气",
    contentToneHint: "影响下方所有选题与正文草案：疑惑、提问、推荐、吐槽等常见 Reddit 情绪向。",
    toneCurious: "疑惑（拿不准、求拍醒）",
    toneQuestion: "提问（求助、真诚发问）",
    toneRecommend: "推荐（过来人、避坑分享）",
    toneRant: "吐槽（发泄、仍求干货）",
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
    monitorUseGemini: "使用 AI 标注情绪/类别与用户倾向（使用当前选择的服务端模型）",
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
    monitorSourceMinimax: "MiniMax 2.7",
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
    competitiveHistoryTitle: "历史抓取记录",
    competitiveHistoryEmpty: "暂无历史抓取记录。",
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
  const [aiProvider, setAiProvider] = useState<AiProvider>(() => {
    try {
      const raw = localStorage.getItem('redditAiProvider');
      if (raw === 'gemini' || raw === 'minimax') return raw;
    } catch {
      /* ignore */
    }
    return 'gemini';
  });
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
  const [contentSubSuggesting, setContentSubSuggesting] = useState(false);
  const [contentPromptInput, setContentPromptInput] = useState('');
  const [contentPromptSource, setContentPromptSource] = useState<string | null>(null);
  const [contentTone, setContentTone] = useState<ContentToneId>(() => {
    try {
      const raw = localStorage.getItem('redditContentTone');
      if (raw && CONTENT_TONE_IDS.includes(raw as ContentToneId)) return raw as ContentToneId;
    } catch {
      /* ignore */
    }
    return DEFAULT_CONTENT_TONE;
  });
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
  const contentSuggestSeqRef = useRef(0);
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
    try {
      localStorage.setItem('redditAiProvider', aiProvider);
    } catch {
      /* ignore */
    }
  }, [aiProvider]);

  useEffect(() => {
    try {
      localStorage.setItem('redditContentTone', contentTone);
    } catch {
      /* ignore */
    }
  }, [contentTone]);

  const withAiSuggestedSubreddits = async (ideas: ContentIdea[]): Promise<ContentIdea[]> => {
    if (ideas.length === 0) return ideas;
    try {
      const res = await fetch('/api/content/subreddits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiProvider,
          language,
          ideas: ideas.map((x) => ({
            title: x.title,
            angle: x.angle,
            postTitle: x.content.postTitle,
            postBody: x.content.postBody,
            currentSuggestedSubreddit: x.content.suggestedSubreddit || '',
          })),
        }),
      });
      const data = (await res.json()) as { success?: boolean; suggestedSubreddits?: string[]; error?: string };
      if (!res.ok || data.success === false || !Array.isArray(data.suggestedSubreddits)) {
        throw new Error(data.error || 'Subreddit suggestion failed');
      }
      return ideas.map((idea, idx) => ({
        ...idea,
        content: {
          ...idea.content,
          suggestedSubreddit: data.suggestedSubreddits?.[idx] || idea.content.suggestedSubreddit,
        },
      }));
    } catch (error: any) {
      console.warn('[content] subreddit suggestion fallback:', error?.message || error);
      return ideas;
    }
  };

  /**
   * Call /api/content/ideas (AI domain-aware generation).
   * Falls back to static templates if the request fails.
   */
  const fetchAiContentIdeas = async (
    src: Report,
    seq: number
  ): Promise<ContentIdea[] | null> => {
    try {
      const res = await fetch('/api/content/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: src, language, tone: contentTone, aiProvider }),
      });
      const data = (await res.json()) as { success?: boolean; ideas?: any[]; error?: string };
      if (!res.ok || data.success === false || !Array.isArray(data.ideas)) {
        throw new Error(data.error || 'Content idea generation failed');
      }
      if (seq !== contentSuggestSeqRef.current) return null;
      return data.ideas.map((raw: any) => ({
        title: String(raw.title ?? ''),
        angle: String(raw.angle ?? ''),
        basedOn: Array.isArray(raw.basedOn) ? raw.basedOn.map(String) : [],
        content: {
          postTitle: String(raw.postTitle ?? ''),
          postBody: String(raw.postBody ?? ''),
          suggestedSubreddit: raw.suggestedSubreddit ? String(raw.suggestedSubreddit) : undefined,
        },
      }));
    } catch (error: any) {
      console.warn('[content] AI idea generation fallback:', error?.message || error);
      return null;
    }
  };

  useEffect(() => {
    const selected = historyRecords.find((x) => x.id === selectedHistoryId) || null;
    const src = report || selected?.report || null;
    if (!src) {
      setContentIdeas([]);
      setContentSubSuggesting(false);
      return;
    }
    const reqSeq = ++contentSuggestSeqRef.current;
    setContentIdeas([]);
    setContentSubSuggesting(true);
    setContentPromptSource(null);
    fetchAiContentIdeas(src, reqSeq).then((aiIdeas) => {
      if (reqSeq !== contentSuggestSeqRef.current) return;
      setContentIdeas(aiIdeas ?? buildIdeasWithDrafts(src, language, contentTone));
      setContentSubSuggesting(false);
    });
  }, [language, report, selectedHistoryId, historyRecords, contentTone, aiProvider]);

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

  const generateContentIdeas = async (baseReport: Report | null) => {
    if (!baseReport) {
      setContentIdeas([]);
      return;
    }
    const reqSeq = ++contentSuggestSeqRef.current;
    setContentIdeas([]);
    setContentSubSuggesting(true);
    setContentPromptSource(null);
    const aiIdeas = await fetchAiContentIdeas(baseReport, reqSeq);
    if (reqSeq === contentSuggestSeqRef.current) {
      setContentIdeas(aiIdeas ?? buildIdeasWithDrafts(baseReport, language, contentTone));
      setContentSubSuggesting(false);
    }
  };

  const generateFromPrompt = async () => {
    const input = contentPromptInput.trim();
    if (!input) return;
    const subMatch = input.match(/r\/(\w+)/i);
    const subreddit = subMatch ? `r/${subMatch[1]}` : '';
    const instruction = input.replace(/r\/\w+/i, '').trim();
    if (!subreddit || !instruction) return;

    const countMatch = input.match(/(\d+)\s*(?:篇|条|个|posts?|ideas?)/i);
    const count = countMatch ? Math.min(Math.max(Number(countMatch[1]), 1), 10) : 6;

    const reqSeq = ++contentSuggestSeqRef.current;
    setContentIdeas([]);
    setContentSubSuggesting(true);
    setContentPromptSource(subreddit);
    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subreddit, instruction, language, tone: contentTone, aiProvider, count }),
      });
      const data = (await res.json()) as { success?: boolean; ideas?: any[]; error?: string };
      if (reqSeq !== contentSuggestSeqRef.current) return;
      if (!res.ok || data.success === false || !Array.isArray(data.ideas)) {
        throw new Error(data.error || 'Generation failed');
      }
      setContentIdeas(
        data.ideas.map((raw: any) => ({
          title: String(raw.title ?? ''),
          angle: String(raw.angle ?? ''),
          basedOn: Array.isArray(raw.basedOn) ? raw.basedOn.map(String) : [],
          content: {
            postTitle: String(raw.postTitle ?? ''),
            postBody: String(raw.postBody ?? ''),
            suggestedSubreddit: raw.suggestedSubreddit ? String(raw.suggestedSubreddit) : undefined,
          },
        }))
      );
    } catch (error: any) {
      console.warn('[content] prompt generation failed:', error?.message || error);
      setContentIdeas([]);
    } finally {
      if (reqSeq === contentSuggestSeqRef.current) setContentSubSuggesting(false);
    }
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
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetText: normalizedInput,
          language,
          aiProvider,
        }),
      });
      const data = (await response.json()) as { success?: boolean; report?: Report; error?: string };
      if (!response.ok || !data.report) {
        throw new Error(data.error || 'No response from AI');
      }
      const parsedReport = data.report;
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
        aiProvider,
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

  const emotionBadgeClass = (_e: string) => 'ym-badge';
  const categoryBadgeClass = (_c: string) => 'ym-badge';

  const contentIdeaTagClass = (_i: number) => 'ym-badge';

  const renderReportContent = (reportData: Report | null, showExport: boolean) => (
    reportData ? (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="ym-page-title">{t.reportTitle}</h2>
          {showExport && (
            <button
              onClick={handleExportToNotion}
              disabled={isExporting}
              className="ym-btn-primary px-4 py-2 text-sm"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {t.exportBtn}
            </button>
          )}
        </div>

        <div className="ym-card p-6">
          <h3 className="text-[var(--ym-foreground)] font-medium mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[var(--ym-gray0)] text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            {t.summary}
          </h3>
          <p className="text-[var(--ym-muted-foreground)] text-sm leading-relaxed">{reportData.summary}</p>
        </div>

        <div className="ym-card p-6">
          <h3 className="text-[var(--ym-foreground)] font-medium mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[var(--ym-gray1)] text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            {t.painPoints}
          </h3>
          <ul className="space-y-2">
            {reportData.painPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--ym-foreground)]">
                <span className="text-[var(--ym-muted-foreground)] mt-1 font-bold">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="ym-card p-6">
          <h3 className="text-[var(--ym-foreground)] font-medium mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[var(--ym-gray2)] text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            {t.praisedFeatures}
          </h3>
          <ul className="space-y-2">
            {reportData.praisedFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--ym-foreground)]">
                <span className="text-[var(--ym-muted-foreground)] mt-1 font-bold">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ym-card p-6">
            <h3 className="text-[var(--ym-foreground)] font-medium mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[var(--ym-gray1)] text-white flex items-center justify-center text-xs font-bold">
                4
              </span>
              {t.mentionedBrands}
            </h3>
            <div className="flex flex-wrap gap-2">
              {reportData.mentionedBrands.map((brand, i) => (
                <span
                  key={i}
                  className="ym-badge"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="ym-card p-6">
            <h3 className="text-[var(--ym-foreground)] font-medium mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[var(--ym-gray2)] text-white flex items-center justify-center text-xs font-bold">
                5
              </span>
              {t.highFreqWords}
            </h3>
            <div className="flex flex-wrap gap-2">
              {reportData.highFrequencyWords.map((word, i) => (
                <span
                  key={i}
                  className="ym-badge"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-[var(--ym-gray2)] space-y-4 py-20 border-2 border-dashed border-[var(--ym-input-border)] rounded-xl bg-[var(--ym-board-card)]/50">
        <FileText className="w-12 h-12 text-[var(--ym-gray3)]" />
        <p>{t.emptyState}</p>
      </div>
    )
  );

  return (
    <div className="h-screen bg-[var(--ym-background)] text-[var(--ym-foreground)] font-sans flex flex-col overflow-hidden">
      <Toaster position="top-right" />
      
      <header className="bg-[var(--ym-surface)] border-b border-[var(--ym-input-border)] shrink-0">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--ym-primary)] rounded-[12px] flex items-center justify-center">
              <Database className="w-5 h-5 text-[var(--ym-primary-foreground)]" />
            </div>
            <h1 className="font-display text-[1.375rem] font-medium tracking-tight text-[var(--ym-foreground)]">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--ym-muted-foreground)] bg-[var(--ym-muted)] border border-[var(--ym-input-border)] rounded-full transition-colors hover:bg-[var(--ym-gray4)]">
              <span className="text-xs">{t.aiProviderLabel}</span>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as AiProvider)}
                className="bg-transparent text-sm text-[var(--ym-foreground)] focus:outline-none cursor-pointer"
              >
                <option value="gemini">{t.aiProviderGemini}</option>
                <option value="minimax">{t.aiProviderMinimax}</option>
              </select>
            </label>
            <button 
              onClick={() => setLanguage(lang => lang === 'en' ? 'zh' : 'en')}
              className="ym-btn-ghost"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? '中' : 'EN'}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="ym-btn-ghost p-2.5"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-72 shrink-0 border-r border-[var(--ym-input-border)] bg-[var(--ym-background)] p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="ym-section-label">{t.navGroupReddit}</div>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setActivePage('monitor')}
                  className={`ym-nav-item ${activePage === 'monitor' ? 'ym-nav-item-active' : ''}`}
                >
                  <Rss className="w-4 h-4 shrink-0" />
                  {t.navMonitor}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('analyze')}
                  className={`ym-nav-item ${activePage === 'analyze' ? 'ym-nav-item-active' : ''}`}
                >
                  <LayoutTemplate className="w-4 h-4 shrink-0" />
                  {t.navAnalyze}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('history')}
                  className={`ym-nav-item ${activePage === 'history' ? 'ym-nav-item-active' : ''}`}
                >
                  <History className="w-4 h-4 shrink-0" />
                  {t.navHistory}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('content')}
                  className={`ym-nav-item ${activePage === 'content' ? 'ym-nav-item-active' : ''}`}
                >
                  <PenSquare className="w-4 h-4 shrink-0" />
                  {t.navContent}
                </button>
              </div>
            </div>
            <div>
              <div className="ym-section-label">{t.navGroupInstagram}</div>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setActivePage('competitive')}
                  className={`ym-nav-item ${activePage === 'competitive' ? 'ym-nav-item-active' : ''}`}
                >
                  <BarChart2 className="w-4 h-4 shrink-0" />
                  {t.navCompetitive}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage('social')}
                  className={`ym-nav-item ${activePage === 'social' ? 'ym-nav-item-active' : ''}`}
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
            <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--ym-input-border)] flex flex-col bg-[var(--ym-background)]">
              <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-6">
                <h2 className="text-lg font-medium flex items-center gap-2 text-[var(--ym-foreground)] shrink-0">
                  <FileText className="w-5 h-5 text-[var(--ym-muted-foreground)]" />
                  {t.dataInput}
                </h2>

                <div className="flex-1 flex flex-col space-y-4">
                  <div className="shrink-0 border-2 border-dashed border-[var(--ym-input-border)] rounded-[16px] p-6 text-center hover:bg-[var(--ym-muted)] transition-[background-color] duration-200 cursor-pointer relative">
                    <input
                      type="file"
                      accept=".csv,.txt,.json"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-[var(--ym-gray2)] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[var(--ym-foreground)]">{t.uploadText}</p>
                    <p className="text-xs text-[var(--ym-muted-foreground)] mt-1">{t.dragDrop}</p>
                  </div>

                  <div className="shrink-0 ym-card p-4">
                    <p className="text-xs text-[var(--ym-muted-foreground)] mb-2">{t.pasteRedditLink}</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={redditUrl}
                        onChange={(e) => setRedditUrl(e.target.value)}
                        placeholder={t.redditLinkPlaceholder}
                        className="ym-input flex-1"
                      />
                      <button
                        onClick={handleConvertRedditLink}
                        disabled={isConverting}
                        className="ym-btn-outline !min-h-0 px-3 py-2 whitespace-nowrap"
                      >
                        {isConverting ? <Loader2 className="w-4 h-4 animate-spin" /> : t.convertToJsonBtn}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-[var(--ym-input-border)]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[var(--ym-surface)] px-2 text-xs text-[var(--ym-muted-foreground)] uppercase tracking-wider">{t.orPaste}</span>
                    </div>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.jsonAreaPlaceholder}
                    className="ym-textarea flex-1 min-h-[200px]"
                  />

                  <button
                    type="button"
                    onClick={handleLoadDemo}
                    className="ym-btn-outline w-full shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--ym-gray1)]" />
                    {t.loadDemoBtn}
                  </button>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="ym-btn-primary w-full shrink-0 py-3.5"
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

            <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto bg-[var(--ym-surface)]">
              <div className="max-w-2xl mx-auto w-full h-full">
                {renderReportContent(report, true)}
              </div>
            </div>
          </section>
        ) : activePage === 'history' ? (
          <section className="flex-1 p-6 lg:p-8 overflow-hidden bg-[var(--ym-background)]">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 h-full">
              <div className="ym-card p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium text-[var(--ym-foreground)]">{t.historyTitle}</h2>
                  <button onClick={handleClearHistory} className="text-xs text-[var(--ym-muted-foreground)] hover:text-[var(--ym-foreground)]">
                    {t.clearHistory}
                  </button>
                </div>
                {historyRecords.length === 0 ? (
                  <p className="text-sm text-[var(--ym-caption)]">{t.historyEmpty}</p>
                ) : (
                  <div className="space-y-2">
                    {historyRecords.map((record) => (
                      <button
                        key={record.id}
                        onClick={() => setSelectedHistoryId(record.id)}
                        className={`w-full text-left p-3 border rounded-[12px] transition-colors ${
                          selectedHistoryId === record.id
                            ? 'border-[var(--ym-primary)] bg-[var(--ym-surface)] ring-1 ring-[var(--ym-input-border)]'
                            : 'border-[var(--ym-input-border)] hover:bg-[var(--ym-surface)] hover:border-[var(--ym-border)]'
                        }`}
                      >
                        <div className="text-xs text-[var(--ym-muted-foreground)] mb-1">{new Date(record.createdAt).toLocaleString()}</div>
                        <div className="text-sm text-[var(--ym-foreground)] line-clamp-1">
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

              <div className="ym-card p-6 overflow-y-auto">
                {selectedHistory ? (
                  <>
                    <div className="mb-4 text-xs text-[var(--ym-muted-foreground)]">
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
                  <div className="h-full min-h-[300px] flex items-center justify-center text-[var(--ym-caption)]">
                    {t.historyDetailEmpty}
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : activePage === 'content' ? (
          <section className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[var(--ym-background)]">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="ym-page-title">{t.contentTitle}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-[var(--ym-foreground)]">
                    <span className="whitespace-nowrap font-medium">{t.contentToneLabel}</span>
                    <select
                      value={contentTone}
                      onChange={(e) => setContentTone(e.target.value as ContentToneId)}
                      className="ym-select !w-auto"
                    >
                      <option value="curious">{t.toneCurious}</option>
                      <option value="question">{t.toneQuestion}</option>
                      <option value="recommend">{t.toneRecommend}</option>
                      <option value="rant">{t.toneRant}</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => generateContentIdeas(contentSourceReport)}
                    className="ym-btn-primary px-4 py-2 text-sm"
                  >
                    {t.regenerate}
                  </button>
                </div>
              </div>
              <p className="text-xs text-[var(--ym-muted-foreground)]">{t.contentToneHint}</p>

              <div className="ym-prompt-box space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contentPromptInput}
                    onChange={(e) => setContentPromptInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !contentSubSuggesting) generateFromPrompt(); }}
                    placeholder={t.promptPlaceholder}
                    className="ym-input flex-1 !border-0 !bg-transparent focus:!border-transparent !shadow-none"
                    disabled={contentSubSuggesting}
                  />
                  <button
                    type="button"
                    onClick={generateFromPrompt}
                    disabled={contentSubSuggesting || !contentPromptInput.trim()}
                    className="ym-btn-primary px-5 py-2.5 shrink-0"
                  >
                    {t.promptGenerate}
                  </button>
                </div>
                <p className="text-xs text-[var(--ym-muted-foreground)]">{t.promptHint}</p>
              </div>

              <div className="text-sm text-[var(--ym-muted-foreground)]">
                {contentPromptSource
                  ? `${t.basedOnPrompt} — ${contentPromptSource}`
                  : report ? t.basedOnReport : selectedHistory ? t.basedOnHistory : t.contentEmpty}
              </div>
              {!contentSourceReport && !contentSubSuggesting && contentIdeas.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-[var(--ym-caption)] border-2 border-dashed border-[var(--ym-input-border)] rounded-[16px]">
                  {t.contentEmpty}
                </div>
              ) : contentSubSuggesting && contentIdeas.length === 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="ym-card overflow-hidden animate-pulse">
                      <div className="p-5 border-b border-[var(--ym-input-border)]">
                        <div className="h-4 w-20 bg-[var(--ym-gray4)] rounded-full mb-3" />
                        <div className="h-5 w-3/4 bg-[var(--ym-gray4)] rounded-[12px] mb-2" />
                        <div className="h-4 w-1/2 bg-[var(--ym-gray4)] rounded-[12px]" />
                      </div>
                      <div className="p-5 space-y-3 bg-[var(--ym-background)]">
                        <div className="h-4 w-24 bg-[var(--ym-gray4)] rounded-[12px]" />
                        <div className="h-10 w-full bg-[var(--ym-muted)] rounded-[12px]" />
                        <div className="h-4 w-20 bg-[var(--ym-gray4)] rounded-[12px]" />
                        <div className="h-24 w-full bg-[var(--ym-muted)] rounded-[12px]" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-[var(--ym-muted-foreground)]">
                    <svg className="w-4 h-4 animate-spin text-[var(--ym-primary)]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {language === 'zh' ? 'AI 正在生成内容，请稍候…' : 'AI is generating content, please wait…'}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {contentIdeas.map((idea, idx) => (
                    <article
                      key={`${idea.title}-${idx}`}
                      className="ym-card overflow-hidden transition-[box-shadow] duration-200 hover:shadow-[var(--ym-shadow-prompt)]"
                    >
                      <div className="p-5 border-b border-[var(--ym-input-border)]">
                        <div className="ym-badge mb-2.5">
                          {language === 'zh' ? '主题' : 'Topic'} {idx + 1}
                        </div>
                        <h3 className="text-base font-medium text-[var(--ym-foreground)] mb-2 leading-snug">{idea.title}</h3>
                        <p className="text-sm text-[var(--ym-muted-foreground)] leading-relaxed mb-3">{idea.angle}</p>
                        <div className="flex flex-wrap gap-2">
                          {idea.basedOn.map((tag, i) => (
                            <span key={`${tag}-${i}`} className="ym-badge">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 space-y-4 bg-[var(--ym-background)]">
                        <h4 className="text-sm font-medium text-[var(--ym-foreground)] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[var(--ym-primary)]" />
                          {t.contentDraftSection}
                        </h4>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-[var(--ym-muted-foreground)] uppercase tracking-wide">{t.redditPostTitleLabel}</div>
                          <p className="text-sm font-medium text-[var(--ym-foreground)] leading-snug ym-card px-4 py-2.5 !rounded-[12px]">
                            {idea.content.postTitle}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-[var(--ym-muted-foreground)] uppercase tracking-wide">{t.redditPostBodyLabel}</div>
                          <div className="text-sm text-[var(--ym-foreground)] leading-relaxed ym-card px-4 py-3 whitespace-pre-wrap font-sans !rounded-[12px]">
                            {idea.content.postBody}
                          </div>
                        </div>

                        {idea.content.suggestedSubreddit ? (
                          <p className="text-xs text-[var(--ym-muted-foreground)]">
                            <span className="font-medium text-[var(--ym-foreground)]">{t.redditSubredditHint}:</span>{' '}
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
          <section className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8 bg-[var(--ym-background)]">
            <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-4">
              <div>
                <h2 className="ym-page-title">{t.monitorTitle}</h2>
                <p className="text-sm text-[var(--ym-muted-foreground)] mt-1">{t.monitorHelp}</p>
                <div className="mt-3 p-3 rounded-[12px] bg-[var(--ym-muted)] border border-[var(--ym-input-border)] text-sm text-[var(--ym-muted-foreground)] leading-relaxed">
                  {t.monitorCompetitiveHint}
                </div>
              </div>

              <div className="ym-card p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="text-xs font-medium text-[var(--ym-muted-foreground)]">
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
                      <span className="text-xs text-[var(--ym-muted-foreground)]">{t.monitorDateLabel}</span>
                      <input
                        type="date"
                        value={monitorDay}
                        onChange={(e) => setMonitorDay(e.target.value)}
                        className="ym-input text-sm px-2 py-1.5"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-xs font-medium text-[var(--ym-muted-foreground)]">{t.monitorSubredditLabel}</label>
                    <button
                      type="button"
                      onClick={() => setMonitorSubreddits((rows) => [...rows, ''])}
                      title={t.monitorAddSubreddit}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--ym-input-border)] bg-[var(--ym-board-card)] hover:bg-[var(--ym-board-card)] text-[var(--ym-foreground)] text-lg font-medium leading-none"
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
                          className="ym-input flex-1 min-w-0"
                        />
                        {monitorSubreddits.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setMonitorSubreddits((prev) => prev.filter((_, i) => i !== idx))
                            }
                            title={language === 'zh' ? '移除此行' : 'Remove row'}
                            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--ym-input-border)] bg-[var(--ym-surface)] hover:bg-[var(--ym-board-card)] text-[var(--ym-muted-foreground)] hover:text-[var(--ym-foreground)]"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.monitorLimit}</label>
                  <select
                    value={monitorLimit}
                    onChange={(e) => setMonitorLimit(Number(e.target.value))}
                    className="ym-input w-full"
                  >
                    {[5, 8, 10, 12, 15, 20, 25].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-[var(--ym-foreground)] cursor-pointer pb-1">
                  <input
                    type="checkbox"
                    checked={monitorUseGemini}
                    onChange={(e) => setMonitorUseGemini(e.target.checked)}
                    className="rounded border-[var(--ym-gray2)]"
                  />
                  {t.monitorUseGemini}
                </label>
                <button
                  type="button"
                  onClick={handleMonitorScan}
                  disabled={monitorLoading}
                  className="ym-btn-primary"
                >
                  {monitorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rss className="w-4 h-4" />}
                  {monitorLoading ? t.monitorLoading : t.monitorFetchBtn}
                </button>
                </div>
              </div>

              {monitorFetchedAt ? (
                <p className="text-xs text-[var(--ym-muted-foreground)]">
                  {t.monitorFetchedAt}: {new Date(monitorFetchedAt).toLocaleString()}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-[var(--ym-muted-foreground)]">{t.monitorEmotion}:</span>
                <select
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                  className="ym-select text-sm px-2 py-1"
                >
                  <option value="all">{t.monitorFilterAll}</option>
                  {['疑惑', '生气', '兴奋', '失望', '讽刺', '中性'].map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[var(--ym-muted-foreground)] ml-2">{t.monitorCategory}:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="ym-select text-sm px-2 py-1"
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
                  <div className="h-48 flex items-center justify-center text-[var(--ym-caption)] border-2 border-dashed border-[var(--ym-input-border)] rounded-2xl bg-[var(--ym-surface)] text-sm px-4 text-center">
                    {t.monitorEmpty}
                  </div>
                ) : (
                  filteredMonitorPosts.map((p) => (
                    <article
                      key={p.id}
                      className="ym-card overflow-hidden border-l-4 border-l-[var(--ym-gray2)] p-0"
                    >
                      <div className="p-4 border-b border-[var(--ym-gray4)] flex flex-wrap items-start gap-2 justify-between">
                        <div className="flex-1 min-w-0">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base font-semibold text-[var(--ym-foreground)] hover:text-[var(--ym-gray1)] leading-snug"
                          >
                            {p.title}
                          </a>
                          <div className="text-xs text-[var(--ym-muted-foreground)] mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span>{p.subreddit.startsWith('r/') ? p.subreddit : `r/${p.subreddit}`}</span>
                            <span>u/{p.author}</span>
                            <span>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</span>
                            <span>↑{p.score}</span>
                            <span>💬{p.numComments}</span>
                            {p.flair ? (
                              <span className="text-[var(--ym-gray0)] bg-[var(--ym-gray4)] px-1.5 py-0.5 rounded border border-[var(--ym-input-border)] text-[11px] font-medium">
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
                              p.classificationSource !== 'heuristic'
                                ? 'bg-[var(--ym-gray4)] text-[var(--ym-foreground)] border-[var(--ym-gray3)]'
                                : 'bg-[var(--ym-board-card)] text-[var(--ym-gray1)] border-[var(--ym-input-border)]'
                            }`}
                          >
                            {p.classificationSource === 'minimax'
                              ? t.monitorSourceMinimax
                              : p.classificationSource === 'gemini'
                                ? t.monitorSourceGemini
                                : t.monitorSourceHeuristic}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 pb-3 border-b border-[var(--ym-subtle-border)]">
                        <button
                          type="button"
                          onClick={() => openMonitorPostForAnalyze(p)}
                          className="ym-btn-primary px-3 py-2 text-sm inline-flex"
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
                            ring: 'ring-[var(--ym-gray4)]',
                            bar: 'border-l-[var(--ym-primary)]',
                            bg: 'bg-[var(--ym-board-card)]',
                            itemBorder: 'border-[var(--ym-input-border)]',
                          },
                          {
                            key: 'dislikes',
                            label: t.monitorIntentDislikes,
                            ring: 'ring-[var(--ym-gray3)]',
                            bar: 'border-l-[var(--ym-gray0)]',
                            bg: 'bg-[var(--ym-gray4)]',
                            itemBorder: 'border-[var(--ym-gray3)]',
                          },
                          {
                            key: 'requests',
                            label: t.monitorIntentRequests,
                            ring: 'ring-[var(--ym-gray4)]',
                            bar: 'border-l-[var(--ym-gray1)]',
                            bg: 'bg-[var(--ym-board-card)]',
                            itemBorder: 'border-[var(--ym-input-border)]',
                          },
                          {
                            key: 'complaints',
                            label: t.monitorIntentComplaints,
                            ring: 'ring-[var(--ym-gray3)]',
                            bar: 'border-l-[var(--ym-gray1)]',
                            bg: 'bg-[var(--ym-gray4)]',
                            itemBorder: 'border-[var(--ym-gray3)]',
                          },
                        ];
                        return (
                          <div className="px-4 py-3 bg-[var(--ym-board-card)]/90 border-b border-[var(--ym-subtle-border)]">
                            <div className="text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ym-surface)] px-2 py-0.5 border border-[var(--ym-input-border)] text-[var(--ym-foreground)] shadow-sm">
                                {t.monitorIntentSection}
                              </span>
                              <span className="text-[var(--ym-caption)] font-normal">
                                {' '}
                                — {p.classificationSource !== 'heuristic' ? t.monitorIntentByAi : t.monitorIntentByKeyword}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {blocks.map(({ key, label, ring, bar, bg, itemBorder }) => (
                                <div
                                  key={key}
                                  className={`rounded-lg border border-[var(--ym-input-border)]/80 p-2.5 shadow-sm ring-1 ${ring} ${bg} border-l-4 ${bar}`}
                                >
                                  <div className="text-[11px] font-semibold text-[var(--ym-foreground)] mb-1.5">{label}</div>
                                  {im[key].length === 0 ? (
                                    <p className="text-xs text-[var(--ym-caption)]">—</p>
                                  ) : (
                                    <ul className="space-y-1">
                                      {im[key].map((line, i) => (
                                        <li
                                          key={i}
                                          className={`text-xs text-[var(--ym-foreground)] leading-snug pl-2 border-l-2 ${itemBorder} bg-[var(--ym-surface)]/60 rounded-r`}
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
                        <div className="px-4 py-3 bg-[var(--ym-board-card)]/80 border-b border-[var(--ym-subtle-border)]">
                          <div className="text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.monitorBody}</div>
                          <div className="text-sm text-[var(--ym-foreground)] whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                            {p.body}
                          </div>
                        </div>
                      ) : null}

                      <div className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => setExpandedMonitorId((id) => (id === p.id ? null : p.id))}
                          className="text-xs text-[var(--ym-muted-foreground)] hover:text-[var(--ym-foreground)]"
                        >
                          {expandedMonitorId === p.id ? '▼' : '▶'} {t.monitorComments} ({p.comments.length})
                        </button>
                        {expandedMonitorId === p.id ? (
                          <ul className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                            {p.comments.map((c) => (
                              <li key={c.id} className="text-sm border-l-2 border-[var(--ym-gray2)] bg-[var(--ym-board-card)] pl-3 py-1 rounded-r">
                                <span className="text-xs text-[var(--ym-muted-foreground)]">u/{c.author} ↑{c.score}</span>
                                <p className="text-[var(--ym-foreground)] whitespace-pre-wrap mt-0.5">{c.body}</p>
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
          <section className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8 bg-[var(--ym-background)]">
            <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 shrink-0">
                <div>
                  <h2 className="ym-page-title flex flex-wrap items-center gap-2">
                    {t.competitiveTitle}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--ym-gray4)] text-[var(--ym-foreground)] border border-[var(--ym-input-border)]">
                      Instagram
                    </span>
                  </h2>
                  <p className="text-sm text-[var(--ym-muted-foreground)] mt-1 max-w-2xl">{t.competitiveHelp}</p>
                  <p className="text-xs text-[var(--ym-caption)] mt-2">{t.competitiveCronNote}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCompetitiveSync}
                  disabled={competitiveSyncing}
                  className="ym-btn-primary px-4 py-2.5 text-sm shrink-0"
                >
                  {competitiveSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  {competitiveSyncing ? t.competitiveSyncing : t.competitiveSync}
                </button>
              </div>

              {competitiveLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--ym-caption)]" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-6 pr-1 min-h-0">
                  <p className="text-xs text-[var(--ym-muted-foreground)]">
                    {t.competitiveLastRun}:{' '}
                    {competitiveCache?.updatedAt
                      ? new Date(String(competitiveCache.updatedAt)).toLocaleString()
                      : '—'}
                  </p>

                  <div className="ym-card p-4">
                    <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-2">{t.competitiveHistoryTitle}</h3>
                    {(() => {
                      const history = Array.isArray((competitiveCache as any)?.history)
                        ? ((competitiveCache as any).history as Array<any>)
                        : [];
                      if (history.length === 0) {
                        return <p className="text-xs text-[var(--ym-caption)]">{t.competitiveHistoryEmpty}</p>;
                      }
                      return (
                        <div className="max-h-52 overflow-y-auto divide-y divide-[var(--ym-subtle-border)]">
                          {history.map((h, idx) => {
                            const by = (h?.instagram?.postsByUsername || {}) as Record<string, Array<Record<string, unknown>>>;
                            const total = Object.values(by).reduce((n, rows) => n + (Array.isArray(rows) ? rows.length : 0), 0);
                            const hasError = typeof h?.instagram?.error === 'string' && h.instagram.error.length > 0;
                            return (
                              <div key={`${h?.updatedAt || 'row'}-${idx}`} className="py-2 text-xs flex items-center justify-between gap-3">
                                <div className="text-[var(--ym-foreground)]">
                                  {h?.updatedAt ? new Date(String(h.updatedAt)).toLocaleString() : '—'}
                                </div>
                                <div className={`font-medium ${hasError ? 'text-[var(--ym-muted-foreground)]' : 'text-[var(--ym-foreground)]'}`}>
                                  {hasError ? (language === 'zh' ? '失败' : 'Failed') : `${total} posts`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="ym-card p-4 border-t-4 border-t-[var(--ym-primary)]">
                    <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--ym-primary)]" aria-hidden />
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
                          <div className="text-sm text-[var(--ym-foreground)] bg-[var(--ym-board-card)] border border-[var(--ym-input-border)] border-l-4 border-l-[var(--ym-primary)] rounded-lg px-3 py-2">
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
                          <div className="flex flex-wrap items-end gap-3 p-3 rounded-lg bg-[var(--ym-board-card)] border border-[var(--ym-subtle-border)]">
                            <div className="flex-1 min-w-[200px]">
                              <div className="text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.competitiveFilterAccounts}</div>
                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next: Record<string, boolean> = {};
                                    for (const k of accountKeys) next[k] = true;
                                    setIgFilterSelections(next);
                                  }}
                                  className="text-xs text-[var(--ym-gray0)] hover:underline"
                                >
                                  {t.competitiveFilterAllAccounts}
                                </button>
                                {pilotHandles.map((uname) => {
                                  const key = uname.toLowerCase();
                                  return (
                                    <label key={key} className="inline-flex items-center gap-1.5 text-xs text-[var(--ym-foreground)] cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={igFilterSelections[key] !== false}
                                        onChange={(e) =>
                                          setIgFilterSelections((prev) => ({
                                            ...prev,
                                            [key]: e.target.checked,
                                          }))
                                        }
                                        className="rounded border-[var(--ym-gray2)]"
                                      />
                                      @{uname}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <label className="text-xs text-[var(--ym-muted-foreground)] flex items-center gap-1">
                                {t.competitiveFilterDateFrom}
                                <input
                                  type="date"
                                  value={igDateFrom}
                                  onChange={(e) => setIgDateFrom(e.target.value)}
                                  className="ym-input text-sm px-2 py-1"
                                />
                              </label>
                              <label className="text-xs text-[var(--ym-muted-foreground)] flex items-center gap-1">
                                {t.competitiveFilterDateTo}
                                <input
                                  type="date"
                                  value={igDateTo}
                                  onChange={(e) => setIgDateTo(e.target.value)}
                                  className="ym-input text-sm px-2 py-1"
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
                                className="text-xs px-2 py-1 rounded-md border border-[var(--ym-input-border)] bg-[var(--ym-surface)] hover:bg-[var(--ym-board-card)] text-[var(--ym-foreground)]"
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
                            <p className="text-sm text-[var(--ym-caption)]">{t.competitiveIgEmpty}</p>
                          ) : null}

                          <div className="space-y-6">
                            {totalInCache > 0 && totalFilteredPosts === 0 ? (
                              <p className="text-sm text-[var(--ym-muted-foreground)] text-center py-6">{t.competitiveFilterNoMatch}</p>
                            ) : (
                              rowsByAccount.map(({ uname, rows }) =>
                                rows.length === 0 ? null : (
                                  <div key={uname}>
                                    <div className="text-xs font-medium text-[var(--ym-foreground)] mb-2">@{uname}</div>
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
                                            className="text-xs border border-[var(--ym-subtle-border)] rounded-lg p-2 bg-[var(--ym-board-card)]/80"
                                          >
                                            <div className="flex flex-wrap items-start gap-2">
                                              <a
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-medium text-[var(--ym-foreground)] hover:text-[var(--ym-gray1)] line-clamp-2 flex-1 min-w-0"
                                              >
                                                {caption || '(no caption)'}
                                              </a>
                                              {pk === 'collaboration' ? (
                                                <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-[var(--ym-gray4)] text-[var(--ym-foreground)] border border-[var(--ym-input-border)] text-[10px] font-semibold">
                                                  {t.competitiveTagCollab}
                                                </span>
                                              ) : null}
                                              {pk === 'repost' ? (
                                                <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-[var(--ym-gray3)] text-[var(--ym-foreground)] border border-[var(--ym-gray3)] text-[10px] font-semibold">
                                                  {t.competitiveTagRepost}
                                                </span>
                                              ) : null}
                                            </div>
                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[var(--ym-muted-foreground)]">
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
          <section className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8 bg-[var(--ym-background)]">
            <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 shrink-0">
                <div>
                  <h2 className="ym-page-title flex flex-wrap items-center gap-2">
                    {t.socialDashTitle}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--ym-gray4)] text-[var(--ym-foreground)] border border-[var(--ym-input-border)]">
                      Instagram
                    </span>
                  </h2>
                  <p className="text-sm text-[var(--ym-muted-foreground)] mt-1 max-w-2xl">{t.socialDashIntro}</p>
                  <p className="text-xs text-[var(--ym-caption)] mt-2">
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
                  className="ym-btn-primary px-4 py-2.5 text-sm shrink-0"
                >
                  {competitiveSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                  {competitiveSyncing ? t.competitiveSyncing : t.competitiveSync}
                </button>
              </div>

              {competitiveLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--ym-caption)]" />
                </div>
              ) : !socialDashboard ? (
                <p className="text-sm text-[var(--ym-muted-foreground)] py-8">{t.socialDashEmpty}</p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                  <p className="text-xs text-[var(--ym-muted-foreground)]">
                    {t.socialSec1FetchAt}:{' '}
                    {socialDashboard.fetchedAt
                      ? new Date(String(socialDashboard.fetchedAt)).toLocaleString()
                      : '—'}
                  </p>
                  <p className="text-xs text-[var(--ym-caption)]">{t.socialSec1FollowersNote}</p>

                  <div className="ym-card p-4 border-t-4 border-t-[var(--ym-primary)]">
                    <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--ym-primary)]" aria-hidden />
                      {t.socialSec1Title}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--ym-muted-foreground)] border-b border-[var(--ym-subtle-border)]">
                            <th className="py-2 pr-4 font-medium">@</th>
                            <th className="py-2 font-medium">{t.socialSec1PostsSample}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {socialDashboard.accountRows.map((row) => (
                            <tr key={row.handle} className="border-b border-[var(--ym-subtle-border)] last:border-0">
                              <td className="py-2 pr-4 text-[var(--ym-foreground)]">{row.handle}</td>
                              <td className="py-2 text-[var(--ym-foreground)] tabular-nums">{row.postsInSample}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="ym-card p-4 border-t-4 border-t-[var(--ym-gray0)]">
                    <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--ym-gray0)]" aria-hidden />
                      {t.socialSec2Title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.socialSec2Kind}</div>
                        <ul className="space-y-1.5 text-sm text-[var(--ym-foreground)]">
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ym-primary)]" aria-hidden />
                              {t.socialKindOriginal}
                            </span>
                            <span className="tabular-nums font-semibold text-[var(--ym-foreground)] bg-[var(--ym-board-card)] px-2 py-0.5 rounded-md border border-[var(--ym-input-border)]">
                              {socialDashboard.contentMix.original}
                            </span>
                          </li>
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ym-gray1)]" aria-hidden />
                              {t.socialKindCollab}
                            </span>
                            <span className="tabular-nums font-semibold text-[var(--ym-foreground)] bg-[var(--ym-gray4)] px-2 py-0.5 rounded-md border border-[var(--ym-input-border)]">
                              {socialDashboard.contentMix.collaboration}
                            </span>
                          </li>
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ym-gray2)]" aria-hidden />
                              {t.socialKindRepost}
                            </span>
                            <span className="tabular-nums font-semibold text-[var(--ym-gray0)] bg-[var(--ym-board-card)] px-2 py-0.5 rounded-md border border-[var(--ym-gray3)]">
                              {socialDashboard.contentMix.repost}
                            </span>
                          </li>
                          <li className="flex justify-between gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ym-caption)]" aria-hidden />
                              {t.socialKindUnknown}
                            </span>
                            <span className="tabular-nums font-semibold text-[var(--ym-foreground)] bg-[var(--ym-gray4)] px-2 py-0.5 rounded-md border border-[var(--ym-input-border)]">
                              {socialDashboard.contentMix.unknown}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.socialSec2Media}</div>
                        {Object.keys(socialDashboard.mediaTypeMix).length === 0 ? (
                          <p className="text-sm text-[var(--ym-caption)]">—</p>
                        ) : (
                          <ul className="space-y-1.5 text-sm text-[var(--ym-foreground)]">
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

                  <div className="ym-card p-4 border-t-4 border-t-[var(--ym-gray1)]">
                    <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--ym-board-card)]0" aria-hidden />
                      {t.socialSec3Title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="rounded-lg bg-[var(--ym-board-card)] border border-[var(--ym-input-border)] px-3 py-2">
                        <div className="text-xs text-[var(--ym-gray1)] font-medium">{t.socialSec3TotalLikes}</div>
                        <div className="text-lg font-semibold text-[var(--ym-foreground)] tabular-nums">
                          {Math.round(socialDashboard.engagement.totalLikes).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--ym-gray4)] border border-[var(--ym-input-border)] px-3 py-2">
                        <div className="text-xs text-[var(--ym-gray1)] font-medium">{t.socialSec3TotalComments}</div>
                        <div className="text-lg font-semibold text-[var(--ym-foreground)] tabular-nums">
                          {Math.round(socialDashboard.engagement.totalComments).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--ym-board-card)] border border-[var(--ym-gray3)] px-3 py-2">
                        <div className="text-xs text-[var(--ym-gray1)] font-medium">{t.socialSec3AvgLikes}</div>
                        <div className="text-lg font-semibold text-[var(--ym-foreground)] tabular-nums">
                          {socialDashboard.engagement.avgLikes.toFixed(1)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--ym-gray4)] border border-[var(--ym-gray3)] px-3 py-2">
                        <div className="text-xs text-[var(--ym-gray1)] font-medium">{t.socialSec3AvgComments}</div>
                        <div className="text-lg font-semibold text-[var(--ym-foreground)] tabular-nums">
                          {socialDashboard.engagement.avgComments.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.socialSec3ByAccount}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[var(--ym-muted-foreground)] border-b border-[var(--ym-subtle-border)]">
                            <th className="py-2 pr-4 font-medium">@</th>
                            <th className="py-2 pr-4 font-medium">{t.competitiveLikes} ∅</th>
                            <th className="py-2 font-medium">{t.competitiveComments} ∅</th>
                            <th className="py-2 pl-2 font-medium text-right">n</th>
                          </tr>
                        </thead>
                        <tbody>
                          {socialDashboard.engagement.byAccount.map((row) => (
                            <tr key={row.handle} className="border-b border-[var(--ym-subtle-border)] last:border-0">
                              <td className="py-2 pr-4 text-[var(--ym-foreground)]">{row.handle}</td>
                              <td className="py-2 pr-4 tabular-nums">{row.avgLikes.toFixed(1)}</td>
                              <td className="py-2 tabular-nums">{row.avgComments.toFixed(1)}</td>
                              <td className="py-2 pl-2 text-right tabular-nums text-[var(--ym-muted-foreground)]">{row.n}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="ym-card p-4 border-t-4 border-t-[var(--ym-gray2)]">
                    <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--ym-gray2)]" aria-hidden />
                      {t.socialSec4Title}
                    </h3>
                    <dl className="grid sm:grid-cols-2 gap-3 text-sm text-[var(--ym-foreground)]">
                      <div className="flex justify-between gap-2 border-b border-[var(--ym-subtle-border)] pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-[var(--ym-muted-foreground)]">{t.socialSec4Span}</dt>
                        <dd className="tabular-nums text-right">
                          {socialDashboard.cadence.dateMin && socialDashboard.cadence.dateMax
                            ? `${socialDashboard.cadence.dateMin} → ${socialDashboard.cadence.dateMax}`
                            : '—'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-[var(--ym-subtle-border)] pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-[var(--ym-muted-foreground)]">{t.socialSec4Days}</dt>
                        <dd className="tabular-nums text-right">{socialDashboard.cadence.spanDays || '—'}</dd>
                      </div>
                      <div className="flex justify-between gap-2 border-b border-[var(--ym-subtle-border)] pb-2 sm:border-0 sm:pb-0">
                        <dt className="text-[var(--ym-muted-foreground)]">{t.socialSec4Ppw}</dt>
                        <dd className="tabular-nums text-right">
                          {socialDashboard.cadence.spanDays > 0
                            ? socialDashboard.cadence.postsPerWeek.toFixed(2)
                            : '—'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-[var(--ym-muted-foreground)]">{t.socialSec4PeakDay}</dt>
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
          <div className="bg-[var(--ym-surface)] rounded-[24px] max-w-md w-full p-6 shadow-[var(--ym-shadow-prompt)] animate-in zoom-in-95 duration-200">
            <h2 className="font-display text-xl font-medium mb-4 text-[var(--ym-foreground)]">{t.settingsTitle}</h2>
            
            <div className="space-y-4">
              <div className="bg-[var(--ym-muted)] text-[var(--ym-muted-foreground)] p-3 rounded-[12px] text-xs flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t.settingsHelp}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ym-foreground)] mb-1">{t.apiKeyLabel}</label>
                <input 
                  type="password" 
                  value={notionApiKey}
                  onChange={(e) => setNotionApiKey(e.target.value)}
                  placeholder="secret_..."
                  className="ym-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--ym-foreground)] mb-1">{t.dbIdLabel}</label>
                <input 
                  type="text" 
                  value={notionDbId}
                  onChange={(e) => setNotionDbId(e.target.value)}
                  placeholder="e.g. 1234567890abcdef1234567890abcdef"
                  className="ym-input"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="ym-btn-ghost px-4 py-2"
              >
                {t.cancel}
              </button>
              <button 
                onClick={saveSettings}
                className="ym-btn-primary px-4 py-2 text-sm"
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
