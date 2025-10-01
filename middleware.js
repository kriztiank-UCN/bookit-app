// This middleware checks if the user is authenticated or admin before allowing access to certain routes.
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

  // Protect /rooms/add & /rooms/my routes, these are for admin only
  if (pathname === "/rooms/add" || pathname === "/rooms/my") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Check if user is admin
    const { isAdmin } = await import("./app/actions/checkAdmin").then(mod => mod.default());
    if (!isAdmin) {
      // Redirect non-admins to homepage or show error
      return NextResponse.redirect(new URL("/", request.url));
    }
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
