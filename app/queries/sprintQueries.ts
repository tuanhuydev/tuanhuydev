import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { useQuery } from "@tanstack/react-query";

export const useSprintQuery = (projectId: string, filter: ObjectType = {}) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["sprints", projectId, filter],
    enabled: !!projectId,
    queryFn: async ({ signal }) => {
      if (!projectId) return [];
      let url = `${BASE_URL}/api/sprints`;
      if (filter) url = `${url}?${new URLSearchParams({ ...filter, projectId }).toString()}`;
      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError("Unable to get sprints");
      const { data: sprints = [] } = await response.json();
      return sprints;
    },
  });
};
