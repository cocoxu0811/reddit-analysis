import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Copy,
  Download,
  ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

type PlatformId = 'tmall' | 'jd' | 'temu' | 'instagram';

type PlatformStyle = {
  id: PlatformId;
  nameZh: string;
  nameEn: string;
  aspectRatio: string;
  size: string;
  promptTemplate: string;
  negativeHints?: string;
  sortOrder: number;
};

type ProductAsset = {
  id: string;
  name: string;
  description: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  generationCount?: number;
};

type AssetGeneration = {
  id: string;
  assetId: string;
  platformId: PlatformId;
  promptUsed: string;
  storagePath: string | null;
  publicUrl: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage: string | null;
  model: string;
  createdAt: string;
};

const copy = {
  en: {
    uploadTitle: 'Upload product image',
    uploadHint: 'PNG, JPEG or WebP · max 15MB',
    nameLabel: 'Product name',
    namePlaceholder: 'e.g. Wireless earbuds Pro',
    descLabel: 'Description (optional)',
    descPlaceholder: 'Color, material, key selling points…',
    tagsLabel: 'Tags (comma separated)',
    uploadBtn: 'Upload to library',
    uploading: 'Uploading…',
    libraryTitle: 'Asset library',
    libraryEmpty: 'No assets yet. Upload a product photo to get started.',
    generations: 'generations',
    selectAsset: 'Select an asset to generate platform images',
    extraPrompt: 'Extra instructions (optional)',
    extraPromptPlaceholder: 'e.g. keep logo visible, add festive red accents',
    generateBtn: 'Generate',
    generating: 'Generating…',
    deleteAsset: 'Delete asset',
    copyLink: 'Copy link',
    download: 'Download',
    statusFailed: 'Failed',
    statusProcessing: 'Processing',
    toastUploadOk: 'Asset uploaded',
    toastUploadFail: 'Upload failed',
    toastGenOk: 'Image generated',
    toastGenFail: 'Generation failed',
    toastDeleteOk: 'Asset deleted',
    toastDeleteFail: 'Delete failed',
    toastCopyOk: 'Link copied',
    toastLoadFail: 'Failed to load assets',
    configHint:
      'Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY on the server.',
  },
  zh: {
    uploadTitle: '上传产品图片',
    uploadHint: '支持 PNG、JPEG、WebP · 最大 15MB',
    nameLabel: '产品名称',
    namePlaceholder: '例如：无线耳机 Pro',
    descLabel: '描述（可选）',
    descPlaceholder: '颜色、材质、核心卖点…',
    tagsLabel: '标签（逗号分隔）',
    uploadBtn: '上传到素材库',
    uploading: '上传中…',
    libraryTitle: '素材库',
    libraryEmpty: '暂无素材，请先上传产品图片。',
    generations: '次生成',
    selectAsset: '选择素材后可按平台风格生成图片',
    extraPrompt: '补充说明（可选）',
    extraPromptPlaceholder: '例如：保留 logo、加入节日红色元素',
    generateBtn: '生成',
    generating: '生成中…',
    deleteAsset: '删除素材',
    copyLink: '复制链接',
    download: '下载',
    statusFailed: '失败',
    statusProcessing: '处理中',
    toastUploadOk: '素材已上传',
    toastUploadFail: '上传失败',
    toastGenOk: '图片已生成',
    toastGenFail: '生成失败',
    toastDeleteOk: '素材已删除',
    toastDeleteFail: '删除失败',
    toastCopyOk: '链接已复制',
    toastLoadFail: '加载素材失败',
    configHint: '服务端需配置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY、OPENAI_API_KEY。',
  },
} as const;

function platformLabel(style: PlatformStyle, lang: 'en' | 'zh'): string {
  return lang === 'zh' ? style.nameZh : style.nameEn;
}

type Props = {
  language: 'en' | 'zh';
};

