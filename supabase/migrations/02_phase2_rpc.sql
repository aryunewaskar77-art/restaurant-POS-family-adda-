-- supabase/migrations/02_phase2_rpc.sql
-- Migration for Phase 2: Core Data Access Layer, Atomic Order RPC & Server Actions

-- Alter menu_items to add is_available
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

-- Update order_status enum to match new Phase 2 spec if needed.
-- Since PostgreSQL enum alterations are complex in a simple script, we'll assume the app logic handles string values or the enum is text.
-- But for a clean script, let's just make sure the enum has the new values, or we cast.
DO $$ BEGIN
  ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'in_kitchen';
  ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'completed';
  ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'voided';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;


CREATE OR REPLACE FUNCTION create_customer_order(
  p_restaurant_id UUID,
  p_table_identifier TEXT,
  p_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_subtotal NUMERIC := 0;
  v_tax NUMERIC := 0;
  v_total NUMERIC := 0;
  v_item_count INT := 0;
  
  v_item JSONB;
  v_menu_item_id UUID;
  v_quantity INT;
  v_notes TEXT;
  
  v_unit_price NUMERIC;
  v_is_available BOOLEAN;
BEGIN
  -- Validate items
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order items cannot be empty';
  END IF;

  -- Create pending order (initial insert)
  INSERT INTO orders (restaurant_id, table_number, status, subtotal, tax, total, placed_at)
  VALUES (p_restaurant_id, p_table_identifier, 'pending', 0, 0, 0, NOW())
  RETURNING id INTO v_order_id;

  -- Process items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_menu_item_id := (v_item->>'menu_item_id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    v_notes := v_item->>'notes';

    SELECT price, is_available INTO v_unit_price, v_is_available
    FROM menu_items
    WHERE id = v_menu_item_id AND restaurant_id = p_restaurant_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Menu item % not found', v_menu_item_id;
    END IF;

    IF NOT v_is_available THEN
      RAISE EXCEPTION 'Menu item % is sold out', v_menu_item_id;
    END IF;

    INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, notes)
    VALUES (v_order_id, v_menu_item_id, v_quantity, v_unit_price, v_unit_price * v_quantity, v_notes);

    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
    v_item_count := v_item_count + v_quantity;
  END LOOP;

  v_tax := ROUND(v_subtotal * 0.05, 2);
  v_total := v_subtotal + v_tax;

  UPDATE orders
  SET subtotal = v_subtotal,
      tax = v_tax,
      total = v_total
  WHERE id = v_order_id;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'subtotal', v_subtotal,
    'tax', v_tax,
    'total', v_total,
    'item_count', v_item_count
  );
END;
$$;


CREATE OR REPLACE FUNCTION verify_staff_pin(
  p_restaurant_id UUID,
  p_pin TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_staff_id UUID;
  v_name TEXT;
  v_role TEXT;
  v_pin_hash TEXT;
BEGIN
  SELECT id, name, role::TEXT, pin_hash INTO v_staff_id, v_name, v_role, v_pin_hash
  FROM staff
  WHERE restaurant_id = p_restaurant_id AND is_active = TRUE
  AND pin_hash = crypt(p_pin, pin_hash)
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'valid', TRUE,
      'staff_id', v_staff_id,
      'name', v_name,
      'role', v_role
    );
  ELSE
    RETURN jsonb_build_object('valid', FALSE);
  END IF;
END;
$$;
