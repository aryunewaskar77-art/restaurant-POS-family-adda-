"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SettleSessionSchema, type SettleSessionInput } from "@/lib/validations/order";
import { getStaffSession } from "@/lib/auth/session";
import type { TableSessionSummary } from "@/types/domain";

export async function settleSession(input: SettleSessionInput) {
  try {
    const session = await getStaffSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: "Unauthorized. Admin required." };
    }

    const data = SettleSessionSchema.parse(input);
    const supabase = await createClient();
    const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;

     
    const { data: result, error } = await (supabase as any).rpc("settle_table_session", {
      p_restaurant_id: restaurantId,
      p_session_id: data.sessionId,
      p_payment_method: data.paymentMethod,
      p_payment_reference: data.paymentReference || null
    });

    if (error) {
      console.error("Settle session error:", error);
      return { success: false, error: "Failed to settle session." };
    }

    revalidatePath("/admin/tables");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/dashboard");
    
    return { success: true, finalTotal: result.final_total };
  } catch (err: any) {
    console.error("Settle session exception:", err);
    return { success: false, error: err.message || "An error occurred." };
  }
}

export async function requestBill(tableIdentifier: string) {
  try {
    const supabase = await createClient();
    const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;

    // Update active session to 'bill_requested'
     
    const { error } = await (supabase as any)
      .from("table_sessions")
      .update({ status: "bill_requested" })
      .eq("restaurant_id", restaurantId)
      .eq("table_identifier", tableIdentifier)
      .eq("status", "active");

    if (error) {
      console.error("Request bill error:", error);
      return { success: false, error: "Failed to request bill." };
    }

    revalidatePath("/admin/tables");
    revalidatePath(`/order/${tableIdentifier}`, "page");
    revalidatePath("/status", "page");

    return { success: true };
  } catch (err: any) {
    console.error("Request bill exception:", err);
    return { success: false, error: err.message || "An error occurred." };
  }
}

export async function getActiveSessionForTable(tableIdentifier: string): Promise<{ success: boolean; session?: TableSessionSummary; error?: string }> {
  try {
    const supabase = await createClient();
    const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;

     
    const { data: sessionData, error: sessionError } = await (supabase as any)
      .from("table_sessions")
      .select(`
        id,
        table_identifier,
        status,
        started_at,
        subtotal,
        tax,
        total,
        orders (
          id,
          placed_at,
          status,
          total,
          order_items (
            quantity,
            unit_price,
            menu_items ( name )
          )
        )
      `)
      .eq("restaurant_id", restaurantId)
      .eq("table_identifier", tableIdentifier)
      .in("status", ["active", "bill_requested"])
      .single();

    if (sessionError) {
      if (sessionError.code === 'PGRST116') {
        // No active session found
        return { success: true };
      }
      return { success: false, error: sessionError.message };
    }

    // Format to TableSessionSummary
    const summary: TableSessionSummary = {
      sessionId: sessionData.id,
      tableIdentifier: sessionData.table_identifier,
      status: sessionData.status,
      startedAt: sessionData.started_at,
      subtotal: sessionData.subtotal,
      tax: sessionData.tax,
      total: sessionData.total,
      orderCount: sessionData.orders?.length || 0,
       
      orders: (sessionData.orders || []).map((o: any) => ({
        id: o.id,
        placedAt: o.placed_at,
        status: o.status,
        total: o.total,
         
        items: (o.order_items || []).map((oi: any) => ({
          name: oi.menu_items?.name || 'Unknown Item',
          quantity: oi.quantity,
          unitPrice: oi.unit_price,
        }))
      }))
    };

    return { success: true, session: summary };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
