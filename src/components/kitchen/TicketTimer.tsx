"use client";

import React, { useState, useEffect } from "react";

interface TicketTimerProps {
  placedAt: string;
  status: string;
}

export function TicketTimer({ placedAt, status }: TicketTimerProps) {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    // If the ticket is completed or voided, we can stop counting
    if (status === "completed" || status === "voided" || status === "cancelled") {
      return;
    }

    const placedTime = new Date(placedAt).getTime();
    
    const updateTimer = () => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - placedTime) / 1000);
      setElapsed(diffInSeconds > 0 ? diffInSeconds : 0);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [placedAt, status]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  let colorClass = "text-slate-400"; // < 10 mins

  if (status !== "completed" && status !== "voided" && status !== "cancelled") {
    if (minutes >= 20) {
      colorClass = "text-rose-400 bg-rose-950/40 border border-rose-800 animate-pulse px-2 py-0.5 rounded";
    } else if (minutes >= 10) {
      colorClass = "text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded";
    }
  }

  return (
    <div className={`font-mono font-medium ${colorClass}`}>
      {formattedMinutes}:{formattedSeconds}
    </div>
  );
}
