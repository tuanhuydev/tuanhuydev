export type MessageRoles = "user" | "assistant";

export type Message = {
  role: MessageRoles;
  content: string;
  timestamp: Date;
};

export interface ChatSession extends Timestamps {
  id: string;
  userId: string;
  name: string;
  messages: Message[];
  model: string;
}

export default ChatSession;
