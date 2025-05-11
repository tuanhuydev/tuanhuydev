import { NextRequest } from "next/server";
import CommentController from "server/controllers/CommentController";

export async function GET(request: NextRequest) {
  return CommentController.getAll(request);
}
