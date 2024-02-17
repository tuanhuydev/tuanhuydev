import TaskController from "@lib/controllers/TaskController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handleGetAll = withAuthMiddleware(async (request: NextRequest) => TaskController.getAll(request));

export async function GET(request: NextRequest) {
  return handleGetAll(request);
}

export async function POST(request: NextRequest) {
  return TaskController.store(request);
}
