"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ItemDetailModalProps {
  item: {
    id: string;
    name: string;
    price: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const { addItem } = useCart();
  const [notes, setNotes] = useState("");

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      unitPrice: item.price,
      notes: notes.trim() || undefined,
    });
    setNotes("");
    onClose();
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(item.price);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            id="notes"
            rows={3}
            maxLength={200}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            placeholder="e.g. Less spicy, extra sauce..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {notes.length}/200
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
        >
          <span>Add to Order</span>
          <span>•</span>
          <span>{formattedPrice}</span>
        </button>
      </div>
    </div>
  );
}
