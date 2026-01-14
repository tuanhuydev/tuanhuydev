import { chatSessionController } from "@features/GenAI/controllers/ChatSessionController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return chatSessionController.store(req);
}

export async function GET(req: NextRequest) {
  return chatSessionController.getAll(req);
}
