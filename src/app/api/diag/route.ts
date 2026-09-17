import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase URL or Key in Vercel environment variables." });
  }

  const startTime = Date.now();
  let dbStatus = "Unknown";
  let dbError = null;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${supabaseUrl}/rest/v1/restaurants?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      signal: controller.signal as any
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      dbStatus = "Connected successfully";
    } else {
      dbStatus = `HTTP Error ${response.status}`;
      dbError = await response.text();
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      dbStatus = "Connection Timed Out (Took more than 5 seconds)";
      dbError = "Your Supabase project might be paused, or the URL is unreachable. Check for typos in your NEXT_PUBLIC_SUPABASE_URL.";
    } else {
      dbStatus = "Connection Failed";
      dbError = error.message;
    }
  }

  return NextResponse.json({
    supabaseUrl: supabaseUrl.substring(0, 15) + "...",
    hasKey: !!supabaseKey,
    restaurantId: restaurantId || "MISSING",
    timeTakenMs: Date.now() - startTime,
    dbStatus,
    dbError
  });
}
