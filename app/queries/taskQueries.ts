import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Task } from "@prisma/client";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTasksQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      let url = `${BASE_URL}/api/tasks`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new BaseError(response.statusText);
      const { data: tasks = [] } = await response.json();
      return tasks;
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ObjectType) => {
      const response = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new BaseError(response.statusText);
      queryClient.invalidateQueries("tasks" as InvalidateQueryFilters);
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...restTask }: Partial<Task>) => {
      const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restTask),
      });
      if (!response.ok) throw new BaseError(response.statusText);
      queryClient.invalidateQueries("tasks" as InvalidateQueryFilters);
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new BaseError(response.statusText);
      queryClient.invalidateQueries("tasks" as InvalidateQueryFilters);
    },
  });
};
