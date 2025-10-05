import ChatSessionController from "@features/GenAI/controllers/ChatSessionController";
import { NextRequest } from "next/server";

export const GET = (request: NextRequest, { params }: any) => {
  return ChatSessionController.get(request, params);
};

export const PATCH = (request: NextRequest, { params }: any) => {
  return ChatSessionController.update(request, params);
};
export const DELETE = (request: NextRequest, { params }: any) => {
  return ChatSessionController.delete(request, params);
};
