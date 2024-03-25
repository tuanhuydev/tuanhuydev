import { ACCESS_TOKEN_SECRET } from "@lib/shared/commons/constants/encryption";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { JWTPayload } from "@lib/shared/interfaces/jwt";
import * as jose from "jose";

export const verifyJwt = async (jwtToken?: string): Promise<JWTPayload> => {
  const { payload } = await jose.jwtVerify(jwtToken as string, ACCESS_TOKEN_SECRET);
  if (!payload) throw new UnauthorizedError("Invalid JWT");

  const { userEmail, userId, exp } = payload as JWTPayload;
  if (!userEmail || !userId || !exp) throw new UnauthorizedError("Invalid JWT");

  return payload as JWTPayload;
};
