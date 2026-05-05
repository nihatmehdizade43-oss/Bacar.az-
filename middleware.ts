// Purpose: Protect private routes and admin area with NextAuth JWT.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow admin login page without auth
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // For API routes, return 401 JSON instead of redirect
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin role check
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // IMPORTANT: Exclude /api/auth so NextAuth callbacks (Google OAuth etc.) work.
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/((?!auth).*)"],
};
