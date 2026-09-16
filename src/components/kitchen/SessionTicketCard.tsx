"use client";

import React, { useState } from "react";
import { TicketTimer } from "./TicketTimer";
import type { OrderStatus } from "@/types/database.types";
import { KDSTicketData } from "./TicketCard";

interface SessionTicketCardProps {
  orders: KDSTicketData[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onUpdateItemStatus?: (itemId: string, newStatus: 'pending' | 'in_kitchen' | 'ready' | 'served') => Promise<void>;
}

export function SessionTicketCard({ orders, onUpdateStatus, onUpdateItemStatus }: SessionTicketCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Use the earliest order for the timer and table info
  const firstOrder = orders.reduce((earliest, current) => 
    new Date(current.placed_at) < new Date(earliest.placed_at) ? current : earliest
  , orders[0]);

  // Aggregate completion status
  const allCompleted = orders.every(o => o.status === "completed" || o.status === "voided" || o.status === "cancelled");
  
  const handleCompleteAll = async () => {
    setIsUpdating(true);
    for (const order of orders) {
      if (order.status !== "completed" && order.status !== "voided" && order.status !== "cancelled") {
        await onUpdateStatus(order.id, "completed");
      }
    }
    setIsUpdating(false);
  };

  return (
    <div className={`flex flex-col bg-white border ${allCompleted ? 'border-gray-200 opacity-60' : 'border-gray-300 shadow-sm'} rounded-xl overflow-hidden w-full h-full`}>
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 flex justify-between items-center ${allCompleted ? '' : 'bg-gray-50'}`}>
        <div>
          {allCompleted ? (
            <>
              <h3 className="font-extrabold text-xl text-gray-900 font-mono">
                Order #{firstOrder.table_sessions?.receipt_number ? String(firstOrder.table_sessions.receipt_number).padStart(4, '0') : firstOrder.session_id ? firstOrder.session_id.slice(0, 6).toUpperCase() : firstOrder.id.slice(0, 6).toUpperCase()}
              </h3>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center font-medium">
                <span>{firstOrder.table_number ? `Table ${firstOrder.table_number}` : "Takeaway"}</span>
                <span className="mx-2 text-gray-300">•</span>
                {orders.length} Batch(es)
              </div>
            </>
          ) : (
            <>
              <h3 className="font-extrabold text-xl text-gray-900">
                {firstOrder.table_number ? `Table ${firstOrder.table_number}` : "Takeaway"}
              </h3>
              <div className="text-xs text-gray-500 font-mono mt-0.5 flex items-center">
                <span className="font-semibold text-gray-400">Order #{firstOrder.table_sessions?.receipt_number ? String(firstOrder.table_sessions.receipt_number).padStart(4, '0') : firstOrder.session_id ? firstOrder.session_id.slice(0, 6).toUpperCase() : firstOrder.id.slice(0, 6).toUpperCase()}</span>
                <span className="mx-2 text-gray-300">•</span>
                {orders.length} Batch(es)
              </div>
            </>
          )}
        </div>
        <TicketTimer placedAt={firstOrder.placed_at} status={allCompleted ? "completed" : "pending"} />
      </div>

      {/* Items List grouped by order */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {orders.sort((a, b) => new Date(a.placed_at).getTime() - new Date(b.placed_at).getTime()).map((order, index) => (
          <div key={order.id} className="space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1">
              Ticket #{order.ticket_number ? String(order.ticket_number).padStart(4, '0') : order.id.slice(0, 6).toUpperCase()} {index === 0 ? "(First)" : "(Add-on)"}
            </div>
            
            {order.order_items.map((item) => {
              const currentStatus = item.status || 'pending';
              const isItemCompleted = order.status === "completed" || order.status === "voided" || order.status === "cancelled";
              return (
                <div key={item.id} className="pb-2 flex flex-col gap-2">
                  <div className="flex gap-3 items-start justify-between">
                    <div className="flex gap-3 items-start flex-1">
                      <span className="text-sm font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                        {item.quantity}x
                      </span>
                      <div className="flex-1">
                        <span className="font-medium text-lg leading-tight text-gray-900">
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
                    {allCompleted && item.total_price !== undefined && (
                      <div className="font-medium text-gray-600 tabular-nums">
                        ₹{item.total_price.toFixed(2)}
                      </div>
                    )}
                  </div>
                  {onUpdateItemStatus && !isItemCompleted && currentStatus !== 'served' && (
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
              );
            })}
          </div>
        ))}
        
        {allCompleted && (
          <div className="pt-3 border-t-2 border-dashed border-gray-200 mt-2 flex justify-between items-center px-1">
            <span className="font-bold text-gray-700 uppercase tracking-wider text-sm">Session Total</span>
            <span className="font-bold text-xl text-emerald-700 tabular-nums">
              ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2">
        {!allCompleted ? (
          <button
            disabled={isUpdating}
            onClick={handleCompleteAll}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-sm border bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 transition-all active:scale-95 disabled:opacity-50"
          >
            Mark All Served
          </button>
        ) : (
          <div className="flex-1 py-2 text-center text-emerald-700 font-bold text-sm bg-emerald-50 rounded border border-emerald-200">
            Completed
          </div>
        )}
      </div>
    </div>
  );
}
