/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { CatPorfileIcon } from "../icons/CatPorfileIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { LoginIcon } from "../icons/LoginIcon";
import { useAuth } from "../context/useAuth";
import { notificationsService, postsService, authService } from "../api";
import { useEffect, useState, useMemo } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentModal } from "./CommentModal";
import type { Perfil } from "../types";
import { CreatePostButton } from "./ButtonPost";
import { useTheme } from "../hooks/useDarkTheme";
import { MoonIcon, SunIcon } from "../icons/ThemeIcon";
import { NotificationModal } from "./NotificationModal";
import { MessagesIcon } from "../icons/MessageIcon";
import { useChat } from "../hooks/useChat";
import type { Notification as NotificationType } from "../types/notification";

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
  const totalUnread = useMemo(
    () => conversations.reduce((acc, conv) => acc + conv.unreadCount, 0),
    [conversations],
  );
  const loggout = async () => {
    await authService.logout();
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
    queryFn: () => notificationsService.getAll(pet!.id, 5),
    enabled: !!pet?.id,
  });
  const unread = notifications.filter(
    (n: NotificationType) => !n.isRead,
  ).length;

  const handleNotification = () => {
    setShowNotifications((prev) => !prev);
  };
  const handleRead = async (id: string) => {
    await notificationsService.markAsRead(id);

    queryClient.setQueryData(["notifications", "preview"], (old: any) => {
      return old.map((n: any) => (n.id === id ? { ...n, isRead: true } : n));
    });
  };

  const goComment = async (p: number) => {
    const postData = await queryClient.fetchQuery({
      queryKey: ["post", p],
      queryFn: () => postsService.getById(p),
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
        <div className="flex items-center justify-between pt-4">
          <Link
            to="/"
            className={`flex items-center gap-2 ${scroll ? "inScroll:-translate-x-48 2xl:text-2xl" : ""} hidden transition-all duration-900 ease-in-out md:block`}
          >
            <img
              src={theme === "dark" ? "/M Logo White.png" : "/M Logo Black.png"}
              alt="Michigram"
              className="h-18 w-24 md:h-20 md:w-30 md:object-contain"
            />
          </Link>
          {scroll ? (
            <div className="bg-primaryWhite fixed right-0 bottom-0 left-0 flex h-20 w-screen items-center justify-between p-5 transition-all duration-700 ease-in-out md:hidden md:bg-inherit dark:bg-[#0e0e0f]">
              <Link to="/" className="flex items-center gap-1">
                <img
                  src={
                    theme === "dark" ? "/M Logo White.png" : "/M Logo Black.png"
                  }
                  alt="Michigram"
                  className="h-24 w-24 object-contain"
                />
              </Link>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/notifications">
                  <NotificationIcon
                    width={32}
                    onClick={handleNotification}
                    className="dark:fill-primaryWhite cursor-pointer"
                  />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={userToken ? `/chats` : "/login"}>
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs text-white">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                  <MessagesIcon
                    width={32}
                    className="dark:fill-primaryWhite -rotate-45 cursor-pointer"
                  />
                </Link>
              </motion.div>
              {userToken && <CreatePostButton clasN=" " />}
              <Link to={userToken ? `/profile/${pet?.id}` : "/login"}>
                {userToken ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    src={pet?.image}
                    alt="Pet Profile"
                    className="mx-auto h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <CatPorfileIcon width={32} />
                )}
              </Link>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" onClick={userToken ? loggout : undefined}>
                  <LoginIcon
                    width={32}
                    isLoggedIn={!!userToken}
                    className={`${userToken ? "stroke-redPink" : "stroke-primaryBlack dark:stroke-primaryWhite"} `}
                  />
                </Link>
              </motion.div>
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-1 transition-all duration-700 ease-in-out md:hidden"
            >
              <img
                src={
                  theme === "dark" ? "/M Logo White.png" : "/M Logo Black.png"
                }
                alt="Michigram"
                className="h-18 w-18 object-contain"
              />
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.14 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={
              "dark:text-primaryWhite bg-primaryWhite text-primaryBlack fixed right-10 bottom-16 z-50 mt-2 ml-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#791f4c2a] px-1 py-2 text-sm font-semibold hover:opacity-90 md:top-auto md:right-8 md:bottom-11 dark:border-0 dark:bg-[#161515]"
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
              "relative flex h-12 items-center justify-between transition-all duration-700 ease-in-out md:w-62 md:gap-2 " +
              (scroll
                ? " inScroll:translate-x-68 inScroll:backdrop-blur-none hidden backdrop-blur-[1px] md:flex"
                : "w-64 md:w-80")
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
              whileHover={{ rotate: -15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to={userToken ? `/chats` : "/login"}>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.85, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <MessagesIcon className="dark:fill-primaryWhite mb-1 w-8 -rotate-45 cursor-pointer dark:w-8" />
                </motion.div>
              </Link>
            </motion.div>
            <div className="dark:text-primaryWhite">
              <div
                className="relative cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <motion.div
                  onHoverStart={() => setBouncing(false)}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <NotificationIcon
                    width={32}
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
                  notifications={notifications.slice(0, 5)}
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

            <motion.div>
              <Link to="/login" onClick={userToken ? loggout : undefined}>
                <LoginIcon
                  width={43}
                  isLoggedIn={!!userToken}
                  className={`pt-1 ${userToken ? "stroke-redPink" : "stroke-primaryBlack dark:stroke-primaryWhite"} `}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
