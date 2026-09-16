"use client";

import React, { useState } from "react";
import { TicketTimer } from "./TicketTimer";
import type { OrderStatus } from "@/types/database.types";

export type KDSTicketData = {
  id: string;
  table_number: string | null;
  status: OrderStatus;
  placed_at: string;
  order_items: {
    id: string;
    quantity: number;
    notes: string | null;
    menu_items: { name: string } | null;
  }[];
};

interface TicketCardProps {
  ticket: KDSTicketData;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

export function TicketCard({ ticket, onUpdateStatus }: TicketCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(ticket.id, newStatus);
    setIsUpdating(false);
  };

  let primaryAction: { label: string; status: OrderStatus; color: string } | null = null;
  
  if (ticket.status === "pending") {
    primaryAction = { label: "Start Cooking", status: "in_kitchen", color: "bg-blue-600 hover:bg-blue-500 text-white border-blue-500" };
  } else if (ticket.status === "in_kitchen") {
    primaryAction = { label: "Mark Ready", status: "ready", color: "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500" };
  } else if (ticket.status === "ready") {
    primaryAction = { label: "Complete / Served", status: "completed", color: "bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600" };
  }

  const isCompleted = ticket.status === "completed" || ticket.status === "voided" || ticket.status === "cancelled";

  return (
    <div className={`flex flex-col bg-slate-900 border ${isCompleted ? 'border-slate-800 opacity-60' : 'border-slate-700'} rounded-xl overflow-hidden shadow-md shrink-0 w-80 max-h-[85vh]`}>
      
      {/* Header */}
      <div className={`p-4 border-b border-slate-800 flex justify-between items-center ${ticket.status === 'pending' ? 'bg-slate-800' : ticket.status === 'in_kitchen' ? 'bg-blue-950/30' : ticket.status === 'ready' ? 'bg-emerald-950/30' : ''}`}>
        <div>
          <h3 className="font-extrabold text-xl text-slate-100">
            {ticket.table_number ? `Table ${ticket.table_number}` : "Takeaway"}
          </h3>
          <div className="text-xs text-slate-500 font-mono mt-0.5">#{ticket.id.slice(0, 8).toUpperCase()}</div>
        </div>
        <TicketTimer placedAt={ticket.placed_at} status={ticket.status} />
      </div>

      {/* Items List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {ticket.order_items.map((item) => (
          <div key={item.id} className="border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
            <div className="flex gap-3 items-start">
              <span className="text-sm font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                {item.quantity}x
              </span>
              <div className="flex-1">
                <span className="font-medium text-slate-200 text-lg leading-tight">
                  {item.menu_items?.name || "Unknown Item"}
                </span>
                {item.notes && (
                  <div className="mt-1 text-sm font-medium text-amber-400 bg-amber-950/20 px-2 py-1 rounded border border-amber-900/50 flex items-start gap-1.5">
                    <span>⚠️</span>
                    <span>{item.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        {primaryAction && (
          <button
            disabled={isUpdating}
            onClick={() => handleStatusChange(primaryAction!.status)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm border transition-all active:scale-95 disabled:opacity-50 ${primaryAction.color}`}
          >
            {primaryAction.label}
          </button>
        )}
        
        {!isCompleted && ticket.status !== 'ready' && (
          <button
            disabled={isUpdating}
            onClick={() => {
              if (confirm("Are you sure you want to void this ticket?")) {
                handleStatusChange("voided");
              }
            }}
            className="px-4 py-3 rounded-lg font-bold text-sm text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-rose-400 transition-all active:scale-95 disabled:opacity-50"
          >
            Void
          </button>
        )}

        {isCompleted && ticket.status === 'completed' && (
          <div className="flex-1 py-2 text-center text-emerald-500 font-bold text-sm bg-emerald-950/10 rounded border border-emerald-900/30">
            Completed
          </div>
        )}
        
        {isCompleted && (ticket.status === 'voided' || ticket.status === 'cancelled') && (
          <div className="flex-1 py-2 text-center text-rose-500 font-bold text-sm bg-rose-950/10 rounded border border-rose-900/30">
            Voided
          </div>
        )}
      </div>
    </div>
  );
}
