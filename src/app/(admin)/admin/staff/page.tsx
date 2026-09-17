import React from "react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { UnlockEditingBanner } from "@/components/admin/UnlockEditingBanner";
import { StaffTableClient } from "@/components/admin/StaffTableClient";
import { addStaffAction } from "@/actions/staff";

export const dynamic = "force-dynamic";

export default async function StaffManagementPage() {
  const cookieStore = await cookies();
  const isEditUnlocked = !!cookieStore.get("edit_mode_access");

  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;

   
  const { data: staffMembers } = await (supabase as any)
    .from("staff")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });

  const totalStaff = staffMembers?.length || 0;
  const activeStaff = staffMembers?.filter((s: any) => s.is_active).length || 0;
  
  // Note: we can technically check how many people have the 1234 PIN by hashing 1234 and comparing.
  const { createHash } = await import("crypto");
  const defaultPinHash = createHash("sha256").update("1234").digest("hex");
  const defaultPinsInUse = staffMembers?.filter((s: any) => s.pin_hash === defaultPinHash).length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Staff Management</h1>
        <p className="text-gray-500 mt-1">Manage team members, roles, contact details, and PIN access.</p>
      </div>

      {/* Top Metric Bar */}
      <UnlockEditingBanner isUnlocked={isEditUnlocked} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-gray-500">Total Staff</span>
          <span className="text-2xl font-bold text-gray-900 mt-1">{totalStaff}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-gray-500">Active Members</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1">{activeStaff}</span>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col ${defaultPinsInUse > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
          <span className={`text-sm font-semibold ${defaultPinsInUse > 0 ? "text-amber-700" : "text-gray-500"}`}>Default PINs In Use</span>
          <div className="flex items-end gap-2 mt-1">
            <span className={`text-2xl font-bold ${defaultPinsInUse > 0 ? "text-amber-600" : "text-gray-900"}`}>{defaultPinsInUse}</span>
            {defaultPinsInUse > 0 && <span className="text-xs font-medium text-amber-700 pb-1 flex-1">Should be updated</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Add Staff Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Staff</h2>
            <form action={addStaffAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" required disabled={!isEditUnlocked} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-gray-50" placeholder="e.g. Rahul" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <input type="tel" name="phone" disabled={!isEditUnlocked} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-gray-50" placeholder="e.g. 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" disabled={!isEditUnlocked} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-gray-50">
                  <option value="staff">Staff / Waiter</option>
                  <option value="kitchen">Kitchen / Chef</option>
                  <option value="admin">Admin / Manager</option>
                </select>
              </div>
              {isEditUnlocked ? (
                <button type="submit" className="w-full bg-brand-600 text-white font-bold py-2 rounded-lg hover:bg-brand-700 transition-colors">
                  Add Member
                </button>
              ) : (
                <button type="button" disabled className="w-full bg-gray-300 text-white font-bold py-2 rounded-lg cursor-not-allowed">
                  Unlock to Add
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Staff Table */}
        <div className="lg:col-span-2">
          <StaffTableClient staffMembers={staffMembers || []} isEditUnlocked={isEditUnlocked} />
        </div>
      </div>
    </div>
  );
}
