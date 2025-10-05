import { MessageRoles } from "../models/ChatSession";

export type CreateChatSessionDTO = {
  userId: string;
  prompt: string;
  model: string;
};
export type NewChatSessionRequest = Omit<CreateChatSessionDTO, "userId">;

export type UpdateChatSessionDTO = {
  name?: string;
  messages?: Array<{
    role: MessageRoles;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }>;
  model?: string;
};

export type AddMessageDTO = {
  role: MessageRoles;
  content: string;
};

export type CreateMessageDTO = {
  role: MessageRoles;
  content: string;
  timestamp?: Date;
};
