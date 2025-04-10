import { NextRequest } from "next/server";
import TaskController from "server/controllers/TaskController";

export async function GET(request: NextRequest, { params }: any) {
  return TaskController.getSubTasks(request, params);
}
