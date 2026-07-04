import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Loader2, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

type SourceType =
  | 'brand_guide'
  | 'product_desc'
  | 'history_copy'
  | 'subreddit_rules'
  | 'campaign_strategy';

type KnowledgeDocument = {
  id: string;
  title: string;
  sourceType: SourceType;
  tags: string[];
  language: 'en' | 'zh';
  performanceWeight: number;
  chunkCount: number;
  createdAt: string;
};

type KnowledgeMatch = {
  id: string;
  title: string;
  content: string;
  sourceType: SourceType;
  combinedScore: number;
};

const SOURCE_OPTIONS: { id: SourceType; en: string; zh: string }[] = [
  { id: 'brand_guide', en: 'Brand guide', zh: '品牌指南' },
  { id: 'product_desc', en: 'Product description', zh: '产品描述' },
  { id: 'history_copy', en: 'Historical copy', zh: '历史文案' },
  { id: 'subreddit_rules', en: 'Subreddit rules', zh: '版块规则' },
  { id: 'campaign_strategy', en: 'Campaign strategy', zh: 'Campaign 策略' },
];

const copy = {
  en: {
    title: 'Knowledge base (RAG)',
    hint: 'Requires Supabase + pgvector migration and OPENAI_API_KEY for embeddings.',
    notConfigured: 'RAG is not configured. Run migration 002_knowledge_rag.sql and set env vars.',
    addTitle: 'Add knowledge document',
    docTitle: 'Title',
    docTitlePh: 'e.g. Brand voice guide Q1',
    sourceType: 'Source type',
    language: 'Language',
    perfWeight: 'Performance weight (0–1)',
    content: 'Content',
    contentPh: 'Paste brand guide, product copy, or high-performing posts…',
    tags: 'Tags (comma separated)',
    ingestBtn: 'Ingest & embed',
    ingesting: 'Embedding…',
    library: 'Documents',
    libraryEmpty: 'No documents yet.',
    chunks: 'chunks',
    delete: 'Delete',
    searchTitle: 'Test retrieval',
    searchPh: 'e.g. SaaS pricing pain points',
    searchBtn: 'Search',
    searching: 'Searching…',
    searchEmpty: 'No matches.',
    score: 'score',
    toastIngestOk: 'Document ingested',
    toastIngestFail: 'Ingest failed',
    toastDeleteOk: 'Deleted',
    toastDeleteFail: 'Delete failed',
    toastLoadFail: 'Failed to load',
    toastSearchFail: 'Search failed',
  },
  zh: {
    title: '知识库（RAG）',
    hint: '需执行 Supabase 迁移 002_knowledge_rag.sql，并配置 OPENAI_API_KEY 做 embedding。',
    notConfigured: 'RAG 未配置。请先运行迁移并设置环境变量。',
    addTitle: '添加知识文档',
    docTitle: '标题',
    docTitlePh: '例如：Q1 品牌语气指南',
    sourceType: '来源类型',
    language: '语言',
    perfWeight: '效果权重（0–1）',
    content: '正文',
    contentPh: '粘贴品牌指南、产品文案或高互动帖子…',
    tags: '标签（逗号分隔）',
    ingestBtn: '入库并向量化',
    ingesting: '向量化中…',
    library: '文档列表',
    libraryEmpty: '暂无文档。',
    chunks: '块',
    delete: '删除',
    searchTitle: '检索测试',
    searchPh: '例如：SaaS 定价痛点',
    searchBtn: '搜索',
    searching: '搜索中…',
    searchEmpty: '无匹配结果。',
    score: '分',
    toastIngestOk: '文档已入库',
    toastIngestFail: '入库失败',
    toastDeleteOk: '已删除',
    toastDeleteFail: '删除失败',
    toastLoadFail: '加载失败',
    toastSearchFail: '搜索失败',
  },
} as const;

function sourceLabel(id: SourceType, lang: 'en' | 'zh'): string {
  return SOURCE_OPTIONS.find((x) => x.id === id)?.[lang] ?? id;
}

type Props = { language: 'en' | 'zh' };

