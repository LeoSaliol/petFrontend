import { useEffect, useState } from 'react';
import { CommentIcon } from '../icons/CommentIcon';
import { HeartIcon } from '../icons/LikeIcon';
import { getPosts, toggleLike } from '../api/axios';
import { timeAgoShort } from '../utils/time';

interface Post {
    id: number;
    content: string;
    image: string;
    createdAt: string;
    pet: {
        id: number;
        name: string;
        image: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    liked?: boolean;
}

export default function PostCard() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getPosts();
            setPosts(data);
            console.log(data);
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId: number, petId: number) => {
        // try {
        //     console.log(postId, petId);
        //     const liked: boolean = await toggleLike(postId, petId);
        //     setLiked(liked);
        // } catch (error) {
        //     console.error('Error toggling like:', error);
        // }
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        liked: !post.liked,
                        _count: {
                            ...post._count,
                            likes: post.liked
                                ? post._count.likes - 1
                                : post._count.likes + 1,
                        },
                    };
                }
                return post;
            }),
        );
        try {
            await toggleLike(postId, petId);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <>
            {posts.map((p) => (
                <div
                    key={p.id}
                    className=" rounded-xl w-full border  border-[#b6a5ad11] mb-6 mt-11"
                >
                    <div className=" flex items-center  p-4 gap-3">
                        <img
                            src={p.pet.image}
                            alt={p.pet.name}
                            className="w-10 h-10 rounded-full mx-3 object-cover"
                        />
                        <span className="font-content ">{p.pet.name} </span>
                        <span className="text-xs text-[#a58e99] ml-auto">
                            {timeAgoShort(p.createdAt)}
                        </span>
                    </div>
                    <picture>
                        <img
                            src={p.image}
                            alt="Cat"
                            className=" aspect-60/70 w-[45%] object-cover mx-auto rounded-lg"
                        />
                    </picture>
                    <div className="p-4 mx-4">
                        <div className="flex items-center gap-4 mb-2">
                            <span
                                className="flex items-center gap-1  "
                                onClick={() => handleLike(p.id, p.pet.id)}
                            >
                                <HeartIcon
                                    className="w-7 h-7 cursor-pointer "
                                    stroke={p.liked ? '#ED6B86' : '#000'}
                                    fill={p.liked ? '#ED6B86' : 'none'}
                                />

                                <span>{p._count.likes}</span>
                            </span>

                            <span className="flex items-center gap-2">
                                <CommentIcon className="w-6 h-6" />
                                <span>{p._count.comments}</span>
                            </span>
                        </div>

                        <p className="text-sm">{p.content}</p>
                        <form className="mt-3 ">
                            <input
                                placeholder="Escribe un comentario..."
                                className="bg-transparent border border-[#b6a5ad28] focus:outline-none focus:ring-1 focus:ring-[#fab2a96e] w-full rounded-lg px-3 py-2 text-sm"
                            />
                        </form>
                    </div>
                </div>
            ))}
        </>
    );
}
