-- ==========================================
-- SQL Schema for Bella Skin
-- For use in Supabase SQL Editor
-- ==========================================

-- 1. Table for PRODUCTS
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,  -- extra images: ["url2","url3"]; cover = image_url
    category TEXT,            -- e.g., 'skincare', 'body', 'hair'
    is_best_seller BOOLEAN DEFAULT false,
    ingredients TEXT,         -- Para sa listahan ng ingredients (optional)
    benefits TEXT,            -- Para sa key benefits (optional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies for Products (Read-only for public)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are visible to everyone." ON public.products FOR SELECT USING (true);


-- 2. Table for WHAT'S NEW (Announcements / Promos / New Collections)
CREATE TABLE public.whats_new (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    link_url TEXT,            -- Kung saan mag-reredirect pag na-click
    is_active BOOLEAN DEFAULT true, -- Pwedeng i-turn off kung tapos na ang promo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for What's New (Read-only for public)
ALTER TABLE public.whats_new ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Whats New is visible to everyone." ON public.whats_new FOR SELECT USING (true);


-- ==========================================
-- SAMPLE DATA (Para makita niyo agad ang resulta sa website niyo pag na-connect na)
-- ==========================================

INSERT INTO public.products (name, price, category, is_best_seller, image_url)
VALUES 
('Bella Skin Facial Set', 399.00, 'skincare', true, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'),
('Rose Gold Elixir', 450.00, 'skincare', true, 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e'),
('Glow Essence Toner', 250.00, 'skincare', false, 'https://images.unsplash.com/photo-1608248593802-84069bb24cbb');

INSERT INTO public.whats_new (title, subtitle, content, image_url, link_url)
VALUES
('Experience the Gold Glow', 'New Arrival', 'Carefully formulated with natural botanical extracts to rejuvenate and restore your skin''s natural balance.', 'https://images.unsplash.com/photo-1615397323891-ce55a6d36e2f', '/product/rejuvenating-set');
