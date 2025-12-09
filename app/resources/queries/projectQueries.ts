import { QUERY_KEYS, createInvalidationHandler, createStableQueryKey } from "./queryKeys";
import { useFetch } from "@features/Auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";
import { useMemo } from "react";

export const useProjectsQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();

  // Create stable query key to prevent unnecessary refetches
  const queryKey = createStableQueryKey([QUERY_KEYS.PROJECTS, "list"], filter);

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
      }, {} as ObjectType);

      if (Object.keys(validFilter).length > 0) {
        url = `${url}?${new URLSearchParams(validFilter).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }

      const { data: projects = [] } = await response.json();
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

      const { data: project } = await response.json();
      return project;
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (formData: ObjectType) => {
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

      return response.json();
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
    mutationFn: async ({ id, ...restBody }: Partial<ObjectType>) => {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restBody),
      });

      if (!response.ok) {
        throw new BaseError(`Failed to update project: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS, "list"],
      });
      queryClient.setQueryData([QUERY_KEYS.PROJECTS, "list"], (oldList: any[] = []) => {
        if (!variables.id) return oldList;
        return oldList.map((project) => (project.id === variables.id ? { ...project, ...variables } : project));
      });
      const projectIdForInvalidation = variables.id ? String(variables.id) : null;

      if (projectIdForInvalidation) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECTS, "detail", projectIdForInvalidation],
        });

        queryClient.invalidateQueries({
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

      return response.json();
    },
    onSuccess: (data, projectId) => {
      // Remove deleted project from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.PROJECTS, "detail", projectId],
      });

      // Invalidate project lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      });
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });
};

export const useProjectTasks = (projectId: string, filter: ObjectType = {}) => {
  const { fetch } = useFetch();

  // Create stable query key with filter
  const queryKey = useMemo(
    () => createStableQueryKey([QUERY_KEYS.PROJECTS, "detail", projectId, QUERY_KEYS.TASKS], filter),
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
      }, {} as ObjectType);

      if (Object.keys(validFilter).length > 0) {
        url = `${url}?${new URLSearchParams(validFilter).toString()}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new BaseError(`Failed to fetch project tasks: ${response.status} ${response.statusText}`);
      }

      const { data: tasks } = await response.json();
      return tasks;
    },
    enabled: !!projectId,
  });
};
