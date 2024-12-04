import { NextResponse } from "next/server";

export async function middleware(request) {
  // const { pathname } = request.nextUrl;
  // console.log(`Requested page: ${pathname}`);

  // Auththentication mock
  const isAuthenticated = false;
  // if not authenticated, redirect to login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/bookings"],
};