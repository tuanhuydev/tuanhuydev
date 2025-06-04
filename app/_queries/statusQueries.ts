import { QUERY_KEYS, createStableQueryKey } from "./queryKeys";
import { useFetch } from "./useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useStatusQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();
  const stableQueryKey = createStableQueryKey([], filter);

  return useQuery({
    queryKey: [QUERY_KEYS.STATUS, stableQueryKey],
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/status`;
      if (Object.keys(filter).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
          if (value != null && value !== "") {
            params.append(key, String(value));
          }
        });
        if (params.toString()) {
          url = `${url}?${params.toString()}`;
        }
      }
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch status: ${response.status} ${response.statusText}`);
      }
      const { data: status } = await response.json();
      return status;
    },
  });
};

export const useCreateStatusMutation = () => {
  const { fetch } = useFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: any) => {
      const response = await fetch(`${BASE_URL}/api/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to create status: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS] });
      return result;
    },
  });
};

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (params: any) => {
      const response = await fetch(`${BASE_URL}/api/status/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS] });
      return result;
    },
  });
};

export const useDeleteStatusMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${BASE_URL}/api/status/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new BaseError(`Failed to delete status: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS] });
      return result;
    },
  });
};
