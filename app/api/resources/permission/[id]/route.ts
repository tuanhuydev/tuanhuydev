import { NextRequest } from "next/server";
import ResourceController from "server/controllers/ResourceController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return ResourceController.getResourcesByPermission(request, params);
}
