import { NextResponse } from "next/server";
import { runAutoArchive } from "@/actions/archival";

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

  const url = new URL(request.url);
  const retentionParam = url.searchParams.get("retention");
  const retention = retentionParam ? parseInt(retentionParam, 10) : 6;

  const result = await runAutoArchive(restaurantId, retention);
  
  return NextResponse.json(result);
}
