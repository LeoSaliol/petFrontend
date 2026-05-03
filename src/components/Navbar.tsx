/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
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
import { CreatePostButton } from "./ButtonPost";
import { useTheme } from "../hooks/useDarkTheme";
import { MoonIcon, SunIcon } from "../icons/ThemeIcon";
import { NotificationModal } from "./NotificationModal";
import { MessagesIcon } from "../icons/MessageIcon";
import { useChat } from "../hooks/useChat";

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

export default function Navbar() {
  const { userToken, pet, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { conversations } = useChat();
  const location = useLocation();
  const [bouncingMsgs, setBouncingMsgs] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [scroll, setScroll] = useState(false);

  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const [selectedPostId, setSelectedPostId] = useState<Perfil | null>(null);

  const queryClient = useQueryClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const totalUnread = conversations.reduce(
    (acc, conv) => acc + conv.unreadCount,
    0,
  );
  const loggout = async () => {
    await logoutUser();
    await refreshUser();
    window.location.reload();
  };
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 20);
    };
    refreshUser();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (totalUnread > 0) {
      setBouncingMsgs(true);
      setBouncing(true);
    }
  }, [totalUnread]);

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
      _count: postData._count,
      likedByUser: postData.likedByUser,
    });
  };

  return (
    <AnimatePresence>
      <div
        className="sticky top-0 z-20"
        onClick={() => {
          setShowNotifications(false);
        }}
      >
        {userToken && (
          <CreatePostButton
            clasN={`fixed bottom-16 left-10 md:bottom-12 ${scroll ? "md:block hidden" : ""}  ${location.pathname !== "/" ? "hidden" : "block"} `}
          />
        )}

        {openModal && (
          <CommentModal
            closeModal={() => setOpenModal(false)}
            pcomment={selectedPostId}
          />
        )}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className={`font-title text-primaryBlack dark:text-primaryWhite text-[2.2rem] ${scroll ? "inScroll:-translate-x-48 inScroll:backdrop-blur-none backdrop-blur-[1px] 2xl:text-[2rem]" : ""} hidden transition-all duration-700 ease-in-out md:block`}
          >
            Michigram
          </Link>
          {scroll ? (
            <div className="bg-primaryWhite fixed right-0 bottom-0 left-0 flex h-20 w-screen items-center justify-between p-5 transition-all duration-700 ease-in-out md:hidden md:bg-inherit dark:bg-[#0e0e0f]">
              <Link
                to="/"
                className="font-title text-primaryBlack text-[2.2rem]"
              >
                M
              </Link>
              <Link to="/notifications">
                <NotificationIcon
                  width={35}
                  onClick={handleNotification}
                  className="dark:fill-primaryWhite cursor-pointer"
                />
              </Link>
              <Link to={userToken ? `/chats` : "/login"}>
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs text-white">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
                <MessagesIcon
                  width={42}
                  className="dark:fill-primaryWhite mb-2 -rotate-140 cursor-pointer md:mb-0"
                />
              </Link>
              {userToken && <CreatePostButton clasN=" " />}
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
                  width={47}
                  className={`pt-1 ${userToken ? "stroke-redPink" : "stroke-[#333]"} `}
                />
              </Link>
            </div>
          ) : (
            <Link
              to="/"
              className="font-title text-primaryBlack text-[2.2rem] transition-all duration-700 ease-in-out md:hidden"
            >
              M
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.14 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={
              "dark:text-primaryWhite bg-primaryWhite text-primaryBlack fixed right-10 bottom-16 z-50 mt-2 ml-auto flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-[#791f4c2a] px-1 py-2 text-sm font-semibold hover:opacity-90 md:top-auto md:right-8 md:bottom-11 dark:border-0 dark:bg-[#161515]"
            }
          >
            {theme === "dark" ? (
              <MoonIcon width={23} stroke="#fff" />
            ) : (
              <SunIcon width={24} />
            )}
          </motion.button>
          <div
            onClick={(e) => e.stopPropagation()}
            className={
              "relative flex h-12 items-center justify-between gap-4 transition-all duration-700 ease-in-out md:w-62 md:gap-2 " +
              (scroll
                ? " inScroll:translate-x-68 inScroll:backdrop-blur-none hidden backdrop-blur-[1px] md:flex"
                : "w-80")
            }
          >
            {totalUnread > 0 && (
              <motion.span
                className={
                  "absolute top-0 left-6 " +
                  (bouncingMsgs ? "animate-bounce" : "") +
                  " bg-pinkNotify rounded-full px-1 text-xs text-white"
                }
              >
                {totalUnread > 99 ? "99+" : totalUnread}
              </motion.span>
            )}
            <motion.div
              onHoverStart={() => setBouncingMsgs(false)}
              transition={{
                type: "tween",
                stiffness: 200,
                damping: 15,
                duration: 0.4,
              }}
              whileHover={{ rotate: -90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={userToken ? `/chats` : "/login"}>
                <MessagesIcon className="dark:fill-primaryWhite mb-1 w-8 -rotate-45 cursor-pointer dark:w-10" />
              </Link>
            </motion.div>
            <div className="dark:text-primaryWhite">
              <div
                className="relative cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <motion.div
                  className="transition-transform duration-200 hover:scale-110"
                  onHoverStart={() => setBouncing(false)}
                >
                  <NotificationIcon
                    width={35}
                    onClick={handleNotification}
                    className="dark:fill-primaryWhite"
                  />
                </motion.div>

                {unread > 0 && (
                  <span
                    className={
                      "text-primaryWhite bg-pinkNotify absolute -top-1 -right-1 items-center justify-center rounded-full px-1 " +
                      (bouncing ? "animate-bounce" : "") +
                      " text-xs"
                    }
                  >
                    {unread}
                  </span>
                )}
              </div>

              {showNotifications && (
                <NotificationModal
                  notifications={notifications}
                  setShowNotifications={setShowNotifications}
                  goComment={goComment}
                  handleRead={handleRead}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  selectedPostId={selectedPostId}
                />
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
                width={43}
                className={`pt-1 ${userToken ? "stroke-redPink" : "stroke-[#333]"} `}
              />
            </Link>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
