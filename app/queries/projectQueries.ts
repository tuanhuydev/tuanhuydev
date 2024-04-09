import { useFetch } from "./useSession";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Project } from "@prisma/client";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProjectsQuery = (filter: ObjectType = {}) => {
  const { fetch } = useFetch();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      let url = `${BASE_URL}/api/projects`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const response = await fetch(url);
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
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`);
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
      queryClient.invalidateQueries("projects" as InvalidateQueryFilters);
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { fetch } = useFetch();

  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const response = await fetch(`${BASE_URL}/api/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify(project),
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
    queryFn: async () => {
      let url = `${BASE_URL}/api/projects/${projectId}/tasks`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new BaseError("Unable to fetch tasks");

      const { data: tasks } = await response.json();
      return tasks;
    },
  });
};
