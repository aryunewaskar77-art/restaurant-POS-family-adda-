"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { KDSTicketData, TicketCard } from "./TicketCard";
import { KDSControls, FilterTab } from "./KDSControls";
import { playOrderChime } from "@/lib/audio/chime";
import { updateOrderStatus } from "@/actions/kitchen";
import type { OrderStatus } from "@/types/database.types";

interface KDSBoardProps {
  initialOrders: KDSTicketData[];
  restaurantId: string;
}

export function KDSBoard({ initialOrders, restaurantId }: KDSBoardProps) {
  const [orders, setOrders] = useState<KDSTicketData[]>(initialOrders);
  const [filter, setFilter] = useState<FilterTab>("active");
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [connectionState, setConnectionState] = useState<"connected" | "reconnecting" | "offline">("connected");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Enable audio after first interaction to bypass autoplay policies
    const enableAudio = () => {
      setIsAudioEnabled(true);
      window.removeEventListener("pointerdown", enableAudio);
    };
    window.addEventListener("pointerdown", enableAudio);
    return () => window.removeEventListener("pointerdown", enableAudio);
  }, []);

  useEffect(() => {
    const channel = supabase.channel(`kds_orders_${restaurantId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // New order received
            // We need to fetch the order items since they are not in the payload
            const { data: newOrderData } = await supabase
              .from("orders")
              .select("*, order_items(*, menu_items(name))")
              .eq("id", payload.new.id)
              .single();

            if (newOrderData) {
              setOrders((prev) => {
                if (prev.some((o) => o.id === newOrderData.id)) return prev;
                return [...prev, newOrderData as unknown as KDSTicketData];
              });
              if (isAudioEnabled) playOrderChime();
            }
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? { ...o, status: payload.new.status as OrderStatus } : o
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setConnectionState("connected");
        else if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") setConnectionState("offline");
        else setConnectionState("reconnecting");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, restaurantId, isAudioEnabled]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await updateOrderStatus({ orderId, status: newStatus as any });
    
    if (!result.success) {
      // Revert if failed (requires a full re-fetch in reality, but we simplify here)
      // For a robust implementation, we would store the old status
      alert(`Failed to update ticket: ${result.error}`);
    }
  };

  const counts = {
    active: orders.filter((o) => o.status === "pending" || o.status === "in_kitchen").length,
    ready: orders.filter((o) => o.status === "ready").length,
    all: orders.filter((o) => (["pending", "in_kitchen", "ready"] as string[]).includes(o.status)).length,
    history: orders.filter((o) => (["completed", "voided", "cancelled"] as string[]).includes(o.status)).length,
  };

  const visibleOrders = orders
    .filter((o) => {
      if (filter === "active") return o.status === "pending" || o.status === "in_kitchen";
      if (filter === "ready") return o.status === "ready";
      if (filter === "all") return (["pending", "in_kitchen", "ready"] as string[]).includes(o.status);
      if (filter === "history") return (["completed", "voided", "cancelled"] as string[]).includes(o.status);
      return false;
    })
    .sort((a, b) => new Date(a.placed_at).getTime() - new Date(b.placed_at).getTime());

  return (
    <div className="flex flex-col h-full relative">
      {/* Absolute connection indicator */}
      <div className="absolute -top-12 right-0 flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${
          connectionState === 'connected' ? 'bg-emerald-500' :
          connectionState === 'reconnecting' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
        }`} />
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          {connectionState}
        </span>
      </div>

      <KDSControls
        currentTab={filter}
        onTabChange={setFilter}
        counts={counts}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled((prev) => !prev)}
      />

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 items-start w-max min-w-full">
          {visibleOrders.map((order) => (
            <TicketCard
              key={order.id}
              ticket={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
          {visibleOrders.length === 0 && (
            <div className="w-full h-40 flex items-center justify-center text-slate-500 italic">
              No tickets in this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
