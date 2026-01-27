import { NextRequest } from "next/server";
import TaskController from "server/controllers/TaskController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return TaskController.getTasksByUser(request, params);
}
