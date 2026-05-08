import api from "./client";
import type { Notification } from "../types/notification";

export const notificationsService = {
  getAll: async (petId: number, limit?: number) => {
    const response = await api.get<{ data: Notification[] }>(`/notifications/${petId}`, {
      params: { limit },
    });
    return response.data.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },
};