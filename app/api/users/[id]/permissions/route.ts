import { permissionController } from "@server/controllers/PermissionController";
import { userController } from "@server/controllers/UserController";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return userController.getUserPermissions(request, params);
}

export async function PUT(request: NextRequest) {
  return permissionController.getAll(request);
}
