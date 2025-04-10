import { NextRequest } from "next/server";
import ProjectController from "server/controllers/ProjectController";

export async function GET(request: NextRequest, { params }: any) {
  return ProjectController.getProjectsByUser(request, params);
}
