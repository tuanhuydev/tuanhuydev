import chatSessionService, { type ChatSessionService } from "../services/ChatSessionService";
import { JWTPlayload } from "@features/Auth/models/jwt";
import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthenticatedError from "@lib/commons/errors/UnauthenticatedError";
import { BaseController } from "@lib/interfaces/controller";
import Network from "@lib/utils/network";
import authService from "@server/services/AuthService";
import { GeminiService } from "@server/services/GeminiService";
import logService from "@server/services/LogService";
import { NextRequest } from "next/server";

interface RouteParams {
  chatId?: string;
}

class ChatSessionController implements BaseController {
  static #instance: ChatSessionController;
  #chatSessionService: ChatSessionService;

  static makeInstance(chatSessionService: ChatSessionService) {
    if (!ChatSessionController.#instance) {
      ChatSessionController.#instance = new ChatSessionController(chatSessionService);
    }
    return ChatSessionController.#instance;
  }

  constructor(chatSessionService: ChatSessionService) {
    this.#chatSessionService = chatSessionService;
  }

  async store(req: NextRequest, params?: RouteParams) {
    const network = new Network(req);
    const requestId = crypto.randomUUID();

    try {
      logService.log("Creating chat session:", { requestId });
      const { id: userId }: JWTPlayload = (await authService.getCurrentUserProfile()) || {};
      if (!userId) {
        throw new UnauthenticatedError("User not authenticated");
      }

      const body = await network.getBody();
      const { prompt, model } = body;

      if (!prompt) {
        throw new BadRequestError("Prompt is required");
      }

      const result = await this.#chatSessionService.createChatSessionWithPrompt({
        userId,
        prompt,
        model: model || "gemini-2.5-flash",
      });

      logService.log("Chat session created successfully:", { requestId, sessionId: result.sessionId });
      return network.successResponse({
        id: result.sessionId,
        name: result.sessionName,
      });
    } catch (error) {
      logService.error("Error creating chat session:", { requestId, error });
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(req: NextRequest, params?: any) {
    const network = new Network(req);
    try {
      const userProfile = await authService.getCurrentUserProfile();
      if (!userProfile?.id) {
        throw new UnauthenticatedError("User not authenticated");
      }
      const { id: userId } = userProfile;
      const chatSessions = await this.#chatSessionService.getChatSessions({ userId });
      return network.successResponse(chatSessions);
    } catch (error) {
      logService.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async get(req: NextRequest, params: Promise<RouteParams>) {
    const network = new Network(req);
    const requestId = crypto.randomUUID();
    try {
      const { chatId } = await params;
      if (!chatId) {
        throw new BadRequestError("Session ID is required");
      }
      logService.log("Getting chat session:", { requestId, chatId });
      const currentUser: JWTPlayload = await authService.getCurrentUserProfile();
      if (!currentUser?.id) {
        throw new UnauthenticatedError("User not authenticated");
      }
      if (!chatId) {
        throw new BadRequestError("Session ID is required");
      }
      const chatSession = await this.#chatSessionService.getChatSession(chatId);
      if (!chatSession) {
        throw new BadRequestError("Chat session not found");
      }
      logService.log("Chat session retrieved successfully:", { requestId, sessionId: chatId });
      return network.successResponse(chatSession);
    } catch (error) {
      logService.error("Error getting chat session:", { requestId, error });
      return network.failResponse(error as BaseError);
    }
  }

  async update(req: NextRequest, { chatId }: RouteParams) {
    const network = new Network(req);
    const requestId = crypto.randomUUID();
    try {
      logService.log("Updating chat session:", { requestId, chatId });
      const currentUser: JWTPlayload = await authService.getCurrentUserProfile();
      if (!currentUser?.id) {
        throw new UnauthenticatedError("User not authenticated");
      }
      if (!chatId) {
        throw new BadRequestError("Session ID is required");
      }
      const body = await network.getBody();
      const chatSession = await this.#chatSessionService.updateChatSession(chatId, body);
      logService.log("Chat session updated successfully:", { requestId, sessionId: chatSession.id });
      return network.successResponse(chatSession);
    } catch (error) {
      logService.error("Error updating chat session:", { requestId, error });
      return network.failResponse(error as BaseError);
    }
  }

  async delete(req: NextRequest, { chatId }: RouteParams) {
    const network = new Network(req);
    const requestId = crypto.randomUUID();
    try {
      logService.log("Deleting chat session:", { requestId, chatId });
      const currentUser: JWTPlayload = await authService.getCurrentUserProfile();
      if (!currentUser?.id) {
        throw new UnauthenticatedError("User not authenticated");
      }
      if (!chatId) {
        throw new BadRequestError("Session ID is required");
      }
      await this.#chatSessionService.deleteChatSession(chatId);
      logService.log("Chat session deleted successfully:", { requestId, sessionId: chatId });
      return network.successResponse({ message: "Chat session deleted successfully" });
    } catch (error) {
      logService.error("Error deleting chat session:", { requestId, error });
      return network.failResponse(error as BaseError);
    }
  }
}

const chatSessionController = ChatSessionController.makeInstance(chatSessionService);

export default chatSessionController;
