import { QUERY_KEYS } from "./queryKeys";
import { useFetch } from "@features/Auth";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useCurrentUserResources = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: [QUERY_KEYS.RESOURCES, "current"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/resources/me`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch resources: ${response.status} ${response.statusText}`);
      }

      const { data: resources = [] } = await response.json();
      return resources;
    },
  });
};
