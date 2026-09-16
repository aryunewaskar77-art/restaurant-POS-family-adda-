import React from "react";
import { CartProvider } from "@/context/CartContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-sm border-x border-gray-100 relative">
          <header className="h-14 border-b border-gray-100 flex items-center px-4 justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm" />
              <span className="font-bold text-brand-800 tracking-tight">Family Adda</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto pb-24">
            {children}
          </main>
        </div>
      </div>
    </CartProvider>
  );
}
