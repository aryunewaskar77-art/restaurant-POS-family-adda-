import { createClient } from "@/lib/supabase/server";
import { FloorMapClient } from "@/components/admin/FloorMapClient";
import type { TableSessionSummary } from "@/types/domain";
import Link from "next/link";
import { NewTakeawayButton } from "@/components/admin/NewTakeawayButton";
import { cookies } from "next/headers";
import { SectionPinGate } from "@/components/admin/SectionPinGate";

export default async function AdminTablesPage() {

  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;
  const TOTAL_TABLES = 10;

   
  const { data: sessionData } = await (supabase as any)
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
    .in("status", ["active", "bill_requested"]);

  // Format to TableSessionSummary
  const sessions: TableSessionSummary[] = (sessionData || []).map((s: any) => {
    // Failsafe: calculate running totals dynamically from non-voided orders
     
    const activeOrders = (s.orders || []).filter((o: any) => o.status !== 'voided' && o.status !== 'cancelled');
     
    const dynamicTotal = activeOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
     
    const dynamicSubtotal = activeOrders.reduce((sum: number, o: any) => sum + Number(o.subtotal || 0), 0);
     
    const dynamicTax = activeOrders.reduce((sum: number, o: any) => sum + Number(o.tax || 0), 0);

    return {
      sessionId: s.id,
      tableIdentifier: s.table_identifier,
      status: s.status,
      startedAt: s.started_at,
      subtotal: dynamicSubtotal || s.subtotal,
      tax: dynamicTax || s.tax,
      total: dynamicTotal || s.total,
      orderCount: s.orders?.length || 0,
       
      orders: (s.orders || []).map((o: any) => ({
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
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Live Floor Map</h1>
          <p className="text-gray-500 mt-1">Manage table occupancy and settle bills.</p>
        </div>
        <div className="flex gap-3">
          <NewTakeawayButton />
          <Link 
            href="/admin/qr"
            className="bg-brand-50 text-brand-700 font-semibold px-4 py-2 rounded-lg border border-brand-200 hover:bg-brand-100 transition-colors flex items-center gap-2"
          >
            <span>🖨️</span> Print QRs
          </Link>
        </div>
      </div>

      <FloorMapClient 
        initialSessions={sessions} 
        totalTables={TOTAL_TABLES}
        restaurantId={restaurantId}
      />
    </div>
  );
}
