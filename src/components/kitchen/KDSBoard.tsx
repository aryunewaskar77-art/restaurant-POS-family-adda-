"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { SessionTicketCard } from "./SessionTicketCard";
import { KDSControls, FilterTab } from "./KDSControls";
import { playOrderChime } from "@/lib/audio/chime";
import { updateOrderStatus } from "@/actions/kitchen";
import type { OrderStatus } from "@/types/database.types";
import { KDSTicketData } from "./TicketCard";

interface KDSBoardProps {
  initialOrders: KDSTicketData[];
  restaurantId: string;
}

export function KDSBoard({ initialOrders, restaurantId }: KDSBoardProps) {
  const [orders, setOrders] = useState<KDSTicketData[]>(initialOrders);
  const [filter, setFilter] = useState<FilterTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");
  const [tableFilter, setTableFilter] = useState("all");
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [connectionState, setConnectionState] = useState<"connected" | "reconnecting" | "offline">("connected");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const enableAudio = () => {
      setIsAudioEnabled(true);
      window.removeEventListener("pointerdown", enableAudio);
    };
    window.addEventListener("pointerdown", enableAudio);
    return () => window.removeEventListener("pointerdown", enableAudio);
  }, []);

  useEffect(() => {
    const channelName = `kds_orders_${restaurantId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelName);

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
            const { data: newOrderData } = await supabase
              .from("orders")
              .select("*, table_sessions(receipt_number), order_items(*, menu_items(name))")
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
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

     
    const result = await updateOrderStatus({ orderId, status: newStatus as any });
    
    if (!result.success) {
      alert(`Failed to update ticket: ${result.error}`);
    }
  };

  const handleUpdateItemStatus = async (itemId: string, newStatus: 'pending' | 'in_kitchen' | 'ready' | 'served') => {
    setOrders((prev) =>
      prev.map((o) => ({
        ...o,
        order_items: o.order_items.map((i: any) => (i.id === itemId ? { ...i, status: newStatus } : i))
      }))
    );

    const { updateOrderItemStatus } = await import("@/actions/kitchen");
    const result = await updateOrderItemStatus(itemId, newStatus);
    
    if (!result.success) {
      alert(`Failed to update item: ${result.error}`);
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

  // Group by session
  const groupedOrders = visibleOrders.reduce((acc, order) => {
    const key = order.session_id ? `session-${order.session_id}` : `order-${order.id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {} as Record<string, KDSTicketData[]>);

  const availableTables = Array.from(new Set(visibleOrders.map(o => o.table_number).filter(Boolean))) as string[];
  // Sort alphabetically or numerically
  availableTables.sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const q = searchQuery.toLowerCase().trim();
  const sessionGroups = Object.values(groupedOrders)
    .filter(group => {
      const first = (group as any)[0];
      
      // Table Filter
      if (tableFilter === "takeaway" && first.table_number) return false;
      if (tableFilter !== "all" && tableFilter !== "takeaway" && first.table_number !== tableFilter) return false;

      // Search Query
      if (!q) return true;
      const matchTable = first.table_number?.toLowerCase().includes(q);
      const matchSession = first.session_id?.toLowerCase().includes(q);
      const matchReceipt = first.table_sessions?.receipt_number ? String(first.table_sessions.receipt_number).includes(q) : false;
      const matchOrderHash = (group as any[]).some((o: any) => o.id.toLowerCase().includes(q));
      const matchTicketNo = (group as any[]).some((o: any) => o.ticket_number ? String(o.ticket_number).includes(q) : false);
      return matchTable || matchSession || matchReceipt || matchOrderHash || matchTicketNo;
    })
    .sort((a, b) => {
      const aTime = Math.min(...(a as any[]).map((o: any) => new Date(o.placed_at).getTime()));
      const bTime = Math.min(...(b as any[]).map((o: any) => new Date(o.placed_at).getTime()));
      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute -top-12 right-0 flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${
          connectionState === 'connected' ? 'bg-emerald-500' :
          connectionState === 'reconnecting' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
        }`} />
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {connectionState}
        </span>
      </div>

      <KDSControls
        currentTab={filter}
        onTabChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        tableFilter={tableFilter}
        onTableFilterChange={setTableFilter}
        availableTables={availableTables}
        counts={counts}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled((prev) => !prev)}
      />

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {sessionGroups.map((groupOrders) => (
            <SessionTicketCard
              key={(groupOrders as any)[0].session_id || (groupOrders as any)[0].id}
              orders={groupOrders as any}
              onUpdateStatus={handleUpdateStatus}
              onUpdateItemStatus={handleUpdateItemStatus}
            />
          ))}
          {sessionGroups.length === 0 && (
            <div className="col-span-full h-40 flex items-center justify-center text-gray-500 italic">
              No tickets in this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
