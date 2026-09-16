"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    is_available: boolean;
  };
  onCustomize: () => void;
}

export function MenuItemCard({ item, onCustomize }: MenuItemCardProps) {
  const { items, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItemId === item.id);
  const qty = cartItem?.quantity || 0;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(item.price);

  return (
    <div className={`p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between gap-4 ${!item.is_available ? "opacity-60" : ""}`}>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-2 font-semibold text-brand-700">{formattedPrice}</div>
      </div>
      
      <div className="flex flex-col items-end justify-center shrink-0">
        {!item.is_available ? (
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded">
            Sold Out
          </span>
        ) : qty > 0 ? (
          <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-lg p-1">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-brand-700 font-bold shadow-sm"
            >
              -
            </button>
            <span className="font-bold w-4 text-center text-brand-800">{qty}</span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="w-8 h-8 flex items-center justify-center bg-brand-600 rounded-md text-white font-bold shadow-sm"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onCustomize}
            className="px-6 py-2 bg-white border-2 border-brand-200 text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
