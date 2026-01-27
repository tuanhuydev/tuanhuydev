import { permissionController } from "@server/controllers/PermissionController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return permissionController.getAll(request);
}
