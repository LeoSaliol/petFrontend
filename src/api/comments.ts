import api from "./client";
import type { Comment, CommentCreatePayload } from "../types/post";

export const commentsService = {
  getByPost: async (postId: number) => {
    const response = await api.get<Comment[]>(`/comments/${postId}`);
    return response.data;
  },

  create: async (payload: CommentCreatePayload) => {
    const response = await api.post<Comment>(`/comments/${payload.postId}`, {
      petId: payload.petId,
      content: payload.content,
    });
    return response.data;
  },
};