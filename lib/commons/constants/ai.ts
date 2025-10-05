export const AI_ENABLE_GPT5_PREVIEW =
  (process.env.AI_ENABLE_GPT5_PREVIEW ?? process.env.NEXT_PUBLIC_AI_ENABLE_GPT5_PREVIEW) === "true";

// If you truly integrate OpenAI GPT-5 later, set AI_GPT5_MODEL to that model id.
export const AI_GPT5_MODEL = process.env.AI_GPT5_MODEL ?? process.env.NEXT_PUBLIC_AI_GPT5_MODEL ?? "";

// Fallback Gemini model used by current implementation
export const AI_GEMINI_DEFAULT_MODEL = process.env.AI_GEMINI_DEFAULT_MODEL ?? "gemini-2.5-flash-8b";

export function getDefaultAIModel(): string {
  if (AI_ENABLE_GPT5_PREVIEW && AI_GPT5_MODEL) return AI_GPT5_MODEL;
  return AI_GEMINI_DEFAULT_MODEL;
}
