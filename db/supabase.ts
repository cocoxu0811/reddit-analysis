import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

/** Legacy bucket — still used to resolve old URLs; new uploads go to split buckets. */
export const PRODUCT_MEDIA_BUCKET = "product-media";
export const ORIGINALS_BUCKET = "product-originals";
export const GENERATED_BUCKET = "product-generated";

let adminClient: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const url = requireEnv("SUPABASE_URL");
    const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function extFromMime(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  return "png";
}

export function buildAssetStoragePath(mimeType: string): string {
  return `product-assets/${randomUUID()}.${extFromMime(mimeType)}`;
}

export function buildGenerationStoragePath(mimeType: string): string {
  return `generations/${randomUUID()}.${extFromMime(mimeType)}`;
}

function detectBucket(storagePath: string): string {
  if (storagePath.startsWith("generations/")) return GENERATED_BUCKET;
  if (storagePath.startsWith("product-assets/")) return ORIGINALS_BUCKET;
  return PRODUCT_MEDIA_BUCKET;
}

export async function uploadToStorage(
  storagePath: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ publicUrl: string }> {
  const bucket = detectBucket(storagePath);
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  if (!data?.publicUrl) throw new Error("Failed to get public URL for uploaded file");
  return { publicUrl: data.publicUrl };
}

export async function downloadFromStorage(storagePath: string): Promise<Buffer> {
  const bucket = detectBucket(storagePath);
  const supabase = getSupabaseAdmin();
  let { data, error } = await supabase.storage.from(bucket).download(storagePath);
  if (error && bucket !== PRODUCT_MEDIA_BUCKET) {
    ({ data, error } = await supabase.storage.from(PRODUCT_MEDIA_BUCKET).download(storagePath));
  }
  if (error || !data) throw new Error(`Storage download failed: ${error?.message ?? "empty"}`);
  return Buffer.from(await data.arrayBuffer());
}

export async function deleteStorageObject(storagePath: string): Promise<void> {
  const bucket = detectBucket(storagePath);
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).remove([storagePath]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}
