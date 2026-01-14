import { UpdateChatSessionDTO } from "../dto/ChatSessionDTOs";
import { chatSessionService, type ChatSessionService } from "../services/ChatSessionService";
import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthenticatedError from "@lib/commons/errors/UnauthenticatedError";
import Network from "@lib/utils/network";
import { User } from "@server/models/User";
import { AuthService, authService } from "@server/services/AuthService";
import logService from "@server/services/LogService";
import { NextRequest } from "next/server";

interface RouteParams {
  chatId?: string;
}

export class ChatSessionController {
  static #instance: ChatSessionController;
  #chatSessionService: ChatSessionService;
  #authService: AuthService;

  static makeInstance(chatSessionService: ChatSessionService, authService: AuthService) {
    if (!ChatSessionController.#instance) {
      ChatSessionController.#instance = new ChatSessionController(chatSessionService, authService);
    }
    return ChatSessionController.#instance;
  }

  constructor(chatSessionService: ChatSessionService, authService: AuthService) {
    this.#chatSessionService = chatSessionService;
    this.#authService = authService;
  }

  private async getCurrentUser(): Promise<User> {
    const user: User | null = await this.#authService.getCurrentUserProfile();
    if (!user) throw new UnauthenticatedError("User not authenticated");
    return user;
  }

  async store(req: NextRequest) {
    const network = new Network(req);
    const requestId = crypto.randomUUID();

    try {
      logService.log("Creating chat session:", { requestId });
      const currentUser = await this.getCurrentUser();
      const body = (await network.getBody()) as { prompt: string; model?: string };
      const { prompt, model } = body;

      if (!prompt) {
        throw new BadRequestError("Prompt is required");
      }

      const result = await this.#chatSessionService.createChatSessionWithPrompt({
        userId: currentUser.id,
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

  async getAll(req: NextRequest) {
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

  async get(req: NextRequest, { chatId }: RouteParams) {
    const network = new Network(req);
    const requestId = crypto.randomUUID();
    try {
      if (!chatId) throw new BadRequestError("Session ID is required");
      const chatSession = await this.#chatSessionService.getChatSession(chatId);
      if (!chatSession) throw new BadRequestError("Chat session not found");

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
      if (!chatId) throw new BadRequestError("Session ID is required");

      const body = (await network.getBody()) as UpdateChatSessionDTO;
      const chatSession = await this.#chatSessionService.updateChatSession(chatId, body);
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
      if (!chatId) throw new BadRequestError("Session ID is required");

      await this.#chatSessionService.deleteChatSession(chatId);
      logService.log("Chat session deleted successfully:", { requestId, sessionId: chatId });
      return network.successResponse({ message: "Chat session deleted successfully" });
    } catch (error) {
      logService.error("Error deleting chat session:", { requestId, error });
      return network.failResponse(error as BaseError);
    }
  }
}

export const chatSessionController = ChatSessionController.makeInstance(chatSessionService, authService);
