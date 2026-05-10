import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // Login/Register page এ token থাকলে home এ redirect
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Dashboard routes — middleware এ block করবো না
  // AuthProvider + page level এ handle করবে
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};