"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStaffAction(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string || null;
  
  const pin = "1234";
  const { createHash } = await import("crypto");
  const pin_hash = createHash("sha256").update(pin).digest("hex");

  const sb = await createClient();
  await (sb as any).from("staff").insert({
    restaurant_id: process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID,
    name,
    role,
    phone,
    pin_hash
  });
  revalidatePath("/admin/staff");
}

export async function toggleStaffActive(id: string, currentStatus: boolean) {
  const sb = await createClient();
  await (sb as any).from("staff").update({ is_active: !currentStatus }).eq("id", id);
  revalidatePath("/admin/staff");
}

export async function resetStaffPin(id: string) {
  const { createHash } = await import("crypto");
  const pin_hash = createHash("sha256").update("1234").digest("hex");
  const sb = await createClient();
  await (sb as any).from("staff").update({ pin_hash }).eq("id", id);
  revalidatePath("/admin/staff");
}

export async function updateStaffRole(id: string, role: string) {
  const sb = await createClient();
  await (sb as any).from("staff").update({ role }).eq("id", id);
  revalidatePath("/admin/staff");
}

export async function changePinAction(formData: FormData) {
  const staffId = formData.get("staff_id") as string;
  const oldPin = formData.get("old_pin") as string;
  const newPin = formData.get("new_pin") as string;

  const { createHash } = await import("crypto");
  const oldPinHash = createHash("sha256").update(oldPin).digest("hex");
  const newPinHash = createHash("sha256").update(newPin).digest("hex");

  const sb = await createClient();
  const { data: staff } = await (sb as any)
    .from("staff")
    .select("id")
    .eq("id", staffId)
    .eq("pin_hash", oldPinHash)
    .single();

  if (!staff) {
    return { success: false, error: "Invalid previous PIN" };
  }

  await (sb as any).from("staff").update({ pin_hash: newPinHash }).eq("id", staffId);
  revalidatePath("/admin/staff");
  return { success: true };
}
