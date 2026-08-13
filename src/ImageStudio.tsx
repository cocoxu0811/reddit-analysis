import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageIcon,
  Layers,
  Loader2,
  Maximize2,
  Paperclip,
  Ratio,
  Send,
  Sparkles,
  Store,
  WandSparkles,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CodexToolStep } from './codex/CodexWorkspace';

type PlatformOption = {
  id: string;
  label: string;
};

type SizePreset = {
  label: string;
  value: string;
};

type AssetPickerItem = {
  id: string;
  name: string;
  publicUrl: string;
  hasClean: boolean;
};

type GeneratedImage = {
  publicUrl: string;
  platform: string;
  generationId: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  referenceAsset?: Pick<AssetPickerItem, 'id' | 'name' | 'publicUrl'>;
  generatedImages?: GeneratedImage[];
  toolCalls?: Array<{ toolName: string; input: unknown; output: unknown }>;
};

const PLATFORMS: PlatformOption[] = [
  { id: 'tmall', label: '天猫' },
  { id: 'jd', label: '京东' },
  { id: 'temu', label: 'Temu' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'custom', label: '自定义' },
];

const SIZE_PRESETS: SizePreset[] = [
  { label: '1:1', value: '1:1' },
  { label: '3:2', value: '3:2' },
  { label: '2:3', value: '2:3' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' },
];

const QUALITY_OPTIONS = [
  { id: 'auto', label: 'Auto' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Med' },
  { id: 'low', label: 'Low' },
];

const copy = {
  en: {
    title: 'AI Image Studio',
    subtitle: 'Chat with your AI designer to generate platform-ready product images.',
    platformLabel: 'Platform',
    sizeLabel: 'Size',
    customW: 'W',
    customH: 'H',
    countLabel: 'Quantity',
    qualityLabel: 'Quality',
    refLabel: 'Reference',
    refHint: 'Select from asset library',
    inputPlaceholder: 'Describe what you want to generate…',
    send: 'Send',
    sending: 'Thinking…',
    toolRunning: 'Using tool',
    emptyHint: 'Start a conversation to generate product images. You can describe what you want in natural language.',
    examplePrompts: [
      'Help me generate a Tmall main image for this product, white background, 1:1',
      'Generate Instagram lifestyle photos, warm tones, natural lighting',
      'Remove the product background, then generate JD.com images',
      'Batch generate all platform images for the wireless headphones',
    ],
    selectAsset: 'Select asset',
    noAssets: 'No assets uploaded yet',
    loadingAssets: 'Loading…',
    clear: 'Clear',
    approve: 'Approve',
    deny: 'Deny',
  },
  zh: {
    title: 'AI 生图工作台',
    subtitle: '与 AI 设计师对话，生成各平台适配的产品图片。',
    platformLabel: '平台',
    sizeLabel: '尺寸',
    customW: '宽',
    customH: '高',
    countLabel: '数量',
    qualityLabel: '质量',
    refLabel: '参考素材',
    refHint: '从素材库选择产品',
    inputPlaceholder: '描述你想生成的图片…',
    send: '发送',
    sending: '思考中…',
    toolRunning: '正在使用工具',
    emptyHint: '开始对话即可生成产品图片，支持自然语言描述。',
    examplePrompts: [
      '帮我生成这个产品的天猫主图，白底，1:1',
      '生成 Instagram 生活方式图片，暖色调，自然光线',
      '先去除产品背景，然后生成京东主图',
      '批量生成无线耳机的所有平台图片',
    ],
    selectAsset: '选择素材',
    noAssets: '暂无上传素材',
    loadingAssets: '加载中…',
    clear: '清空对话',
    approve: '批准执行',
    deny: '拒绝',
  },
} as const;

type Props = {
  language: 'en' | 'zh';
};

export function ImageStudio({ language }: Props) {
  const t = copy[language];
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [platform, setPlatform] = useState<string>('');
  const [sizePreset, setSizePreset] = useState<string>('1:1');
  const [customW, setCustomW] = useState('');
  const [customH, setCustomH] = useState('');
  const [count, setCount] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [openPanel, setOpenPanel] = useState<'platform' | 'size' | 'count' | 'quality' | null>(null);

  const [assets, setAssets] = useState<AssetPickerItem[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? null;
  const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label;

  const loadAssets = useCallback(async () => {
    setAssetsLoading(true);
    try {
      const res = await fetch('/api/assets?limit=50');
      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        setAssets(
          data.assets.map((a: any) => ({
            id: a.id,
            name: a.name,
            publicUrl: a.publicUrl,
            hasClean: Boolean(a.cleanPublicUrl),
          }))
        );
      }
    } catch { /* non-blocking */ }
    finally { setAssetsLoading(false); }
  }, []);

  useEffect(() => { void loadAssets(); }, [loadAssets]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!openPanel) return;
    const onPointerDown = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openPanel]);

  const conversationRef = useRef<Array<{ role: string; content: string }>>([]);

  const togglePanel = (panel: NonNullable<typeof openPanel>) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  const handleSend = async () => {
    const visibleText = inputValue.trim();
    if (!visibleText || isBusy) return;

    const referenceAsset = selectedAsset
      ? {
          id: selectedAsset.id,
          name: selectedAsset.name,
          publicUrl: selectedAsset.publicUrl,
        }
      : undefined;
    const agentText = selectedAssetId
      ? `[参考素材ID: ${selectedAssetId}]\n${visibleText}`
      : visibleText;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: visibleText,
      referenceAsset,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsBusy(true);

    conversationRef.current.push({ role: 'user', content: agentText });

    const sidebarParams: Record<string, unknown> = {};
    if (platform) sidebarParams.platform = platform;
    if (platform === 'custom') {
      const w = parseInt(customW, 10);
      const h = parseInt(customH, 10);
      if (w > 0 && h > 0) { sidebarParams.width = w; sidebarParams.height = h; }
    } else if (sizePreset) {
      sidebarParams.size = sizePreset;
    }
    if (count > 1) sidebarParams.count = count;
    if (quality !== 'auto') sidebarParams.quality = quality;
    if (selectedAssetId) sidebarParams.selectedAssetId = selectedAssetId;

    try {
      const res = await fetch('/api/image-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationRef.current, sidebarParams }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Agent error');

      conversationRef.current.push({ role: 'assistant', content: data.response });

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.response,
        generatedImages: data.generatedImages,
        toolCalls: data.toolCalls,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch');
    } finally {
      setIsBusy(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setMessages([]);
    conversationRef.current = [];
    setInputValue('');
  };

  const allGeneratedImages = messages.flatMap((msg) => msg.generatedImages ?? []);

  const renderImages = (images: GeneratedImage[]) => (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {images.map((img, i) => (
        <div key={i} className="relative group">
          <img
            src={img.publicUrl}
            alt={`Generated ${img.platform}`}
            className="rounded-[8px] w-full object-cover cursor-pointer"
            onClick={() => window.open(img.publicUrl, '_blank')}
          />
          <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
            <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-[4px] font-mono">
              {img.platform}
            </span>
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white p-1 rounded-[4px]"
              onClick={() => window.open(img.publicUrl, '_blank')}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderToolCalls = (toolCalls: ChatMessage['toolCalls']) => {
    if (!toolCalls || toolCalls.length === 0) return null;
    return (
      <div className="mt-3 space-y-1">
        {toolCalls.map((tc, i) => (
          <div key={i}>
            <CodexToolStep
              label={tc.toolName}
              status="done"
              detail={t.toolRunning}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="h-full min-h-0 flex flex-col">
      <div className="codex-main-header">
        <div>
          <div className="codex-main-title flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t.title}
          </div>
          <div className="codex-main-subtitle">{t.subtitle}</div>
        </div>
        <div className="codex-main-actions">
          {messages.length > 0 && (
            <button type="button" className="ym-btn-ghost text-xs py-1 px-3" onClick={handleClear}>
              {t.clear}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: 'minmax(0,1fr) 300px' }}>
        <div className="min-w-0 min-h-0 flex flex-col border-r border-[var(--ym-input-border)]">
          <div ref={scrollRef} className="codex-chat-scroll">
            {messages.length === 0 ? (
              <div className="codex-empty">
                <Sparkles className="w-8 h-8 opacity-70" />
                <div className="codex-empty-title">{t.title}</div>
                <p className="codex-empty-sub">{t.emptyHint}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full mt-2">
                  {t.examplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="text-left px-3 py-2.5 rounded-[10px] border border-[var(--ym-input-border)] text-xs text-[var(--ym-muted-foreground)] hover:bg-[var(--ym-muted)] hover:text-[var(--ym-foreground)] transition-colors"
                      onClick={() => handleExampleClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`codex-msg ${msg.role === 'user' ? 'codex-msg-user' : 'codex-msg-assistant'}`}
                >
                  <div className="codex-msg-bubble">
                    {msg.referenceAsset && (
                      <button
                        type="button"
                        className="mb-2 flex w-full items-center gap-2 rounded-[10px] bg-black/5 p-2 text-left hover:bg-black/8"
                        onClick={() => window.open(msg.referenceAsset?.publicUrl, '_blank')}
                      >
                        <img
                          src={msg.referenceAsset.publicUrl}
                          alt={msg.referenceAsset.name}
                          className="h-12 w-12 shrink-0 rounded-[8px] object-cover"
                        />
                        <span className="min-w-0 truncate text-xs opacity-90">
                          {msg.referenceAsset.name}
                        </span>
                      </button>
                    )}
                    <div>{msg.text}</div>
                    {msg.generatedImages && msg.generatedImages.length > 0 && renderImages(msg.generatedImages)}
                    {renderToolCalls(msg.toolCalls)}
                  </div>
                </div>
              ))
            )}
            {isBusy && (
              <div className="codex-msg codex-msg-assistant">
                <div className="flex items-center gap-2 text-sm text-[var(--ym-caption)]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.sending}
                </div>
              </div>
            )}
          </div>

          <div className="codex-composer">
            <div className="codex-composer-box">
              {selectedAsset && (
                <div className="flex items-center gap-2 px-1">
                  <img
                    src={selectedAsset.publicUrl}
                    alt=""
                    className="w-8 h-8 rounded-[6px] object-cover border border-[var(--ym-input-border)]"
                    title={selectedAsset.name}
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-[var(--ym-muted-foreground)]">
                    {selectedAsset.name}
                  </span>
                  <button
                    type="button"
                    className="codex-param-btn"
                    onClick={() => setSelectedAssetId(null)}
                    title={language === 'zh' ? '清除素材' : 'Clear reference'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <textarea
                ref={inputRef}
                className="codex-composer-input"
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder}
                disabled={isBusy}
              />
              <div className="codex-composer-toolbar" ref={toolbarRef}>
                <div className="codex-composer-tools">
                  <div className="relative">
                    <button
                      type="button"
                      className={`codex-param-btn ${openPanel === 'platform' ? 'is-open' : ''} ${platform ? 'is-active' : ''}`}
                      title={platformLabel ? `${t.platformLabel}: ${platformLabel}` : t.platformLabel}
                      onClick={() => togglePanel('platform')}
                    >
                      <Store className="w-4 h-4" />
                      {platform ? <span className="codex-param-dot" /> : null}
                    </button>
                    {openPanel === 'platform' && (
                      <div className="codex-param-popover">
                        <div className="codex-param-popover-title">{t.platformLabel}</div>
                        {PLATFORMS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className={`codex-param-option ${platform === p.id ? 'is-active' : ''}`}
                            onClick={() => {
                              setPlatform(platform === p.id ? '' : p.id);
                              setOpenPanel(null);
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      className={`codex-param-btn ${openPanel === 'size' ? 'is-open' : ''} ${sizePreset !== '1:1' || platform === 'custom' ? 'is-active' : ''}`}
                      title={`${t.sizeLabel}: ${platform === 'custom' && customW && customH ? `${customW}×${customH}` : sizePreset}`}
                      onClick={() => togglePanel('size')}
                    >
                      <Ratio className="w-4 h-4" />
                      {(sizePreset !== '1:1' || (platform === 'custom' && Boolean(customW && customH))) ? (
                        <span className="codex-param-dot" />
                      ) : null}
                    </button>
                    {openPanel === 'size' && (
                      <div className="codex-param-popover" style={{ minWidth: 220 }}>
                        <div className="codex-param-popover-title">{t.sizeLabel}</div>
                        {platform === 'custom' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="ym-input text-xs"
                              value={customW}
                              onChange={(e) => setCustomW(e.target.value)}
                              placeholder="1024"
                            />
                            <X className="w-3 h-3 shrink-0 text-[var(--ym-caption)]" />
                            <input
                              type="number"
                              className="ym-input text-xs"
                              value={customH}
                              onChange={(e) => setCustomH(e.target.value)}
                              placeholder="1024"
                            />
                          </div>
                        ) : (
                          <div className="codex-param-chips">
                            {SIZE_PRESETS.map((s) => (
                              <button
                                key={s.value}
                                type="button"
                                className={`codex-param-chip ${sizePreset === s.value ? 'is-active' : ''}`}
                                onClick={() => {
                                  setSizePreset(s.value);
                                  setOpenPanel(null);
                                }}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      className={`codex-param-btn ${openPanel === 'quality' ? 'is-open' : ''} ${quality !== 'auto' ? 'is-active' : ''}`}
                      title={`${t.qualityLabel}: ${QUALITY_OPTIONS.find((q) => q.id === quality)?.label ?? quality}`}
                      onClick={() => togglePanel('quality')}
                    >
                      <WandSparkles className="w-4 h-4" />
                      {quality !== 'auto' ? <span className="codex-param-dot" /> : null}
                    </button>
                    {openPanel === 'quality' && (
                      <div className="codex-param-popover">
                        <div className="codex-param-popover-title">{t.qualityLabel}</div>
                        <div className="codex-param-chips">
                          {QUALITY_OPTIONS.map((q) => (
                            <button
                              key={q.id}
                              type="button"
                              className={`codex-param-chip ${quality === q.id ? 'is-active' : ''}`}
                              onClick={() => {
                                setQuality(q.id);
                                setOpenPanel(null);
                              }}
                            >
                              {q.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      className={`codex-param-btn ${openPanel === 'count' ? 'is-open' : ''} ${count > 1 ? 'is-active' : ''}`}
                      title={`${t.countLabel}: ${count}`}
                      onClick={() => togglePanel('count')}
                    >
                      <Layers className="w-4 h-4" />
                      {count > 1 ? <span className="codex-param-dot" /> : null}
                    </button>
                    {openPanel === 'count' && (
                      <div className="codex-param-popover" style={{ minWidth: 200 }}>
                        <div className="codex-param-popover-title">
                          {t.countLabel} · {count}
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={count}
                          onChange={(e) => setCount(Number(e.target.value))}
                          className="w-full accent-[var(--ym-primary)]"
                        />
                        <div className="codex-param-chips mt-2">
                          {[1, 2, 4, 6, 8, 10].map((n) => (
                            <button
                              key={n}
                              type="button"
                              className={`codex-param-chip ${count === n ? 'is-active' : ''}`}
                              onClick={() => setCount(n)}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      className={`codex-param-btn ${selectedAssetId ? 'is-active' : ''}`}
                      title={selectedAsset ? `${t.refLabel}: ${selectedAsset.name}` : t.refLabel}
                      onClick={() => {
                        setOpenPanel(null);
                        setAssetPickerOpen(true);
                        if (assets.length === 0) void loadAssets();
                      }}
                    >
                      <Paperclip className="w-4 h-4" />
                      {selectedAssetId ? <span className="codex-param-dot" /> : null}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="ym-btn-primary p-2 rounded-[8px]"
                  disabled={isBusy || !inputValue.trim()}
                  onClick={handleSend}
                >
                  {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="min-h-0 overflow-y-auto bg-[#fbfbfc] p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--ym-caption)] mb-3">
            Artifacts
          </div>
          {allGeneratedImages.length === 0 ? (
            <div className="text-xs text-[var(--ym-caption)] leading-relaxed">
              {language === 'zh' ? '生成结果会显示在这里。' : 'Generated images appear here.'}
            </div>
          ) : (
            <div className="space-y-3">
              {allGeneratedImages.map((img, i) => (
                <button
                  key={`${img.generationId}-${i}`}
                  type="button"
                  className="block w-full text-left"
                  onClick={() => window.open(img.publicUrl, '_blank')}
                >
                  <img
                    src={img.publicUrl}
                    alt={img.platform}
                    className="w-full rounded-[10px] border border-[var(--ym-input-border)] object-cover"
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--ym-caption)] font-mono">
                    <span>{img.platform}</span>
                    <ImageIcon className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>

      {assetPickerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--ym-surface)] rounded-[16px] max-w-lg w-full p-6 border border-[var(--ym-input-border)] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{t.selectAsset}</h3>
              <button
                type="button"
                onClick={() => setAssetPickerOpen(false)}
              >
                <X className="w-4 h-4 text-[var(--ym-caption)]" />
              </button>
            </div>
            {assetsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--ym-caption)]" />
              </div>
            ) : assets.length === 0 ? (
              <p className="text-sm text-[var(--ym-muted-foreground)] text-center py-8">{t.noAssets}</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    className={`rounded-[12px] border p-2 transition-colors ${
                      selectedAssetId === asset.id
                        ? 'border-[var(--ym-primary)] bg-black/5'
                        : 'border-transparent hover:border-[var(--ym-input-border)]'
                    }`}
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      setAssetPickerOpen(false);
                    }}
                  >
                    <img
                      src={asset.publicUrl}
                      alt={asset.name}
                      className="w-full aspect-square object-cover rounded-[8px] mb-1"
                    />
                    <p className="text-xs truncate">{asset.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
