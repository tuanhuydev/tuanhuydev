import { NextRequest } from "next/server";
import { postController } from "server/controllers/PostController";

export async function GET(request: NextRequest) {
  return postController.getAll(request);
}

export async function POST(request: NextRequest) {
  return postController.store(request);
}
