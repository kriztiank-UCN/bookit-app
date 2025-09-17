// This middleware checks if the user is authenticated before allowing access to certain routes.
import { NextResponse } from "next/server";
import checkAuth from "./app/actions/checkAuth";

export async function middleware(request) {
  // Get authentification status from checkAuth action
  const { isAuthenticated } = await checkAuth();
  // Extract the pathname from the request URL
  const { pathname } = new URL(request.url);
  // Protect /login and /register routes
  if (pathname === "/login" || pathname === "/register") {
    // If authenticated, redirect to homepage
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // If not authenticated, allow access
    return NextResponse.next();
  }
  // For other protected routes, require authentication
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/bookings", "/rooms/add", "/rooms/my", "/login", "/register"],
};
