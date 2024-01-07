import ProjectController from "@lib/controllers/ProjectController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { ObjectType } from "@lib/shared/interfaces/base";
import { NextRequest } from "next/server";

const handleGetAll = withAuthMiddleware(async (request: NextRequest, params: ObjectType) =>
  ProjectController.getProjectTasks(request, params),
);

export async function GET(request: NextRequest, { params }: any) {
  return handleGetAll(request, params);
}
