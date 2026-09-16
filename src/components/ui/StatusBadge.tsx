import React from "react";
import type { OrderStatus } from "@/types/database.types";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  let styles = "";
  const label = status.replace("_", " ");

  switch (status) {
    case "pending":
      styles = "bg-amber-100 text-amber-800 border-amber-200";
      break;
    case "in_kitchen":
      styles = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case "ready":
      styles = "bg-emerald-100 text-emerald-800 border-emerald-200";
      break;
    case "completed":
      styles = "bg-slate-100 text-slate-700 border-slate-200";
      break;
    case "voided":
      styles = "bg-rose-100 text-rose-800 border-rose-200";
      break;
    default:
      styles = "bg-gray-100 text-gray-800 border-gray-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
