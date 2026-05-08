import api from "./client";
import type { Perfil } from "../types/post";

export const usersService = {
  getProfile: async (petId: number, userId?: number) => {
    const response = await api.get<Perfil>(`/users/${petId}/profile`, {
      params: { userId },
    });
    return response.data;
  },

  follow: async (petId: number) => {
    const response = await api.post(`/follow/${petId}`);
    return response.data;
  },
};