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
      {pending ? "Triggering Archive..." : "Archive Old Data"}
    </button>
  );
}

function EvacuateButton({ onEvacuate }: { onEvacuate: () => void }) {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="button"
      onClick={onEvacuate}
      disabled={pending}
      className={`w-full font-bold py-2 rounded-lg transition-colors border-2 ${
        pending ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-red-500 text-red-600 hover:bg-red-50"
      }`}
    >
      ⚠️ Evacuate Database Now
    </button>
  );
}

export function ArchiveForm({ 
  savedRetention, 
  triggerArchive,
  triggerEvacuate,
  isEditUnlocked
}: { 
  savedRetention: string, 
  triggerArchive: (formData: FormData) => Promise<{ success: boolean; error?: string; message?: string } | undefined>,
  triggerEvacuate: () => Promise<{ success: boolean; error?: string; message?: string } | undefined>,
  isEditUnlocked: boolean
}) {
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  async function handleAction(formData: FormData) {
    setMessage(null);
    const res = await triggerArchive(formData);
    if (res) {
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Archival completed." });
      } else {
        setMessage({ type: "error", text: res.error || "An error occurred." });
      }
    }
  }

  async function handleEvacuate() {
    if (!window.confirm("WARNING! This will immediately DELETE ALL orders, sessions, and transaction history. The menu and staff will remain. Are you absolutely sure?")) {
      return;
    }
    
    setMessage(null);
    const res = await triggerEvacuate();
    if (res) {
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Database evacuated successfully." });
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Archive Frequency (Months)</label>
        <input 
          type="number" 
          name="retention" 
          defaultValue={savedRetention}
          min={1}
          required
          disabled={!isEditUnlocked}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">Automatically packages and deletes data older than this many months into CSVs.</p>
      </div>
      
      {isEditUnlocked ? (
        <div className="pt-2 space-y-3">
          <SubmitButton />
          <div className="pt-4 border-t border-gray-100">
            <EvacuateButton onEvacuate={handleEvacuate} />
            <p className="text-xs text-center text-gray-500 mt-2">Instantly wipes all transaction data (keeps your menu intact).</p>
          </div>
        </div>
      ) : (
        <button type="button" disabled className="w-full bg-gray-300 text-white font-bold py-2 rounded-lg cursor-not-allowed">
          Unlock to Manage Data
        </button>
      )}
    </form>
  );
}
