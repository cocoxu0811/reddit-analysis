import {
  buildAssetStoragePath,
  buildGenerationStoragePath,
  deleteStorageObject,
  downloadFromStorage,
  getSupabaseAdmin,
  isSupabaseConfigured,
  uploadToStorage,
} from "../db/supabase.js";
import {
  PLATFORM_STYLE_FALLBACKS,
  type PlatformId,
  type PlatformStyle,
  isPlatformId,
} from "./platformStyles.js";

export type ProductAsset = {
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

export type AssetGeneration = {
  id: string;
  assetId: string;
  platformId: PlatformId;
  promptUsed: string;
  storagePath: string | null;
  publicUrl: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  errorMessage: string | null;
  model: string;
  createdAt: string;
};

function mapAssetRow(row: Record<string, unknown>): ProductAsset {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    storagePath: String(row.storage_path ?? ""),
    publicUrl: String(row.public_url ?? ""),
    mimeType: String(row.mime_type ?? "image/png"),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
    generationCount:
      typeof row.generation_count === "number" ? row.generation_count : undefined,
  };
}

function mapGenerationRow(row: Record<string, unknown>): AssetGeneration {
  return {
    id: String(row.id),
    assetId: String(row.asset_id),
    platformId: String(row.platform_id) as PlatformId,
    promptUsed: String(row.prompt_used ?? ""),
    storagePath: row.storage_path != null ? String(row.storage_path) : null,
    publicUrl: row.public_url != null ? String(row.public_url) : null,
    status: String(row.status ?? "pending") as AssetGeneration["status"],
    errorMessage: row.error_message != null ? String(row.error_message) : null,
    model: String(row.model ?? "gpt-image-2"),
    createdAt: String(row.created_at ?? ""),
  };
}

function mapPlatformRow(row: Record<string, unknown>): PlatformStyle {
  return {
    id: String(row.id) as PlatformId,
    nameZh: String(row.name_zh ?? ""),
    nameEn: String(row.name_en ?? ""),
    aspectRatio: String(row.aspect_ratio ?? "1:1"),
    size: String(row.size ?? "1024x1024"),
    promptTemplate: String(row.prompt_template ?? ""),
    negativeHints: row.negative_hints != null ? String(row.negative_hints) : undefined,
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export function assertSupabaseReady(): void {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

export async function listPlatformStyles(): Promise<PlatformStyle[]> {
  assertSupabaseReady();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("platform_styles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return PLATFORM_STYLE_FALLBACKS;
  return data.map((row) => mapPlatformRow(row as Record<string, unknown>));
}

export async function getPlatformStyle(platformId: PlatformId): Promise<PlatformStyle | null> {
  const styles = await listPlatformStyles();
  return styles.find((s) => s.id === platformId) ?? null;
}

export async function listAssets(limit = 50, offset = 0): Promise<ProductAsset[]> {
  assertSupabaseReady();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("product_assets")
    .select("*, asset_generations(count)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const mapped = mapAssetRow(row as Record<string, unknown>);
    const genCount = (row as { asset_generations?: { count: number }[] }).asset_generations?.[0]?.count;
    if (typeof genCount === "number") mapped.generationCount = genCount;
    return mapped;
  });
}

export async function getAsset(id: string): Promise<ProductAsset | null> {
  assertSupabaseReady();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("product_assets").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapAssetRow(data as Record<string, unknown>) : null;
}

export async function createAsset(input: {
  name: string;
  description?: string;
  buffer: Buffer;
  mimeType: string;
  tags?: string[];
}): Promise<ProductAsset> {
  assertSupabaseReady();
  const storagePath = buildAssetStoragePath(input.mimeType);
  const { publicUrl } = await uploadToStorage(storagePath, input.buffer, input.mimeType);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("product_assets")
    .insert({
      name: input.name.trim(),
      description: (input.description ?? "").trim(),
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: input.mimeType,
      tags: input.tags ?? [],
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapAssetRow(data as Record<string, unknown>);
}

export async function deleteAsset(id: string): Promise<void> {
  assertSupabaseReady();
  const asset = await getAsset(id);
  if (!asset) throw new Error("Asset not found");

  const generations = await listGenerations(id);
  for (const gen of generations) {
    if (gen.storagePath) {
      try {
        await deleteStorageObject(gen.storagePath);
      } catch {
        /* ignore missing objects */
      }
    }
  }

  try {
    await deleteStorageObject(asset.storagePath);
  } catch {
    /* ignore */
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("product_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listGenerations(assetId: string): Promise<AssetGeneration[]> {
  assertSupabaseReady();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("asset_generations")
    .select("*")
    .eq("asset_id", assetId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapGenerationRow(row as Record<string, unknown>));
}

export async function createGenerationRecord(input: {
  assetId: string;
  platformId: PlatformId;
  promptUsed: string;
}): Promise<AssetGeneration> {
  assertSupabaseReady();
  if (!isPlatformId(input.platformId)) throw new Error("Invalid platform");

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("asset_generations")
    .insert({
      asset_id: input.assetId,
      platform_id: input.platformId,
      prompt_used: input.promptUsed,
      status: "processing",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGenerationRow(data as Record<string, unknown>);
}

export async function completeGenerationRecord(
  id: string,
  input: { buffer: Buffer; mimeType: string; promptUsed: string }
): Promise<AssetGeneration> {
  assertSupabaseReady();
  const storagePath = buildGenerationStoragePath(input.mimeType);
  const { publicUrl } = await uploadToStorage(storagePath, input.buffer, input.mimeType);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("asset_generations")
    .update({
      storage_path: storagePath,
      public_url: publicUrl,
      prompt_used: input.promptUsed,
      status: "completed",
      error_message: null,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapGenerationRow(data as Record<string, unknown>);
}

export async function failGenerationRecord(id: string, errorMessage: string): Promise<void> {
  assertSupabaseReady();
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("asset_generations")
    .update({ status: "failed", error_message: errorMessage })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function downloadAssetBuffer(asset: ProductAsset): Promise<Buffer> {
  return downloadFromStorage(asset.storagePath);
}
