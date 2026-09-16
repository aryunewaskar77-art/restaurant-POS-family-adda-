import { createClient } from "@/lib/supabase/server";
import { KDSBoard } from "@/components/kitchen/KDSBoard";
import { KDSTicketData } from "@/components/kitchen/TicketCard";

export default async function KitchenDisplayPage() {
  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;

  // We fetch pending, in_kitchen, ready, and recently completed
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, table_number, status, placed_at, order_items(id, quantity, notes, menu_items(name))")
    .eq("restaurant_id", restaurantId)
    .in("status", ["pending", "in_kitchen", "ready", "completed", "voided", "cancelled"])
    .order("placed_at", { ascending: true })
    .limit(50); // Get recent 50 to populate history if needed

  if (error) {
    console.error("Failed to load kitchen orders:", JSON.stringify(error, null, 2) || error.message || error);
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Error loading initial tickets.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <KDSBoard 
        initialOrders={orders as unknown as KDSTicketData[]} 
        restaurantId={restaurantId} 
      />
    </div>
  );
}
