import PermissionController from "@lib/controllers/PermissionController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return PermissionController.getAll(request);
}
