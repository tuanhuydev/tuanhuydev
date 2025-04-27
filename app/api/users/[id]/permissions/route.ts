import { NextRequest } from "next/server";
import PermissionController from "server/controllers/PermissionController";
import UserController from "server/controllers/UserController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return UserController.getUserPermissions(request, params);
}

export async function PUT(request: NextRequest, { params }: any) {
  return PermissionController.getAll(request);
}
