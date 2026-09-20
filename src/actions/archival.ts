"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Simple CSV Generator
function toCSV(data: any[]) {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(h => {
      let val = row[h];
      if (val === null || val === undefined) return "";
      val = String(val).replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
      if (val.includes(",") || val.includes("\n") || val.includes('"')) {
        return `"${val}"`;
      }
      return val;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function runAutoArchive(restaurantId: string, retentionMonths: number = 6) {
  const supabase = supabaseAdmin;
  
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);
  const endOfTargetMonth = new Date(cutoffDate.getFullYear(), cutoffDate.getMonth() + 1, 0, 23, 59, 59).toISOString();
  
  // We'll use the cutoff date's month string for record keeping
  const archiveMonthDateStr = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`;

  const { data: job, error: jobErr } = await (supabase as any)
    .from("archive_jobs")
    .insert({
      restaurant_id: restaurantId,
      archive_month: archiveMonthDateStr,
      status: "started"
    })
    .select()
    .single();

  if (jobErr || !job) {
    return { success: false, error: "Failed to create archive job." };
  }

  const jobId = job.id;

  try {
     
    const { data: sessions, error: sessErr } = await (supabase as any)
      .from("table_sessions")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .in("status", ["paid", "abandoned"])
      .lte("closed_at", endOfTargetMonth);

    if (sessErr) throw new Error("Failed to fetch sessions: " + sessErr.message);
    if (!sessions || sessions.length === 0) {
      await (supabase as any).from("archive_jobs").update({ status: "completed", error_message: "No eligible records found.", completed_at: new Date().toISOString() }).eq("id", jobId);
      return { success: true, message: `No records older than ${retentionMonths} months to archive.` };
    }

     
    const sessionIds = sessions.map((s: any) => s.id);

     
    const { data: orders, error: ordErr } = await (supabase as any)
      .from("orders")
      .select("*")
      .in("session_id", sessionIds);
    if (ordErr) throw new Error("Failed to fetch orders.");

     
    const orderIds = orders?.map((o: any) => o.id) || [];
    let orderItems: any[] = [];
    if (orderIds.length > 0) {
       
      const { data: items, error: itemsErr } = await (supabase as any)
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);
      if (itemsErr) throw new Error("Failed to fetch order items.");
      orderItems = items || [];
    }

    // Calculate aggregates before deletion
    let grossSales = 0;
    let taxCollected = 0;
    const paymentBreakdown: Record<string, number> = {};
    
     
    sessions.forEach((s: any) => {
      if (s.status === "paid") {
        grossSales += Number(s.subtotal || 0);
        taxCollected += Number(s.tax || 0);
        const method = s.payment_method || "unknown";
        paymentBreakdown[method] = (paymentBreakdown[method] || 0) + Number(s.total || 0);
      }
    });

    // Upsert to monthly_revenue_aggregates
     
    const { error: aggErr } = await (supabase as any).from("monthly_revenue_aggregates").upsert({
      restaurant_id: restaurantId,
      month_year: archiveMonthDateStr,
      gross_sales: grossSales,
      tax_collected: taxCollected,
      total_orders: orders?.length || 0,
      total_sessions: sessions.length,
      payment_breakdown: paymentBreakdown
    }, { onConflict: "restaurant_id, month_year" });
    
    if (aggErr) throw new Error("Failed to upsert monthly aggregates: " + aggErr.message);

    const sessionsCSV = toCSV(sessions);
    const ordersCSV = toCSV(orders || []);
    const itemsCSV = toCSV(orderItems);

    const yearMonth = archiveMonthDateStr.substring(0, 7).replace("-", "/");
    const basePath = `${restaurantId}/${yearMonth}`;
    const paths = {
      sessions: `${basePath}/table_sessions.csv`,
      orders: `${basePath}/orders.csv`,
      order_items: `${basePath}/order_items.csv`
    };

    const uploadFile = async (path: string, content: string) => {
      if (!content) return;
       
      const { error } = await (supabase as any).storage.from("pos-archives").upload(path, content, { upsert: true, contentType: "text/csv" });
      if (error) throw new Error(`Upload failed for ${path}: ` + error.message);
    };

    await uploadFile(paths.sessions, sessionsCSV);
    if (ordersCSV) await uploadFile(paths.orders, ordersCSV);
    if (itemsCSV) await uploadFile(paths.order_items, itemsCSV);

     
    await (supabase as any).from("archive_jobs").update({ status: "exported", file_paths: paths }).eq("id", jobId);

    const verifyFile = async (path: string, expectedRows: number) => {
      if (expectedRows === 0) return true;
       
      const { data, error } = await (supabase as any).storage.from("pos-archives").download(path);
      if (error || !data) throw new Error(`Verification download failed for ${path}`);
      const text = await data.text();
      const rowCount = text.split("\n").filter((l: string) => l.trim().length > 0).length - 1;
      if (rowCount !== expectedRows) throw new Error(`Verification failed for ${path}. Expected ${expectedRows}, got ${rowCount}.`);
      return true;
    };

    await verifyFile(paths.sessions, sessions.length);
    await verifyFile(paths.orders, orders?.length || 0);
    await verifyFile(paths.order_items, orderItems.length);

     
    await (supabase as any).from("archive_jobs").update({ status: "verified" }).eq("id", jobId);

    // CHUNK DELETION (250 records at a time)
    const chunkSize = 250;
    for (let i = 0; i < sessionIds.length; i += chunkSize) {
      const chunk = sessionIds.slice(i, i + chunkSize);
       
      const { error: delErr } = await (supabase as any).rpc("delete_archived_sessions", { p_session_ids: chunk });
      if (delErr) throw new Error(`Deletion RPC failed on chunk ${i}: ` + delErr.message);
    }

     
    await (supabase as any).from("archive_jobs").update({
      status: "completed",
      completed_at: new Date().toISOString(),
      metrics: {
        table_sessions: sessions.length,
        orders: orders?.length || 0,
        order_items: orderItems.length
      }
    }).eq("id", jobId);

    revalidatePath("/admin/data");
    return { success: true, message: `Successfully archived and deleted ${sessions.length} sessions.` };

  } catch (err: any) {
     
    await (supabase as any).from("archive_jobs").update({
      status: "failed",
      error_message: err.message,
      completed_at: new Date().toISOString()
    }).eq("id", jobId);
    return { success: false, error: err.message };
  }
}

export async function evacuateDatabase(restaurantId: string) {
  const supabase = supabaseAdmin;
  
  try {
    // Delete all table_sessions for this restaurant (cascades or sets null to orders)
    // Actually, orders are set to null, so we must delete orders first, or use a manual delete
    await (supabase as any).from("orders").delete().eq("restaurant_id", restaurantId);
    await (supabase as any).from("table_sessions").delete().eq("restaurant_id", restaurantId);
    await (supabase as any).from("archive_jobs").delete().eq("restaurant_id", restaurantId);
    
    revalidatePath("/admin/data");
    return { success: true, message: "Database completely evacuated (transactions wiped)." };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
