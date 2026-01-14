import { Project } from "@lib/types/project";
import { redirect } from "next/navigation";
import MongoProjectRepository from "server/repositories/MongoProjectRepository";

export const getProjects = async (filter: Record<string, unknown> = {}) => {
  const projects = (await MongoProjectRepository.getProjects(filter)) as unknown as Project[];
  return projects;
};

export const getProjectByIdAction = async (projectId: string) => {
  const project = await MongoProjectRepository.getProject(projectId);
  if (!project) {
    return redirect("/dashboard/projects");
  }
  return project as unknown as Project;
};
