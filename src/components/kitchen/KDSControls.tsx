"use client";

import React from "react";

export type FilterTab = "active" | "ready" | "all" | "history";

interface KDSControlsProps {
  currentTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  counts: {
    active: number;
    ready: number;
    all: number;
    history: number;
  };
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
}

export function KDSControls({ currentTab, onTabChange, counts, isAudioEnabled, onToggleAudio }: KDSControlsProps) {
  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "active", label: "Active", count: counts.active },
    { id: "ready", label: "Ready", count: counts.ready },
    { id: "all", label: "All Open", count: counts.all },
    { id: "history", label: "History", count: counts.history },
  ];

  return (
    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
      <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
              currentTab === tab.id
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                currentTab === tab.id
                  ? "bg-slate-900 text-slate-300"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onToggleAudio}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
          isAudioEnabled
            ? "bg-brand-950/30 text-brand-400 border-brand-800/50 hover:bg-brand-900/50"
            : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400"
        }`}
      >
        <span>{isAudioEnabled ? "🔊" : "🔇"}</span>
        <span>{isAudioEnabled ? "Chime ON" : "Chime OFF"}</span>
      </button>
    </div>
  );
}
