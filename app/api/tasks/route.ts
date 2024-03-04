import TaskController from "@lib/controllers/TaskController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return TaskController.getAll(request);
}

export async function POST(request: NextRequest) {
  return TaskController.store(request);
}
