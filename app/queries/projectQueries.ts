import { apiWithBearer } from "@app/_utils/network";
import { BASE_URL } from "@lib/configs/constants";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Project } from "@prisma/client";
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProjectsQuery = (filter: ObjectType = {}) => {
  return useQuery({
    queryKey: ["projects"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      let url = `${BASE_URL}/api/projects`;
      if (filter) url = `${url}?${new URLSearchParams(filter).toString()}`;

      const { data = [] } = await apiWithBearer(url);
      return data;
    },
  });
};

export const useProjectQuery = (projectId: string) => {
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

export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}/tasks`);
      if (!response.ok) throw new BaseError("Unable to fetch tasks");
      const { data: tasks } = await response.json();
      return tasks;
    },
  });
};
