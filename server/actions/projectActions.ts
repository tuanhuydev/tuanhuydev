import MongoProjectRepository from "@lib/repositories/MongoProjectRepository";
import { redirect } from "next/navigation";

export const getProjectByIdAction = async (projectId: string) => {
  const project = await MongoProjectRepository.getProject(projectId);
  if (!project) {
    return redirect("/dashboard/projects");
  }
  const { _id, ...restProject } = project;
  return { id: _id.toString(), ...restProject } as unknown as Project;
};
