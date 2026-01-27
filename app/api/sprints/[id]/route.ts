import { NextRequest } from "next/server";
import SprintController from "server/controllers/SprintController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return SprintController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return SprintController.update(request, params);
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return SprintController.destroy(request, params);
}
