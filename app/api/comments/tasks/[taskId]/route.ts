import CommentController from "@server/controllers/CommentController";
import { NextRequest } from "next/server";

type Params = Promise<{ taskId: string }>;

export async function POST(request: NextRequest, segment: { params: Params }) {
  const params = await segment.params;
  return CommentController.createTaskComment(request, params);
}

export async function GET(request: NextRequest, segment: { params: Params }) {
  const params = await segment.params;
  return CommentController.getCommentsByTaskId(request, params);
}
