import { NextRequest } from "next/server";
import StorageController from "server/controllers/StorageController";

interface RouteParams {
  params: Promise<{ type: string }>;
}

export async function POST(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return StorageController.uploadFile(request, params);
}
