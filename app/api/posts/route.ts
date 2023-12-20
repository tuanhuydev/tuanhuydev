import PostController from "@backend/controllers/PostController";
import withAuthMiddleware from "@backend/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handlePost = withAuthMiddleware(async (request: NextRequest, params: any) =>
  PostController.store(request, params),
);

export async function GET(request: NextRequest) {
  return PostController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
  return handlePost(request, params);
}
