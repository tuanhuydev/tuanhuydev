import { userController } from "@server/controllers/UserController";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return userController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return userController.update(request, params);
}

export async function DELETE(request: NextRequest) {
  return userController.delete(request);
}
