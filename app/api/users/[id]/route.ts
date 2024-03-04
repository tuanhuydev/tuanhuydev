import UserController from "@lib/controllers/UserController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return UserController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return UserController.update(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return UserController.delete(request, params);
}
