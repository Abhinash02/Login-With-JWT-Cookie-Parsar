import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token"); // Get JWT token from cookies

  // Define protected routes (accessible only if authenticated)
  const protectedRoutes = ["/admin", "/user", "/dashboard"];

  // If trying to access a protected route without a token, redirect to login
  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // Allow access if authenticated
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*"], // Protect these routes
};
