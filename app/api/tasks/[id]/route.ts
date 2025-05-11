import { NextRequest } from "next/server";
import TaskController from "server/controllers/TaskController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return TaskController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: any) {
  const params = await props.params;
  return TaskController.update(request, params);
}

export async function DELETE(request: NextRequest, props: any) {
  const params = await props.params;
  return TaskController.delete(request, params);
}
