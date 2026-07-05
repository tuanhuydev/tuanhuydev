import { NextRequest } from "next/server";
import { tagController } from "server/controllers/TagController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return tagController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return tagController.update(request, params);
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return tagController.delete(request, params);
}
