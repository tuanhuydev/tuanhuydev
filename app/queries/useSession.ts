"use client";

import { useSignOut } from "./authQueries";
import { BASE_URL } from "@lib/configs/constants";
import { HTTP_CODE } from "@lib/shared/commons/constants/httpCode";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useFetch = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: signUserOut } = useSignOut();

  const signOut = async () => {
    await signUserOut();
    queryClient.removeQueries();
    router.replace("/auth/sign-in");
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}, retryCount = 3): Promise<any> => {
    try {
      const accessToken = queryClient.getQueryData<string>(["accessToken"]);
      const isRefreshing = queryClient.getQueryData<boolean>(["isRefreshing"]);
      // if there is no retry count, then force sign out
      if (retryCount <= 0) {
        signOut();
      }

      // if refreshing token, wait for 2 seconds before retrying
      if (isRefreshing) {
        queryClient.removeQueries({ queryKey: ["accessToken"] });
        // Wait for 2 seconds and waiting BE to update access token before retrying
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fetchWithAuth(url, options, retryCount - 1));
          }, 4000);
        });
      }

      if (!accessToken) throw new UnauthorizedError("Access token is missing");
      const headers = options.headers || {};
      const updatedOptions = {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, updatedOptions);

      if (!response.ok) {
        if (response.status !== HTTP_CODE.UNAUTHORIZED_ERROR) {
          throw new BaseError(response.statusText);
        }

        if (retryCount <= 0) {
          queryClient.setQueryData(["isRefreshing"], false);
          throw new UnauthorizedError("Unable to refresh token");
        }
        const isRefreshing = queryClient.getQueryData<boolean>(["isRefreshing"]);
        if (isRefreshing) {
          // Wait for 2 seconds and waiting BE to update access token before retrying
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(fetchWithAuth(url, options, retryCount - 1));
            }, 2000);
          });
        }
        // Set isRefreshing to true to prevent multiple refresh token requests
        queryClient.setQueryData(["isRefreshing"], true);

        // Get new access token
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/refresh-token`, { method: "POST" });
        if (!tokenResponse.ok) throw new UnauthorizedError("Unable to refresh token");

        const { data: newAccessToken } = await tokenResponse.json();
        queryClient.setQueryData(["accessToken"], newAccessToken);
        queryClient.setQueryData(["isRefreshing"], false);
        // Retry request with new access token
        return fetchWithAuth(url, options, retryCount);
      }
      return response;
    } catch (error) {
      if (error instanceof UnauthorizedError) signOut();
      throw error;
    }
  };

  return { fetch: fetchWithAuth, signOut };
};
