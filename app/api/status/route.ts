import StatusController from "@lib/controllers/StatusController";
import withAuthMiddleware from "@lib/middlewares/authMiddleware";
import { NextRequest } from "next/server";

const handleGetAll = withAuthMiddleware(async (request: NextRequest) => StatusController.getAll(request));

const handlePost = withAuthMiddleware(async (request: NextRequest) => StatusController.store(request));

export async function GET(request: NextRequest) {
  return handleGetAll(request);
}

export async function POST(request: NextRequest) {
  return handlePost(request);
}
