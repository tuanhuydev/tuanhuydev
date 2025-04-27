import { NextRequest } from "next/server";
import TaskController from "server/controllers/TaskController";

export async function GET(request: NextRequest, props: any) {
  const params = await props.params;
  return TaskController.getTasksByUser(request, params);
}
