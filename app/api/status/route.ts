import StatusController from "@lib/controllers/StatusController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const getAll = withAuthMiddleware(async (request: NextRequest) => StatusController.getAll(request));

export async function GET(request: NextRequest, { params }: any) {
  return getAll(request, params);
}
