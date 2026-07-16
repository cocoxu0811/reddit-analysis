-- Product Identity Card fields + VLM generation review
-- Run after 001_asset_library.sql in Supabase SQL Editor

-- ── Product Identity Card (added to product_assets) ──
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS primary_colors TEXT[] DEFAULT '{}';
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS material TEXT DEFAULT '';
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS shape_keywords TEXT DEFAULT '';
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS brand_elements TEXT DEFAULT '';
ALTER TABLE product_assets ADD COLUMN IF NOT EXISTS immutable_features TEXT DEFAULT '';

-- ── VLM review on generated images ──
ALTER TABLE asset_generations ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT NULL
  CHECK (review_status IN ('passed', 'warning', 'failed'));
ALTER TABLE asset_generations ADD COLUMN IF NOT EXISTS review_notes TEXT DEFAULT NULL;
