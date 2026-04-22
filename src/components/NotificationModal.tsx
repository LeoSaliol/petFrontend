import { Link } from "react-router-dom";
import { CommentModal } from "./CommentModal";
import type { Perfil } from "../types";
interface Notification {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  message: string;
  isRead: boolean;
  actorId: number;
  postId?: number;
  actor?: {
    id: number;
    name: string;
    image: string;
  };
}
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
    <div className="dark:text-background bg-background absolute right-0 z-10 mt-2 flex w-96 flex-col gap-1 overflow-hidden rounded-md shadow-xl dark:bg-[#1b1a1a]">
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500">No tienes notificaciones</p>
      ) : (
        notifications.map((n: Notification) => (
          <div
            onMouseEnter={() => {
              if (!n.isRead) {
                setTimeout(() => {
                  handleRead(n.id);
                }, 500);
              }
            }}
            key={n.id}
            className={`flex w-full items-center gap-3 px-5 py-3 transition ${!n.isRead ? "bg-gray-100 dark:bg-[#0c0a0c]" : "bg-inherit"} text-md hover:bg-[#c911391a] dark:hover:bg-gray-900`}
          >
            <Link
              to={
                n.type === "FOLLOW"
                  ? `/profile/${n.actor?.id}`
                  : `/post/${n.postId}`
              }
              onClick={() => setShowNotifications(false)}
            >
              <img
                className="h-9 w-9 rounded-full object-cover"
                src={n.actor?.image}
                alt={n.actor?.name}
              />
            </Link>
            {n.type === "FOLLOW" ? (
              <Link
                to={`/profile/${n.actorId}`}
                className=""
                onClick={() => setShowNotifications(false)}
              >
                {n.message}
              </Link>
            ) : (
              <p
                className="cursor-pointer"
                onClick={() => goComment(n.postId!)}
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
                      handleRead(n.id);
                    }, 500);
                  }
                }}
                className="overflow-hidden text-xs text-blue-500 hover:text-blue-700"
              >
                New
              </div>
            )}
          </div>
        ))
      )}
      <Link
        to={"/notifications"}
        onClick={() => {
          setShowNotifications(false);
        }}
        className="text-background color-change-2x mt-1 cursor-pointer rounded-b-md py-2 text-center font-semibold transition hover:bg-[#c911391a] dark:bg-inherit dark:hover:bg-gray-800"
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
