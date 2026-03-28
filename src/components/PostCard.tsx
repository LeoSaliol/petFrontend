import { useState } from 'react';
import { CommentIcon } from '../icons/CommentIcon';
import { HeartIcon } from '../icons/LikeIcon';

import { timeAgoShort } from '../utils/time';
import { useAuth } from '../context/useAuth';

import { CommentModal } from './CommentModal';
import type { Post } from '../types';
import { useNavigate } from 'react-router-dom';

interface Perfil {
    id: number;
    name: string;
    image: string;
    content: string;
    postId: number;
    postImg: string;
}

export default function PostCard({
    post,
    handleLike,
    handleComment,
}: {
    post: Post;
    handleLike: (postId: number, petId: number) => void;
    handleComment: (
        e: React.FormEvent<HTMLFormElement>,
        postId: number,
        petId: number,
    ) => void;
}) {
    const [openModal, setOpenModal] = useState<boolean | null>(false);
    const [selectedPostId, setSelectedPostId] = useState<Perfil | null>(null);
    const navigate = useNavigate();
    const { pet, userToken } = useAuth();

    const openCommentModal = (post: Perfil) => {
        if (!userToken) {
            navigate('/login');
            return;
        }
        setOpenModal(true);
        setSelectedPostId(post);
    };
    return (
        <>
            {openModal && userToken && (
                <CommentModal
                    pcomment={selectedPostId}
                    closeModal={() => setOpenModal(false)}
                />
            )}
            <div
                key={post.id}
                className=" rounded-xl w-full border  border-[#b6a5ad11] mb-6 mt-11"
            >
                <div className=" flex items-center  p-4 gap-3">
                    <img
                        src={post.pet.image}
                        alt={post.pet.name}
                        className="w-10 h-10 rounded-full mx-3 object-cover"
                    />
                    <span className="font-content ">{post.pet.name} </span>
                    <span className="text-xs text-[#a58e99] ml-auto">
                        {timeAgoShort(post.createdAt)}
                    </span>
                </div>
                <picture>
                    <img
                        src={post.image}
                        alt="Cat"
                        className=" aspect-60/70 w-[45%] object-cover mx-auto rounded-lg"
                    />
                </picture>
                <div className="p-4 mx-4">
                    <div className="flex items-center gap-4 mb-2">
                        <span
                            className="flex items-center gap-1  "
                            onClick={() => handleLike(post.id, post.pet.id)}
                        >
                            {}
                            <HeartIcon
                                className="w-7 h-7 cursor-pointer "
                                stroke={post.liked ? '#ED6B86' : '#000'}
                                fill={post.liked ? '#ED6B86' : 'none'}
                            />

                            <span>{post._count.likes}</span>
                        </span>

                        <span className="flex items-center gap-2">
                            <CommentIcon
                                className="w-6 h-6 cursor-pointer"
                                onClick={() =>
                                    openCommentModal({
                                        id: post.pet.id,
                                        name: post.pet.name,
                                        image: post.pet.image,
                                        content: post.content,
                                        postId: post.id,
                                        postImg: post.image,
                                    })
                                }
                            />
                            <span>{post._count.comments}</span>
                        </span>
                    </div>

                    <div className="text-lg flex gap-2 items-center">
                        {' '}
                        <p className=" font-semibold">{post.pet.name}</p>{' '}
                        <p>{post.content}</p>
                    </div>
                    {post.newComment && (
                        <p className="text-md ml-2 py-1  animate-fadeIn">
                            <span className="font-semibold  ">
                                {pet?.name}{' '}
                            </span>{' '}
                            {post.newComment}
                        </p>
                    )}
                    <form
                        className="mt-3 "
                        onSubmit={(e) => handleComment(e, post.id, post.pet.id)}
                    >
                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            className="bg-transparent border border-[#b6a5ad28] focus:outline-none focus:ring-1 focus:ring-[#5f59596e] w-full rounded-lg px-3 py-2 text-sm"
                            name="comment"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
