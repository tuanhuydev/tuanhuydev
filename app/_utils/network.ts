import { BASE_URL, STORAGE_CREDENTIAL_KEY } from "@lib/configs/constants";
import { ACCESS_TOKEN_LIFE, ACCESS_TOKEN_SECRET } from "@lib/shared/commons/constants/encryption";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { getLocalStorage } from "@lib/shared/utils/dom";
import * as jose from "jose";
import Cookies from "js-cookie";
import { JWTPayload } from "middleware";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const apiWithBearer = async (
  url: string,
  options: ObjectType = { headers: { "Content-Type": "application/json" } },
) => {
  const request = await fetch(url, options);
  if (!request.ok && request.status === 401) {
    // Refresh the access token using the refresh token
    const token: string = getLocalStorage(STORAGE_CREDENTIAL_KEY);
    if (!token) throw new UnauthorizedError();

    const refreshTokenRequest = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    if (!refreshTokenRequest.ok) throw new UnauthorizedError();

    const { data: newAccessToken } = await refreshTokenRequest.json();
    if (!newAccessToken) throw new UnauthorizedError();

    // Update the request headers with the new access token
    Cookies.set("jwt", newAccessToken, { expires: ACCESS_TOKEN_LIFE });

    // Re-fetch the request with the updated headers
    options.headers.Authorization = `Bearer ${newAccessToken}`;
    return fetch(url, options);
  }
  if (!request.ok) throw new BaseError(request.statusText, request.status);

  const response = await request.json();
  return response;
};

export const verifyJwt = async (jwtToken?: RequestCookie): Promise<JWTPayload> => {
  if (!jwtToken) throw new UnauthorizedError("No JWT found");

  const { value: accessToken } = jwtToken;
  const { payload } = await jose.jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
  if (!payload) throw new UnauthorizedError("Invalid JWT");

  const { userEmail, userId, exp } = payload as JWTPayload;
  if (!userEmail || !userId || !exp) throw new UnauthorizedError("Invalid JWT");

  return payload as JWTPayload;
};
