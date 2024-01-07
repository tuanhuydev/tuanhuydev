import ProjectController from "@lib/controllers/ProjectController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handlePost = withAuthMiddleware(async (request: NextRequest) => ProjectController.store(request));
const handleGetAll = withAuthMiddleware(async (request: NextRequest) => ProjectController.getAll(request));

export async function GET(request: NextRequest) {
  return handleGetAll(request);
}

export async function POST(request: NextRequest) {
  return handlePost(request);
}
