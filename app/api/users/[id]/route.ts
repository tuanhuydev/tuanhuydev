import { NextRequest } from "next/server";
import UserController from "server/controllers/UserController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return UserController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: any) {
  const params = await props.params;
  return UserController.update(request, params);
}

export async function DELETE(request: NextRequest, props: any) {
  const params = await props.params;
  return UserController.delete(request, params);
}
