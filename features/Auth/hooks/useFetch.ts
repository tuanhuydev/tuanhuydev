"use client";

import AuthApiService from "../services/AuthApiService";
import { HTTP_CODE } from "@lib/commons/constants/httpCode";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const clearAccessToken = (): void => {
  try {
    localStorage.removeItem("accessToken");
  } catch {
    // ignore
  }
};

export const useFetch = () => {
  const router = useRouter();
  const isSigningOutRef = useRef(false);

  const signOut = useCallback(async () => {
    if (isSigningOutRef.current) return;
    try {
      isSigningOutRef.current = true;
      await AuthApiService.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      clearAccessToken();
      isSigningOutRef.current = false;
      router.replace("/auth/sign-in");
    }
  }, [router]);

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      if (isSigningOutRef.current) throw new Error("Authentication in progress, please wait");

      const accessToken = getAccessToken();

      if (!accessToken || !AuthApiService.isValidTokenFormat(accessToken)) {
        void signOut();
        throw new UnauthorizedError("Access token is missing or invalid");
      }

      const method = options.method?.toUpperCase();
      const hasBody = options.body !== undefined;
      const needsContentType = hasBody && ["POST", "PUT", "PATCH"].includes(method ?? "GET");

      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        ...(needsContentType ? { "Content-Type": "application/json" } : {}),
        ...(options.headers as Record<string, string>),
      };

      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const isAuthEndpoint = url.includes("/users/me") || url.includes("/permissions");
        if (
          response.status === HTTP_CODE.UNAUTHORIZED_ERROR ||
          (isAuthEndpoint && (response.status === 403 || response.status === 404))
        ) {
          void signOut();
          throw new UnauthorizedError("Session expired or invalid");
        }
        const errorMessage = await AuthApiService.extractErrorMessage(response);
        throw new BaseError(errorMessage);
      }

      return response;
    },
    [signOut],
  );

  return { fetch: fetchWithAuth, signOut };
};

export default useFetch;
