import chatSessionService from "@features/GenAI/services/ChatSessionService";
import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import { GeminiService } from "@server/services/GeminiService";
import logService from "@server/services/LogService";
import { NextRequest } from "next/server";

class AIController {
  static #instance: AIController;
  #geminiService: GeminiService;

  constructor(geminiService: GeminiService) {
    this.#geminiService = geminiService;
  }

  static makeInstance(geminiService: GeminiService) {
    return AIController.#instance ?? new AIController(geminiService);
  }

  async prompt(request: NextRequest) {
    const network = new Network(request);
    try {
      const body = await network.getBody();
      const { prompt, chatId } = body;
      logService.log("Received prompt:", { prompt, chatId });

      if (!prompt) {
        throw new BadRequestError("Prompt is required");
      }

      const response = await this.#geminiService.generateContent(prompt);

      if (!response?.text) {
        throw new BadRequestError("Failed to generate AI response");
      }

      if (chatId) {
        await chatSessionService.addConversationToChatSession(chatId, prompt, response.text);
        logService.log("Added conversation to chat session:", { chatId });
      }

      return network.successResponse({ response: response.text });
    } catch (error) {
      logService.error(error);
      return network.failResponse(error as BaseError);
    }
  }
}

const geminiService = GeminiService.getInstance();
const aiController = AIController.makeInstance(geminiService);

export default aiController;
