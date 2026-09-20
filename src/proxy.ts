import { NextResponse, type NextRequest } from "next/server";

// Auto-create an admin session payload (no PIN required)
function makeAdminSession(restaurantId: string, role: string) {
  const session = {
    staffId: "auto-login-id",
    name: role === "kitchen" ? "Auto Kitchen" : "Auto Admin",
    role,
    restaurantId,
  };
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public routes and static assets pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/order") ||
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    const sessionCookie = request.cookies.get("pos_session");
    const restaurantId =
      process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID ||
      "00000000-0000-0000-0000-000000000001";

    // Determine role from existing cookie or default to admin
    let role = "admin";

    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(atob(sessionCookie.value));
        role = session.role || "admin";
      } catch {
        // Cookie is corrupt — we will auto-reset it below
      }
    }

    // If no valid cookie, auto-set one (no PIN required)
    if (!sessionCookie?.value) {
      // Kitchen routes default to kitchen role, everything else to admin
      if (pathname.startsWith("/admin/kitchen") || pathname.startsWith("/admin/pantry")) {
        role = "kitchen";
      }
      const response = NextResponse.next();
      response.cookies.set("pos_session", makeAdminSession(restaurantId, role), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 43200, // 12 hours
      });
      return response;
    }

    // Kitchen role: only allow kitchen + pantry
    if (role === "kitchen") {
      if (
        pathname.startsWith("/admin/pantry") ||
        pathname.startsWith("/admin/kitchen")
      ) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/kitchen";
      return NextResponse.redirect(url);
    }

    // Admin/manager: allow all /admin routes
    return NextResponse.next();
  }

  // Redirect legacy /kitchen to /admin/kitchen
  if (pathname.startsWith("/kitchen")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/kitchen";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
