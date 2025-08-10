import { z } from "zod";

export const MessageRolesSchema = z.enum(["user", "assistant"]);

export const MessageInputSchema = z.object({
  role: MessageRolesSchema,
  content: z.string().min(1, "Message content cannot be empty").max(5000, "Message content is too long"),
});

export const MessageSchema = z.object({
  role: MessageRolesSchema,
  content: z.string().min(1, "Message content cannot be empty").max(5000, "Message content is too long"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Zod schema for ChatSession validation
export const ChatSessionSchema = z.object({
  id: z.string().min(1, "Chat session ID is required"),
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Chat session name is required").max(100, "Name is too long"),
  messages: z.array(MessageSchema).default([]),
  model: z.string().min(1, "Model is required"),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Zod schema for creating a new chat session
export const CreateChatSessionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt is too long"),
  model: z.string().min(1, "Model is required"),
});

// Zod schema for updating a chat session
export const UpdateChatSessionSchema = z.object({
  name: z.string().min(1, "Chat session name is required").max(100, "Name is too long").optional(),
  messages: z.array(MessageSchema).optional(),
  model: z.string().min(1, "Model is required").optional(),
});

// Zod schema for adding a message to a chat session
export const AddMessageSchema = z.object({
  role: MessageRolesSchema,
  content: z.string().min(1, "Message content cannot be empty").max(5000, "Message content is too long"),
});

// Zod schema for message creation (with optional timestamp)
export const CreateMessageSchema = z.object({
  role: MessageRolesSchema,
  content: z.string().min(1, "Message content cannot be empty").max(5000, "Message content is too long"),
  timestamp: z.date().optional(),
});

// Infer TypeScript types from Zod schemas for validation
export type ChatSessionValidation = z.infer<typeof ChatSessionSchema>;
export type CreateChatSessionValidation = z.infer<typeof CreateChatSessionSchema>;
export type UpdateChatSessionValidation = z.infer<typeof UpdateChatSessionSchema>;
export type AddMessageValidation = z.infer<typeof AddMessageSchema>;
export type MessageValidation = z.infer<typeof MessageSchema>;
export type MessageInputValidation = z.infer<typeof MessageInputSchema>;
export type CreateMessageValidation = z.infer<typeof CreateMessageSchema>;
