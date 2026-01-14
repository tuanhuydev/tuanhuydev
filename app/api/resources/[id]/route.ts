import { NextRequest } from "next/server";
import ResourceController from "server/controllers/ResourceController";

export async function GET(request: NextRequest) {
  return ResourceController.getResource(request);
}
