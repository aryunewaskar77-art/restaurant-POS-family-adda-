import React from "react";
import { createClient } from "@/lib/supabase/server";
import { runMonthlyArchive } from "@/actions/archival";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function DataManagementPage() {
  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;

   
  const { data: jobs } = await (supabase as any)
    .from("archive_jobs")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("archive_month", { ascending: false });

   
  const { count: sessionCount } = await (supabase as any)
    .from("table_sessions")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  async function triggerArchive(formData: FormData) {
    "use server";
    const month = formData.get("archive_month") as string;
    const retention = parseInt(formData.get("retention") as string, 10);
    if (!month) return;
    const res = await runMonthlyArchive(restaurantId!, `${month}-01`, retention);
    console.log("Archive Triggered:", res);
    revalidatePath("/admin/data");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-500">Manage database archival and backups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Current Database Status</h2>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">Active/Recent Table Sessions</span>
            <span className="font-bold text-gray-900">{sessionCount || 0}</span>
          </div>
          <div className="text-xs text-gray-400 mt-4">
            To prevent your free-tier Supabase database from filling up, old transactional data is safely exported to CSV and deleted from Postgres.
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-200 border-l-4 border-l-brand-600">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Manual Archive</h2>
          <form action={triggerArchive} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Month</label>
              <input 
                type="month" 
                name="archive_month" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retention Protection (Months)</label>
              <input 
                type="number" 
                name="retention" 
                defaultValue={12}
                min={1}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-gray-500 mt-1">Data newer than this many months cannot be archived.</p>
            </div>
            <button 
              type="submit"
              className="w-full bg-brand-600 text-white font-bold py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Trigger Archive & Delete
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Archival History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-500 bg-white border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Month</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Archived Sessions</th>
                <th className="px-6 py-3 font-medium">Date Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {jobs && jobs.length > 0 ? jobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{new Date(job.archive_month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      job.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                      job.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {job.status}
                    </span>
                    {job.error_message && <div className="text-xs text-red-500 mt-1">{job.error_message}</div>}
                  </td>
                  <td className="px-6 py-4">{job.metrics?.table_sessions || 0}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(job.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No archival jobs run yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
