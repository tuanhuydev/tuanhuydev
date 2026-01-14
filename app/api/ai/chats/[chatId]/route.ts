import { chatSessionController } from "@features/GenAI/controllers/ChatSessionController";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ chatId: string }>;
}

export const GET = async (request: NextRequest, props: RouteParams) => {
  const params = await props.params;
  return chatSessionController.get(request, params);
};

export const PATCH = async (request: NextRequest, props: RouteParams) => {
  const params = await props.params;
  return chatSessionController.update(request, params);
};
export const DELETE = async (request: NextRequest, props: RouteParams) => {
  const params = await props.params;
  return chatSessionController.delete(request, params);
};
