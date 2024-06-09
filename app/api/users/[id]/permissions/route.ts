import PermissionController from "@lib/controllers/PermissionController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return PermissionController.getOne(request, params);
}

export async function PUT(request: NextRequest, { params }: any) {
  return PermissionController.getAll(request);
}
