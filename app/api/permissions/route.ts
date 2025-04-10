import { NextRequest } from "next/server";
import PermissionController from "server/controllers/PermissionController";

export async function GET(request: NextRequest) {
  return PermissionController.getAll(request);
}
