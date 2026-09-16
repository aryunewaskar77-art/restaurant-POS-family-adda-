"use client";

import React from "react";

export type FilterTab = "active" | "ready" | "all" | "history";
export type SortOrder = "oldest" | "newest";

interface KDSControlsProps {
  currentTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortOrder: SortOrder;
  onSortChange: (s: SortOrder) => void;
  tableFilter: string;
  onTableFilterChange: (table: string) => void;
  availableTables: string[];
  counts: {
    active: number;
    ready: number;
    all: number;
    history: number;
  };
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
}

export function KDSControls({ currentTab, onTabChange, searchQuery, onSearchChange, sortOrder, onSortChange, tableFilter, onTableFilterChange, availableTables, counts, isAudioEnabled, onToggleAudio }: KDSControlsProps) {
  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "active", label: "Active", count: counts.active },
    { id: "ready", label: "Ready", count: counts.ready },
    { id: "all", label: "All Open", count: counts.all },
    { id: "history", label: "History", count: counts.history },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all whitespace-nowrap ${
                currentTab === tab.id
                  ? "bg-white text-emerald-800 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  currentTab === tab.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-colors shrink-0 ${
            isAudioEnabled
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>{isAudioEnabled ? "🔊" : "🔇"}</span>
          <span>{isAudioEnabled ? "Chime ON" : "Chime OFF"}</span>
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search Order ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-white"
          />
        </div>
        <select
          value={tableFilter}
          onChange={(e) => onTableFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
        >
          <option value="all">All Tables</option>
          <option value="takeaway">Takeaway</option>
          {availableTables.map(t => (
            <option key={t} value={t}>Table {t}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
        >
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
}
