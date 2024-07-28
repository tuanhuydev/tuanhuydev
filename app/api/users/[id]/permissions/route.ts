import PermissionController from "@lib/controllers/PermissionController";
import UserController from "@lib/controllers/UserController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return UserController.getUserPermissions(request, params);
}

export async function PUT(request: NextRequest, { params }: any) {
  return PermissionController.getAll(request);
}
