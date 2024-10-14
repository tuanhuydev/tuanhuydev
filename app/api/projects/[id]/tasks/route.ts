import ProjectController from "@lib/controllers/ProjectController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return ProjectController.getProjectTasks(request, params);
}
