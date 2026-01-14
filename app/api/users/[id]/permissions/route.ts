import { NextRequest } from "next/server";
import PermissionController from "server/controllers/PermissionController";
import UserController from "server/controllers/UserController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return UserController.getUserPermissions(request, params);
}

export async function PUT(request: NextRequest) {
  return PermissionController.getAll(request);
}
