import ProjectController from "@lib/backend/controllers/ProjectController";
import withAuthMiddleware from "@lib/backend/middlewares/authMiddleware";
import { ObjectType } from "@lib/shared/interfaces/base";
import { NextRequest } from "next/server";

const handleGetAll = withAuthMiddleware(async (request: NextRequest, params: ObjectType) =>
  ProjectController.getProjectTasks(request, params),
);

export async function GET(request: NextRequest, { params }: any) {
  return handleGetAll(request, params);
}
