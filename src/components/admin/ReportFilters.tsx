"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentDate = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const updateRoute = (newDate: string) => {
    router.push(`/admin/reports?date=${newDate}`, { scroll: false });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      updateRoute(val);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-2">
        <input 
          type="date"
          value={currentDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm"
        />
      </div>
    </div>
  );
}
