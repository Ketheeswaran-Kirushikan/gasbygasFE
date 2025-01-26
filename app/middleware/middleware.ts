import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken");
  const userId = req.cookies.get("userId");

  // Redirect unauthenticated users to the landing page
  if (!token || !userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow only authenticated users to access `/consumer` routes
  if (req.nextUrl.pathname.startsWith(`/consumers`)) {
    const urlId = req.nextUrl.pathname.split("/")[2]; // Extract userId from URL
    if (urlId !== userId) {
      // Prevent access to other user dashboards
      return NextResponse.redirect(new URL(`/consumers/${userId}`, req.url));
    }
  }

  return NextResponse.next(); // Allow other requests
}
