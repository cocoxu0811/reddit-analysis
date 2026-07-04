import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

export const PRODUCT_MEDIA_BUCKET = "product-media";

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

export async function uploadToStorage(
  storagePath: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ publicUrl: string }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(PRODUCT_MEDIA_BUCKET).upload(storagePath, buffer, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(storagePath);
  if (!data?.publicUrl) throw new Error("Failed to get public URL for uploaded file");
  return { publicUrl: data.publicUrl };
}

export async function downloadFromStorage(storagePath: string): Promise<Buffer> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(PRODUCT_MEDIA_BUCKET).download(storagePath);
  if (error || !data) throw new Error(`Storage download failed: ${error?.message ?? "empty"}`);
  return Buffer.from(await data.arrayBuffer());
}

export async function deleteStorageObject(storagePath: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(PRODUCT_MEDIA_BUCKET).remove([storagePath]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}
