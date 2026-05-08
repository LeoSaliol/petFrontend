import { Link } from "react-router-dom";
import { CommentModal } from "./CommentModal";
import type { Perfil, Notification } from "../types";

export const NotificationModal = ({
  notifications,
  setShowNotifications,
  goComment,
  handleRead,
  openModal,
  setOpenModal,
  selectedPostId,
}: {
  notifications: Notification[];
  setShowNotifications: (value: boolean) => void;
  goComment: (postId: number) => void;
  handleRead: (notificationId: string) => void;
  openModal: boolean | null;
  setOpenModal: (value: boolean | null) => void;
  selectedPostId: Perfil | null;
}) => {
  return (
    <div className="dark:text-primaryWhite bg-primaryWhite dark:bg-bgBlack absolute right-0 z-10 mt-2 flex w-96 flex-col gap-1 overflow-hidden rounded-md shadow-xl">
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500">No tienes notificaciones</p>
      ) : (
        notifications.map((n: Notification) => {
          if (!n.fromUser) return null;
          return (
          <div
            onMouseEnter={() => {
              if (!n.isRead) {
                setTimeout(() => {
                  handleRead(String(n.id));
                }, 500);
              }
            }}
            key={n.id}
            className={`flex w-full items-center gap-3 px-5 py-3 transition ${!n.isRead ? "bg-gray-100 dark:bg-[#0c0a0c]" : "bg-inherit"} text-md hover:bg-[#c911391a] dark:hover:bg-pink-900`}
          >
            <Link
              to={
                n.type === "follow"
                  ? `/profile/${n.fromUser.id}`
                  : n.relatedPostId ? `/post/${n.relatedPostId}` : "#"
              }
              onClick={() => setShowNotifications(false)}
            >
              <img
                className="h-9 w-9 rounded-full object-cover"
                src={n.fromUser.avatar || "/default-avatar.png"}
                alt={n.fromUser.name}
              />
            </Link>
            {n.type === "follow" ? (
              <Link
                to={`/profile/${n.fromUser.id}`}
                className=""
                onClick={() => setShowNotifications(false)}
              >
                {n.message}
              </Link>
            ) : (
              <p
                className="cursor-pointer"
                onClick={() => n.relatedPostId && goComment(n.relatedPostId)}
              >
                {" "}
                {n.message}{" "}
              </p>
            )}

            {!n.isRead && (
              <div
                onMouseEnter={() => {
                  if (!n.isRead) {
                    setTimeout(() => {
                      handleRead(String(n.id));
                    }, 500);
                  }
                }}
                className="overflow-hidden text-xs text-pink-500 hover:text-pink-700"
              >
                New
              </div>
            )}
          </div>
          );
        })
      )}
      <Link
        to={"/notifications"}
        onClick={() => {
          setShowNotifications(false);
        }}
        className="dark:text-primaryWhite color-change-2x dark:hover:text-primaryWhite mt-1 cursor-pointer rounded-b-md py-2 text-center font-semibold transition hover:bg-[#c911391a] dark:hover:bg-pink-800"
      >
        Ver todas la notificaciones
      </Link>
      {openModal && (
        <CommentModal
          closeModal={() => setOpenModal(false)}
          pcomment={selectedPostId}
        />
      )}
    </div>
  );
};
