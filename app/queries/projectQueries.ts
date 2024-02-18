import { apiWithBearer } from "@app/_utils/network";
import { BASE_URL } from "@lib/configs/constants";
import { useQuery } from "@tanstack/react-query";

export const useProjectsQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["projects"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      let url = `${BASE_URL}/api/projects`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const { data = [] } = await apiWithBearer(url);
      return data;
    },
  });
};
