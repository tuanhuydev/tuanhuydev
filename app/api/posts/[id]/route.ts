import PostController from "@lib/controllers/PostController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return PostController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return PostController.update(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return PostController.delete(request, params);
}
