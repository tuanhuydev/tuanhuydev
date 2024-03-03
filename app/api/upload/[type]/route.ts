import StorageController from "@lib/controllers/StorageController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: any) {
  return StorageController.uploadFile(request, params);
}
