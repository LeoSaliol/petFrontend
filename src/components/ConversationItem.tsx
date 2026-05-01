import type { Conversation } from "../types";
import { timeAgoShort } from "../utils/time";
import { Avatar } from "./Avatar";

export const ConversationItem = ({
  conversation,
  currentUserId,
  isActive,
  isOnline,
  onClick,
}: {
  conversation: Conversation;
  currentUserId: number;
  isActive: boolean;
  isOnline: boolean;
  onClick: () => void;
}) => {
  const otherUser = conversation.participants.find(
    (p) => p.user.id !== currentUserId,
  )?.user;
  if (!otherUser) return null;
  const lastMsg = conversation.messages[0];

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-r-2 px-4 py-3 text-left transition-colors ${isActive ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
    >
      <Avatar user={otherUser} isOnline={isOnline} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm font-medium ${isActive ? "text-amber-700 dark:text-amber-300" : "text-neutral-800 dark:text-neutral-100"}`}
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
            <span className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-semibold text-white">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
