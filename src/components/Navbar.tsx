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
  const location = useLocation();

  const [scroll, setScroll] = useState(false);

  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const [selectedPostId, setSelectedPostId] = useState<Perfil | null>(null);

  const queryClient = useQueryClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);

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
            className={`font-title text-primary text-[2.2rem] ${scroll ? "inScroll:-translate-x-48 inScroll:backdrop-blur-none backdrop-blur-[1px] 2xl:text-[2rem]" : ""} hidden transition-all duration-700 ease-in-out md:block`}
          >
            Michigram
          </Link>
          {scroll ? (
            <div className="bg-background fixed right-0 bottom-0 left-0 flex h-20 w-screen items-center justify-between p-5 transition-all duration-700 ease-in-out md:hidden md:bg-inherit dark:bg-[#0e0e0f]">
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
                  width={39}
                  className={`pt-1 ${userToken ? "stroke-[#da1b41]" : "stroke-[#333]"} `}
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

          <motion.button
            whileHover={{ scale: 1.14 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={
              "dark:text-background bg-background text-primaryText z-50 flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-[#791f4c2a] font-semibold hover:opacity-90 dark:border-0 dark:bg-[#161515]" +
              (scroll
                ? " fixed top-0 right-1 mt-2 ml-auto px-1 py-2 text-sm md:top-auto md:right-8 md:bottom-11 dark:bg-[#161515]"
                : " top-0 left-0")
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
              "flex h-12 items-center gap-5 transition-all duration-700 ease-in-out md:gap-8 " +
              (scroll
                ? "inScroll:translate-x-48 inScroll:backdrop-blur-none hidden backdrop-blur-[1px] md:flex"
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
                  <span className="text-background absolute -top-1 -right-1 flex animate-bounce items-center justify-center rounded-full bg-[#f54669] px-1 text-xs">
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
                width={40}
                className={`pt-1 ${userToken ? "stroke-[#da1b41]" : "stroke-[#333]"} `}
              />
            </Link>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