export function AssetLibrary({ language }: Props) {
  const t = copy[language];
  const fileRef = useRef<HTMLInputElement>(null);
  const [styles, setStyles] = useState<PlatformStyle[]>([]);
  const [assets, setAssets] = useState<ProductAsset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generations, setGenerations] = useState<AssetGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatingPlatform, setGeneratingPlatform] = useState<PlatformId | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformId>('tmall');
  const [uploadName, setUploadName] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [extraPrompt, setExtraPrompt] = useState('');

  const selectedAsset = assets.find((a) => a.id === selectedId) ?? null;

  const loadStyles = useCallback(async () => {
    const res = await fetch('/api/platform-styles');
    const data = await res.json();
    if (data.success && Array.isArray(data.styles)) {
      setStyles(data.styles);
      if (data.styles[0]?.id) setActivePlatform(data.styles[0].id);
    }
  }, []);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'load failed');
      setAssets(data.assets ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastLoadFail);
    } finally {
      setLoading(false);
    }
  }, [t.toastLoadFail]);

  const loadAssetDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/assets/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'load failed');
      setGenerations(data.generations ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastLoadFail);
    }
  }, [t.toastLoadFail]);

  useEffect(() => {
    void loadStyles();
    void loadAssets();
  }, [loadStyles, loadAssets]);

  useEffect(() => {
    if (selectedId) void loadAssetDetail(selectedId);
    else setGenerations([]);
  }, [selectedId, loadAssetDetail]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    if (!uploadName.trim()) {
      setUploadName(file.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error(language === 'zh' ? '请选择图片' : 'Please select an image');
      return;
    }
    if (!uploadName.trim()) {
      toast.error(language === 'zh' ? '请填写产品名称' : 'Product name is required');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', uploadFile);
      form.append('name', uploadName.trim());
      form.append('description', uploadDesc.trim());
      form.append('tags', uploadTags.trim());
      const res = await fetch('/api/assets/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'upload failed');
      toast.success(t.toastUploadOk);
      setUploadFile(null);
      setUploadName('');
      setUploadDesc('');
      setUploadTags('');
      if (fileRef.current) fileRef.current.value = '';
      await loadAssets();
      if (data.asset?.id) setSelectedId(data.asset.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastUploadFail);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedAsset) return;
    setGeneratingPlatform(activePlatform);
    try {
      const res = await fetch(`/api/assets/${selectedAsset.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: activePlatform, extraPrompt: extraPrompt.trim() || undefined }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'generate failed');
      toast.success(t.toastGenOk);
      await loadAssetDetail(selectedAsset.id);
      await loadAssets();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastGenFail);
    } finally {
      setGeneratingPlatform(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedAsset) return;
    if (!window.confirm(language === 'zh' ? '确定删除该素材？' : 'Delete this asset?')) return;
    try {
      const res = await fetch(`/api/assets/${selectedAsset.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'delete failed');
      toast.success(t.toastDeleteOk);
      setSelectedId(null);
      await loadAssets();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastDeleteFail);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.toastCopyOk);
    } catch {
      toast.error('Copy failed');
    }
  };

  const groupedGenerations = styles.map((style) => ({
    style,
    items: generations.filter((g) => g.platformId === style.id),
  }));

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 space-y-6">
      <p className="text-xs text-[var(--ym-caption)]">{t.configHint}</p>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="ym-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--ym-foreground)] flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t.uploadTitle}
            </h3>
            <div
              className="border-2 border-dashed border-[var(--ym-input-border)] rounded-[16px] p-5 text-center hover:bg-[var(--ym-muted)] transition-colors cursor-pointer relative"
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFilePick}
              />
              {uploadFile ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(uploadFile)}
                    alt=""
                    className="mx-auto max-h-36 rounded-[12px] object-contain"
                  />
                  <p className="text-xs text-[var(--ym-muted-foreground)]">{uploadFile.name}</p>
                  <button
                    type="button"
                    className="ym-btn-ghost text-xs mx-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadFile(null);
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                  >
                    <X className="w-3 h-3 inline mr-1" />
                    {language === 'zh' ? '移除' : 'Remove'}
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-[var(--ym-gray2)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--ym-foreground)]">{t.uploadHint}</p>
                </>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.nameLabel}</label>
              <input
                className="ym-input"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder={t.namePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.descLabel}</label>
              <textarea
                className="ym-input min-h-[72px] resize-y"
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder={t.descPlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.tagsLabel}</label>
              <input
                className="ym-input"
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
                placeholder="electronics, hero"
              />
            </div>
            <button
              type="button"
              className="ym-btn-primary w-full py-2.5 text-sm"
              disabled={uploading || !uploadFile}
              onClick={() => void handleUpload()}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : t.uploadBtn}
            </button>
          </div>

          <div className="ym-card p-5">
            <h3 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3">{t.libraryTitle}</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--ym-caption)]" />
              </div>
            ) : assets.length === 0 ? (
              <p className="text-sm text-[var(--ym-muted-foreground)]">{t.libraryEmpty}</p>
            ) : (
              <div className="ym-asset-grid">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    className={`ym-asset-card ${selectedId === asset.id ? 'ym-asset-card-active' : ''}`}
                    onClick={() => setSelectedId(asset.id)}
                  >
                    <img src={asset.publicUrl} alt={asset.name} className="ym-asset-thumb" />
                    <div className="ym-asset-meta">
                      <span className="ym-asset-name">{asset.name}</span>
                      <span className="ym-asset-count">
                        {asset.generationCount ?? 0} {t.generations}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {!selectedAsset ? (
            <div className="ym-card p-8 text-center text-sm text-[var(--ym-muted-foreground)]">
              {t.selectAsset}
            </div>
          ) : (
            <>
              <div className="ym-card p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--ym-foreground)]">{selectedAsset.name}</h3>
                    {selectedAsset.description ? (
                      <p className="text-sm text-[var(--ym-muted-foreground)] mt-1">{selectedAsset.description}</p>
                    ) : null}
                  </div>
                  <button type="button" className="ym-btn-ghost text-sm text-[var(--ym-destructive)]" onClick={() => void handleDelete()}>
                    <Trash2 className="w-4 h-4" />
                    {t.deleteAsset}
                  </button>
                </div>
                <img
                  src={selectedAsset.publicUrl}
                  alt={selectedAsset.name}
                  className="w-full max-h-72 object-contain rounded-[12px] bg-[var(--ym-muted)]"
                />

                <div className="ym-platform-tabs" role="tablist">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      role="tab"
                      aria-selected={activePlatform === style.id}
                      className={`ym-platform-tab ${activePlatform === style.id ? 'ym-platform-tab-active' : ''}`}
                      onClick={() => setActivePlatform(style.id)}
                    >
                      {platformLabel(style, language)}
                      <span className="ym-platform-tab-sub">{style.aspectRatio}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.extraPrompt}</label>
                  <input
                    className="ym-input"
                    value={extraPrompt}
                    onChange={(e) => setExtraPrompt(e.target.value)}
                    placeholder={t.extraPromptPlaceholder}
                  />
                </div>

                <button
                  type="button"
                  className="ym-btn-primary px-5 py-2.5 text-sm"
                  disabled={generatingPlatform !== null}
                  onClick={() => void handleGenerate()}
                >
                  {generatingPlatform ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {generatingPlatform ? t.generating : t.generateBtn}
                </button>
              </div>

              <div className="space-y-4">
                {groupedGenerations.map(({ style, items }) =>
                  items.length > 0 ? (
                    <div key={style.id} className="ym-card p-5">
                      <h4 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3">
                        {platformLabel(style, language)}
                      </h4>
                      <div className="space-y-3">
                        {items.map((gen) => (
                          <div key={gen.id} className="ym-gen-row">
                            {gen.status === 'completed' && gen.publicUrl ? (
                              <img src={gen.publicUrl} alt="" className="ym-gen-thumb" />
                            ) : (
                              <div className="ym-gen-thumb ym-gen-thumb-placeholder">
                                {gen.status === 'failed' ? t.statusFailed : t.statusProcessing}
                              </div>
                            )}
                            <div className="flex-1 min-w-0 space-y-2">
                              <p className="text-xs text-[var(--ym-caption)] line-clamp-2">{gen.promptUsed || '—'}</p>
                              {gen.errorMessage ? (
                                <p className="text-xs text-[var(--ym-destructive)]">{gen.errorMessage}</p>
                              ) : null}
                              <div className="flex flex-wrap gap-2">
                                {gen.publicUrl ? (
                                  <>
                                    <button type="button" className="ym-btn-ghost text-xs py-1 px-2" onClick={() => void copyUrl(gen.publicUrl!)}>
                                      <Copy className="w-3 h-3" />
                                      {t.copyLink}
                                    </button>
                                    <a href={gen.publicUrl} download target="_blank" rel="noreferrer" className="ym-btn-ghost text-xs py-1 px-2 inline-flex items-center gap-1">
                                      <Download className="w-3 h-3" />
                                      {t.download}
                                    </a>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
