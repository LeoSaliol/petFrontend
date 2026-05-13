import type { Conversation } from "../types";
import { timeAgoShort } from "../utils/time";
import { Avatar } from "./ChatAvatar";
import { motion } from "framer-motion";

export const ConversationItem = ({
  conversation,
  currentUserId,
  isActive,
  isOnline,
  onClick,
  pet,
}: {
  conversation: Conversation;
  currentUserId: number;
  isActive: boolean;
  isOnline: boolean;
  onClick: () => void;
  pet?: {
    id: number;
    name: string;
    image: string;
  };
}) => {
  const otherUser = conversation.participants.find(
    (p) => p.user.id !== currentUserId,
  )?.user;
  if (!otherUser) return null;

  const lastMsg = conversation.messages[0];

  const otherPet = otherUser.pets?.[0];
  const avatarSrc = otherUser.avatar ?? otherPet?.image ?? pet?.image ?? null;

  return (
    <motion.button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-3 border-r-2 px-4 py-3 text-left transition-colors ${isActive ? "border-formColorDark bg-[#ed6b901a] dark:bg-pink-950/30" : "border-transparent hover:bg-[#ed6b9010] dark:hover:bg-neutral-800/50"} ${conversation.unreadCount > 0 ? "bg-[#ed6b901a] dark:bg-pink-950/30" : ""} `}
      whileHover={{ scale: 1.02, x: -8 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Avatar
        user={{
          id: otherUser.id,
          name: otherUser.name,
          avatar: avatarSrc,
          lastSeen: otherUser.lastSeen,
          pets: otherUser.pets,
        }}
        isOnline={isOnline}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm font-medium ${isActive ? "text-pink-700 dark:text-pink-200" : "text-neutral-800 dark:text-neutral-100"}`}
          >
            {otherUser.name}
          </span>
          {lastMsg && (
            <span className="shrink-0 text-[11px] text-neutral-400">
              {timeAgoShort(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {lastMsg
              ? lastMsg.senderId === currentUserId
                ? `Vos: ${lastMsg.content}`
                : lastMsg.content
              : "Sin mensajes"}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-formColorDark flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};
