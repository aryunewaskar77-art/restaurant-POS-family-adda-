import React from "react";
import { getStaffSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/ui/LogoutButton";

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStaffSession();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧑‍🍳</span>
            <span className="font-bold text-slate-100 tracking-wide uppercase text-sm">
              Kitchen Display
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300">Live network</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Active Staff: <span className="text-slate-200 font-semibold">{session?.name || "Unknown"}</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <LogoutButton className="text-rose-400 hover:text-rose-300" />
        </div>
      </header>
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
