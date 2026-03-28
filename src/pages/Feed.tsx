import { useEffect, useState } from 'react';
import { CreatePostButton } from '../components/ButtonPost';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/useAuth';
import { createComment, getPosts, toggleLike } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';

export const Feed = () => {
    const { userToken } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getPosts();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId: number, petId: number) => {
        if (userToken) {
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
        } else {
            navigate('/login');
        }
    };
    const handleComment = async (
        e: React.FormEvent<HTMLFormElement>,
        postId: number,
        petId: number,
    ) => {
        e.preventDefault();

        if (userToken) {
            const form = e.currentTarget;
            const formData = new FormData(e.currentTarget);
            const content = formData.get('comment') as string;

            try {
                await createComment(postId, petId, content);

                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                newComment: content,
                                _count: {
                                    ...post._count,
                                    comments: post._count.comments + 1,
                                },
                            };
                        }
                        return post;
                    }),
                );
                form.reset();
            } catch (error) {
                console.error('Error creating comment:', error);
            }
        } else {
            navigate('/login');
        }
    };
    return (
        <>
            {userToken && <CreatePostButton />}
            {posts.map((p: Post) => (
                <PostCard
                    key={p.id}
                    post={p}
                    handleLike={(postId, petId) => handleLike(postId, petId)}
                    handleComment={(e, postId, petId) =>
                        handleComment(e, postId, petId)
                    }
                />
            ))}
        </>
    );
};
