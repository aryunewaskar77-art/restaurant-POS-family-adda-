"use client";

import React from "react";
import { logoutStaff } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutStaff();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-sm font-medium hover:opacity-80 transition-opacity ${className}`}
    >
      Lock / Switch Staff
    </button>
  );
}
