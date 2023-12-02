import UserController from "@backend/controllers/UserController";
import withAuthMiddleware from "@backend/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handleUpdate = withAuthMiddleware(async (request: NextRequest, params: any) => {
  return UserController.update(request, params);
});

const handleDelete = withAuthMiddleware(async (request: NextRequest, params: any) => {
  return UserController.delete(request, params);
});

export async function GET(request: NextRequest, { params }: any) {
  return UserController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return handleUpdate(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return handleDelete(request, params);
}
