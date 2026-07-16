import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  Eraser,
  ImageIcon,
  ImagePlus,
  Loader2,
  Star,
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

type ProductIdentity = {
  primaryColors: string[];
  material: string;
  shapeKeywords: string;
  brandElements: string;
  immutableFeatures: string;
};

type ProductAsset = {
  id: string;
  name: string;
  description: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  tags: string[];
  identity: ProductIdentity;
  cleanPublicUrl: string | null;
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
  seed: number | null;
  approved: boolean;
  reviewStatus: 'passed' | 'warning' | 'failed' | null;
  reviewNotes: string | null;
  createdAt: string;
};

type AssetReferenceImage = {
  id: string;
  assetId: string;
  label: string;
  publicUrl: string;
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
    idCardTitle: 'Product Identity Card',
    idCardHint: 'Fill in for better consistency across generated images.',
    colorsLabel: 'Primary colors (hex, comma separated)',
    colorsPlaceholder: '#E63946, #1D3557',
    materialLabel: 'Material / texture',
    materialPlaceholder: 'e.g. matte metal + silicone tips',
    shapeLabel: 'Shape keywords',
    shapePlaceholder: 'e.g. rounded in-ear, short stem, oval charging case',
    brandLabel: 'Brand elements to preserve',
    brandPlaceholder: 'e.g. logo on right earpiece, LED on case front',
    immutableLabel: 'Must NOT change',
    immutablePlaceholder: 'e.g. logo orientation, main body color',
    uploadBtn: 'Upload to library',
    uploading: 'Uploading…',
    libraryTitle: 'Asset library',
    libraryEmpty: 'No assets yet. Upload a product photo to get started.',
    generations: 'generations',
    selectAsset: 'Select an asset to view details',
    deleteAsset: 'Delete asset',
    editIdentity: 'Edit identity card',
    saveIdentity: 'Save',
    savingIdentity: 'Saving…',
    copyLink: 'Copy link',
    download: 'Download',
    statusFailed: 'Failed',
    statusProcessing: 'Processing',
    reviewPassed: 'QA: Passed',
    reviewWarning: 'QA: Warning',
    reviewFailed: 'QA: Failed',
    toastUploadOk: 'Asset uploaded',
    toastUploadFail: 'Upload failed',
    toastDeleteOk: 'Asset deleted',
    toastDeleteFail: 'Delete failed',
    toastCopyOk: 'Link copied',
    toastLoadFail: 'Failed to load assets',
    toastIdentityOk: 'Identity card saved',
    toastIdentityFail: 'Failed to save identity',
    refImagesTitle: 'Reference images',
    refImagesHint: 'Add more angles (side, back, detail) for better consistency.',
    refLabel: 'Label',
    refLabelPlaceholder: 'e.g. side view',
    addRef: 'Add angle',
    removeBg: 'Remove background',
    removingBg: 'Removing…',
    removeBgDone: 'Background removed',
    removeBgFail: 'Background removal failed',
    cleanVersion: 'Clean cutout',
    approve: 'Approve',
    approved: 'Approved',
    unapprove: 'Unapprove',
    generatedTitle: 'Generated images',
    generatedEmpty: 'No generated images yet. Use AI Image Studio to generate.',
    configHint:
      'Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY on the server.',
  },
  zh: {
    uploadTitle: '上传产品图片',
    uploadHint: '支持 PNG、JPEG、WebP · 最大 15MB',
    nameLabel: '产品名称',
    namePlaceholder: '例如：无线耳机 Pro',
    descLabel: '描述（可选）',
    descPlaceholder: '颜色、材质、核心卖点…',
    tagsLabel: '标签（逗号分隔）',
    idCardTitle: '产品身份卡',
    idCardHint: '填写后可显著提升跨平台生成一致性。',
    colorsLabel: '主色调（HEX，逗号分隔）',
    colorsPlaceholder: '#E63946, #1D3557',
    materialLabel: '材质 / 质感',
    materialPlaceholder: '例如：哑光金属 + 硅胶耳套',
    shapeLabel: '外形关键词',
    shapePlaceholder: '例如：圆润入耳式、短柄、椭圆充电盒',
    brandLabel: '需保留的品牌元素',
    brandPlaceholder: '例如：右耳壳 logo、充电盒前脸指示灯',
    immutableLabel: '绝对不可改',
    immutablePlaceholder: '例如：logo 方向、产品主体颜色',
    uploadBtn: '上传到素材库',
    uploading: '上传中…',
    libraryTitle: '素材库',
    libraryEmpty: '暂无素材，请先上传产品图片。',
    generations: '次生成',
    selectAsset: '选择素材查看详情',
    deleteAsset: '删除素材',
    editIdentity: '编辑身份卡',
    saveIdentity: '保存',
    savingIdentity: '保存中…',
    copyLink: '复制链接',
    download: '下载',
    statusFailed: '失败',
    statusProcessing: '处理中',
    reviewPassed: '质检：通过',
    reviewWarning: '质检：需注意',
    reviewFailed: '质检：不通过',
    toastUploadOk: '素材已上传',
    toastUploadFail: '上传失败',
    toastDeleteOk: '素材已删除',
    toastDeleteFail: '删除失败',
    toastCopyOk: '链接已复制',
    toastLoadFail: '加载素材失败',
    toastIdentityOk: '身份卡已保存',
    toastIdentityFail: '保存失败',
    refImagesTitle: '参考图',
    refImagesHint: '添加不同角度的图片（侧面、背面、细节）以提升一致性。',
    refLabel: '标签',
    refLabelPlaceholder: '例如：侧面',
    addRef: '添加角度',
    removeBg: '去除背景',
    removingBg: '处理中…',
    removeBgDone: '背景已去除',
    removeBgFail: '去除背景失败',
    cleanVersion: '干净抠图',
    approve: '采纳',
    approved: '已采纳',
    unapprove: '取消采纳',
    generatedTitle: '已生成图片',
    generatedEmpty: '暂无生成图片，请前往 AI 生图工作台生成。',
    configHint: '服务端需配置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY。',
  },
} as const;

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
  const [uploadName, setUploadName] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadColors, setUploadColors] = useState('');
  const [uploadMaterial, setUploadMaterial] = useState('');
  const [uploadShape, setUploadShape] = useState('');
  const [uploadBrand, setUploadBrand] = useState('');
  const [uploadImmutable, setUploadImmutable] = useState('');
  const [referenceImages, setReferenceImages] = useState<AssetReferenceImage[]>([]);
  const [removingBg, setRemovingBg] = useState(false);
  const refFileRef = useRef<HTMLInputElement>(null);
  const [refLabel, setRefLabel] = useState('');
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [editColors, setEditColors] = useState('');
  const [editMaterial, setEditMaterial] = useState('');
  const [editShape, setEditShape] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editImmutable, setEditImmutable] = useState('');

  const selectedAsset = assets.find((a) => a.id === selectedId) ?? null;

  const loadStyles = useCallback(async () => {
    const res = await fetch('/api/platform-styles');
    const data = await res.json();
    if (data.success && Array.isArray(data.styles)) {
      setStyles(data.styles);
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
      setReferenceImages(data.referenceImages ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastLoadFail);
    }
  }, [t.toastLoadFail]);

  useEffect(() => {
    void loadStyles();
    void loadAssets();
  }, [loadStyles, loadAssets]);

  useEffect(() => {
    setEditingIdentity(false);
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
      form.append('primaryColors', uploadColors.trim());
      form.append('material', uploadMaterial.trim());
      form.append('shapeKeywords', uploadShape.trim());
      form.append('brandElements', uploadBrand.trim());
      form.append('immutableFeatures', uploadImmutable.trim());
      const res = await fetch('/api/assets/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'upload failed');
      toast.success(t.toastUploadOk);
      setUploadFile(null);
      setUploadName('');
      setUploadDesc('');
      setUploadTags('');
      setUploadColors('');
      setUploadMaterial('');
      setUploadShape('');
      setUploadBrand('');
      setUploadImmutable('');
      if (fileRef.current) fileRef.current.value = '';
      await loadAssets();
      if (data.asset?.id) setSelectedId(data.asset.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.toastUploadFail);
    } finally {
      setUploading(false);
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
            <details className="group">
              <summary className="text-xs font-medium text-[var(--ym-primary)] cursor-pointer select-none flex items-center gap-1">
                <span className="transition-transform group-open:rotate-90">▶</span>
                {t.idCardTitle}
                <span className="text-[var(--ym-caption)] font-normal ml-1">— {t.idCardHint}</span>
              </summary>
              <div className="mt-3 space-y-3 pl-3 border-l-2 border-[var(--ym-input-border)]">
                <div>
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.colorsLabel}</label>
                  <input className="ym-input" value={uploadColors} onChange={(e) => setUploadColors(e.target.value)} placeholder={t.colorsPlaceholder} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.materialLabel}</label>
                  <input className="ym-input" value={uploadMaterial} onChange={(e) => setUploadMaterial(e.target.value)} placeholder={t.materialPlaceholder} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.shapeLabel}</label>
                  <input className="ym-input" value={uploadShape} onChange={(e) => setUploadShape(e.target.value)} placeholder={t.shapePlaceholder} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.brandLabel}</label>
                  <input className="ym-input" value={uploadBrand} onChange={(e) => setUploadBrand(e.target.value)} placeholder={t.brandPlaceholder} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ym-muted-foreground)] mb-1">{t.immutableLabel}</label>
                  <input className="ym-input" value={uploadImmutable} onChange={(e) => setUploadImmutable(e.target.value)} placeholder={t.immutablePlaceholder} />
                </div>
              </div>
            </details>
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

                {/* Reference images (multi-angle) */}
                <div className="rounded-[12px] border border-[var(--ym-input-border)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[var(--ym-foreground)]">{t.refImagesTitle}</h4>
                    <button
                      type="button"
                      className="ym-btn-ghost text-xs py-1 px-2"
                      onClick={() => refFileRef.current?.click()}
                    >
                      <ImagePlus className="w-3 h-3" />
                      {t.addRef}
                    </button>
                    <input
                      ref={refFileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !selectedAsset) return;
                        try {
                          const form = new FormData();
                          form.append('file', file);
                          form.append('label', refLabel.trim() || file.name.replace(/\.[^.]+$/, ''));
                          const res = await fetch(`/api/assets/${selectedAsset.id}/references`, { method: 'POST', body: form });
                          const data = await res.json();
                          if (!data.success) throw new Error(data.error);
                          setRefLabel('');
                          await loadAssetDetail(selectedAsset.id);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : 'Failed to add reference');
                        }
                        if (refFileRef.current) refFileRef.current.value = '';
                      }}
                    />
                  </div>
                  {referenceImages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {referenceImages.map((ref) => (
                        <div key={ref.id} className="relative group">
                          <img src={ref.publicUrl} alt={ref.label} className="w-16 h-16 object-cover rounded-[8px] border border-[var(--ym-input-border)]" />
                          <span className="block text-[10px] text-center text-[var(--ym-caption)] mt-0.5 truncate max-w-[64px]">{ref.label || '—'}</span>
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--ym-destructive)] text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={async () => {
                              try {
                                await fetch(`/api/assets/${selectedAsset.id}/references/${ref.id}`, { method: 'DELETE' });
                                await loadAssetDetail(selectedAsset.id);
                              } catch { /* ignore */ }
                            }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--ym-caption)] italic">{t.refImagesHint}</p>
                  )}
                </div>

                {/* Identity Card (view / edit) */}
                <div className="rounded-[12px] border border-[var(--ym-input-border)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[var(--ym-foreground)]">{t.idCardTitle}</h4>
                    {!editingIdentity ? (
                      <button type="button" className="ym-btn-ghost text-xs py-1 px-2" onClick={() => {
                        const id = selectedAsset.identity;
                        setEditColors(id.primaryColors.join(', '));
                        setEditMaterial(id.material);
                        setEditShape(id.shapeKeywords);
                        setEditBrand(id.brandElements);
                        setEditImmutable(id.immutableFeatures);
                        setEditingIdentity(true);
                      }}>
                        {t.editIdentity}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="ym-btn-primary text-xs py-1 px-3"
                        disabled={savingIdentity}
                        onClick={async () => {
                          setSavingIdentity(true);
                          try {
                            const res = await fetch(`/api/assets/${selectedAsset.id}/identity`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                primaryColors: editColors.trim(),
                                material: editMaterial.trim(),
                                shapeKeywords: editShape.trim(),
                                brandElements: editBrand.trim(),
                                immutableFeatures: editImmutable.trim(),
                              }),
                            });
                            const data = await res.json();
                            if (!data.success) throw new Error(data.error || 'save failed');
                            toast.success(t.toastIdentityOk);
                            setEditingIdentity(false);
                            await loadAssets();
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : t.toastIdentityFail);
                          } finally {
                            setSavingIdentity(false);
                          }
                        }}
                      >
                        {savingIdentity ? <Loader2 className="w-3 h-3 animate-spin" /> : t.saveIdentity}
                      </button>
                    )}
                  </div>
                  {editingIdentity ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-[var(--ym-caption)] mb-0.5">{t.colorsLabel}</label>
                        <input className="ym-input text-xs" value={editColors} onChange={(e) => setEditColors(e.target.value)} placeholder={t.colorsPlaceholder} />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--ym-caption)] mb-0.5">{t.materialLabel}</label>
                        <input className="ym-input text-xs" value={editMaterial} onChange={(e) => setEditMaterial(e.target.value)} placeholder={t.materialPlaceholder} />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--ym-caption)] mb-0.5">{t.shapeLabel}</label>
                        <input className="ym-input text-xs" value={editShape} onChange={(e) => setEditShape(e.target.value)} placeholder={t.shapePlaceholder} />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--ym-caption)] mb-0.5">{t.brandLabel}</label>
                        <input className="ym-input text-xs" value={editBrand} onChange={(e) => setEditBrand(e.target.value)} placeholder={t.brandPlaceholder} />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--ym-caption)] mb-0.5">{t.immutableLabel}</label>
                        <input className="ym-input text-xs" value={editImmutable} onChange={(e) => setEditImmutable(e.target.value)} placeholder={t.immutablePlaceholder} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--ym-muted-foreground)] space-y-1">
                      {selectedAsset.identity.primaryColors.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--ym-caption)]">{t.colorsLabel.split('(')[0].trim()}:</span>
                          <span className="flex gap-1">
                            {selectedAsset.identity.primaryColors.map((c, i) => (
                              <span key={i} className="inline-flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border border-[var(--ym-input-border)]" style={{ background: c }} />
                                <code className="text-[10px]">{c}</code>
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                      {selectedAsset.identity.material && <div><span className="text-[var(--ym-caption)]">{t.materialLabel}:</span> {selectedAsset.identity.material}</div>}
                      {selectedAsset.identity.shapeKeywords && <div><span className="text-[var(--ym-caption)]">{t.shapeLabel}:</span> {selectedAsset.identity.shapeKeywords}</div>}
                      {selectedAsset.identity.brandElements && <div><span className="text-[var(--ym-caption)]">{t.brandLabel}:</span> {selectedAsset.identity.brandElements}</div>}
                      {selectedAsset.identity.immutableFeatures && <div><span className="text-[var(--ym-caption)]">{t.immutableLabel}:</span> {selectedAsset.identity.immutableFeatures}</div>}
                      {!selectedAsset.identity.primaryColors.length && !selectedAsset.identity.material && !selectedAsset.identity.shapeKeywords && !selectedAsset.identity.brandElements && !selectedAsset.identity.immutableFeatures && (
                        <span className="italic text-[var(--ym-caption)]">{t.idCardHint}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="ym-btn-ghost px-4 py-2.5 text-sm"
                    disabled={removingBg}
                    onClick={async () => {
                      setRemovingBg(true);
                      try {
                        const res = await fetch(`/api/assets/${selectedAsset.id}/remove-bg`, { method: 'POST' });
                        const data = await res.json();
                        if (!data.success) throw new Error(data.error || 'failed');
                        toast.success(t.removeBgDone);
                        await loadAssets();
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : t.removeBgFail);
                      } finally {
                        setRemovingBg(false);
                      }
                    }}
                  >
                    {removingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
                    {removingBg ? t.removingBg : t.removeBg}
                  </button>
                </div>

                {selectedAsset.cleanPublicUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[var(--ym-muted)]">
                    <img src={selectedAsset.cleanPublicUrl} alt="clean" className="w-16 h-16 object-contain rounded-[8px] bg-white" />
                    <div className="text-xs text-[var(--ym-muted-foreground)]">
                      <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-600" />
                      {t.cleanVersion}
                    </div>
                  </div>
                )}
              </div>

              {/* Generated images (readonly) */}
              <div className="ym-card p-5">
                <h4 className="text-sm font-semibold text-[var(--ym-foreground)] mb-3">{t.generatedTitle}</h4>
                {generations.length === 0 ? (
                  <p className="text-sm text-[var(--ym-muted-foreground)]">{t.generatedEmpty}</p>
                ) : (
                  <div className="space-y-3">
                    {generations.map((gen) => (
                      <div key={gen.id} className="ym-gen-row">
                        {gen.status === 'completed' && gen.publicUrl ? (
                          <img src={gen.publicUrl} alt="" className="ym-gen-thumb" />
                        ) : (
                          <div className="ym-gen-thumb ym-gen-thumb-placeholder">
                            {gen.status === 'failed' ? t.statusFailed : t.statusProcessing}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--ym-muted)] text-[var(--ym-foreground)]">
                              {gen.platformId}
                            </span>
                            {gen.reviewStatus && (
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                gen.reviewStatus === 'passed' ? 'bg-green-100 text-green-700' :
                                gen.reviewStatus === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`} title={gen.reviewNotes || ''}>
                                {gen.reviewStatus === 'passed' ? t.reviewPassed :
                                 gen.reviewStatus === 'warning' ? t.reviewWarning :
                                 t.reviewFailed}
                              </span>
                            )}
                          </div>
                          {gen.errorMessage && (
                            <p className="text-xs text-[var(--ym-destructive)]">{gen.errorMessage}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {gen.publicUrl && (
                              <>
                                <button
                                  type="button"
                                  className={`ym-btn-ghost text-xs py-1 px-2 ${gen.approved ? 'text-green-600' : ''}`}
                                  onClick={async () => {
                                    try {
                                      await fetch(`/api/generations/${gen.id}/approve`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ approved: !gen.approved }),
                                      });
                                      if (selectedAsset) await loadAssetDetail(selectedAsset.id);
                                    } catch { /* ignore */ }
                                  }}
                                >
                                  <Star className={`w-3 h-3 ${gen.approved ? 'fill-current' : ''}`} />
                                  {gen.approved ? t.approved : t.approve}
                                </button>
                                <button type="button" className="ym-btn-ghost text-xs py-1 px-2" onClick={() => void copyUrl(gen.publicUrl!)}>
                                  <Copy className="w-3 h-3" />
                                  {t.copyLink}
                                </button>
                                <a href={gen.publicUrl} download target="_blank" rel="noreferrer" className="ym-btn-ghost text-xs py-1 px-2 inline-flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {t.download}
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
