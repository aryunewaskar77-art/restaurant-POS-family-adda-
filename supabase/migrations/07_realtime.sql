-- Enable realtime for orders and table_sessions
BEGIN;

-- Drop from publication if exists to avoid errors, then add
-- (A safer way is to just add it, Supabase usually doesn't error if it's already there, but we can check)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'table_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE table_sessions;
  END IF;
END $$;

COMMIT;
