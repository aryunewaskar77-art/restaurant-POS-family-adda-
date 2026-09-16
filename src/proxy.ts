import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public routes and static assets pass through without decoding the session
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/order") ||
    pathname === "/login" ||
    pathname === "/" ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Intercept /admin and /kitchen routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isKitchenRoute = pathname.startsWith("/kitchen");

  if (isAdminRoute || isKitchenRoute) {
    const sessionCookie = request.cookies.get("pos_session");

    if (!sessionCookie || !sessionCookie.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const payloadString = atob(sessionCookie.value);
      const session = JSON.parse(payloadString);
      const role = session.role;

      if (isAdminRoute) {
        if (role !== "admin" && role !== "manager") {
          // If they are cashier/kitchen trying to access admin, send them to their own area or unauthorized
          const url = request.nextUrl.clone();
          url.pathname = role === "kitchen" ? "/kitchen" : "/unauthorized";
          return NextResponse.redirect(url);
        }
      } else if (isKitchenRoute) {
        // Kitchen permits kitchen, admin, manager
        if (role !== "kitchen" && role !== "admin" && role !== "manager") {
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }
    } catch {
      // Unparseable session cookie
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
