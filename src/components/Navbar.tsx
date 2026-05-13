/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { CatPorfileIcon } from "../icons/CatPorfileIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { LoginIcon } from "../icons/LoginIcon";
import { useAuth } from "../context/useAuth";
import { notificationsService, postsService, authService } from "../api";
import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentModal } from "./CommentModal";
import type { Perfil } from "../types";
import { CreatePostButton } from "./ButtonPost";
import { useTheme } from "../hooks/useDarkTheme";
import { MoonIcon, SunIcon } from "../icons/ThemeIcon";
import { NotificationModal } from "./NotificationModal";
import { MessagesIcon } from "../icons/MessageIcon";
import type { Notification as NotificationType } from "../types/notification";
import LogoWhite from "../assets/MLogoWhite.png";
import LogoDark from "../assets/MLogoBlack.png";
import { useChatContext } from "../context/ChatContext";

export default function Navbar() {
  const { userToken, pet, refreshUser } = useAuth();
  const { conversations } = useChatContext();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [bouncing, setBouncing] = useState(false);
  const [scroll, setScroll] = useState(false);

  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const [selectedPostId, setSelectedPostId] = useState<Perfil | null>(null);

  const queryClient = useQueryClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
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

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", "preview"],
    queryFn: () => notificationsService.getAll(pet!.id, 5),
    enabled: !!pet?.id,
  });
  const unread = notifications.filter(
    (n: NotificationType) => !n.isRead,
  ).length;

  const msgUnreadCount = conversations.reduce(
    (acc, conv) => acc + conv.unreadCount,
    0,
  );
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
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className={`font-title text-primaryBlack dark:text-primaryWhite text-[2.2rem] ${scroll ? "inScroll:-translate-x-48 inScroll:backdrop-blur-none backdrop-blur-[1px] 2xl:text-[2rem]" : ""} hidden h-16 transition-all duration-700 ease-in-out md:block`}
          >
            {theme === "dark" ? (
              <img src={LogoWhite} alt="Logo" className="h-full w-auto" />
            ) : (
              <img src={LogoDark} alt="Logo" className="h-full w-auto" />
            )}
          </Link>
          {scroll ? (
            <div className="bg-primaryWhite fixed right-0 bottom-0 left-0 flex h-16 w-screen items-center justify-around gap-8 px-4 transition-all duration-700 ease-in-out md:hidden dark:bg-[#0e0e0f]">
              <Link
                to="/"
                className="font-title text-primaryBlack dark:text-primaryWhite h-8 text-[2rem]"
              >
                {theme === "dark" ? (
                  <img src={LogoWhite} alt="Logo" className="h-full w-auto" />
                ) : (
                  <img src={LogoDark} alt="Logo" className="h-full w-auto" />
                )}
              </Link>
              <Link to="/notifications">
                <NotificationIcon className="dark:fill-primaryWhite w-9 cursor-pointer" />
              </Link>
              <Link to={userToken ? `/chats` : "/login"}>
                <MessagesIcon
                  width={32}
                  className="dark:fill-primaryWhite -rotate-45 cursor-pointer"
                />
              </Link>
              {userToken && <CreatePostButton clasN=" " />}
              <Link to={userToken ? `/profile/${pet?.id}` : "/login"}>
                {userToken ? (
                  <img
                    src={pet?.image}
                    alt="Pet Profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <CatPorfileIcon width={30} />
                )}
              </Link>

              <Link to="/login" onClick={userToken ? loggout : undefined}>
                <LoginIcon
                  width={30}
                  className={userToken ? "stroke-redPink" : "stroke-[#333]"}
                />
              </Link>
            </div>
          ) : (
            <Link
              to="/"
              className="font-title text-primaryBlack dark:text-primaryWhite h-14 text-[2rem] transition-all duration-700 ease-in-out md:hidden"
            >
              {theme === "dark" ? (
                <img src={LogoWhite} alt="Logo" className="h-full w-auto" />
              ) : (
                <img src={LogoDark} alt="Logo" className="h-full w-auto" />
              )}
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.14 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`dark:text-primaryWhite bg-primaryWhite text-primaryBlack fixed z-50 mt-2 ml-auto flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-[#791f4c2a] px-1 py-2 text-sm font-semibold hover:opacity-90 dark:border-0 dark:bg-[#161515] ${
              scroll
                ? "top-4 right-4 md:top-4 md:right-8 md:bottom-auto"
                : "right-10 bottom-16 md:right-8 md:bottom-11"
            }`}
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
              "relative flex h-12 items-center justify-between gap-7 transition-all duration-700 ease-in-out md:w-62 md:gap-2" +
              (scroll
                ? " inScroll:translate-x-68 inScroll:backdrop-blur-none hidden backdrop-blur-[1px] md:flex"
                : "w-80")
            }
          >
            <motion.div
              className=""
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
                <MessagesIcon className="dark:fill-primaryWhite mb-1 w-8 -rotate-45 cursor-pointer" />
              </Link>
            </motion.div>
            {msgUnreadCount > 0 && (
              <span
                className={
                  "text-primaryWhite bg-pinkNotify absolute top-0.5 left-5 items-center justify-center rounded-full px-1 " +
                  (bouncing ? "animate-bounce" : "") +
                  " text-xs"
                }
              >
                {msgUnreadCount}
              </span>
            )}
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

            <Link to="/login" onClick={userToken ? loggout : undefined}>
              <LoginIcon
                className={`-ml-2 w-9 ${userToken ? "stroke-redPink" : "stroke-[#333]"} `}
              />
            </Link>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
