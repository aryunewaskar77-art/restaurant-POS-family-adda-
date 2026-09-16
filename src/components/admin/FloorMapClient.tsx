"use client";

import React, { useEffect } from "react";
import { FloorTableCard } from "./FloorTableCard";
import type { TableSessionSummary } from "@/types/domain";
import { createClient } from "@/lib/supabase/client";

interface FloorMapClientProps {
  initialSessions: TableSessionSummary[];
  totalTables: number;
  restaurantId: string;
}

export function FloorMapClient({ initialSessions, totalTables, restaurantId }: FloorMapClientProps) {
  const sessions = initialSessions;
  const supabase = createClient();

  // Polling fallback or Realtime subscription could be used here
  // For simplicity and bulletproof execution, we refresh via router or simple polling,
  // but let's implement Realtime as requested.
  useEffect(() => {
    // Append random string to channel name to prevent StrictMode re-subscription errors
    const channel = supabase
      .channel(`table_sessions_changes_${Math.random().toString(36).substring(7)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'table_sessions', filter: `restaurant_id=eq.${restaurantId}` },
        () => {
          // Simplest approach: reload the page to get full fresh data including nested orders
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, restaurantId]);

  const takeawaySessions = sessions.filter(s => s.tableIdentifier.startsWith('takeaway'));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: totalTables }).map((_, i) => {
          const tableNumber = i + 1;
          const session = sessions.find(s => s.tableIdentifier === String(tableNumber));
          return (
            <FloorTableCard 
              key={tableNumber} 
              tableNumber={tableNumber} 
              session={session} 
            />
          );
        })}
      </div>
      
      {takeawaySessions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🛍️</span> Active Takeaways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {takeawaySessions.map(session => (
              <FloorTableCard 
                key={session.sessionId} 
                tableNumber={session.tableIdentifier} 
                session={session} 
                isTakeaway={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
