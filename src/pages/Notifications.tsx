/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { notificationsService, postsService } from "../api";
import { useAuth } from "../context/useAuth";
import {
  formatNotification,
  groupNotifications,
} from "../utils/groupNotifications";
import { Link } from "react-router";
import { CommentModal } from "../components/CommentModal";
import { NotificationSkeleton } from "../components/skeletons";
import type { Perfil } from "../types";

export const Notifications = () => {
  const { pet } = useAuth();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const [selectedPost, setSelectedPost] = useState<Perfil | null>(null);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", "preview"],
    queryFn: () => notificationsService.getAll(pet!.id),
    enabled: !!pet?.id,
  });

  const handleRead = async (id: string) => {
    await notificationsService.markAsRead(id);

    queryClient.setQueryData(["notifications", "preview"], (old: any) => {
      return old.map((n: any) => (n.id === id ? { ...n, isRead: true } : n));
    });
  };

  const handlePostClick = async (postId: number) => {
    try {
      const postData = await postsService.getById(postId);
      const perfilData: Perfil = {
        id: postData.pet.id,
        name: postData.pet.name,
        image: postData.pet.image,
        content: postData.content,
        postId: postData.id,
        postImg: postData.image,
        createdAt: postData.createdAt,
        _count: postData._count,
        likedByUser: postData.likedByUser,
        ownerId: postData.pet.id,
      };
      setSelectedPost(perfilData);
      setOpenModal(true);
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const groupedNotifications = groupNotifications(notifications);

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (notifications.length === 0) {
    return (
      <div className="dark:bg-bgBlack rounded-md px-10 py-6">
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <p className="mt-4 text-gray-500">No tienes notificaciones</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-bgBlack rounded-md px-10 py-6">
      <h1 className="text-2xl font-bold">Notificaciones</h1>
      <div className="">
        <ul className="mt-4">
          {groupedNotifications.map((n, index) => {
            const isLikeOrComment = n.type === "like" || n.type === "comment";
            const relatedPostId = n.relatedPostId || n.postId;
            
            return (
            <div
              key={n.id || index}
              className={`p-2 text-sm transition ${
                !n.isRead
                  ? "hover:bg-[#c911391a] dark:hover:bg-gray-900"
                  : "dark:bg-bgBlack"
              }`}
              onMouseEnter={() => {
                if (!n.isRead) {
                  setTimeout(() => {
                    handleRead(String(n.id));
                  }, 500);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Link to={`/profile/${n.actor?.id}`}>
                  <img src={n.actor?.avatar || n.actor?.image || "/default-avatar.png"} alt="Avatar del usuario" className="h-8 w-8 rounded-full object-cover" />
                </Link>

                <div className="group relative flex items-center gap-1">
                  <Link
                    to={`/profile/${n.actor?.id}`}
                    className="font-semibold"
                  >
                    {formatNotification(n).main}
                  </Link>
                  {n.type === "follow" ? (
                    <span className="text-neutral-500">te empezó a seguir</span>
                  ) : n.type === "like" ? (
                    <>
                      <span className="text-neutral-500">le dio like a tu </span>
                      <button
                        onClick={() => relatedPostId && handlePostClick(relatedPostId)}
                        className="text-blue-500 hover:underline"
                      >
                        publicación
                      </button>
                    </>
                  ) : n.type === "comment" ? (
                    <>
                      <span className="text-neutral-500">comentó tu </span>
                      <button
                        onClick={() => relatedPostId && handlePostClick(relatedPostId)}
                        className="text-blue-500 hover:underline"
                      >
                        publicación
                      </button>
                    </>
                  ) : (
                    <span className="text-neutral-500">publicación</span>
                  )}
                  {formatNotification(n).others.length > 0 && (
                    <div className="absolute top-6 left-0 z-50 hidden w-48 rounded-lg p-2 text-xs shadow-lg group-hover:block">
                      {formatNotification(n).others.map((actor: any, i: number) => (
                        <Link
                          key={actor?.id || i}
                          to={`/profile/${actor?.id}`}
                          className="flex items-center gap-2 rounded p-1 hover:bg-gray-800"
                        >
                          <img
                            src={actor?.avatar || actor?.image || "/default-avatar.png"}
                            alt={`Avatar de ${actor?.name}`}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          {actor?.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </ul>
      </div>
      {openModal && selectedPost && (
        <CommentModal
          closeModal={() => setOpenModal(false)}
          pcomment={selectedPost}
        />
      )}
    </div>
  );
};
