-- Run in Supabase SQL Editor (once) if `gallery_urls` is not on `products` yet.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.products.gallery_urls IS 'Additional product image URLs (JSON array of strings); primary cover stays in image_url.';
