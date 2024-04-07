import { extractBearerToken, verifyJwt } from "@app/_utils/network";
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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth/sign-in") &&
    !pathname.startsWith("/api/auth/sign-out") &&
    !pathname.startsWith("/api/auth/refresh-token") &&
    !pathname.startsWith("/api/posts")
  ) {
    return apiMiddleware(request);
  }
}
