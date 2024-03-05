import { verifyJwt } from "@app/_utils/network";
import LogService from "@lib/services/LogService";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export type JWTPayload = {
  userId: string;
  userEmail: string;
  iat: number;
  exp: number;
};

export function dashboardMiddleware(request: NextRequest) {
  if (!request.cookies.has("jwt")) {
    LogService.log("[ERROR]: No JWT found");
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export async function apiMiddleware(request: NextRequest) {
  try {
    const jwt = cookies().get("jwt");
    if (!jwt) throw new UnauthorizedError("No JWT found");

    await verifyJwt(jwt?.value);
  } catch (error: any) {
    LogService.log(`[MIDDLEWARE ERROR]: ${(error as Error).message}, ${request.url}`);
    return Response.json({ success: false, message: "Authentication Failed" }, { status: 401 });
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard")) {
    return dashboardMiddleware(request);
  }
  if (
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth/sign-in") &&
    !pathname.startsWith("/api/auth/refresh-token") &&
    !pathname.startsWith("/api/posts")
  ) {
    return apiMiddleware(request);
  }
}
