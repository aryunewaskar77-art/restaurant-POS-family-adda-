"use client";

import React, { useState } from "react";
import { toggleStaffActive, resetStaffPin, updateStaffRole, changePinAction } from "@/actions/staff";

export function StaffTableClient({ staffMembers, isEditUnlocked }: { staffMembers: any[], isEditUnlocked: boolean }) {
  const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
  const [changingPinFor, setChangingPinFor] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const handleRoleChange = async (id: string, newRole: string) => {
    await updateStaffRole(id, newRole);
    setEditingRoleFor(null);
  };

  const handleResetPin = async (id: string) => {
    if (confirm("Are you sure you want to reset this users PIN to 1234?")) {
      await resetStaffPin(id);
      alert("PIN reset to 1234");
    }
  };

  const handlePinChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await changePinAction(formData);
    if (!res?.success && res?.error) {
      setPinError(res.error);
    } else {
      setChangingPinFor(null);
      setPinError(null);
      alert("PIN updated successfully.");
    }
  };

  // Deterministic mock metric generator
  const getMockMetrics = (id: string) => {
    const sum = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return {
      settled: sum % 245 + 12,
      lastActive: sum % 3 === 0 ? "Today, 1:45 PM" : sum % 2 === 0 ? "Yesterday" : "3 Days Ago"
    };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-medium">Name & Contact</th>
            <th className="px-6 py-4 font-medium">Role</th>
            <th className="px-6 py-4 font-medium text-center">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staffMembers?.map((staff: any) => {
            const metrics = getMockMetrics(staff.id);
            return (
            <tr key={staff.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900 text-base">{staff.name}</div>
                {staff.phone && <div className="text-sm text-gray-500 mt-0.5">📞 {staff.phone}</div>}
                <div className="text-[11px] text-gray-400 mt-0.5 font-medium">Joined: {new Date(staff.created_at).toLocaleDateString()}</div>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-400">
                    Active: {metrics.lastActive}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {editingRoleFor === staff.id ? (
                  <select 
                    autoFocus
                    defaultValue={staff.role}
                    onBlur={() => setEditingRoleFor(null)}
                    onChange={(e) => handleRoleChange(staff.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-brand-500 shadow-sm"
                  >
                    <option value="staff">Staff / Waiter</option>
                    <option value="kitchen">Kitchen / Chef</option>
                    <option value="admin">Admin / Manager</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                    staff.role === "admin" ? "bg-purple-100 text-purple-700" :
                    staff.role === "kitchen" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {staff.role}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => toggleStaffActive(staff.id, staff.is_active)}
                  disabled={!isEditUnlocked}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    !isEditUnlocked ? "opacity-50 cursor-not-allowed " : ""
                  }${
                    staff.is_active ? "bg-brand-600" : "bg-gray-200"
                  }`}
                  title={staff.is_active ? "Deactivate" : "Activate"}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      staff.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <div className="text-[10px] font-medium mt-1 text-gray-500 uppercase">{staff.is_active ? "Active" : "Inactive"}</div>
              </td>
              <td className="px-6 py-4 text-right align-top">
                <details className={`relative inline-block text-left group ${!isEditUnlocked ? "opacity-50 pointer-events-none" : ""}`}>
                  <summary className="cursor-pointer list-none flex items-center justify-end">
                    <span className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </span>
                  </summary>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden hidden group-open:block">
                    <div className="py-1">
                      <button onClick={() => setEditingRoleFor(staff.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        🔄 Edit Role
                      </button>
                      <button onClick={() => setChangingPinFor(staff.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        🔑 Change PIN
                      </button>
                      <button onClick={() => handleResetPin(staff.id)} className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">
                        ⚡ Quick Reset (1234)
                      </button>
                    </div>
                  </div>
                </details>
              </td>
            </tr>
          )})}
          {(!staffMembers || staffMembers.length === 0) && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No staff members found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Change PIN Modal */}
      {changingPinFor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">
            <h3 className="text-xl font-extrabold mb-1 text-gray-900">Change PIN</h3>
            <p className="text-sm text-gray-500 mb-5">Securely update the access code for this user.</p>
            <form onSubmit={handlePinChangeSubmit} className="space-y-4">
              <input type="hidden" name="staff_id" value={changingPinFor} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous 4-Digit PIN</label>
                <input type="text" name="old_pin" required pattern="[0-9]{4}" maxLength={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-center tracking-widest text-xl font-mono shadow-sm" placeholder="1234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New 4-Digit PIN</label>
                <input type="text" name="new_pin" required pattern="[0-9]{4}" maxLength={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-center tracking-widest text-xl font-mono shadow-sm" placeholder="5678" />
              </div>
              {pinError && <p className="text-red-500 text-sm font-medium p-2 bg-red-50 rounded">{pinError}</p>}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setChangingPinFor(null)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm">
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
