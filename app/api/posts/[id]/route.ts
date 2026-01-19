import { NextRequest } from "next/server";
import { postController } from "server/controllers/PostController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return postController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return postController.update(request, params);
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return postController.delete(request, params);
}
