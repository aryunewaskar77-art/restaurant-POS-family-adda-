"use client";

import React, { useState } from "react";
import type { TableSessionSummary } from "@/types/domain";
import { SettleBillModal } from "./SettleBillModal";

interface FloorTableCardProps {
  tableNumber: number | string;
  session?: TableSessionSummary;
  isTakeaway?: boolean;
}

export function FloorTableCard({ tableNumber, session, isTakeaway }: FloorTableCardProps) {
  const [isSettleModalOpen, setSettleModalOpen] = useState(false);
  const identifier = String(tableNumber);
  
  const isVacant = !session;
  const isBillRequested = session?.status === 'bill_requested';

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <div 
        className={`relative border rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all ${
          isVacant 
            ? "bg-white border-gray-200" 
            : isBillRequested
              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400 ring-opacity-50"
              : "bg-blue-50 border-blue-200"
        }`}
      >
        {isBillRequested && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm animate-pulse">
            Bill Requested
          </div>
        )}

        <div className="flex justify-between items-start mb-4 mt-2">
          <div>
            <h3 className={`text-2xl font-black ${isVacant ? 'text-gray-800' : 'text-gray-900'}`}>
              {isTakeaway ? 'Takeaway' : `Table ${identifier}`}
            </h3>
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isVacant ? 'text-emerald-600' : isBillRequested ? 'text-amber-700' : 'text-blue-600'
            }`}>
              {isTakeaway ? (session?.status === 'bill_requested' ? 'Ready to Pay' : 'Preparing') : (isVacant ? 'Vacant' : 'Occupied')}
            </span>
          </div>
          
          {!isVacant && (
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">{formatPrice(session.total)}</div>
              <div className="text-xs text-gray-500">{session.orders.length} Order(s)</div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 border-opacity-50 flex gap-2">
          {isVacant ? (
            <a 
              href={`/order/${identifier}`}
              target="_blank"
              className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors block"
            >
              Take Order
            </a>
          ) : (
            <>
              <a
                href={`/order/${identifier}`}
                target="_blank"
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors block"
              >
                Add Order
              </a>
              <button
                onClick={() => setSettleModalOpen(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${
                  isBillRequested 
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                Settle Bill
              </button>
            </>
          )}
        </div>
      </div>

      {session && (
        <SettleBillModal 
          isOpen={isSettleModalOpen}
          onClose={() => setSettleModalOpen(false)}
          session={session}
        />
      )}
    </>
  );
}
