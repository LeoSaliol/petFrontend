import api from "./client";
import type { Pet, CreatePetPayload } from "../types/pet";

export const petsService = {
  getMyPets: async () => {
    const response = await api.get<Pet[]>("/pets/me");
    return response.data;
  },

  create: async (payload: CreatePetPayload & { image?: File }) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.bio) formData.append("bio", payload.bio);
    if (payload.image) formData.append("image", payload.image);
    
    const response = await api.post("/pets", formData);
    return response.data;
  },

  update: async (petId: number, name: string, bio: string, image?: File | null) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (image) formData.append("image", image);
    
    await api.put(`/users/${petId}`, formData);
  },
};