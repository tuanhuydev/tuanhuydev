import { NextRequest } from "next/server";
import ResourceController from "server/controllers/ResourceController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return ResourceController.getResource(request, params);
}
