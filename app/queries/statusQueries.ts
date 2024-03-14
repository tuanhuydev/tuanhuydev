import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStatusQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      let url = `${BASE_URL}/api/status`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new BaseError("Unable to get status");
      const { data: status } = await response.json();
      return status;
    },
  });
};

export const useCreateStatusMutation = () => {
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
      if (!response.ok) throw new BaseError("Unable to create status");
      queryClient.invalidateQueries("status" as InvalidateQueryFilters);
    },
  });
};

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: any) => {
      const response = await fetch(`${BASE_URL}/api/status/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new BaseError("Unable to update status");
      queryClient.invalidateQueries("status" as InvalidateQueryFilters);
    },
  });
};

export const useDeleteStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${BASE_URL}/api/status/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new BaseError("Unable to delete status");
      queryClient.invalidateQueries("status" as InvalidateQueryFilters);
    },
  });
};
