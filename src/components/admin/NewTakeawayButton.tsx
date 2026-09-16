"use client";

import React from "react";

export function NewTakeawayButton() {
  return (
    <button 
      onClick={() => {
        window.open(`/order/takeaway-${Date.now()}`, '_blank');
      }}
      className="bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-brand-700 transition-colors flex items-center gap-2"
    >
      <span>🛍️</span> New Takeaway
    </button>
  );
}
