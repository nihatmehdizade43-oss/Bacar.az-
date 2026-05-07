// Purpose: Protect private routes, admin area, and messaging with NextAuth JWT.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow admin login page without auth
  if (pathname === "/admin/login") return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Block banned users from accessing protected routes
  if ((token as { error?: string }).error === "banned") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: { message: "Hesabınız bloklanıb" } },
        { status: 403 },
      );
    }
    return NextResponse.redirect(new URL("/login?error=banned", req.url));
  }

  // Admin role check
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/mesajlar/:path*", "/api/((?!auth).*)"],
};
