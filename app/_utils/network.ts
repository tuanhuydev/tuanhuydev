import { ACCESS_TOKEN_SECRET } from "@lib/shared/commons/constants/encryption";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { JWTPayload } from "@lib/shared/interfaces/jwt";
import * as jose from "jose";
import { NextRequest } from "next/server";

export const decryptJwt = async (jwtToken: string, secretKey: string) => {
  try {
    const decodedKey = new TextEncoder().encode(secretKey);

    const { payload } = await jose.jwtVerify(jwtToken, decodedKey);
    if (!payload) throw new UnauthorizedError("Invalid JWT");

    const { userEmail, userId, exp } = payload as JWTPayload;
    if (!userEmail || !userId || !exp) throw new UnauthorizedError("Invalid JWT");

    return payload as JWTPayload;
  } catch (error) {
    throw new UnauthorizedError("Invalid JWT");
  }
};

export const encryptJwt = async (payload: ObjectType, secretKey: string = "secretKey", lifeTime: string = "15m") => {
  const encodedKey = new TextEncoder().encode(secretKey);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(lifeTime)
    .sign(encodedKey);
};

export const extractBearerToken = (request: NextRequest) => {
  const header = request.headers.get("Authorization");
  if (!header) throw new UnauthorizedError("No Authorization Header");

  const token = header.split(/\s+/)[1];
  if (!token) throw new UnauthorizedError("No Token");

  return decryptJwt(token, ACCESS_TOKEN_SECRET as unknown as string);
};
