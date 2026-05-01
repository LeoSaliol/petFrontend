import { Link } from "react-router-dom";
import { timeAgoShort } from "../utils/time";

export const MessageBubble = ({
  content,
  createdAt,
  isMine,
  isRead,
  showAvatar,
  sender,
  pet,
}: {
  content: string;
  createdAt: string;
  isMine: boolean;
  isRead: boolean;
  showAvatar: boolean;
  sender: { id: number; name: string; avatar: string | null };
  pet: { id: number; name: string; image: string };
}) => {
  return (
    <div
      className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isMine && (
        <div className="w-6 shrink-0">
          <Link to={`/profile/${pet.id}`}>
            {showAvatar && (
              <img
                src={sender.avatar ?? pet.image}
                alt={sender.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
          </Link>
        </div>
      )}
      <div
        className={`flex max-w-[70%] flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isMine ? "rounded-br-sm bg-amber-400 text-white dark:bg-amber-500" : "rounded-bl-sm border border-neutral-100 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"}`}
        >
          {content}
        </div>
        <div
          className={`flex items-center gap-1 ${isMine ? "flex-row-reverse" : ""}`}
        >
          <span className="text-[10px] text-neutral-400">
            {timeAgoShort(createdAt)}
          </span>
          {isMine && (
            <span
              className={`text-[10px] ${isRead ? "text-amber-400" : "text-neutral-300 dark:text-neutral-600"}`}
            >
              {isRead ? "Visto hace " : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
