import ProjectController from "@lib/controllers/ProjectController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handlePost = withAuthMiddleware(async (request: NextRequest) => ProjectController.store(request));

export async function GET(request: NextRequest) {
  return ProjectController.getAll(request);
}

export async function POST(request: NextRequest) {
  return handlePost(request);
}
