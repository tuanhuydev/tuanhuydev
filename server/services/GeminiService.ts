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
    return this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
  }
}
