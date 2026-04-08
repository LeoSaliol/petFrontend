/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router';

import { CatPorfileIcon } from '../icons/CatPorfileIcon';
import { NotificationIcon } from '../icons/NotificationIcon';
import { LoginIcon } from '../icons/LoginIcon';
import { useAuth } from '../context/useAuth';
import {
    getNotifications,
    getPost,
    logoutUser,
    markAsRead,
} from '../api/axios';
import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentModal } from './CommentModal';
import type { Perfil } from '../types';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW';
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
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications', 'preview'],
        queryFn: () => getNotifications(pet!.id, 5),
        enabled: !!pet?.id,
    });
    const unread = notifications.filter((n: Notification) => !n.isRead).length;

    const handleNotification = () => {
        setShowNotifications((prev) => !prev);
    };
    const handleRead = async (id: string) => {
        await markAsRead(id);

        queryClient.setQueryData(['notifications', 'preview'], (old: any) => {
            return old.map((n: any) =>
                n.id === id ? { ...n, isRead: true } : n,
            );
        });
    };

    const goComment = async (p: number) => {
        const postData = await queryClient.fetchQuery({
            queryKey: ['post', p],
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
            className=" sticky top-0  "
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
            <div className=" flex justify-between items-center">
                <Link
                    to="/"
                    className={`font-title text-[2.2rem] text-primary ${scroll ? 'backdrop-blur-xs 2xl:backdrop-blur-none 2xl:-translate-x-54 2xl:text-[2rem] ' : ''} transition-all duration-700 ease-in-out `}
                >
                    Michigram
                </Link>
                {pet && (
                    <p>
                        {pet.name}:{pet.id}
                    </p>
                )}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={
                        'flex gap-5 items-center h-12 transition-all duration-700 ease-in-out  ' +
                        (scroll
                            ? 'backdrop-blur-xs 2xl:backdrop-blur-none  2xl:translate-x-45'
                            : '')
                    }
                >
                    <div className=" dark:text-background">
                        <div
                            className="relative cursor-pointer "
                            onClick={() => setOpen(!open)}
                        >
                            <div className="transition-transform duration-200 hover:scale-110 ">
                                <NotificationIcon
                                    width={35}
                                    onClick={handleNotification}
                                    className="dark:fill-background"
                                />
                            </div>

                            {unread > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#f54669]  text-xs px-1 rounded-full animate-bounce flex items-center justify-center ">
                                    {unread}
                                </span>
                            )}
                        </div>

                        {showNotifications && (
                            <div className="absolute rounded-md overflow-hidden  right-0 mt-2 flex flex-col gap-1 w-72  shadow-xl z-10 dark:bg-[#1b1a1a] dark:text-background">
                                {notifications.length === 0 ? (
                                    <p className="p-4 text-gray-500">
                                        No tienes notificaciones
                                    </p>
                                ) : (
                                    notifications.map((n: Notification) => (
                                        <div
                                            key={n.id}
                                            className={`py-3  px-5  transition
                                                    ${!n.isRead ? 'bg-gray-100' : 'bg-inherit'}
                                                    hover:bg-gray-900 text-sm
                                                `}
                                        >
                                            {n.type === 'FOLLOW' ? (
                                                <Link
                                                    to={`/profile/${n.actorId}`}
                                                    className=""
                                                    onClick={() =>
                                                        setShowNotifications(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    {n.message}
                                                </Link>
                                            ) : (
                                                <p
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        goComment(n.postId!)
                                                    }
                                                >
                                                    {' '}
                                                    {n.message}{' '}
                                                </p>
                                            )}

                                            {!n.isRead && (
                                                <div
                                                    onMouseEnter={() => {
                                                        if (!n.isRead) {
                                                            setTimeout(() => {
                                                                handleRead(
                                                                    n.id,
                                                                );
                                                            }, 500); // medio segundo
                                                        }
                                                    }}
                                                    className="text-xs text-blue-500 hover:text-blue-700 overflow-hidden"
                                                >
                                                    New
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className=" text-background dark:bg-inherit color-change-2x   py-2 rounded-b-md font-semibold  hover:bg-gray-800 transition mt-1  cursor-pointer"
                                >
                                    Ver todas la notificaciones
                                </button>
                            </div>
                        )}
                    </div>
                    <Link to={userToken ? `/profile/${pet?.id}` : '/login'}>
                        {userToken ? (
                            <img
                                src={pet?.image}
                                alt="Pet Profile"
                                className="w-9 h-9 rounded-full mx-auto object-fill  "
                            />
                        ) : (
                            <CatPorfileIcon width={35} />
                        )}
                    </Link>

                    <Link
                        to="/login"
                        onClick={userToken ? loggout : undefined}
                    >
                        <LoginIcon
                            width={40}
                            className={`pt-1 ${userToken ? 'stroke-red-600' : 'stroke-[#333] '} `}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
