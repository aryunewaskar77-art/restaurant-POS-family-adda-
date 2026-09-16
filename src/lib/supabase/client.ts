/**
 * Supabase Browser Client
 *
 * Use this factory in "use client" components.
 * Creates a singleton-per-render browser client using the public anon key.
 * Session is stored in cookies (managed by @supabase/ssr).
 *
 * @example
 * const supabase = createClient()
 * const { data } = await supabase.from('menu_items').select('*')
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
