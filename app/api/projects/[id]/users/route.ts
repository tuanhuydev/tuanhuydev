import { NextRequest } from "next/server";
import ProjectController from "server/controllers/ProjectController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return ProjectController.getProjectUsers(request, params);
}
