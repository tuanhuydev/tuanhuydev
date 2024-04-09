import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const useFetch = () => {
  const queryClient = useQueryClient();

  const fetchWithAuth = async (url: string, options: RequestInit = {}, retryCount = 3): Promise<any> => {
    const accessToken = queryClient.getQueryData(["accessToken" as unknown as QueryKey]);
    if (!accessToken) throw new BaseError("Access token is missing");
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
      if (retryCount > 0) {
        // Retry the request by calling /refresh-token
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/refresh-token`, { method: "POST" });
        if (!tokenResponse.ok) throw new BaseError(tokenResponse.statusText); // Redirect to sign in
        const { data: newAccessToken } = await tokenResponse.json();
        // Update the accessToken in queryClient
        queryClient.setQueryData(["accessToken" as unknown as QueryKey], newAccessToken);

        // Retry the request with the new accessToken
        return fetchWithAuth(url, updatedOptions, retryCount - 1);
      } else {
        throw new BaseError("Failed to refresh token");
      }
    }
    return response;
  };

  return { fetch: fetchWithAuth };
};
