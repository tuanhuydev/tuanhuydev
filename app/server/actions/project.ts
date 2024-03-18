"use server";

import { verifyJwt } from "@app/_utils/network";
import ProjectService from "@lib/services/ProjectService";
import { JWTPayload } from "@lib/shared/interfaces/jwt";
import { Project } from "@prisma/client";
import { cookies } from "next/headers";

export const getProjectsByUser = async (): Promise<Project[]> => {
  const jwt = cookies().get("jwt")?.value;
  const { userId }: JWTPayload = await verifyJwt(jwt);

  const projects = (await ProjectService.getProjectsByUser(userId)) || [];
  return projects;
};
