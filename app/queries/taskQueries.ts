import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTodayTasks = () => {
  return useQuery({
    queryKey: ["todayTasks"],
  });
};

export const useSubTasks = (taskId: string | undefined) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: ["tasks", taskId, "subTasks"],
    queryFn: async ({ signal }) => {
      if (!taskId) return [];
      const response = await fetch(`${BASE_URL}/api/tasks/${taskId}/subtasks`, { signal });
      if (!response.ok) throw new BaseError(response.statusText);
      const { data: subTasks = [] } = await response.json();
      return subTasks;
    },
  });
};

export const useUpdateTodayTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedTasks: ObjectType[]) => {
      localStorage.setItem("todayTasks", JSON.stringify(updatedTasks));
      queryClient.invalidateQueries(["todayTasks"] as InvalidateQueryFilters);
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

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
      queryClient.invalidateQueries(["tasks"] as InvalidateQueryFilters);
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async ({ id, ...restTask }: ObjectType) => {
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
  const { fetch } = useFetch();

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
