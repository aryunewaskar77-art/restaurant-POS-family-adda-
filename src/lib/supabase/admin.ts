/**
 * Supabase Admin Client (Service Role)
 *
 * ⚠️  SERVER-ONLY — Never import this in "use client" components.
 * ⚠️  Bypasses Row Level Security (RLS) — use only for privileged operations:
 *     - Webhook handlers
 *     - Background jobs / cron tasks
 *     - Admin panel data mutations
 *     - Seeding / migrations from API routes
 *
 * This client uses the service role key directly from `@supabase/supabase-js`
 * (not `@supabase/ssr`) because it does not need cookie-based session management.
 *
 * @example
 * import { supabaseAdmin } from "@/lib/supabase/admin"
 * const { data } = await supabaseAdmin.from('restaurants').select('*')
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      // Disable session persistence — admin client is stateless and server-only
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
