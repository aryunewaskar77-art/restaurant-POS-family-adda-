"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CategoryNav } from "@/components/customer/CategoryNav";
import { MenuItemCard } from "@/components/customer/MenuItemCard";
import { ItemDetailModal } from "@/components/customer/ItemDetailModal";
import { CartBar } from "@/components/customer/CartBar";
import { CheckoutDrawer } from "@/components/customer/CheckoutDrawer";

interface MenuClientProps {
  tableId: string;
  categories: {
    id: string;
    name: string;
    menu_items: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      is_available: boolean;
    }[];
  }[];
}

export function MenuClient({ tableId, categories }: MenuClientProps) {
  const { setTableId } = useCart();
  const [activeCategoryId] = useState(categories[0]?.id || "");
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; price: number; } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setTableId(tableId);
  }, [tableId, setTableId]);

  // Intersection observer logic to highlight active category could be added here
  // For simplicity, we just render them out.

  return (
    <>
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-center">
        <div className="bg-brand-50 text-brand-800 text-sm font-bold px-3 py-1 rounded-md border border-brand-200">
          Table #{tableId}
        </div>
      </div>

      <CategoryNav 
        categories={categories} 
        activeCategoryId={activeCategoryId} 
      />

      <div className="p-4 space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-32">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">{cat.name}</h2>
            <div className="space-y-4">
              {cat.menu_items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onCustomize={() => setSelectedItem(item)}
                />
              ))}
              {cat.menu_items.length === 0 && (
                <p className="text-gray-400 text-sm">No items available.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <CartBar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      
      <ItemDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
      
      <CheckoutDrawer 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
}
