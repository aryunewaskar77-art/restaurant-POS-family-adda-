DO $$ BEGIN
  CREATE TYPE item_status AS ENUM ('pending', 'in_kitchen', 'ready', 'served');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS status item_status NOT NULL DEFAULT 'pending';
