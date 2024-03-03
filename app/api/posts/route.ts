import PostController from "@lib/controllers/PostController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return PostController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
  return PostController.store(request, params);
}
