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
    if (newStatus === "in_kitchen" || newStatus === "completed" || newStatus === "voided") isValidTransition = true;
  } else if (currentStatus === "in_kitchen") {
    if (newStatus === "ready" || newStatus === "completed" || newStatus === "voided") isValidTransition = true;
  } else if (currentStatus === "ready") {
    if (newStatus === "completed" || newStatus === "in_kitchen" || newStatus === "voided") isValidTransition = true;
  } else if (currentStatus === "completed" || currentStatus === "voided") {
    isValidTransition = false; // Terminal states
  }
  
  if (!isValidTransition) {
    return { success: false, error: `Invalid transition from ${currentStatus} to ${newStatus}` };
  }
  
   
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

export type ItemStatus = 'pending' | 'in_kitchen' | 'ready' | 'served';

export async function updateOrderItemStatus(itemId: string, newStatus: ItemStatus) {
  const session = await getStaffSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  
   
  const { data: updatedItem, error } = await (supabase as any)
    .from("order_items")
    .update({ status: newStatus })
    .eq("id", itemId)
    .select("order_id")
    .single();
    
  if (error || !updatedItem) {
    return { success: false, error: error?.message || "Item not found" };
  }

  const orderId = updatedItem.order_id;

  // Auto-advance parent order
   
  const { data: siblings } = await (supabase as any)
    .from("order_items")
    .select("status")
    .eq("order_id", orderId);

  if (siblings && siblings.length > 0) {
     
    const allServed = siblings.every((s: any) => s.status === 'served');
     
    const allReadyOrServed = siblings.every((s: any) => ['ready', 'served'].includes(s.status));
     
    const anyProgress = siblings.some((s: any) => ['in_kitchen', 'ready', 'served'].includes(s.status));

     
    const { data: order } = await (supabase as any).from("orders").select("status").eq("id", orderId).single();
    
    if (order) {
      let targetStatus = null;
      if (allServed && order.status !== 'completed') {
        targetStatus = 'completed';
      } else if (allReadyOrServed && !allServed && order.status !== 'ready') {
        targetStatus = 'ready';
      } else if (anyProgress && order.status === 'pending') {
        targetStatus = 'in_kitchen';
      }

      if (targetStatus) {
         
        await (supabase as any).from("orders").update({ status: targetStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
      }
    }
  }
  
  return { success: true };
}
