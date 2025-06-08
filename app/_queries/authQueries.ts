import { QUERY_KEYS } from "./queryKeys";
import { useFetch } from "./useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const usePermissions = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: [QUERY_KEYS.PERMISSIONS],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/permissions`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch permissions: ${response.status} ${response.statusText}`);
      }
      const { data: permissions = [] } = await response.json();
      return permissions;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

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
