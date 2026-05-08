import type { Pet } from "./pet";

export interface MessageSender {
  name: string;
  avatar: string | null;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: number;
  conversationId: number;
  sender: MessageSender;
}

export interface ConversationUser {
  id: number;
  name: string;
  avatar: string | null;
  lastSeen: string | null;
  pets: Pet[];
}

export interface Conversation {
  id: number;
  participants: { user: ConversationUser }[];
  messages: Message[];
  unreadCount: number;
}

export interface SendMessagePayload {
  conversationId: number;
  content: string;
  senderId: number;
}