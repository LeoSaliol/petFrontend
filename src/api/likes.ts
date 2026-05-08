import api from "./client";

export const likesService = {
  toggle: async (postId: number) => {
    const response = await api.post(`/likes/toggle/${postId}`);
    return response.data;
  },

  getByPost: async (postId: number) => {
    const response = await api.get(`/likes/${postId}`);
    return response.data;
  },
};