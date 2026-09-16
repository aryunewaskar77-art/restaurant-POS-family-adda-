"use client";

import React, { useState } from "react";
import { addPantryItem, updatePantryStock } from "@/actions/admin";

interface PantryItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  unit: string;
  minimum_required: number;
  status: string;
  updated_at: string;
}

export function PantryManagerClient({ initialItems, restaurantId }: { initialItems: PantryItem[], restaurantId: string }) {
  const [items, setItems] = useState<PantryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "", category: "Vegetables", current_stock: "0", unit: "kg", minimum_required: "5"
  });

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addPantryItem({
      name: formData.name,
      category: formData.category,
      current_stock: parseFloat(formData.current_stock) || 0,
      unit: formData.unit,
      minimum_required: parseFloat(formData.minimum_required) || 0
    });
    setIsSubmitting(false);

    if (result.success && result.item) {
      setItems(prev => [...prev, result.item as PantryItem]);
      setIsAdding(false);
      setFormData({ name: "", category: "Vegetables", current_stock: "0", unit: "kg", minimum_required: "5" });
    } else {
      alert("Failed to add item");
    }
  };

  const handleSaveStock = async (item: PantryItem) => {
    const newStock = parseFloat(editStockValue);
    if (isNaN(newStock)) return;

    // Optimistic update
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, current_stock: newStock, status: newStock <= i.minimum_required ? 'Low Stock' : 'In Stock' } : i));
    setEditingStockId(null);

    const result = await updatePantryStock(item.id, newStock, item.minimum_required);
    if (!result.success) {
      alert("Failed to update stock");
      // Revert
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, current_stock: item.current_stock, status: item.status } : i));
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-900">Inventory List</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            + Add Pantry Item
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 text-sm"
          />
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                  activeCategory === c ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add Pantry Item</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Basmati Rice" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Dairy" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input type="text" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="kg, L, pack" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Stock</label>
                  <input type="number" required min="0" step="0.1" value={formData.current_stock} onChange={e => setFormData({...formData, current_stock: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min. Required</label>
                  <input type="number" required min="0" step="0.1" value={formData.minimum_required} onChange={e => setFormData({...formData, minimum_required: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">{isSubmitting ? "Saving..." : "Add Item"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
              <th className="px-6 py-3 font-medium">Item Name</th>
              <th className="px-6 py-3 font-medium text-center">Status</th>
              <th className="px-6 py-3 font-medium text-right">Min Required</th>
              <th className="px-6 py-3 font-medium text-right">Current Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Low Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-500">
                  {item.minimum_required} {item.unit}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingStockId === item.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <input type="number" className="w-20 border rounded px-2 py-1 text-sm text-right" value={editStockValue} onChange={(e) => setEditStockValue(e.target.value)} autoFocus />
                      <button onClick={() => handleSaveStock(item)} className="text-brand-600 font-bold text-sm">Save</button>
                      <button onClick={() => setEditingStockId(null)} className="text-gray-400 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-3 group">
                      <span className={`font-medium ${item.current_stock <= item.minimum_required ? 'text-rose-600' : 'text-gray-900'}`}>
                        {item.current_stock} {item.unit}
                      </span>
                      <button onClick={() => { setEditingStockId(item.id); setEditStockValue(item.current_stock.toString()); }} className="text-brand-600 opacity-0 group-hover:opacity-100 text-xs uppercase font-semibold">
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No pantry items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
