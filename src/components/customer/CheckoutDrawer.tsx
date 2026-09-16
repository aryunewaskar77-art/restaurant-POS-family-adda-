"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/actions/checkout";

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutDrawer({ isOpen, onClose }: CheckoutDrawerProps) {
  const router = useRouter();
  const { tableId, items, subtotal, estimatedTax, estimatedTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await placeOrder({
        tableIdentifier: tableId,
        items: items.map(({ menuItemId, quantity, notes }) => ({ menuItemId, quantity, notes })),
      });

      if (result.success && result.data) {
        clearCart();
        router.push(`/order/${tableId}/status?orderId=${result.data.orderId}`);
      } else {
        setError(result.error || "Failed to place order.");
        setIsSubmitting(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="bg-slate-50 w-full max-w-md rounded-t-3xl sm:rounded-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
            ✕
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.menuItemId} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
              <div className="w-8 h-8 bg-brand-50 text-brand-700 font-bold rounded-lg flex items-center justify-center shrink-0">
                {item.quantity}x
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span className="font-medium text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
                {item.notes && <p className="text-sm text-gray-500 mt-1 italic">&quot;{item.notes}&quot;</p>}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center text-gray-500 py-10">Your cart is empty.</div>
          )}
        </div>

        {/* Bill Summary */}
        <div className="bg-white px-6 py-4 border-t border-gray-100 shrink-0">
          {error && <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}
          
          <div className="flex justify-between text-gray-500 text-sm mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm mb-4">
            <span>Taxes (5%)</span>
            <span>{formatPrice(estimatedTax)}</span>
          </div>
          <div className="flex justify-between text-gray-900 font-bold text-lg mb-6 border-t border-gray-100 pt-4">
            <span>Total</span>
            <span>{formatPrice(estimatedTotal)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all text-white font-bold py-4 rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
