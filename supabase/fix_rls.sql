-- Fix: Allow public access to all tables for custom auth

-- If you enabled Row Level Security (RLS) on these tables, 
-- it will block the Next.js app because it uses custom PIN auth instead of Supabase Auth.

ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled, run these policies instead:
-- CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON menu_items FOR SELECT USING (true);
-- etc.
