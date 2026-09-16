CREATE TABLE IF NOT EXISTS monthly_revenue_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  month_year DATE NOT NULL,
  gross_sales NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax_collected NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_orders INT NOT NULL DEFAULT 0,
  total_sessions INT NOT NULL DEFAULT 0,
  payment_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, month_year)
);
