import { NextResponse } from "next/server";
import { runMonthlyArchive } from "@/actions/archival";

export async function GET(request: Request) {
  // Protect route
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Also allow manual trigger for testing with a query param in dev
    if (process.env.NODE_ENV !== "development" || new URL(request.url).searchParams.get("override") !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId) {
    return NextResponse.json({ error: "Restaurant ID not configured" }, { status: 500 });
  }

  // Determine archive month (12 months ago, previous month from that)
  // Example: If today is Sept 2026, 12 months ago is Sept 2025. 
  // We want to archive Aug 2025 (or everything up to Sept 2025). 
  const url = new URL(request.url);
  const requestedMonth = url.searchParams.get("month");

  // Determine archive month (12 months ago)
  const d = new Date();
  d.setMonth(d.getMonth() - 12);
  const archiveMonthStr = requestedMonth || `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

  const result = await runMonthlyArchive(restaurantId, archiveMonthStr, 12);
  
  return NextResponse.json(result);
}
