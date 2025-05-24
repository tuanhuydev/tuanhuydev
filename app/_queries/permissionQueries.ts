import { useFetch } from "./useSession";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

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
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/permissions`, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch permissions");
      const { data: permissions = [] } = await response.json();
      return permissions;
    },
  });
};
