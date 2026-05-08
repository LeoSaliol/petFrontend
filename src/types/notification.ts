export type NotificationType = "like" | "comment" | "follow" | "message";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  createdAt: string;
  isRead: boolean;
  fromUser: {
    id: number;
    name: string;
    avatar: string | null;
  };
  relatedPostId?: number;
  relatedPetId?: number;
}

export interface NotificationGroup {
  type: NotificationType;
  count: number;
  notifications: Notification[];
}