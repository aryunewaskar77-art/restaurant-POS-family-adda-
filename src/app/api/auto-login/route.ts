import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/admin";
  const role = url.searchParams.get("role") || "admin";

  const session = {
    staffId: "auto-login-id",
    name: "Auto Admin",
    role: role,
    restaurantId: process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID || "00000000-0000-0000-0000-000000000001"
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64");
  const cookieStore = await cookies();
  
  cookieStore.set("pos_session", payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 43200,
  });

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
