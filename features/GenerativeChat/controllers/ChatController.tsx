import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import { GeminiService } from "@server/services/GeminiService";
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
    const network = Network(request);
    try {
      const body = await network.getBody();
      const { prompt } = body;

      if (!prompt) {
        throw new BadRequestError("Prompt is required");
      }

      const response = await this.#geminiService.generateContent(prompt);

      return network.successResponse({ response: response.text });
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }
}

const geminiService = GeminiService.getInstance();
const aiController = AIController.makeInstance(geminiService);

export default aiController;
