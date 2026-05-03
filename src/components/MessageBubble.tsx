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
        className={`mr-2 flex max-w-[70%] flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isMine ? "bg-formColorDark text-primaryWhite rounded-br-sm" : "rounded-bl-sm border border-neutral-100 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"}`}
        >
          {content}
        </div>
        <div
          className={`flex items-center gap-1 ${isMine ? "flex-row-reverse" : ""}`}
        >
          <span
            className={`text-[10px] ${isMine ? "text-formColorLight" : "text-neutral-400 dark:text-neutral-500"}`}
          >
            {timeAgoShort(createdAt)}
          </span>
          {isMine && (
            <span
              className={`text-[10px] ${isRead ? "text-formColorLight" : "text-neutral-400 dark:text-neutral-600"}`}
            >
              {isRead ? "Visto hace " : "Enviado hace "}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
