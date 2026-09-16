"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

export interface CartItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  notes?: string;
}

interface CartContextType {
  tableId: string;
  setTableId: (id: string) => void;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  estimatedTax: number;
  estimatedTotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  updateNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [tableId, setTableId] = useState<string>("");
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.menuItemId === menuItemId
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const updateNotes = (menuItemId: string, notes: string) => {
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, notes } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  // Calculate tax on subtotal (5%)
  const estimatedTax = useMemo(() => Math.round(subtotal * 0.05 * 100) / 100, [subtotal]);
  const estimatedTotal = useMemo(() => subtotal + estimatedTax, [subtotal, estimatedTax]);

  return (
    <CartContext.Provider
      value={{
        tableId,
        setTableId,
        items,
        totalItems,
        subtotal,
        estimatedTax,
        estimatedTotal,
        addItem,
        updateQuantity,
        updateNotes,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
