"use client";

import React, { useState, useEffect } from "react";
import type { TableSessionSummary } from "@/types/domain";
import { requestBill } from "@/actions/settlement";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface RunningBillDrawerProps {
  session: TableSessionSummary;
}

export function RunningBillDrawer({ session }: RunningBillDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session?.sessionId) return;
    const supabase = createClient();
    
    const channel = supabase
      .channel(`session-updates-${session.sessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "table_sessions", filter: `id=eq.${session.sessionId}` },
        () => { router.refresh(); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `session_id=eq.${session.sessionId}` },
        () => { router.refresh(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.sessionId, router]);
  
  if (!session || !session.orders || session.orders.length === 0) return null;

  const validOrders = session.orders.filter(o => !['voided', 'cancelled'].includes(o.status));
  if (validOrders.length === 0) return null;

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  let computedSub = 0;
  validOrders.forEach(o => {
    if (o.items) {
      o.items.forEach(i => computedSub += (i.unitPrice * i.quantity));
    }
  });
  
  const finalSubtotal = computedSub > 0 ? computedSub : session.subtotal;
  const finalTax = finalSubtotal * 0.05;
  const finalTotal = finalSubtotal + finalTax;

  const handleRequestBill = async () => {
    setIsRequesting(true);
    await requestBill(session.tableIdentifier);
    setIsRequesting(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[80px] right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg z-30 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-xl">🧾</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm max-w-md mx-auto"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 transform max-w-md mx-auto flex flex-col max-h-[85vh] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex-shrink-0 flex justify-center py-3 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Running Bill</h2>
          <p className="text-sm text-gray-500 mb-6">Table {session.tableIdentifier}</p>

          <div className="space-y-4 mb-6">
            {validOrders.map((order, idx) => (
              <div key={order.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800 text-sm">Batch #{idx + 1}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 mb-8">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(finalSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (5%)</span>
              <span>{formatPrice(finalTax)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-brand-700 mt-2 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {session.status === 'bill_requested' ? (
            <div className="w-full py-4 text-center bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200">
              Bill Requested! Server is on the way.
            </div>
          ) : (
            <button
              onClick={handleRequestBill}
              disabled={isRequesting}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-md hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isRequesting ? "Requesting..." : "Request Bill & Pay"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
