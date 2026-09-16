CREATE OR REPLACE FUNCTION delete_archived_sessions(p_session_ids UUID[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Delete grandchild items first (no cascade on schema)
  DELETE FROM order_items
  WHERE order_id IN (
    SELECT id FROM orders WHERE session_id = ANY(p_session_ids)
  );

  -- 2. Delete child orders
  DELETE FROM orders
  WHERE session_id = ANY(p_session_ids);

  -- 3. Delete parent sessions
  DELETE FROM table_sessions
  WHERE id = ANY(p_session_ids);
END;
$$;
