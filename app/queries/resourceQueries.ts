import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUserResources = () => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["currentUserResources"],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/resources/me`);
      if (!response.ok) throw new BaseError(response.statusText);

      const { data: resources = [] } = await response.json();
      return resources;
    },
  });
};
