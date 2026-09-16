-- Archive jobs table
CREATE TABLE IF NOT EXISTS archive_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    archive_month DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'started',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    metrics JSONB DEFAULT '{}'::jsonb,
    file_paths JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one completed job per restaurant per month
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_completed_archive_job
ON archive_jobs (restaurant_id, archive_month)
WHERE status = 'completed';

-- Storage Bucket for POS Archives
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pos-archives', 'pos-archives', false, null, ARRAY['text/csv'])
ON CONFLICT (id) DO UPDATE SET public = false;

-- RPC for safe transactional deletion
CREATE OR REPLACE FUNCTION delete_archived_sessions(p_session_ids UUID[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete order_items first
    DELETE FROM order_items
    WHERE order_id IN (
        SELECT id FROM orders WHERE session_id = ANY(p_session_ids)
    );

    -- Delete orders next
    DELETE FROM orders
    WHERE session_id = ANY(p_session_ids);

    -- Delete table_sessions last
    DELETE FROM table_sessions
    WHERE id = ANY(p_session_ids);
END;
$$;
