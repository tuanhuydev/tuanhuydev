import { QUERY_KEYS } from "./queryKeys";
import { useFetch } from "@features/Auth";
import { Task } from "@lib/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useTodayTasks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TODAY_TASKS],
    queryFn: () => [],
    initialData: [],
  });
};

export const useSubTasks = (taskId: string | undefined) => {
  const { fetch } = useFetch();
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS, taskId, "subTasks"],
    queryFn: async ({ signal }) => {
      if (!taskId) return [];
      const response = await fetch(`${BASE_URL}/api/tasks/${taskId}/subtasks`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch subtasks: ${response.status} ${response.statusText}`);
      }
      const { data: subTasks = [] } = (await response.json()) as { data: Task[] };
      return subTasks;
    },
    enabled: !!taskId,
  });
};

export const useUpdateTodayTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedTasks: Record<string, unknown>[]) => {
      localStorage.setItem("todayTasks", JSON.stringify(updatedTasks));
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODAY_TASKS] });
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to create task: ${response.status} ${response.statusText}`);
      }

      const result = (await response.json()) as { data: Task };

      // Invalidate all task-related queries
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });

      // If task belongs to a project, invalidate project tasks
      if (data.projectId) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECTS, "detail", data.projectId, QUERY_KEYS.TASKS],
        });
      }

      return result;
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async ({ id, ...restTask }: Partial<Task>) => {
      const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restTask),
      });
      if (!response.ok) {
        throw new BaseError(`Failed to update task: ${response.status} ${response.statusText}`);
      }

      const result = (await response.json()) as { data: Task };

      // Invalidate all task-related queries
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });

      // If task belongs to a project, invalidate project tasks
      if (restTask.projectId) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECTS, "detail", restTask.projectId, QUERY_KEYS.TASKS],
        });
      }

      return result;
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
      if (!response.ok) {
        throw new BaseError(`Failed to delete task: ${response.status} ${response.statusText}`);
      }

      const result = (await response.json()) as { success: boolean };

      // Invalidate all task-related queries
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });

      // Invalidate project tasks (we don't know which project, so invalidate all)
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return queryKey.includes(QUERY_KEYS.TASKS);
        },
      });

      return result;
    },
  });
};
