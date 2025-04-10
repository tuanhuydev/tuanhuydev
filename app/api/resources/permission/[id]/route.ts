import { NextRequest } from "next/server";
import ResourceController from "server/controllers/ResourceController";

export async function GET(request: NextRequest, { params }: any) {
  return ResourceController.getResourcesByPermission(request, params);
}
