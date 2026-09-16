/**
 * Supabase Server Client
 *
 * Use this factory in Server Components, Route Handlers, and Server Actions.
 * Creates a per-request client wired to Next.js cookies for session management.
 *
 * ⚠️  Always call `supabase.auth.getUser()` (not `getSession()`) on the server.
 *     getSession() reads from the cookie without re-validating with Supabase Auth,
 *     which can be spoofed by a malicious user.
 *
 * @example
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components are read-only for cookies.
            // Session refresh is handled by middleware.ts instead.
          }
        },
      },
    }
  );
}
