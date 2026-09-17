"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit"
      disabled={pending}
      className={`w-full font-bold py-2 rounded-lg transition-colors text-white ${
        pending ? "bg-gray-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700"
      }`}
    >
      {pending ? "Triggering Archive..." : "Trigger Archive & Delete"}
    </button>
  );
}

export function ArchiveForm({ 
  savedRetention, 
  triggerArchive,
  isEditUnlocked
}: { 
  savedRetention: string, 
  triggerArchive: (formData: FormData) => Promise<{ success: boolean; error?: string; message?: string } | undefined>,
  isEditUnlocked: boolean
}) {
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  async function handleAction(formData: FormData) {
    setMessage(null);
    const res = await triggerArchive(formData);
    if (res) {
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Archival job started." });
      } else {
        setMessage({ type: "error", text: res.error || "An error occurred." });
      }
    }
  }

  return (
    <form action={handleAction} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Month</label>
        <input 
          type="month" 
          name="archive_month" 
          required
          disabled={!isEditUnlocked}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Retention Protection (Months)</label>
        <input 
          type="number" 
          name="retention" 
          defaultValue={savedRetention}
          min={1}
          required
          disabled={!isEditUnlocked}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">Data newer than this many months cannot be archived.</p>
      </div>
      {isEditUnlocked ? <SubmitButton /> : (
        <button type="button" disabled className="w-full bg-gray-300 text-white font-bold py-2 rounded-lg cursor-not-allowed">
          Unlock to Archive
        </button>
      )}
    </form>
  );
}
