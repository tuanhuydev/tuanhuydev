import { ACCESS_TOKEN_SECRET } from "@lib/shared/commons/constants/encryption";
import Network from "@lib/shared/utils/network";
import BaseError from "@shared/commons/errors/BaseError";
import UnauthorizedError from "@shared/commons/errors/UnauthorizedError";
import { extractTokenFromRequest } from "@shared/utils/helper";
import * as jose from "jose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const withAuthMiddleware =
  (handler: Function) =>
  async (req: NextRequest, params: any = {}) => {
    const network = Network(req);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
      const authorization: string | null = headers().get("authorization");
      if (!authorization) throw new UnauthorizedError("Token not found");

      const accessToken = extractTokenFromRequest(authorization);
      const { payload } = await jose.jwtVerify(accessToken, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });
      const { userId, exp } = payload as { userId: string; exp: number };

      const invalidSecret = !payload || typeof payload !== "object" || !userId;
      const isTokenExpired = invalidSecret || (exp as number) < currentTimestamp;
      if (isTokenExpired) throw new UnauthorizedError("Token expired");

      return await handler(req, { ...params, userId: "userId" });
    } catch (error) {
      const isBaseError = error instanceof BaseError;
      return network.failResponse(isBaseError ? error : new UnauthorizedError((error as Error).message));
    }
  };

export default withAuthMiddleware;
