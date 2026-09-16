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

  // Intercept /admin routes (including kitchen which is now /admin/kitchen)
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
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

      // Kitchen staff CAN access pantry and kitchen
      if (role === 'kitchen') {
        if (pathname.startsWith('/admin/pantry') || pathname.startsWith('/admin/kitchen')) {
          return NextResponse.next();
        }
        // Redirect unauthorized access to their home base
        const url = request.nextUrl.clone();
        url.pathname = "/admin/kitchen";
        return NextResponse.redirect(url);
      }

      // Admin and Manager can access everything in /admin
      if (role !== "admin" && role !== "manager") {
        const url = request.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }

    } catch {
      // Unparseable session cookie
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
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
