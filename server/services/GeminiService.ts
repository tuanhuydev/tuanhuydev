import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export class GeminiService {
  private static instance: GeminiService;
  private client: GoogleGenAI;

  private constructor() {
    this.client = ai;
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public getClient(): GoogleGenAI {
    return this.client;
  }

  public async generateContent(prompt: string) {
    const config = {
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking budget for immediate response
        },
      },
      model: "gemini-2.5-flash",
    };
    return this.client.models.generateContent({
      ...config,
      contents: prompt,
    });
  }
}
