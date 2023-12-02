import ResourceController from "@lib/backend/controllers/ResourceController";
import withAuthMiddleware from "@lib/backend/middlewares/authMiddleware";
import { ObjectType } from "@lib/shared/interfaces/base";
import { NextRequest } from "next/server";

const handleGetOne = withAuthMiddleware(async (request: NextRequest, params: ObjectType) =>
  ResourceController.getResourcesByPermission(request, params),
);

export async function GET(request: NextRequest, { params }: any) {
  return handleGetOne(request, params);
}
