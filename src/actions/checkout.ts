"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateOrderSchema, type CreateOrderInput } from "@/lib/validations/order";

export async function placeOrder(rawInput: CreateOrderInput) {
  const result = CreateOrderSchema.safeParse(rawInput);
  
  if (!result.success) {
    return { success: false, error: "Invalid order input" };
  }
  
  const { tableIdentifier, items } = result.data;
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  
  if (!restaurantId) {
    return { success: false, error: "Missing restaurant ID configuration" };
  }

  const supabase = await createClient();
  
  const formattedItems = items.map(item => ({
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    notes: item.notes || null,
  }));
  
  // Need to bypass TypeScript generic strictness for this RPC call since the type might not be updated in the auto-generated types
   
  const { data, error } = await (supabase as any).rpc("create_customer_order", {
    p_restaurant_id: restaurantId,
    p_table_identifier: tableIdentifier,
    p_items: formattedItems,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { 
    success: true, 
    data: {
      orderId: data.order_id,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      itemCount: data.item_count
    } 
  };
}
