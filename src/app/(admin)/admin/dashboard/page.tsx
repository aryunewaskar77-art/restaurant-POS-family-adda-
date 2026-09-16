 
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getShiftMetrics } from "@/actions/admin";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;

  // 1. Check health
  const { data: restaurant, error: rError } = await (supabase as any)
    .from("restaurants")
    .select("name, is_accepting_orders")
    .eq("id", restaurantId)
    .single();

  const isHealthy = !rError && restaurant;

  // 2. Fetch Menu Stats
  const { count: menuCount } = await (supabase as any)
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  // 3. Fetch Active Orders
  const { count: activeOrders } = await (supabase as any)
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId)
    .in("status", ["pending", "preparing", "ready"]);

  // 4. Fetch Pantry Low Stock
  const { data: pantryItems } = await (supabase as any)
    .from("pantry_items")
    .select("current_stock, min_required_stock")
    .eq("restaurant_id", restaurantId);
  
  const lowStockCount = pantryItems?.filter((p: any) => p.current_stock < p.min_required_stock).length || 0;

  // 5. Fetch Revenue
  const { metrics, success } = await getShiftMetrics();
  const todayRevenue = success && metrics ? metrics.grossRevenue : 0;
  const formatPrice = (amount: number) => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">System Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage operations for {restaurant?.name || "your restaurant"}</p>
      </div>

      {/* System Health */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
          <div>
            <h3 className="font-bold text-gray-900">Database Connection</h3>
            <p className="text-sm text-gray-500">Supabase Realtime & Postgres Active</p>
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            restaurant?.is_accepting_orders 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {restaurant?.is_accepting_orders ? "Accepting Orders" : "Orders Paused"}
          </span>
        </div>
      </div>

      {/* Quick Action Jump Cards with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/admin/menu"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📋
            </div>
            <span className="text-2xl font-black text-brand-700">{menuCount || 0}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Manage Menu</h3>
            <p className="text-xs text-gray-500">Total active items</p>
          </div>
        </Link>

        <Link 
          href="/admin/reports"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <span className="text-2xl font-black text-blue-600">{formatPrice(todayRevenue)}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Shift Reports</h3>
            <p className="text-xs text-gray-500">Today&apos;s Revenue</p>
          </div>
        </Link>

        <Link 
          href="/admin/pantry"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🧅
            </div>
            {lowStockCount > 0 ? (
               <span className="text-sm font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-md">{lowStockCount} Low</span>
            ) : (
               <span className="text-sm font-bold text-emerald-600">All Good</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Pantry</h3>
            <p className="text-xs text-gray-500">Inventory alerts</p>
          </div>
        </Link>

        <Link 
          href="/admin/kitchen"
          className="group bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-600 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🧑‍🍳
            </div>
            <span className="text-2xl font-black text-white">{activeOrders || 0}</span>
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">Open KDS</h3>
            <p className="text-xs text-slate-400">Active tickets</p>
          </div>
        </Link>
      </div>

      {/* Utilities */}
      <div className="grid grid-cols-1 gap-6">
        <Link 
          href="/admin/qr"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🖨️
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Print Table QRs</h3>
            <p className="text-sm text-gray-500">Generate printable table QR codes for customer self-ordering.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
