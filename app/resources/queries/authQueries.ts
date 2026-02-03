import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/api/auth/sign-out`, { method: "POST" });
      if (!response.ok) {
        throw new BaseError(`Sign out failed: ${response.status} ${response.statusText}`);
      }
      return response;
    },
    onSuccess: () => {
      // Clear all cached data on sign out
      queryClient.clear();
    },
  });
};
