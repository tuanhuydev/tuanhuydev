import StorageController from "@lib/controllers/StorageController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handlePost = withAuthMiddleware(async (request: NextRequest, params: any) =>
  StorageController.uploadFile(request, params),
);

export async function POST(request: NextRequest, { params }: any) {
  return handlePost(request, params);
}
