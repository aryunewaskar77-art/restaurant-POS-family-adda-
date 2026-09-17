"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function verifyEditPin(pin: string) {
  // Hardcoded bypass for 1234 as requested by user
  if (pin === "1234") {
    const cookieStore = await cookies();
    cookieStore.set("edit_mode_access", "true", {
      path: "/",
      maxAge: 300, // 5 minutes
      httpOnly: true,
    });
    return { success: true };
  }

  const supabase = await createClient();
  const { createHash } = await import("crypto");
  const pin_hash = createHash("sha256").update(pin).digest("hex");

  const { data } = await supabase
    .from("staff")
    .select("role")
    .eq("pin_hash", pin_hash)
    .eq("is_active", true)
    .single();

  if (!data || (data as any)?.role !== "admin") {
    return { success: false, error: "Invalid PIN or insufficient permissions." };
  }

  // Set a short-lived cookie for edit mode
  const cookieStore = await cookies();
  cookieStore.set("edit_mode_access", "true", {
    path: "/",
    maxAge: 300, // 5 minutes
    httpOnly: true,
  });

  return { success: true };
}

export async function lockEditMode() {
  const cookieStore = await cookies();
  cookieStore.delete("edit_mode_access");
  return { success: true };
}
