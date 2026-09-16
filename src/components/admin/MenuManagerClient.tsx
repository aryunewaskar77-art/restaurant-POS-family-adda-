"use client";

import React, { useState } from "react";
import { toggleMenuItemAvailability, updateMenuItemPrice, addMenuItem } from "@/actions/admin";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

interface MenuManagerProps {
  categories: Category[];
  menuItems: MenuItem[];
}

export function MenuManagerClient({ categories, menuItems: initialItems }: MenuManagerProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>("");
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categories[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (id: string, currentAvailable: boolean) => {
    // Optimistic Update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_available: !currentAvailable } : i))
    );
    const result = await toggleMenuItemAvailability(id, !currentAvailable);
    if (!result.success) {
      alert("Failed to update availability");
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_available: currentAvailable } : i))
      );
    }
  };

  const handleSavePrice = async (id: string) => {
    const newPrice = parseFloat(editPriceValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Invalid price");
      return;
    }

    const oldItem = items.find((i) => i.id === id);
    if (!oldItem) return;

    // Optimistic Update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, price: newPrice } : i))
    );
    setEditingPriceId(null);

    const result = await updateMenuItemPrice(id, newPrice);
    if (!result.success) {
      alert("Failed to update price");
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, price: oldItem.price } : i))
      );
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemCategory || !newItemPrice) return;
    
    setIsSubmitting(true);
    const result = await addMenuItem({
      name: newItemName,
      category_id: newItemCategory,
      price: parseFloat(newItemPrice)
    });
    setIsSubmitting(false);

    if (result.success && result.item) {
      setItems((prev) => [...prev, result.item as MenuItem]);
      setIsAdding(false);
      setNewItemName("");
      setNewItemPrice("");
    } else {
      alert("Failed to add item: " + result.error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeTab === "all" || item.category_id === activeTab;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-900">Menu</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            + Add Item
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 text-sm focus:ring-brand-500 focus:border-brand-500"
          />
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                activeTab === "all" ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Items
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                  activeTab === c.id ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddItem} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add New Menu Item</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" placeholder="e.g. Masala Dosa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select required value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" required min="1" step="0.01" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500" placeholder="e.g. 150" />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50">{isSubmitting ? "Adding..." : "Add Item"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
              <th className="px-6 py-3 font-medium">Item Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium text-right">Price (₹)</th>
              <th className="px-6 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item) => {
              const catName = categories.find((c) => c.id === item.category_id)?.name || "Unknown";
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{catName}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingPriceId === item.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                          value={editPriceValue}
                          onChange={(e) => setEditPriceValue(e.target.value)}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          className="text-emerald-600 font-bold hover:text-emerald-700 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3 group">
                        <span className="font-medium text-gray-900">{item.price}</span>
                        <button
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setEditPriceValue(item.price.toString());
                          }}
                          className="text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold uppercase"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggle(item.id, item.is_available)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        item.is_available ? "bg-brand-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.is_available ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    {!item.is_available && (
                      <span className="block mt-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                        Sold Out
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
