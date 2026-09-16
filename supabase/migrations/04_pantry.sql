-- supabase/migrations/04_pantry.sql

CREATE TABLE IF NOT EXISTS pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    current_stock NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    minimum_required NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'In Stock',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE pantry_items DISABLE ROW LEVEL SECURITY;
