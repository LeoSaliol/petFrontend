export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface AuthState {
  userToken: number | null;
  petId: number | null;
  pet: import("./pet").Pet | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  petId?: number;
  token: string;
}