import { NextRequest } from "next/server";
import TaskController from "server/controllers/TaskController";

export async function GET(request: NextRequest) {
  return TaskController.getAll(request);
}

export async function POST(request: NextRequest) {
  return TaskController.store(request);
}
