"use client";

import AuthApiService from "../services/AuthApiService";
import { HTTP_CODE } from "@lib/commons/constants/httpCode";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/**
 * Enhanced authenticated fetch hook with improved error handling and token management
 */
export const useFetch = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isSigningOutRef = useRef(false);

  /**
   * Sign out user and clean up auth state
   */
  const signOut = useCallback(async () => {
    if (isSigningOutRef.current) {
      return; // Prevent multiple simultaneous signouts
    }

    try {
      isSigningOutRef.current = true;

      // Call API to sign out
      await AuthApiService.signOut();

      // Clear only auth-related queries to preserve non-sensitive data
      queryClient.cancelQueries();
      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return ["accessToken", "currentUser", "permissions", "userPermissions"].includes(key);
        },
      });

      // Navigate to sign in
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if API call fails, still clean up client state
      queryClient.clear();
      router.replace("/auth/sign-in");
    } finally {
      isSigningOutRef.current = false;
    }
  }, [queryClient, router]);

  /**
   * Enhanced fetch with authentication and better error handling
   */
  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      // Prevent requests during sign out process
      if (isSigningOutRef.current) {
        throw new Error("Authentication in progress, please wait");
      }

      try {
        const accessToken = queryClient.getQueryData<string>(["accessToken"]);

        if (!accessToken) {
          const error = new UnauthorizedError("Access token is missing");
          console.warn("No access token found, signing out user");
          signOut(); // Sign out immediately for missing token
          throw error;
        }

        if (!AuthApiService.isValidTokenFormat(accessToken)) {
          const error = new UnauthorizedError("Invalid token format");
          console.warn("Invalid token format detected, signing out user");
          signOut(); // Sign out immediately for invalid token
          throw error;
        }

        // Prepare headers with authentication
        const defaultHeaders: Record<string, string> = {
          Authorization: `Bearer ${accessToken}`,
        };

        // Add Content-Type for requests with body (POST, PUT, PATCH)
        const hasBody = options.body !== undefined;
        const method = options.method?.toUpperCase();
        const needsContentType = hasBody && ["POST", "PUT", "PATCH"].includes(method || "GET");

        if (needsContentType && !(options.headers as Record<string, string>)?.["Content-Type"]) {
          defaultHeaders["Content-Type"] = "application/json";
        }

        const updatedOptions: RequestInit = {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
        };

        const response = await fetch(url, updatedOptions);

        // Handle different types of errors
        if (!response.ok) {
          if (response.status === HTTP_CODE.UNAUTHORIZED_ERROR) {
            throw new UnauthorizedError("Session expired or invalid");
          }

          // Try to extract meaningful error message
          const errorMessage = await AuthApiService.extractErrorMessage(response);
          throw new BaseError(errorMessage);
        }

        return response;
      } catch (error) {
        // Handle unauthorized errors by signing out
        if (error instanceof UnauthorizedError) {
          console.warn("Unauthorized access detected, signing out user");
          signOut(); // Don't await to avoid blocking the current request
        }
        throw error;
      }
    },
    [queryClient, signOut],
  );

  return {
    fetch: fetchWithAuth,
    signOut,
    isSigningOut: isSigningOutRef.current,
  };
};

export default useFetch;
