-- Asset library schema for product images + platform-specific AI generations
-- Run in Supabase SQL Editor or via supabase db push

CREATE TABLE IF NOT EXISTS platform_styles (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '1:1',
  size TEXT NOT NULL DEFAULT '1024x1024',
  prompt_template TEXT NOT NULL,
  negative_hints TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

INSERT INTO platform_styles (id, name_zh, name_en, aspect_ratio, size, prompt_template, negative_hints, sort_order)
VALUES
  (
    'tmall',
    '天猫',
    'Tmall',
    '1:1',
    '1024x1024',
    'Transform this product photo into a Tmall/Taobao main product image: pure white background (#FFFFFF), product centered with generous padding, clean e-commerce look, soft even studio lighting, no clutter, space reserved for Chinese selling points overlay, photorealistic, sharp product details preserved.',
    'busy background, text watermark, low quality, distorted product',
    1
  ),
  (
    'jd',
    '京东',
    'JD.com',
    '1:1',
    '1024x1024',
    'Transform this product photo into a JD.com main product image: crisp white background, product centered, slightly higher contrast and punchy colors, professional e-commerce photography, sturdy premium feel, sharp edges, no decorative clutter, suitable for Chinese marketplace listing.',
    'messy background, cartoon style, blurry, wrong colors',
    2
  ),
  (
    'temu',
    'Temu',
    'Temu',
    '1:1',
    '1024x1024',
    'Transform this product photo into a Temu-style promotional product image: vibrant saturated colors, eye-catching deal/shopping vibe, subtle promotional sticker feel, bold composition, high energy, product still clearly visible and accurate, marketplace thumbnail optimized.',
    'dull colors, luxury minimal, unreadable product',
    3
  ),
  (
    'instagram',
    'Instagram',
    'Instagram',
    '4:5',
    '1024x1280',
    'Transform this product photo into an Instagram lifestyle post: natural soft daylight, authentic UGC aesthetic, product in a real-life context or styled flat lay, warm inviting mood, subtle depth of field, not overly commercial, social-media ready vertical composition.',
    'white e-commerce background, heavy text, stock photo cliché',
    4
  )
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS product_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/png',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_assets_created ON product_assets(created_at DESC);

CREATE TABLE IF NOT EXISTS asset_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES product_assets(id) ON DELETE CASCADE,
  platform_id TEXT NOT NULL REFERENCES platform_styles(id),
  prompt_used TEXT NOT NULL,
  storage_path TEXT,
  public_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  model TEXT NOT NULL DEFAULT 'gpt-image-2',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_generations_asset ON asset_generations(asset_id, created_at DESC);

-- Storage bucket (run separately if storage API preferred):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true)
-- ON CONFLICT (id) DO NOTHING;
