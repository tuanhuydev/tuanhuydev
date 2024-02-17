import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { useQuery } from "@tanstack/react-query";

export const useProjectsQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["projects"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      let url = `${BASE_URL}/api/projects`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;
      const response: any = await fetch(url);

      if (response?.status === 401) throw new UnauthorizedError("Projects not found");
      if (!response.ok) throw new BaseError("Projects not found");

      const { data = [] } = await response.json();
      return data;
    },
  });
};
