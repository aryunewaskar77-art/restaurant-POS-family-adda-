"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/types/database.types";

function OrderStatusTracker({ tableId }: { tableId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use createBrowserClient directly
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!orderId) {
      router.push(`/order/${tableId}`);
      return;
    }

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("orders")
        .select("status, total")
        .eq("id", orderId)
        .single();
        
      if (data) {
        setStatus(data.status as OrderStatus);
      }
      setIsLoading(false);
    };

    fetchInitial();

    const channelName = `order_updates_${orderId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new && payload.new.status) {
            setStatus(payload.new.status as OrderStatus);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, tableId, router, supabase]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (!status) {
    return <div className="p-8 text-center">Order not found.</div>;
  }

  const steps = [
    { key: "pending", label: "Order Received" },
    { key: "in_kitchen", label: "Cooking in Kitchen" },
    { key: "ready", label: "Ready to Serve" },
    { key: "completed", label: "Completed / Paid" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === status);
  const isVoided = status === "voided" || status === "cancelled";

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Tracking</h2>
        <p className="text-sm text-gray-500 mb-4">Table #{tableId} • Order {orderId?.slice(0, 8)}</p>
        <StatusBadge status={status} className="text-sm px-3 py-1 mb-6" />

        {isVoided ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium">
            This order has been cancelled or voided.
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-left mt-2">
            {steps.map((step, index) => {
              const isPast = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              
              let dotClass = "bg-gray-200 border-gray-300";
              if (isPast) dotClass = "bg-brand-500 border-brand-500";
              if (isCurrent) dotClass = "bg-brand-600 border-brand-200 border-4 animate-pulse";

              let textClass = "text-gray-400";
              if (isPast) textClass = "text-gray-700 font-medium";
              if (isCurrent) textClass = "text-brand-800 font-bold";

              return (
                <div key={step.key} className="flex items-center gap-4 relative">
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute left-[11px] top-8 w-0.5 h-8 -z-10 ${isPast ? 'bg-brand-200' : 'bg-gray-100'}`} />
                  )}
                  <div className={`w-6 h-6 rounded-full border-2 ${dotClass} flex-shrink-0 z-10 bg-white flex items-center justify-center`} />
                  <span className={textClass}>{step.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => router.push(`/order/${tableId}`)}
        className="w-full max-w-sm bg-white border-2 border-brand-600 text-brand-700 font-bold py-4 rounded-xl flex items-center justify-center hover:bg-brand-50 transition-colors"
      >
        Order More Items
      </button>
    </div>
  );
}

export default function StatusPage({ params }: { params: Promise<{ tableId: string }> }) {
  const tableId = use(params).tableId;
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OrderStatusTracker tableId={tableId} />
    </Suspense>
  );
}
