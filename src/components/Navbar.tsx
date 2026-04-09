/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router";

import { CatPorfileIcon } from "../icons/CatPorfileIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { LoginIcon } from "../icons/LoginIcon";
import { useAuth } from "../context/useAuth";
import {
  getNotifications,
  getPost,
  logoutUser,
  markAsRead,
} from "../api/axios";
import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentModal } from "./CommentModal";
import type { Perfil } from "../types";

interface Notification {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  message: string;
  isRead: boolean;
  actorId: number;
  postId?: number;
}

export default function Navbar() {
  const { userToken, pet, refreshUser } = useAuth();
  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const [selectedPostId, setSelectedPostId] = useState<Perfil | null>(null);

  const queryClient = useQueryClient();
  const [scroll, setScroll] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);

  const loggout = async () => {
    await logoutUser();
    await refreshUser();
  };
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 20);
    };
    refreshUser();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", "preview"],
    queryFn: () => getNotifications(pet!.id, 5),
    enabled: !!pet?.id,
  });
  const unread = notifications.filter((n: Notification) => !n.isRead).length;

  const handleNotification = () => {
    setShowNotifications((prev) => !prev);
  };
  const handleRead = async (id: string) => {
    await markAsRead(id);

    queryClient.setQueryData(["notifications", "preview"], (old: any) => {
      return old.map((n: any) => (n.id === id ? { ...n, isRead: true } : n));
    });
  };

  const goComment = async (p: number) => {
    const postData = await queryClient.fetchQuery({
      queryKey: ["post", p],
      queryFn: () => getPost(p),
    });
    setShowNotifications(false);

    setOpenModal(true);
    setSelectedPostId({
      id: postData.pet.id,
      name: postData.pet.name,
      image: postData.pet.image,
      content: postData.content,
      postId: postData.id,
      postImg: postData.image,
      createdAt: postData.createdAt,
    });
  };

  return (
    <div
      className="sticky top-0 z-50"
      onClick={() => {
        setShowNotifications(false);
      }}
    >
      {openModal && (
        <CommentModal
          closeModal={() => setOpenModal(false)}
          pcomment={selectedPostId}
        />
      )}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className={`font-title text-primary text-[2.2rem] ${scroll ? "backdrop-blur-xs 2xl:-translate-x-54 2xl:text-[2rem] 2xl:backdrop-blur-none" : ""} hidden transition-all duration-700 ease-in-out md:block`}
        >
          Michigram
        </Link>
        {scroll ? (
          <div className="fixed right-0 bottom-0 left-0 flex h-20 w-screen items-center justify-between p-5 transition-all duration-700 ease-in-out md:hidden dark:bg-[#0e0e0f]">
            <Link to="/" className="font-title text-primary text-[2.2rem]">
              M
            </Link>
            <Link to="/notifications">
              <NotificationIcon
                width={35}
                onClick={handleNotification}
                className="dark:fill-background cursor-pointer"
              />
            </Link>

            <Link to={userToken ? `/profile/${pet?.id}` : "/login"}>
              {userToken ? (
                <img
                  src={pet?.image}
                  alt="Pet Profile"
                  className="mx-auto h-9 w-9 rounded-full object-fill"
                />
              ) : (
                <CatPorfileIcon width={35} />
              )}
            </Link>

            <Link to="/login" onClick={userToken ? loggout : undefined}>
              <LoginIcon
                width={40}
                className={`pt-1 ${userToken ? "stroke-red-600" : "stroke-[#333]"} `}
              />
            </Link>
          </div>
        ) : (
          <Link
            to="/"
            className="font-title text-primary text-[2.2rem] transition-all duration-700 ease-in-out md:hidden"
          >
            M
          </Link>
        )}

        {pet && (
          <p>
            {pet.name}:{pet.id}
          </p>
        )}
        <div
          onClick={(e) => e.stopPropagation()}
          className={
            "flex h-12 items-center gap-5 transition-all duration-700 ease-in-out " +
            (scroll
              ? "hidden backdrop-blur-xs md:flex 2xl:translate-x-45 2xl:backdrop-blur-none"
              : "")
          }
        >
          <div className="dark:text-background">
            <div
              className="relative cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <div className="transition-transform duration-200 hover:scale-110">
                <NotificationIcon
                  width={35}
                  onClick={handleNotification}
                  className="dark:fill-background"
                />
              </div>

              {unread > 0 && (
                <span className="absolute -top-1 -right-1 flex animate-bounce items-center justify-center rounded-full bg-[#f54669] px-1 text-xs">
                  {unread}
                </span>
              )}
            </div>

            {showNotifications && (
              <div className="dark:text-background absolute right-0 z-10 mt-2 flex w-72 flex-col gap-1 overflow-hidden rounded-md shadow-xl dark:bg-[#1b1a1a]">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500">No tienes notificaciones</p>
                ) : (
                  notifications.map((n: Notification) => (
                    <div
                      key={n.id}
                      className={`px-5 py-3 transition ${!n.isRead ? "bg-gray-100" : "bg-inherit"} text-md hover:bg-gray-900`}
                    >
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
                              }, 500); // medio segundo
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
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-background color-change-2x mt-1 cursor-pointer rounded-b-md py-2 font-semibold transition hover:bg-gray-800 dark:bg-inherit"
                >
                  Ver todas la notificaciones
                </button>
              </div>
            )}
          </div>
          <Link to={userToken ? `/profile/${pet?.id}` : "/login"}>
            {userToken ? (
              <img
                src={pet?.image}
                alt="Pet Profile"
                className="mx-auto h-9 w-9 rounded-full object-fill"
              />
            ) : (
              <CatPorfileIcon width={35} />
            )}
          </Link>

          <Link to="/login" onClick={userToken ? loggout : undefined}>
            <LoginIcon
              width={40}
              className={`pt-1 ${userToken ? "stroke-red-600" : "stroke-[#333]"} `}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
