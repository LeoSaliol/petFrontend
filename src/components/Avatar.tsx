import type { ConversationUser } from "../types";

export const Avatar = ({
  user,
  isOnline,
  size = "md",
}: {
  user: ConversationUser;
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  const dotSizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };

  return (
    <div className="relative shrink-0">
      <img
        src={user.avatar ?? user.pets[0]?.image}
        alt={user.name}
        className={`${sizes[size]} rounded-full object-cover`}
      />

      {isOnline && (
        <span
          className={`${dotSizes[size]} absolute right-0 bottom-0 rounded-full border-2 border-white bg-emerald-400 dark:border-neutral-900`}
        />
      )}
    </div>
  );
};
