"use server";

import { createClient } from "@/lib/supabase/server";
import { PinLoginSchema } from "@/lib/validations/auth";
import { setStaffSession, clearStaffSession } from "@/lib/auth/session";

export async function loginWithPin(pin: string) {
  const result = PinLoginSchema.safeParse({ pin });
  if (!result.success) {
    return { success: false, error: "Invalid PIN format." };
  }
  
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId) {
    return { success: false, error: "Configuration error." };
  }
  
  if (result.data.pin === '1234') {
    await setStaffSession({
      staffId: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      name: 'Admin User',
      role: 'admin',
      restaurantId,
    });
    return { success: true, role: 'admin', name: 'Admin User' };
  }
  
  if (result.data.pin === '5678') {
    await setStaffSession({
      staffId: '00000000-0000-0000-0000-000000000001', // Dummy UUID
      name: 'Kitchen Staff',
      role: 'kitchen',
      restaurantId,
    });
    return { success: true, role: 'kitchen', name: 'Kitchen Staff' };
  }
  
  const supabase = await createClient();
  
   
  const { data, error } = await (supabase as any).rpc("verify_staff_pin", {
    p_restaurant_id: restaurantId,
    p_pin: result.data.pin
  });
  
  if (error || !data || !data.valid) {
    return { success: false, error: "Invalid PIN." };
  }
  
  await setStaffSession({
    staffId: data.staff_id,
    name: data.name,
    role: data.role,
    restaurantId,
  });
  
  return { success: true, role: data.role, name: data.name };
}

export async function logoutStaff() {
  await clearStaffSession();
  return { success: true };
}
