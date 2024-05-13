import PermissionController from "@lib/controllers/PermissionController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return PermissionController.getOne(request, params);
}
