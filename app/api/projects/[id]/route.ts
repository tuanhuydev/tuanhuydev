import { NextRequest } from "next/server";
import ProjectController from "server/controllers/ProjectController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return ProjectController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: any) {
  const params = await props.params;
  return ProjectController.update(request, params);
}

export async function DELETE(request: NextRequest, props: any) {
  const params = await props.params;
  return ProjectController.delete(request, params);
}
