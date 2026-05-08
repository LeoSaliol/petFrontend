import type { PetMini } from "./pet";

export interface Post {
  id: number;
  content: string;
  image: string;
  createdAt: string;
  likes: number[];
  pet: PetMini;
  _count: {
    likes: number;
    comments: number;
  };
  likedByUser?: boolean;
  newComment?: string;
}

export interface PostCreatePayload {
  content: string;
  image?: string | File;
  petId: number;
}

export interface PostFilters {
  petId?: number;
  userId?: number;
  limit?: number;
  offset?: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  pet: PetMini;
}

export interface CommentCreatePayload {
  postId: number;
  petId: number;
  content: string;
}

export interface Perfil {
  id: number;
  name: string;
  image: string;
  content: string;
  postId: number;
  postImg: string;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
  likedByUser?: boolean;
  ownerId?: number;
  bio?: string;
  posts?: PostPerfil[];
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface PostPerfil {
  id: number;
  image: string;
  content: string;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}