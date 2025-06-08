import { QUERY_KEYS } from "./queryKeys";
import { useFetch } from "./useSession";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useCurrentUserPermission = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: [QUERY_KEYS.PERMISSIONS, "current"],
    placeholderData: [],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me/permissions`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch permissions: ${response.status} ${response.statusText}`);
      }
      const { data: permissions = [] } = await response.json();

      return permissions.flatMap((permission: any) => permission.rules);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useUserPermissions = (userId: string) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: [QUERY_KEYS.PERMISSIONS, "user", userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/permissions`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch user permissions: ${response.status} ${response.statusText}`);
      }
      const { data: permissions = [] } = await response.json();
      return permissions;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
