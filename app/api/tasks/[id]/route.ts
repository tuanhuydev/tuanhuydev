import TaskController from "@lib/controllers/TaskController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handleGetOne = withAuthMiddleware(async (request: NextRequest, params: ObjectType) =>
  TaskController.getOne(request, params),
);

const handleUpdate = withAuthMiddleware(async (request: NextRequest, params: any) => {
  return TaskController.update(request, params);
});

const handleDelete = withAuthMiddleware(async (request: NextRequest, params: any) => {
  return TaskController.delete(request, params);
});

export async function GET(request: NextRequest, { params }: any) {
  return handleGetOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return handleUpdate(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return handleDelete(request, params);
}
