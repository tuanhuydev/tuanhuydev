import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUserPermission = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["currentUserPermission"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/users/me/permissions`);
      if (!response.ok) throw new BaseError("Unable to fetch permissions");

      const { data: permission = { rules: [] } } = await response.json();
      const { rules } = permission;
      const permissions: ObjectType = {};

      rules.forEach((rule: ObjectType) => {
        Object.entries(rule).forEach(([key, value]) => {
          permissions[key] = value;
        });
      });
      return permissions;
    },
  });
};
