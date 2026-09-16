DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('active', 'bill_requested', 'paid', 'abandoned');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS table_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_identifier TEXT NOT NULL,
  status session_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_method TEXT, -- 'cash', 'upi', 'card'
  payment_reference TEXT
);

-- Ensure only one active/bill_requested session per table at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_active_session_per_table
ON table_sessions (restaurant_id, table_identifier)
WHERE status IN ('active', 'bill_requested');

-- Link orders to session
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES table_sessions(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION create_customer_order(
  p_restaurant_id UUID,
  p_table_identifier TEXT,
  p_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id UUID;
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

  -- Find or create active table session
  SELECT id INTO v_session_id
  FROM table_sessions
  WHERE restaurant_id = p_restaurant_id
    AND table_identifier = p_table_identifier
    AND status IN ('active', 'bill_requested')
  LIMIT 1;

  IF v_session_id IS NULL THEN
    INSERT INTO table_sessions (restaurant_id, table_identifier, status)
    VALUES (p_restaurant_id, p_table_identifier, 'active')
    RETURNING id INTO v_session_id;
  END IF;

  -- Create pending order (initial insert)
  INSERT INTO orders (restaurant_id, table_number, session_id, status, subtotal, tax, total, placed_at)
  VALUES (p_restaurant_id, p_table_identifier, v_session_id, 'pending', 0, 0, 0, NOW())
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
    'session_id', v_session_id,
    'subtotal', v_subtotal,
    'tax', v_tax,
    'total', v_total,
    'item_count', v_item_count
  );
END;
$$;

CREATE OR REPLACE FUNCTION settle_table_session(
  p_restaurant_id UUID,
  p_session_id UUID,
  p_payment_method TEXT,
  p_payment_reference TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subtotal NUMERIC := 0;
  v_tax NUMERIC := 0;
  v_total NUMERIC := 0;
BEGIN
  -- Compute totals from non-voided/cancelled orders
  SELECT COALESCE(SUM(subtotal), 0), COALESCE(SUM(tax), 0), COALESCE(SUM(total), 0)
  INTO v_subtotal, v_tax, v_total
  FROM orders
  WHERE session_id = p_session_id 
    AND restaurant_id = p_restaurant_id
    AND status NOT IN ('voided', 'cancelled');

  -- Update session
  UPDATE table_sessions
  SET status = 'paid',
      closed_at = NOW(),
      payment_method = p_payment_method,
      payment_reference = p_payment_reference,
      subtotal = v_subtotal,
      tax = v_tax,
      total = v_total
  WHERE id = p_session_id AND restaurant_id = p_restaurant_id;

  -- Update all active child orders to completed (if not voided)
  UPDATE orders
  SET status = 'completed'
  WHERE session_id = p_session_id 
    AND restaurant_id = p_restaurant_id
    AND status NOT IN ('voided', 'cancelled', 'completed');

  RETURN jsonb_build_object(
    'success', true,
    'session_id', p_session_id,
    'final_total', v_total
  );
END;
$$;

-- Allow anon to fetch table sessions since our frontend uses manual PIN overrides in some places or anon role for kiosk
ALTER TABLE table_sessions DISABLE ROW LEVEL SECURITY;
