import { NextRequest } from "next/server";
import StorageController from "server/controllers/StorageController";

export async function POST(request: NextRequest, props: any) {
  const params = await props.params;
  return StorageController.uploadFile(request, params);
}
