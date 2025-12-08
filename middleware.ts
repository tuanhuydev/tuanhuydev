import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });

  // Set CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Add caching headers to static assets
  if (
    request.nextUrl.pathname.includes("/_next/static") ||
    request.nextUrl.pathname.includes("/assets/") ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|css|js)$/)
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Add correct content type headers for fonts
  if (request.nextUrl.pathname.match(/\.(woff|woff2|ttf|otf)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ or assets/ (when they are static files)
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|assets/images/|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    // Apply to all API routes
    "/api/:path*",
  ],
};
