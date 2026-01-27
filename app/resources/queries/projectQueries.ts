import { QUERY_KEYS, QueryKey, createInvalidationHandler, createStableQueryKey } from "./queryKeys";
import { useFetch } from "@features/Auth";
import { Project } from "@lib/types/project";
import { Task } from "@lib/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";
import { useMemo } from "react";

export const useProjectsQuery = (filter: Record<string, unknown> = {}) => {
  const { fetch } = useFetch();

  // Create stable query key to prevent unnecessary refetches
  const queryKey = createStableQueryKey([QUERY_KEYS.PROJECTS, "list" as QueryKey], filter);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/projects`;

      // Build query string from filter
      const validFilter = Object.entries(filter).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      if (Object.keys(validFilter).length > 0) {
        url = `${url}?${new URLSearchParams(validFilter as Record<string, string>).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }

      const { data: projects = [] } = (await response.json()) as { data: Project[] };
      return projects;
    },
  });
};

export const useProjectQuery = (projectId: string) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, "detail", projectId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch project: ${response.status} ${response.statusText}`);
      }

      const { data: project } = (await response.json()) as { data: Project };
      return project;
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new BaseError(`Failed to create project: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<{ data: Project }>;
    },
    onSuccess: createInvalidationHandler(queryClient, [
      [QUERY_KEYS.PROJECTS],
      [QUERY_KEYS.CURRENT_USER, QUERY_KEYS.PROJECTS],
    ]),
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async ({ id, ...restBody }: Partial<Record<string, unknown>>) => {
      const response = await fetch(`${BASE_URL}/api/projects/${id as string}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restBody),
      });

      if (!response.ok) {
        throw new BaseError(`Failed to update project: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<{ data: Project }>;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS, "list" as QueryKey],
      });
      queryClient.setQueryData([QUERY_KEYS.PROJECTS, "list"], (oldList: Project[] = []) => {
        if (!variables.id) return oldList;
        return oldList.map((project) => (project.id === variables.id ? { ...project, ...variables } : project));
      });
      const projectIdForInvalidation = variables.id ? String(variables.id as string) : null;

      if (projectIdForInvalidation) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECTS, "detail", projectIdForInvalidation],
        });

        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECTS, "detail", projectIdForInvalidation, QUERY_KEYS.TASKS],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new BaseError(`Failed to delete project: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<{ success: boolean }>;
    },
    onSuccess: async (_, projectId) => {
      // Remove deleted project from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.PROJECTS, "detail", projectId],
      });

      // Invalidate project lists
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      });
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });
};

export const useProjectTasks = (projectId: string, filter: Record<string, unknown> = {}) => {
  const { fetch } = useFetch();

  // Create stable query key with filter
  const queryKey = useMemo(
    () =>
      createStableQueryKey(
        [QUERY_KEYS.PROJECTS, "detail" as QueryKey, projectId as QueryKey, QUERY_KEYS.TASKS],
        filter,
      ),
    [projectId, filter],
  );

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/projects/${projectId}/tasks`;

      // Build query string from filter
      const validFilter = Object.entries(filter).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      if (Object.keys(validFilter).length > 0) {
        url = `${url}?${new URLSearchParams(validFilter as Record<string, string>).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch project tasks: ${response.status} ${response.statusText}`);
      }

      const { data: tasks } = (await response.json()) as { data: Task[] };
      return tasks;
    },
    enabled: !!projectId,
  });
};
