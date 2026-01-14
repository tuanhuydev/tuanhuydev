import { NextRequest } from "next/server";
import ProjectController from "server/controllers/ProjectController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return ProjectController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return ProjectController.update(request, params);
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return ProjectController.delete(request, params);
}
