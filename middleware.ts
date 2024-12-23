import { extractBearerToken } from "@app/_utils/network";
import LogService from "@lib/services/LogService";
import { NextRequest } from "next/server";

export async function apiMiddleware(request: NextRequest) {
  try {
    await extractBearerToken(request);
  } catch (error: any) {
    LogService.log(`[MIDDLEWARE ERROR]: ${(error as Error).message}, ${request.url}`);
    return Response.json({ success: false, message: "Authorization Failed" }, { status: 401 });
  }
}

const publicPaths = ["/api/auth/sign-in", "/api/auth/sign-out", "/api/auth/refresh-token", "/api/posts", "/api/mongo"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api") && !publicPaths.some((path) => pathname.startsWith(path))) {
    return apiMiddleware(request);
  }
}
