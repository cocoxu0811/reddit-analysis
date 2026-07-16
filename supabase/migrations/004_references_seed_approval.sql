-- Multi-reference images, seed tracking, generation approval, and clean-bg support
-- Run after 003_product_identity_and_review.sql in Supabase SQL Editor

-- ── Multi-angle reference images per product ──
CREATE TABLE IF NOT EXISTS asset_reference_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES product_assets(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/png',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_ref_images_asset
  ON asset_reference_images(asset_id, sort_order);

-- ── Seed tracking + approval on generations ──
ALTER TABLE asset_generations ADD COLUMN IF NOT EXISTS seed INT DEFAULT NULL;
ALTER TABLE asset_generations ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- ── Clean (background-removed) version of product asset ──
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS clean_storage_path TEXT DEFAULT NULL;
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS clean_public_url TEXT DEFAULT NULL;
