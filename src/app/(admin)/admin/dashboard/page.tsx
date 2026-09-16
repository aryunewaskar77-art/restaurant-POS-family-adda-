/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;

  // Check health by querying the restaurant row
  const { data: restaurant, error } = await (supabase as any)
    .from("restaurants")
    .select("name, is_accepting_orders")
    .eq("id", restaurantId)
    .single();

  const isHealthy = !error && restaurant;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">System Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage operations for {restaurant?.name || "your restaurant"}</p>
      </div>

      {/* System Health */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
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

      {/* Quick Action Jump Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/admin/menu"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col items-start gap-4"
        >
          <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📋
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Manage Menu</h3>
            <p className="text-sm text-gray-500">Edit pricing and instantly 86 sold-out items.</p>
          </div>
        </Link>

        <Link 
          href="/admin/reports"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col items-start gap-4"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Shift Reports</h3>
            <p className="text-sm text-gray-500">View live sales, void audits, and ticket times.</p>
          </div>
        </Link>

        <Link 
          href="/admin/qr"
          className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col items-start gap-4"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🖨️
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Print QRs</h3>
            <p className="text-sm text-gray-500">Generate printable table QR codes.</p>
          </div>
        </Link>

        <Link 
          href="/kitchen"
          className="group bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-600 transition-all flex flex-col items-start gap-4"
        >
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🧑‍🍳
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">Open KDS</h3>
            <p className="text-sm text-slate-400">Launch the live Kitchen Display System.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
