import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // Safely get the token
  const userId = req.cookies.get("userId")?.value; // Safely get the userId

  // Redirect unauthenticated users to the login page
  if (!token || !userId) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to the login page
  }

  // Handle `/consumers` route protection
  if (req.nextUrl.pathname.startsWith(`/consumers`)) {
    const urlId = req.nextUrl.pathname.split("/")[2]; // Extract userId from the URL
    if (urlId !== userId) {
      // Redirect to the authenticated user's correct dashboard
      return NextResponse.redirect(new URL(`/consumers/${userId}`, req.url));
    }
  }

  // Handle `/dispatch` route protection
  if (req.nextUrl.pathname.startsWith(`/dispatch`)) {
    const urlId = req.nextUrl.pathname.split("/")[2]; // Extract userId from the URL
    if (urlId !== userId) {
      // Redirect to the authenticated user's correct dashboard
      return NextResponse.redirect(new URL(`/dispatch/${userId}`, req.url));
    }
  }

  // Handle `/outlets` route protection
  if (req.nextUrl.pathname.startsWith(`/outlets`)) {
    const urlId = req.nextUrl.pathname.split("/")[2]; // Extract userId from the URL
    if (urlId !== userId) {
      // Redirect to the authenticated user's correct dashboard
      return NextResponse.redirect(new URL(`/outlets/${userId}`, req.url));
    }
  }

  // Allow other requests to proceed
  return NextResponse.next();
}
