import { NextRequest } from "next/server";
import StorageController from "server/controllers/StorageController";

export async function POST(request: NextRequest, { params }: any) {
  return StorageController.uploadFile(request, params);
}
