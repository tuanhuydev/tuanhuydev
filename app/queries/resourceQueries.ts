import { useFetch } from "./useSession";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useCurrentUserResources = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["currentUserResources"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/resources/me`, { signal });
      if (!response.ok) throw new BaseError(response.statusText);

      const { data: resources = [] } = await response.json();
      return resources;
    },
  });
};
