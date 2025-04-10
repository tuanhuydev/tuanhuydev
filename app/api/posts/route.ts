import { NextRequest } from "next/server";
import PostController from "server/controllers/PostController";

export async function GET(request: NextRequest) {
  return PostController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
  return PostController.store(request, params);
}
