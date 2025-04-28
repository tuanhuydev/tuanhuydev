import { useFetch } from "./useSession";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "lib/commons/constants/base";
import BaseError from "lib/commons/errors/BaseError";

export const useProjectsQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/projects`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch projects");
      const { data: projects = [] } = await response.json();
      return projects;
    },
  });
};

export const useProjectQuery = (projectId: string) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch project");
      const { data: project } = await response.json();
      return project;
    },
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (formData: ObjectType) => {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new BaseError("Unable to save");
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
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
        body: JSON.stringify(restBody),
      });
      if (!response.ok) throw new BaseError("Unable to update");
      queryClient.invalidateQueries("projects" as InvalidateQueryFilters);
    },
  });
};

export const useProjectTasks = (projectId: string, filter: ObjectType = {}) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: async ({ signal }) => {
      let url = `${BASE_URL}/api/projects/${projectId}/tasks`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const response = await fetch(url, { signal });
      if (!response.ok) throw new BaseError("Unable to fetch tasks");

      const { data: tasks } = await response.json();
      return tasks;
    },
  });
};
