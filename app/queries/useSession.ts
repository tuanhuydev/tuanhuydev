"use client";

import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { RedirectType, redirect } from "next/navigation";

export const useFetch = () => {
  const queryClient = useQueryClient();

  const fetchWithAuth = async (url: string, options: RequestInit = {}, retryCount = 3): Promise<any> => {
    try {
      const accessToken = queryClient.getQueryData(["accessToken" as unknown as QueryKey]);
      const headers = options?.headers || {};
      const updatedOptions = {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await fetch(url, updatedOptions);
      if (!response.ok) {
        if (response.status !== 401) throw new BaseError(response.statusText);

        if (retryCount <= 0) {
          queryClient.setQueryData(["isRefreshing" as unknown as QueryKey], false);
          throw new BaseError("Unable to fetch data");
        }
        // Keep trying after 1sec while is refreshing token
        const isRefreshing = queryClient.getQueryData(["isRefreshing" as unknown as QueryKey]) ?? false;
        if (isRefreshing) {
          return new Promise((resolve) => setTimeout(() => resolve(fetchWithAuth(url, options, retryCount)), 1000));
        }

        // Set a flag to indicate that a refresh token request is in progress
        queryClient.setQueryData(["isRefreshing" as unknown as QueryKey], true);
        try {
          const tokenResponse = await fetch(`${BASE_URL}/api/auth/refresh-token`, { method: "POST" });
          if (!tokenResponse.ok) throw new UnauthorizedError(); // Redirect to sign in
          // Update the accessToken in queryClient
          const { data: newAccessToken } = await tokenResponse.json();

          queryClient.setQueryData(["accessToken" as unknown as QueryKey], newAccessToken);
          queryClient.setQueryData(["isRefreshing" as unknown as QueryKey], false);
          // Retry the request with the new accessToken
          return fetchWithAuth(url, updatedOptions, retryCount - 1);
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            window.location.href = "/auth/sign-in";
          }
          queryClient.setQueryData(["isRefreshing" as unknown as QueryKey], false);
        }
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return { fetch: fetchWithAuth };
};
