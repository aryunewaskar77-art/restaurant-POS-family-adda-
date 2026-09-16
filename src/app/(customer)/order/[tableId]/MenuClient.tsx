"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CategoryNav } from "@/components/customer/CategoryNav";
import { MenuItemCard } from "@/components/customer/MenuItemCard";
import { ItemDetailModal } from "@/components/customer/ItemDetailModal";
import { CartBar } from "@/components/customer/CartBar";
import { CheckoutDrawer } from "@/components/customer/CheckoutDrawer";
import { RunningBillDrawer } from "@/components/customer/RunningBillDrawer";
import type { TableSessionSummary } from "@/types/domain";

interface MenuClientProps {
  tableId: string;
  initialSession?: TableSessionSummary;
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

export function MenuClient({ tableId, categories, initialSession }: MenuClientProps) {
  const { setTableId } = useCart();
  const [activeCategoryId] = useState(categories[0]?.id || "");
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; price: number; } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTableId(tableId);
  }, [tableId, setTableId]);

  const q = searchQuery.toLowerCase().trim();

  // Filter categories and items based on search
  const filteredCategories = categories.map(cat => ({
    ...cat,
    menu_items: cat.menu_items.filter(item => 
      !q || item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))
    )
  })).filter(cat => cat.menu_items.length > 0 || !q);

  return (
    <>
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-center">
          <div className="bg-brand-50 text-brand-800 text-sm font-bold px-3 py-1 rounded-md border border-brand-200">
            {tableId === 'preview' ? 'Menu Preview' : tableId.startsWith('takeaway') ? 'Takeaway' : `Table #${tableId}`}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-white"
          />
        </div>
      </div>

      {!q && (
        <CategoryNav 
          categories={categories} 
          activeCategoryId={activeCategoryId} 
        />
      )}

      <div className="p-4 space-y-8 pb-32">
        {filteredCategories.length === 0 && q && (
          <div className="text-center text-gray-500 mt-8">
            No items found for &quot;{searchQuery}&quot;.
          </div>
        )}
        
        {filteredCategories.map((cat) => (
          <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-48">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">{cat.name}</h2>
            <div className="space-y-4">
              {cat.menu_items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onCustomize={() => setSelectedItem(item)}
                />
              ))}
              {cat.menu_items.length === 0 && !q && (
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
      
      {initialSession && (
        <RunningBillDrawer session={initialSession} />
      )}
    </>
  );
}
