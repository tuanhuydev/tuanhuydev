import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/shared/commons/constants/base";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUserPermission = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["permissions", "current"],
    placeholderData: [],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/me/permissions`, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch permissions");
      const { data: permissions = [] } = await response.json();

      return permissions.flatMap((permission: any) => permission.rules);
    },
  });
};

export const useUserPermissions = (userId: string) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["permissions", "user", userId],
    enabled: false,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/permissions`, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch permissions");
      const { data: permissions = [] } = await response.json();
      return permissions;
    },
  });
};
