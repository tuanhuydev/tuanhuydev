import { verifyJwt } from "@app/_utils/network";
import LogService from "@lib/services/LogService";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { JWTPayload } from "@lib/shared/interfaces/jwt";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

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

export async function dashboardMiddleware(request: NextRequest) {
  try {
    const jwt = cookies().get("jwt");
    if (!jwt) throw new UnauthorizedError("No JWT found");

    const data = await verifyJwt(jwt?.value);
    if (!data) throw new UnauthorizedError("Invalid JWT");

    const { userId, exp } = data as JWTPayload;

    if (!userId) throw new UnauthorizedError("User not found");

    if (exp < Date.now() / 1000) throw new UnauthorizedError("JWT Expired");
    return NextResponse.next();
  } catch (error) {
    LogService.log(`[ERROR]: ${(error as Error).message}`);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
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
    !pathname.startsWith("/api/auth/sign-out") &&
    !pathname.startsWith("/api/auth/refresh-token") &&
    !pathname.startsWith("/api/posts")
  ) {
    return apiMiddleware(request);
  }
}
