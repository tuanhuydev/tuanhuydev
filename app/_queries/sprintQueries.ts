import { QUERY_KEYS, createStableQueryKey } from "./queryKeys";
import { useFetch } from "./useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useSprintQuery = (projectId: string, filter: ObjectType = {}) => {
  const { fetch } = useFetch();
  const stableQueryKey = createStableQueryKey([], filter);

  return useQuery({
    queryKey: [QUERY_KEYS.SPRINTS, projectId, stableQueryKey],
    enabled: !!projectId,
    queryFn: async ({ signal }) => {
      if (!projectId) return [];
      let url = `${BASE_URL}/api/sprints`;
      if (Object.keys(filter).length > 0) {
        const params = new URLSearchParams();
        Object.entries({ ...filter, projectId }).forEach(([key, value]) => {
          if (value != null && value !== "") {
            params.append(key, String(value));
          }
        });
        if (params.toString()) {
          url = `${url}?${params.toString()}`;
        }
      } else {
        url = `${url}?projectId=${projectId}`;
      }
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch sprints: ${response.status} ${response.statusText}`);
      }
      const { data: sprints = [] } = await response.json();
      return sprints;
    },
  });
};

export type MutationParams = {
  body: ObjectType;
  method: "POST" | "PUT" | "DELETE";
};

export const useMutateSprint = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async ({ body, method = "POST" }: MutationParams) => {
      let url = `${BASE_URL}/api/sprints`;
      if (body.id) {
        url = `${url}/${body.id}`;
      }
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to mutate sprint: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Invalidate all sprint-related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPRINTS] });

      // If sprint belongs to a project, invalidate project sprints
      if (body.projectId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECTS, body.projectId, QUERY_KEYS.SPRINTS],
        });
      }

      return result;
    },
  });
};
