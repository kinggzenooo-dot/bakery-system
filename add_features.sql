-- ============================================================================
-- FREDY BILLS BAKERY — SUPABASE DELTA UPDATE SCRIPT
-- Paste and RUN this snippet in your Supabase SQL Editor
-- ============================================================================

-- 1. ADD MISSING RECIPE COLUMN TO PRODUCTS TABLE
ALTER TABLE products ADD COLUMN IF NOT EXISTS recipe_json TEXT DEFAULT '[]';

-- 2. CREATE SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bakery-images', 'bakery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Row Level Security (RLS) Policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;

CREATE POLICY "Public Read Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'bakery-images');

CREATE POLICY "Public Insert Access" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'bakery-images');

CREATE POLICY "Public Update Access" ON storage.objects
    FOR UPDATE USING (bucket_id = 'bakery-images');

CREATE POLICY "Public Delete Access" ON storage.objects
    FOR DELETE USING (bucket_id = 'bakery-images');

-- 3. DISABLE ROW LEVEL SECURITY (RLS) ON TABLES TO ALLOW DIRECT API CRUD OPERATIONS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE production_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE production_ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE sale_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
