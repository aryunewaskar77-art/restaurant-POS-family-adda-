"use client";

import React, { useState } from "react";
import { TicketTimer } from "./TicketTimer";
import type { OrderStatus } from "@/types/database.types";

export type KDSTicketData = {
  id: string;
  session_id: string | null;
  table_number: string | null;
  status: OrderStatus;
  total: number;
  placed_at: string;
  ticket_number?: number;
  table_sessions?: { receipt_number: number } | null;
  order_items: {
    id: string;
    quantity: number;
    notes: string | null;
    status: 'pending' | 'in_kitchen' | 'ready' | 'served';
    total_price: number;
    menu_items: { name: string } | null;
  }[];
};

interface TicketCardProps {
  ticket: KDSTicketData;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onUpdateItemStatus?: (itemId: string, newStatus: 'pending' | 'in_kitchen' | 'ready' | 'served') => Promise<void>;
}

export function TicketCard({ ticket, onUpdateStatus, onUpdateItemStatus }: TicketCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(ticket.id, newStatus);
    setIsUpdating(false);
  };

  let primaryAction: { label: string; status: OrderStatus; color: string } | null = null;
  
  if (ticket.status !== "completed" && ticket.status !== "voided" && ticket.status !== "cancelled") {
    primaryAction = { label: "Mark All Served", status: "completed", color: "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500" };
  }

  const isCompleted = ticket.status === "completed" || ticket.status === "voided" || ticket.status === "cancelled";

  return (
    <div className={`flex flex-col bg-white border ${isCompleted ? 'border-gray-200 opacity-60' : 'border-gray-300 shadow-sm'} rounded-xl overflow-hidden shrink-0 w-80 max-h-[85vh]`}>
      
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 flex justify-between items-center ${ticket.status === 'pending' ? 'bg-gray-50' : ticket.status === 'in_kitchen' ? 'bg-blue-50' : ticket.status === 'ready' ? 'bg-emerald-50' : ''}`}>
        <div>
          <h3 className="font-extrabold text-xl text-gray-900">
            {ticket.table_number ? `Table ${ticket.table_number}` : "Takeaway"}
          </h3>
          <div className="text-xs text-gray-500 font-mono mt-0.5">#{ticket.id.slice(0, 8).toUpperCase()}</div>
        </div>
        <TicketTimer placedAt={ticket.placed_at} status={ticket.status} />
      </div>

      {/* Items List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {ticket.order_items.map((item) => {
          // If status isn't returned by DB (missing migration), default to ticket status or pending
          const currentStatus = item.status || 'pending';
          return (
          <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 flex flex-col gap-2">
            <div className="flex gap-3 items-start">
              <span className="text-sm font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                {item.quantity}x
              </span>
              <div className="flex-1">
                <span className={`font-medium text-lg leading-tight ${currentStatus === 'served' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {item.menu_items?.name || "Unknown Item"}
                </span>
                {item.notes && (
                  <div className="mt-1 text-sm font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-start gap-1.5">
                    <span>⚠️</span>
                    <span>{item.notes}</span>
                  </div>
                )}
              </div>
            </div>
            {onUpdateItemStatus && !isCompleted && currentStatus !== 'served' && (
              <div className="flex gap-2 ml-10">
                <button 
                  onClick={() => onUpdateItemStatus(item.id, 'served')}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 text-xs font-bold uppercase transition-colors"
                >
                  Mark Served
                </button>
              </div>
            )}
          </div>
        )})}
      </div>

      {/* Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2">
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
            className="px-4 py-3 rounded-lg font-bold text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-rose-600 transition-all active:scale-95 disabled:opacity-50"
          >
            Void
          </button>
        )}

        {isCompleted && ticket.status === 'completed' && (
          <div className="flex-1 py-2 text-center text-emerald-700 font-bold text-sm bg-emerald-50 rounded border border-emerald-200">
            Completed
          </div>
        )}
        
        {isCompleted && (ticket.status === 'voided' || ticket.status === 'cancelled') && (
          <div className="flex-1 py-2 text-center text-rose-700 font-bold text-sm bg-rose-50 rounded border border-rose-200">
            Voided
          </div>
        )}
      </div>
    </div>
  );
}