export function KnowledgeLibrary({ language }: Props) {
  const t = copy[language];
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('brand_guide');
  const [docLanguage, setDocLanguage] = useState<'en' | 'zh'>(language);
  const [performanceWeight, setPerformanceWeight] = useState('0.6');
  const [tags, setTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<KnowledgeMatch[]>([]);

  const loadStatus = useCallback(async () => {
    const res = await fetch('/api/knowledge/status');
    const data = await res.json();
    setConfigured(Boolean(data.configured));
  }, []);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'load failed');
      setDocuments(data.documents ?? []);
      setConfigured(true);
    } catch (e) {
      if (configured === false) return;
      toast.error(e instanceof Error ? e.message : t.toastLoadFail);
    } finally {
      setLoading(false);
    }
  }, [configured, t.toastLoadFail]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (configured) void loadDocuments();
    else setLoading(false);
  }, [configured, loadDocuments]);

  const handleIngest = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error(language === 'zh' ? '请填写标题和正文' : 'Title and content required');
      return;
    }
    setIngesting(true);
    try {
      const res = await fetch('/api/knowledge/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          sourceType,
          language: docLanguage,
          performanceWeight: Number(performanceWeight) || 0.5,
          tags: tags
            .split(/[,，]/)
            .map((x) => x.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'ingest failed');
      toast.success(t.toastIngestOk);
      setTitle('');
      setContent('');
      setTags('');
      await loadDocuments();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastIngestFail);
    } finally {
      setIngesting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'zh' ? '确定删除？' : 'Delete this document?')) return;
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'delete failed');
      toast.success(t.toastDeleteOk);
      await loadDocuments();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastDeleteFail);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim(), topK: 5, language: docLanguage }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'search failed');
      setMatches(data.matches ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastSearchFail);
    } finally {
      setSearching(false);
    }
  };

  if (configured === false) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        <div className="ym-card p-8 text-center space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-[var(--ym-gray2)]" />
          <p className="text-sm text-[var(--ym-muted-foreground)]">{t.notConfigured}</p>
          <p className="text-xs text-[var(--ym-caption)]">{t.hint}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 space-y-6">
      <p className="text-xs text-[var(--ym-caption)]">{t.hint}</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="ym-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--ym-foreground)]">{t.addTitle}</h3>
          <div>
            <label className="block text-xs text-[var(--ym-muted-foreground)] mb-1">{t.docTitle}</label>
            <input className="ym-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.docTitlePh} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--ym-muted-foreground)] mb-1">{t.sourceType}</label>
              <select className="ym-input" value={sourceType} onChange={(e) => setSourceType(e.target.value as SourceType)}>
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {sourceLabel(opt.id, language)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--ym-muted-foreground)] mb-1">{t.language}</label>
              <select className="ym-input" value={docLanguage} onChange={(e) => setDocLanguage(e.target.value as 'en' | 'zh')}>
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--ym-muted-foreground)] mb-1">{t.perfWeight}</label>
            <input className="ym-input" type="number" min={0} max={1} step={0.05} value={performanceWeight} onChange={(e) => setPerformanceWeight(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-[var(--ym-muted-foreground)] mb-1">{t.content}</label>
            <textarea className="ym-input min-h-[160px] resize-y" value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPh} />
          </div>
          <div>
            <label className="block text-xs text-[var(--ym-muted-foreground)] mb-1">{t.tags}</label>
            <input className="ym-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="brand, reddit, saas" />
          </div>
          <button type="button" className="ym-btn-primary w-full py-2.5 text-sm" disabled={ingesting} onClick={() => void handleIngest()}>
            {ingesting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : t.ingestBtn}
          </button>
        </div>

        <div className="space-y-4">
          <div className="ym-card p-5">
            <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3">{t.library}</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--ym-caption)]" />
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-[var(--ym-muted-foreground)]">{t.libraryEmpty}</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="ym-gen-row">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ym-foreground)] truncate">{doc.title}</p>
                      <p className="text-xs text-[var(--ym-caption)]">
                        {sourceLabel(doc.sourceType, language)} · {doc.chunkCount} {t.chunks} · w={doc.performanceWeight.toFixed(2)}
                      </p>
                    </div>
                    <button type="button" className="ym-btn-ghost text-xs text-[var(--ym-destructive)] shrink-0" onClick={() => void handleDelete(doc.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.delete}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ym-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--ym-foreground)]">{t.searchTitle}</h3>
            <div className="flex gap-2">
              <input className="ym-input flex-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPh} />
              <button type="button" className="ym-btn-primary px-4 py-2 text-sm shrink-0" disabled={searching} onClick={() => void handleSearch()}>
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {searching ? t.searching : t.searchBtn}
              </button>
            </div>
            {matches.length === 0 && searchQuery && !searching ? (
              <p className="text-xs text-[var(--ym-muted-foreground)]">{t.searchEmpty}</p>
            ) : (
              <div className="space-y-2">
                {matches.map((m) => (
                  <div key={m.id} className="rounded-[12px] bg-[var(--ym-muted)] p-3">
                    <p className="text-xs font-medium text-[var(--ym-foreground)]">
                      {m.title} · {sourceLabel(m.sourceType, language)} · {t.score} {m.combinedScore.toFixed(2)}
                    </p>
                    <p className="text-xs text-[var(--ym-muted-foreground)] mt-1 line-clamp-4">{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
