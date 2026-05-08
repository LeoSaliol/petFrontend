import api from "./client";
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  me: async () => {
    const response = await api.get<AuthResponse>("/me");
    return response.data;
  },
};