import api from "./client";
import type { Conversation } from "../types/chat";

export const conversationsService = {
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get<{ data: Conversation[] } | Conversation[]>("/conversations");
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.data;
  },
};
