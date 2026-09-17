"use client";

import React, { useState } from "react";
import { PinPad } from "@/components/ui/PinPad";
import { verifyEditPin, lockEditMode } from "@/actions/editAuth";
import { useRouter } from "next/navigation";

export function UnlockEditingBanner({ isUnlocked }: { isUnlocked: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (pin: string) => {
    setIsLoading(true);
    setError(null);
    const result = await verifyEditPin(pin);
    if (result.success) {
      setShowModal(false);
      router.refresh();
    } else {
      setError(result.error || "Invalid PIN");
      setIsLoading(false);
    }
  };

  const handleLock = async () => {
    await lockEditMode();
    router.refresh();
  };

  if (isUnlocked) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between mb-8 shadow-sm">
        <div>
          <h3 className="font-bold text-emerald-900">Editing is Unlocked</h3>
          <p className="text-sm text-emerald-700">You can modify data on this page. It will automatically lock in 5 minutes.</p>
        </div>
        <button
          onClick={handleLock}
          className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold rounded-lg transition-colors shadow-sm"
        >
          🔒 Lock Now
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between mb-8 shadow-sm">
        <div>
          <h3 className="font-bold text-amber-900">Editing is Locked</h3>
          <p className="text-sm text-amber-700">You must enter the Admin PIN to modify data on this page.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          🔓 Unlock Editing
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setShowModal(false);
                setError(null);
                setIsLoading(false);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-200 font-bold"
            >
              Close ✕
            </button>
            <PinPad
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
              title="Unlock Editing"
              subtitle="Enter Admin PIN to enable edit mode for 5 minutes"
            />
          </div>
        </div>
      )}
    </>
  );
}
