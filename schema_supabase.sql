-- ============================================================================
-- FREDY BILLS BAKERY SYSTEM — SUPABASE POSTGRESQL DATABASE SCHEMA & BUCKET SETUP
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Customer',
    phone VARCHAR(50) DEFAULT '',
    address TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    image VARCHAR(500) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. PRODUCTS TABLE (Starts Empty for manual item-by-item creation)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    price DOUBLE PRECISION NOT NULL,
    cost_price DOUBLE PRECISION DEFAULT 0.0,
    image VARCHAR(500) DEFAULT '',
    description TEXT DEFAULT '',
    short_description VARCHAR(255) DEFAULT '',
    allergens_json TEXT DEFAULT '[]',
    badge VARCHAR(50) DEFAULT '',
    is_featured BOOLEAN DEFAULT FALSE,
    rating DOUBLE PRECISION DEFAULT 5.0,
    sizes_json TEXT DEFAULT '[]',
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 50,
    recipe_json TEXT DEFAULT '[]'
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    fulfillment VARCHAR(50) DEFAULT 'delivery',
    address TEXT DEFAULT '',
    branch_name VARCHAR(120) DEFAULT 'Mabini Main Flagship',
    payment_method VARCHAR(80) DEFAULT 'GCash',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    status VARCHAR(50) DEFAULT 'confirmed',
    status_step INTEGER DEFAULT 2,
    subtotal DOUBLE PRECISION DEFAULT 0.0,
    discount DOUBLE PRECISION DEFAULT 0.0,
    delivery_fee DOUBLE PRECISION DEFAULT 0.0,
    total DOUBLE PRECISION DEFAULT 0.0,
    estimated_time VARCHAR(100) DEFAULT 'Estimated 45-60 mins',
    timeline_json TEXT DEFAULT '[]',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DOUBLE PRECISION NOT NULL,
    options_json TEXT DEFAULT '{}'
);

-- 7. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(120) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    email VARCHAR(120) DEFAULT '',
    address TEXT DEFAULT '',
    category VARCHAR(100) DEFAULT 'Baking Ingredients',
    notes TEXT DEFAULT ''
);

-- 8. INVENTORY ITEMS TABLE
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(80) DEFAULT 'Baking Ingredients',
    unit VARCHAR(30) DEFAULT 'kg',
    current_stock DOUBLE PRECISION DEFAULT 0.0,
    minimum_stock DOUBLE PRECISION DEFAULT 10.0,
    unit_cost DOUBLE PRECISION DEFAULT 0.0,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. INVENTORY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    inventory_item_id INTEGER REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit_price DOUBLE PRECISION DEFAULT 0.0,
    reference_id VARCHAR(100) DEFAULT '',
    notes TEXT DEFAULT '',
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. PRODUCTION TASKS TABLE
CREATE TABLE IF NOT EXISTS production_tasks (
    id SERIAL PRIMARY KEY,
    task_code VARCHAR(50) UNIQUE NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    target_quantity INTEGER DEFAULT 1,
    completed_quantity INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    assigned_baker_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    scheduled_date VARCHAR(50) DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 11. PRODUCTION INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS production_ingredients (
    id SERIAL PRIMARY KEY,
    production_task_id INTEGER REFERENCES production_tasks(id) ON DELETE CASCADE,
    inventory_item_id INTEGER NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    required_quantity DOUBLE PRECISION DEFAULT 1.0,
    actual_used_quantity DOUBLE PRECISION DEFAULT 1.0,
    unit VARCHAR(30) DEFAULT 'kg'
);

-- 12. DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    delivery_staff_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    assigned_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    proof_note TEXT DEFAULT '',
    failure_reason TEXT DEFAULT '',
    customer_notes TEXT DEFAULT ''
);

-- 13. PURCHASE ORDERS TABLE
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    po_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Draft',
    total_cost DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery TIMESTAMP,
    received_at TIMESTAMP,
    notes TEXT DEFAULT ''
);

-- 14. PURCHASE ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
    inventory_item_id INTEGER REFERENCES inventory_items(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit_price DOUBLE PRECISION NOT NULL,
    total_price DOUBLE PRECISION NOT NULL
);

-- 15. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(80) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    transaction_ref VARCHAR(120) DEFAULT '',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. SALE RECORDS TABLE
CREATE TABLE IF NOT EXISTS sale_records (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    total_amount DOUBLE PRECISION NOT NULL,
    net_profit DOUBLE PRECISION DEFAULT 0.0,
    payment_method VARCHAR(80) DEFAULT 'Cash',
    channel VARCHAR(50) DEFAULT 'Online Store',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT DEFAULT ''
);

-- 19. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE
);

-- 20. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percent',
    discount_value DOUBLE PRECISION NOT NULL,
    min_order DOUBLE PRECISION DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- SUPABASE STORAGE BUCKET SETUP: bakery-images
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bakery-images', 'bakery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Row Level Security (RLS) Policies
CREATE POLICY "Public Read Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'bakery-images');

CREATE POLICY "Public Insert Access" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'bakery-images');

CREATE POLICY "Public Update Access" ON storage.objects
    FOR UPDATE USING (bucket_id = 'bakery-images');

CREATE POLICY "Public Delete Access" ON storage.objects
    FOR DELETE USING (bucket_id = 'bakery-images');

-- ============================================================================
-- INITIAL SEED DATA FOR SUPABASE (Default Roles & Categories)
-- ============================================================================

-- Insert Default System Users (Passwords are bcrypt hashed 'password123')
INSERT INTO users (email, password_hash, name, role, phone, address) VALUES
('admin@fredybills.ph', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'System Administrator', 'Administrator', '+63 917 000 1122', 'Headquarters Office'),
('counter@fredybills.ph', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Maria Santos (Counter)', 'Counter Staff', '+63 918 888 2211', 'Main Branch POS Counter'),
('baker@fredybills.ph', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Chef Fredy (Baker)', 'Baker', '+63 919 777 3344', 'Bakery Kitchen Division'),
('delivery@fredybills.ph', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Ramon Courier (Dispatch)', 'Delivery Staff', '+63 920 666 5544', 'Cebu Logistics Hub'),
('customer@fredybills.ph', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Juan Dela Cruz', 'Customer', '+63 917 123 4567', 'Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City')
ON CONFLICT (email) DO NOTHING;

-- Insert Categories
INSERT INTO categories (id, name, description, image, is_active) VALUES
('cakes', 'Artisanal Cakes', 'Celebration, layered, and chiffon cakes hand-crafted with European butter.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', true),
('breads', 'Artisan Breads', 'Naturally fermented sourdoughs and rustic crusty hearth loaves.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', true),
('pastries', 'Viennoiserie & Pastries', 'Flaky Normandy butter croissants, danishes, and savoury turnovers.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', true),
('cookies', 'Cookies & Confections', 'Gooey chocolate chunk cookies, financiers, and French macarons.', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80', true),
('specialty', 'Specialty & Filipino', 'Classic Filipino bakery staples elevated with premium local ingredients.', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- Promo code defaults
INSERT INTO promo_codes (code, discount_type, discount_value, min_order, is_active) VALUES
('FREDY10', 'percent', 10.0, 500.0, true),
('WELCOME50', 'fixed', 50.0, 300.0, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- DISABLE ROW LEVEL SECURITY (RLS) FOR FULL PUBLIC / ANON REST CRUD ACCESS
-- ============================================================================
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

