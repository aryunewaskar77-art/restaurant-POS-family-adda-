"use client";

import React from "react";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  activeCategoryId: string;
}

export function CategoryNav({ categories, activeCategoryId }: CategoryNavProps) {
  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`category-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-14 bg-white/95 backdrop-blur z-20 border-b border-gray-100 px-4 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
      {categories.map((cat) => {
        const isActive = activeCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => scrollToCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
