import { CreateChatSessionDTO, NewChatSessionRequest, UpdateChatSessionDTO } from "../dto/ChatSessionDTOs";
import ChatSession, { MessageRoles } from "../models/ChatSession";
import { GENERATIVE_CHAT_SESSION_NAME_PROMPT } from "../prompts";
import MongoChatSessionRepository from "../repositories/MongoChatSessionRepository";
import { CreateChatSessionSchema } from "../schemas/ChatSessionSchema";
import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import { GeminiService } from "@server/services/GeminiService";
import logService from "@server/services/LogService";
import MongoService from "@server/services/MongoService";

interface ChatSessionFilter {
  userId: string;
  limit?: number;
  offset?: number;
}

class ChatSessionService {
  static #instance: ChatSessionService;
  #geminiService: GeminiService;
  #repository: typeof MongoChatSessionRepository;

  static makeInstance(geminiService: GeminiService) {
    if (!ChatSessionService.#instance) {
      ChatSessionService.#instance = new ChatSessionService(geminiService);
    }
    return ChatSessionService.#instance;
  }

  private constructor(geminiService: GeminiService) {
    this.#geminiService = geminiService;
    this.#repository = MongoChatSessionRepository;
  }

  async generateChatSessionName(prompt: string): Promise<string> {
    try {
      const generationPrompt = GENERATIVE_CHAT_SESSION_NAME_PROMPT(prompt);
      const response = await this.#geminiService.generateContent(generationPrompt);
      if (!response || !response?.text) {
        throw new Error("Failed to generate chat session name");
      }
      return response.text.trim().replace(/^"|"$/g, ""); // Remove quotes if Gemini adds them
    } catch (error) {
      logService.error("Error generating chat session name:", error);
      return "New Chat";
    }
  }

  async createChatSession(dto: CreateChatSessionDTO): Promise<any> {
    try {
      // Generate session name from the prompt
      const sessionName = await this.generateChatSessionName(dto.prompt);

      const chatSessionData = {
        userId: dto.userId,
        name: sessionName,
        model: dto.model,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      return await this.#repository.createChatSession(chatSessionData as any);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error creating chat session:", error);
      throw new BadRequestError("Failed to create chat session");
    }
  }

  async createChatSessionWithPrompt(dto: CreateChatSessionDTO): Promise<{
    sessionId: string;
    sessionName: string;
    aiResponse: string;
  }> {
    try {
      this.validateCreateSessionRequest(dto);
      const response = await this.#geminiService.generateContent(dto.prompt);
      if (!response?.text) {
        throw new BadRequestError("Failed to generate AI response");
      }

      const sessionName = await this.generateChatSessionName(dto.prompt);
      const chatSession = await this.#repository.createChatSession({
        userId: dto.userId,
        name: sessionName,
        model: dto.model,
        messages: [],
      } as unknown as ChatSession);

      const sessionId = chatSession.insertedId?.toString();
      if (!sessionId) {
        throw new BadRequestError("Failed to create chat session");
      }

      // Add the conversation to the session
      await this.addConversationToChatSession(sessionId, dto.prompt, response.text);

      return {
        sessionId,
        sessionName,
        aiResponse: response.text,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error creating chat session with prompt:", error);
      throw new BadRequestError("Failed to create chat session with prompt");
    }
  }

  private validateCreateSessionRequest(request: CreateChatSessionDTO): void {
    const { success, error } = CreateChatSessionSchema.safeParse(request);
    if (!success) {
      logService.error("Validation failed:", error);
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      throw new BadRequestError(errorMessages);
    }
  }

  async getChatSessions(filter: ChatSessionFilter): Promise<any[]> {
    try {
      this.validateUserId(filter.userId);
      return await this.#repository.getChatSessions(filter);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error fetching chat sessions:", error);
      throw new BadRequestError("Failed to fetch chat sessions");
    }
  }

  async getChatSession(id: string): Promise<any> {
    try {
      if (!id?.trim()) {
        throw new BadRequestError("Session ID is required");
      }
      return await this.#repository.getChatSession(id);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error fetching chat session:", error);
      throw new BadRequestError("Failed to fetch chat session");
    }
  }

  async updateChatSession(id: string, updates: UpdateChatSessionDTO): Promise<any> {
    try {
      if (!id?.trim()) {
        throw new BadRequestError("Session ID is required");
      }

      if (updates.name && updates.name.length > 255) {
        throw new BadRequestError("Session name cannot exceed 255 characters");
      }

      return await this.#repository.updateChatSession(id, updates);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error updating chat session:", error);
      throw new BadRequestError("Failed to update chat session");
    }
  }

  async deleteChatSession(id: string): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new BadRequestError("Session ID is required");
      }
      await this.#repository.deleteChatSession(id);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error deleting chat session:", error);
      throw new BadRequestError("Failed to delete chat session");
    }
  }

  async addMessageToChatSession(sessionId: string, message: { role: MessageRoles; content: string }): Promise<any> {
    try {
      if (!sessionId?.trim()) {
        throw new BadRequestError("Session ID is required");
      }

      if (!message.content?.trim()) {
        throw new BadRequestError("Message content cannot be empty");
      }

      if (message.content.length > 10000) {
        throw new BadRequestError("Message content exceeds maximum length");
      }

      return await this.#repository.addMessageToChatSession(sessionId, message);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error adding message to chat session:", error);
      throw new BadRequestError("Failed to add message to chat session");
    }
  }

  async clearChatSessionMessages(sessionId: string): Promise<any> {
    try {
      if (!sessionId?.trim()) {
        throw new BadRequestError("Session ID is required");
      }
      return await this.#repository.clearChatSessionMessages(sessionId);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error clearing chat session messages:", error);
      throw new BadRequestError("Failed to clear chat session messages");
    }
  }

  async addConversationToChatSession(sessionId: string, userMessage: string, aiResponse: string): Promise<void> {
    try {
      if (!sessionId?.trim()) {
        throw new BadRequestError("Session ID is required");
      }

      if (!userMessage?.trim() || !aiResponse?.trim()) {
        throw new BadRequestError("Both user message and AI response are required");
      }

      if (userMessage.length > 10000 || aiResponse.length > 10000) {
        throw new BadRequestError("Message content exceeds maximum length");
      }

      const client = MongoService.getClient();
      const session = client.startSession();

      try {
        await session.withTransaction(async () => {
          await this.#repository.addMessageToChatSession(
            sessionId,
            {
              role: "user",
              content: userMessage,
            },
            { session },
          );

          await this.#repository.addMessageToChatSession(
            sessionId,
            {
              role: "assistant",
              content: aiResponse,
            },
            { session },
          );
        });

        logService.log("Successfully added conversation to chat session:", { sessionId });
      } finally {
        await session.endSession();
      }
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      logService.error("Error adding conversation to chat session:", error);
      throw new BadRequestError("Failed to add conversation to chat session");
    }
  }

  // Helper method
  private validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new BadRequestError("User ID is required");
    }
  }
}

const geminiServiceInstance = GeminiService.getInstance();
export default ChatSessionService.makeInstance(geminiServiceInstance);
export type { ChatSessionService };
