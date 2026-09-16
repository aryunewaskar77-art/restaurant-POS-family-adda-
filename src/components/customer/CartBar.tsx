"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

interface CartBarProps {
  onOpenCheckout: () => void;
}

export function CartBar({ onOpenCheckout }: CartBarProps) {
  const { totalItems, estimatedTotal } = useCart();

  if (totalItems === 0) return null;

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(estimatedTotal);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 max-w-md mx-auto bg-gradient-to-t from-white via-white to-transparent pb-8">
      <button
        onClick={onOpenCheckout}
        className="w-full bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </div>
          <span>View Order</span>
        </div>
        <span>{formattedTotal}</span>
      </button>
    </div>
  );
}
