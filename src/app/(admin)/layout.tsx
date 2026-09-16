import React from "react";
import Link from "next/link";
import { getStaffSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/ui/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStaffSession();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="h-16 flex items-center px-4 border-b border-brand-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full mr-3 object-cover border border-brand-700" />
          <span className="font-bold tracking-wide">Family Adda Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          {session?.role === 'admin' && (
            <>
              <Link
                href="/admin/dashboard"
                className="px-3 py-2 rounded-md hover:bg-brand-800 transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/menu"
                className="px-3 py-2 rounded-md hover:bg-brand-800 transition-colors text-sm font-medium"
              >
                Menu
              </Link>
              <Link
                href="/admin/reports"
                className="px-3 py-2 rounded-md hover:bg-brand-800 transition-colors text-sm font-medium"
              >
                Sales Report
              </Link>
              <Link
                href="/admin/qr"
                className="px-3 py-2 rounded-md hover:bg-brand-800 transition-colors text-sm font-medium"
              >
                Table QRs
              </Link>
            </>
          )}

          {(session?.role === 'admin' || session?.role === 'kitchen') && (
            <Link
              href="/admin/pantry"
              className="px-3 py-2 rounded-md hover:bg-brand-800 transition-colors text-sm font-medium"
            >
              Pantry Management
            </Link>
          )}
          
          {session?.role === 'kitchen' && (
            <Link
              href="/kitchen"
              className="px-3 py-2 rounded-md hover:bg-brand-800 transition-colors text-sm font-medium text-emerald-400"
            >
              Open Kitchen Display ↗
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-brand-800">
          <div className="text-xs text-brand-300 mb-1">Logged in as</div>
          <div className="font-medium text-sm truncate mb-3">{session?.name || "Admin"} ({session?.role})</div>
          <LogoutButton className="text-sm text-brand-200 hover:text-white w-full text-left" />
        </div>
      </aside>

      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden flex flex-col flex-1 w-full max-w-full">
        <header className="h-16 bg-brand-900 text-white flex items-center justify-between px-4">
          <div className="font-bold">Family Adda Admin</div>
          <LogoutButton className="text-sm text-brand-200 hover:text-white" />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </main>
      </div>

      {/* Main Content (Desktop) */}
      <main className="flex-1 overflow-auto p-8 hidden md:block">
        {children}
      </main>
    </div>
  );
}
