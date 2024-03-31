import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUserResources = () => {
  return useQuery({
    queryKey: ["currentUserResources"],
    queryFn: async () => {
      let url = `${BASE_URL}/api/resources/me`;
      const response = await fetch(url);
      if (!response.ok) throw new BaseError(response.statusText);

      const { data: resources = [] } = await response.json();
      return resources;
    },
  });
};
