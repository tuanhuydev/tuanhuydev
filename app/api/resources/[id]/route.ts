import ResourceController from "@lib/controllers/ResourceController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return ResourceController.getResource(request, params);
}
