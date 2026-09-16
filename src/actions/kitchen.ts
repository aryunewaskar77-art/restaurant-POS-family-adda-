"use server";

import { createClient } from "@/lib/supabase/server";
import { UpdateOrderStatusSchema, type UpdateOrderStatusInput } from "@/lib/validations/auth";
import { getStaffSession } from "@/lib/auth/session";

export async function updateOrderStatus(rawInput: UpdateOrderStatusInput) {
  const session = await getStaffSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const result = UpdateOrderStatusSchema.safeParse(rawInput);
  if (!result.success) {
    return { success: false, error: "Invalid input" };
  }
  
  const { orderId, status: newStatus } = result.data;
  
  const supabase = await createClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error: fetchError } = await (supabase as any)
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();
    
  if (fetchError || !order) {
    return { success: false, error: "Order not found." };
  }
  
  const currentStatus = order.status;
  
  // Enforce state machine
  let isValidTransition = false;
  
  if (currentStatus === "pending") {
    if (newStatus === "in_kitchen" || newStatus === "voided") isValidTransition = true;
  } else if (currentStatus === "in_kitchen") {
    if (newStatus === "ready" || newStatus === "voided") isValidTransition = true;
  } else if (currentStatus === "ready") {
    if (newStatus === "completed" || newStatus === "in_kitchen") isValidTransition = true;
  } else if (currentStatus === "completed" || currentStatus === "voided") {
    isValidTransition = false; // Terminal states
  }
  
  if (!isValidTransition) {
    return { success: false, error: `Invalid transition from ${currentStatus} to ${newStatus}` };
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from("orders")
    .update({ 
      status: newStatus, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", orderId);
    
  if (updateError) {
    return { success: false, error: updateError.message };
  }
  
  return { success: true };
}
