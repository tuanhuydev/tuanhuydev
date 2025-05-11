import { useFetch } from "./useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

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
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new BaseError("Unable to mutate sprint");
      queryClient.invalidateQueries({
        queryKey: ["sprints"],
      });
    },
  });
};
