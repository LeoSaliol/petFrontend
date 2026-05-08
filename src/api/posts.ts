import api from "./client";
import type { Post, PostCreatePayload } from "../types/post";

export const postsService = {
  getFeed: async (petId?: number) => {
    const response = await api.get<Post[]>("/posts/feed", { params: { petId } });
    return response.data;
  },

  getById: async (postId: number) => {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  create: async (payload: PostCreatePayload & { image?: File }) => {
    const formData = new FormData();
    formData.append("content", payload.content);
    formData.append("petId", payload.petId.toString());
    if (payload.image) formData.append("image", payload.image);
    
    const response = await api.post("/posts", formData);
    return response.data;
  },

  update: async (postId: number, content: string, image?: File) => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);
    
    await api.put(`/posts/${postId}`, formData);
  },

  delete: async (postId: number) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data.message;
  },
};