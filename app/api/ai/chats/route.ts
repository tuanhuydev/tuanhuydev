import ChatSessionController from "@features/GenAI/controllers/ChatSessionController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return ChatSessionController.store(req);
}

export async function GET(req: NextRequest) {
  return ChatSessionController.getAll(req);
}
