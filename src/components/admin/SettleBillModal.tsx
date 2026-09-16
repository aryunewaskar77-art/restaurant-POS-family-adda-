"use client";

import React, { useState } from "react";
import type { TableSessionSummary, PaymentMethod } from "@/types/domain";
import { settleSession } from "@/actions/settlement";

interface SettleBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: TableSessionSummary;
}

export function SettleBillModal({ isOpen, onClose, session }: SettleBillModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [paymentReference, setPaymentReference] = useState("");
  const [isSettling, setIsSettling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  const handleSettle = async () => {
    setIsSettling(true);
    setError(null);
    const res = await settleSession({
      sessionId: session.sessionId,
      paymentMethod,
      paymentReference
    });
    setIsSettling(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to settle bill");
    }
  };

  // Recompute actual cumulative totals because session.total is from the DB (might be slightly out of sync if realtime hasn't fired yet)
  const safeOrders = session.orders || [];
  const validOrders = safeOrders.filter(o => !['voided', 'cancelled'].includes(o.status));
  
  // Exact calculation from items:
  let exactSub = 0;
  validOrders.forEach(o => {
    if (o.items) {
      o.items.forEach(i => {
        exactSub += (i.unitPrice * i.quantity);
      });
    }
  });

  const finalSubtotal = exactSub > 0 ? exactSub : session.subtotal;
  const finalTax = finalSubtotal * 0.05;
  const finalTotal = finalSubtotal + finalTax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Settle Table {session.tableIdentifier}</h2>
            <p className="text-xs text-gray-500 font-medium">Session ID: {session.sessionId.split('-')[0]}...</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ordered Batches</h3>
            
            {validOrders.map((order, idx) => (
              <div key={order.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">Order #{idx + 1}</span>
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.items?.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {validOrders.length === 0 && (
              <p className="text-gray-500 text-sm">No valid orders found.</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Gross Subtotal</span>
              <span>{formatPrice(finalSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (5%)</span>
              <span>{formatPrice(finalTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-brand-700 mt-2 pt-2 border-t border-gray-200">
              <span>Final Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Payment Method</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['cash', 'upi', 'card'] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-lg font-semibold text-sm border transition-all ${
                    paymentMethod === m 
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {m === 'upi' ? 'UPI / QR' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference ID (Optional)
              </label>
              <input 
                type="text" 
                value={paymentReference}
                onChange={e => setPaymentReference(e.target.value)}
                placeholder={paymentMethod === 'cash' ? 'N/A' : 'Transaction ID / Last 4 Digits'}
                disabled={paymentMethod === 'cash'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isSettling}
            className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSettle}
            disabled={isSettling}
            className="px-6 py-2 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSettling ? 'Processing...' : 'Confirm Payment & Vacate'}
          </button>
        </div>
      </div>
    </div>
  );
}
