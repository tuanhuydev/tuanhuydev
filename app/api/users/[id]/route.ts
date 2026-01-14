import { NextRequest } from "next/server";
import UserController from "server/controllers/UserController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return UserController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return UserController.update(request, params);
}

export async function DELETE() {
  return UserController.delete();
}
