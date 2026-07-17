import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Loader2,
  Maximize2,
  Paperclip,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    sidebarToggle: 'Parameters',
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
    sidebarToggle: '参数设置',
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
  const formRef = useRef<HTMLFormElement>(null);

  const [platform, setPlatform] = useState<string>('');
  const [sizePreset, setSizePreset] = useState<string>('1:1');
  const [customW, setCustomW] = useState('');
  const [customH, setCustomH] = useState('');
  const [count, setCount] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [assets, setAssets] = useState<AssetPickerItem[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? null;

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

  const conversationRef = useRef<Array<{ role: string; content: string }>>([]);

  const handleSend = async () => {
    let text = inputValue.trim();
    if (!text || isBusy) return;

    if (selectedAssetId) {
      text = `[参考素材ID: ${selectedAssetId}]\n${text}`;
    }

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsBusy(true);

    conversationRef.current.push({ role: 'user', content: text });

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
            <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-[4px]">
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
      <div className="mt-2 space-y-1">
        {toolCalls.map((tc, i) => (
          <div key={i} className="text-[10px] px-2 py-1 rounded-[6px] bg-black/5 text-[var(--ym-caption)]">
            <span className="font-medium">{t.toolRunning}:</span> {tc.toolName}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--ym-foreground)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--ym-primary)]" />
            {t.title}
          </h2>
          <p className="text-xs text-[var(--ym-caption)] mt-0.5">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button type="button" className="ym-btn-ghost text-xs py-1 px-3" onClick={handleClear}>
              {t.clear}
            </button>
          )}
          <button
            type="button"
            className="ym-btn-ghost text-xs py-1 px-3 flex items-center gap-1"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {t.sidebarToggle}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 shrink-0 overflow-y-auto">
            <div className="ym-card p-4 space-y-4">
              {/* Platform */}
              <div>
                <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.platformLabel}</label>
                <div className="space-y-1">
                  {PLATFORMS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] cursor-pointer text-sm transition-colors ${
                        platform === p.id
                          ? 'bg-[var(--ym-primary)] text-white'
                          : 'hover:bg-[var(--ym-muted)] text-[var(--ym-foreground)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="platform"
                        value={p.id}
                        checked={platform === p.id}
                        onChange={() => setPlatform(platform === p.id ? '' : p.id)}
                        className="sr-only"
                      />
                      <span
                        className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                          platform === p.id ? 'border-white' : 'border-[var(--ym-input-border)]'
                        }`}
                      >
                        {platform === p.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.sizeLabel}</label>
                {platform !== 'custom' ? (
                  <div className="flex flex-wrap gap-1.5">
                    {SIZE_PRESETS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        className={`px-2.5 py-1 text-xs rounded-[8px] transition-colors ${
                          sizePreset === s.value
                            ? 'bg-[var(--ym-primary)] text-white'
                            : 'bg-[var(--ym-muted)] text-[var(--ym-foreground)] hover:bg-[var(--ym-input-border)]'
                        }`}
                        onClick={() => setSizePreset(s.value)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-[var(--ym-caption)] mb-0.5">{t.customW}</label>
                      <input
                        type="number"
                        className="ym-input text-xs"
                        value={customW}
                        onChange={(e) => setCustomW(e.target.value)}
                        placeholder="1024"
                      />
                    </div>
                    <X className="w-3 h-3 text-[var(--ym-caption)] mt-3" />
                    <div className="flex-1">
                      <label className="block text-[10px] text-[var(--ym-caption)] mb-0.5">{t.customH}</label>
                      <input
                        type="number"
                        className="ym-input text-xs"
                        value={customH}
                        onChange={(e) => setCustomH(e.target.value)}
                        placeholder="1024"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Count */}
              <div>
                <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">
                  {t.countLabel}
                  <span className="ml-2 text-[var(--ym-primary)] font-semibold">{count}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-[var(--ym-primary)]"
                />
                <div className="flex justify-between text-[10px] text-[var(--ym-caption)]">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.qualityLabel}</label>
                <div className="flex gap-1.5">
                  {QUALITY_OPTIONS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      className={`flex-1 py-1 text-xs rounded-[8px] transition-colors ${
                        quality === q.id
                          ? 'bg-[var(--ym-primary)] text-white'
                          : 'bg-[var(--ym-muted)] text-[var(--ym-foreground)] hover:bg-[var(--ym-input-border)]'
                      }`}
                      onClick={() => setQuality(q.id)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference asset */}
              <div>
                <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-2">{t.refLabel}</label>
                {selectedAsset ? (
                  <div className="flex items-center gap-2 p-2 rounded-[8px] bg-[var(--ym-muted)]">
                    <img
                      src={selectedAsset.publicUrl}
                      alt={selectedAsset.name}
                      className="w-10 h-10 rounded-[6px] object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--ym-foreground)] truncate">{selectedAsset.name}</p>
                    </div>
                    <button
                      type="button"
                      className="text-[var(--ym-caption)] hover:text-[var(--ym-foreground)]"
                      onClick={() => setSelectedAssetId(null)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-[8px] border border-dashed border-[var(--ym-input-border)] text-xs text-[var(--ym-caption)] hover:bg-[var(--ym-muted)] transition-colors"
                    onClick={() => {
                      setAssetPickerOpen(true);
                      if (assets.length === 0) void loadAssets();
                    }}
                  >
                    <Paperclip className="w-3 h-3 inline mr-1" />
                    {t.refHint}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1 space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[var(--ym-muted)] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[var(--ym-primary)]" />
                </div>
                <p className="text-sm text-[var(--ym-muted-foreground)] max-w-md">{t.emptyHint}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                  {t.examplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="text-left px-3 py-2.5 rounded-[12px] border border-[var(--ym-input-border)] text-xs text-[var(--ym-muted-foreground)] hover:bg-[var(--ym-muted)] hover:text-[var(--ym-foreground)] transition-colors"
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
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-[16px] px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[var(--ym-primary)] text-white rounded-br-[4px]'
                        : 'bg-[var(--ym-muted)] text-[var(--ym-foreground)] rounded-bl-[4px]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.generatedImages && msg.generatedImages.length > 0 && renderImages(msg.generatedImages)}
                    {renderToolCalls(msg.toolCalls)}
                  </div>
                </div>
              ))
            )}
            {isBusy && (
              <div className="flex justify-start">
                <div className="bg-[var(--ym-muted)] rounded-[16px] rounded-bl-[4px] px-4 py-3 text-sm text-[var(--ym-muted-foreground)] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.sending}
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="shrink-0 pt-2">
            <div className="ym-card p-3 flex items-end gap-2">
              {selectedAsset && (
                <div className="shrink-0 pb-1">
                  <img
                    src={selectedAsset.publicUrl}
                    alt=""
                    className="w-8 h-8 rounded-[6px] object-cover border border-[var(--ym-input-border)]"
                    title={selectedAsset.name}
                  />
                </div>
              )}
              <textarea
                ref={inputRef}
                className="flex-1 resize-none bg-transparent border-none outline-none text-sm text-[var(--ym-foreground)] placeholder:text-[var(--ym-caption)] min-h-[36px] max-h-[120px]"
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder}
                disabled={isBusy}
              />
              <button
                type="button"
                className="shrink-0 ym-btn-primary p-2 rounded-[10px]"
                disabled={isBusy || !inputValue.trim()}
                onClick={handleSend}
              >
                {isBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Asset picker modal */}
      {assetPickerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--ym-surface)] rounded-[24px] max-w-lg w-full p-6 shadow-[var(--ym-shadow-prompt)] animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--ym-foreground)]">{t.selectAsset}</h3>
              <button
                type="button"
                className="text-[var(--ym-caption)] hover:text-[var(--ym-foreground)]"
                onClick={() => setAssetPickerOpen(false)}
              >
                <X className="w-4 h-4" />
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
                    className={`rounded-[12px] border-2 p-2 transition-colors ${
                      selectedAssetId === asset.id
                        ? 'border-[var(--ym-primary)] bg-[var(--ym-primary)]/5'
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
                    <p className="text-xs text-[var(--ym-foreground)] truncate">{asset.name}</p>
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
