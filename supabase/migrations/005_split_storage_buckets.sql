-- Split original uploads and AI-generated images into public buckets.
-- Safe to run repeatedly.

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES
  (
    'product-originals',
    'product-originals',
    true,
    15728640,
    ARRAY['image/png', 'image/jpeg', 'image/webp']
  ),
  (
    'product-generated',
    'product-generated',
    true,
    15728640,
    ARRAY['image/png', 'image/jpeg', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

ALTER TABLE asset_generations
  ALTER COLUMN model SET DEFAULT 'gemini-3.1-flash-image';
