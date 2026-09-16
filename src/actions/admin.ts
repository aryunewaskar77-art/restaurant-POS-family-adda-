/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleMenuItemAvailability(menuItemId: string, isAvailable: boolean) {
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId || !menuItemId) {
    return { success: false, error: "Invalid request parameters" };
  }

  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("menu_items")
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq("id", menuItemId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate so customers see the sold out status instantly
  revalidatePath("/admin/menu");
  revalidatePath("/order/[tableId]", "page");

  return { success: true };
}

export async function updateMenuItemPrice(menuItemId: string, newPrice: number) {
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId || !menuItemId || newPrice <= 0) {
    return { success: false, error: "Invalid request parameters" };
  }

  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("menu_items")
    .update({ price: newPrice, updated_at: new Date().toISOString() })
    .eq("id", menuItemId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/menu");
  revalidatePath("/order/[tableId]", "page");

  return { success: true };
}

export type ShiftMetrics = {
  grossRevenue: number;
  orderCount: number;
  averageTicketSize: number;
  voidedCount: number;
  averagePrepTimeMins: number;
};

export async function getShiftMetrics() {
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  const supabase = await createClient();

  // For a real app, you'd filter by today's date/shift. We'll simplify to fetch recent completed/voided orders
  const { data: orders, error } = await (supabase as any)
    .from("orders")
    .select("id, status, total, placed_at, updated_at")
    .eq("restaurant_id", restaurantId!)
    .in("status", ["completed", "voided", "cancelled"]);

  if (error || !orders) {
    return { success: false, error: "Failed to fetch shift metrics", metrics: null };
  }

  const completedOrders = (orders as any[]).filter((o) => o.status === "completed");
  const voidedOrders = (orders as any[]).filter((o) => o.status === "voided" || o.status === "cancelled");

  const grossRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = completedOrders.length;
  const averageTicketSize = orderCount > 0 ? grossRevenue / orderCount : 0;
  const voidedCount = voidedOrders.length;

  // Calculate average prep time (updated_at - placed_at) for completed orders
  let totalPrepSeconds = 0;
  let validPrepOrders = 0;

  completedOrders.forEach((o) => {
    if (o.placed_at && o.updated_at) {
      const placed = new Date(o.placed_at).getTime();
      const updated = new Date(o.updated_at).getTime();
      const diffSecs = (updated - placed) / 1000;
      if (diffSecs > 0) {
        totalPrepSeconds += diffSecs;
        validPrepOrders += 1;
      }
    }
  });

  const averagePrepTimeMins = validPrepOrders > 0 ? (totalPrepSeconds / validPrepOrders) / 60 : 0;

  const metrics: ShiftMetrics = {
    grossRevenue,
    orderCount,
    averageTicketSize,
    voidedCount,
    averagePrepTimeMins,
  };

  return { success: true, metrics };
}

export async function addMenuItem(data: { name: string, category_id: string, price: number }) {
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId || !data.name || !data.category_id || data.price <= 0) {
    return { success: false, error: "Invalid request parameters" };
  }

  const supabase = await createClient();

  const { data: maxSort } = await (supabase as any)
    .from("menu_items")
    .select("sort_order")
    .eq("restaurant_id", restaurantId)
    .eq("category_id", data.category_id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder = (maxSort && maxSort.length > 0) ? (maxSort[0].sort_order + 10) : 10;

  const { data: newItem, error } = await (supabase as any)
    .from("menu_items")
    .insert({
      restaurant_id: restaurantId,
      category_id: data.category_id,
      name: data.name,
      price: data.price,
      availability: "available",
      is_available: true,
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
      sort_order: nextSortOrder
    })
    .select("id, name, price, is_available, category_id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/menu");
  revalidatePath("/order/[tableId]", "page");

  return { success: true, item: newItem };
}

export async function addPantryItem(data: { name: string, category: string, current_stock: number, unit: string, minimum_required: number }) {
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId || !data.name || !data.unit) return { success: false };

  const supabase = await createClient();
  const { data: item, error } = await (supabase as any).from("pantry_items").insert({
    restaurant_id: restaurantId,
    name: data.name,
    category: data.category,
    current_stock: data.current_stock,
    unit: data.unit,
    minimum_required: data.minimum_required,
    status: data.current_stock <= data.minimum_required ? 'Low Stock' : 'In Stock'
  }).select().single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/pantry");
  return { success: true, item };
}

export async function updatePantryStock(id: string, newStock: number, minimumRequired: number) {
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  const supabase = await createClient();
  const status = newStock <= minimumRequired ? 'Low Stock' : 'In Stock';
  
  const { error } = await (supabase as any).from("pantry_items")
    .update({ current_stock: newStock, status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("restaurant_id", restaurantId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/pantry");
  return { success: true, status };
}

