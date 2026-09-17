"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function verifySectionPin(pin: string, section: string) {
  const supabase = await createClient();
  const { createHash } = await import("crypto");
  const pin_hash = createHash("sha256").update(pin).digest("hex");

  const { data } = await supabase
    .from("staff")
    .select("role")
    .eq("pin_hash", pin_hash)
    .eq("is_active", true)
    .single();

  if (!data || data.role !== "admin") {
    return { success: false, error: "Invalid PIN or insufficient permissions." };
  }

  // Set a short-lived cookie for this section
  const cookieStore = await cookies();
  cookieStore.set(`${section}_access`, "true", {
    path: "/",
    maxAge: 300, // 5 minutes
    httpOnly: true,
  });

  return { success: true };
}
