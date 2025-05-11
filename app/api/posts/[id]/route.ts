import { NextRequest } from "next/server";
import PostController from "server/controllers/PostController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return PostController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: any) {
  const params = await props.params;
  return PostController.update(request, params);
}

export async function DELETE(request: NextRequest, props: any) {
  const params = await props.params;
  return PostController.delete(request, params);
}
