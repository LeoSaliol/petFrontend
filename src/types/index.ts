export type Pet = {
  id: number;
  ownerId: number;
  createdAT: string;
  name: string;
  image: string;
  bio: string;
};

export interface Post {
  id: number;
  content: string;
  image: string;
  createdAt: string;
  likes: number[];
  pet: {
    id: number;
    name: string;
    image: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  likedByUser?: boolean;
  newComment?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
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
}

export interface MessageSender {
  name: string;
  avatar: string | null;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: number;
  conversationId: number;
  sender: MessageSender;
}

export interface ConversationUser {
  id: number;
  name: string;
  avatar: string | null;
  lastSeen: string | null;
  pets: Pet[];
}

export interface Conversation {
  id: number;
  participants: { user: ConversationUser }[];
  messages: Message[];
  unreadCount: number;
}
