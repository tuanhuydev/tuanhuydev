import TaskController from "@lib/controllers/TaskController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return TaskController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return TaskController.update(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return TaskController.delete(request, params);
}
