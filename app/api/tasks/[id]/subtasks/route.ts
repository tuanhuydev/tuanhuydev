import TaskController from "@lib/controllers/TaskController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return TaskController.getSubTasks(request, params);
}
