import { CreatePostButton } from '../components/ButtonPost';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/useAuth';
import { createComment, getFeed, toggleLike } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PostSkeleton } from '../skeleton/FeedSkeleton';

export const Feed = () => {
    const { userToken, pet } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: posts, isLoading } = useQuery({
        queryKey: ['feed', pet?.id],
        queryFn: () => getFeed(pet?.id),
    });
    // useEffect(() => {
    //     axios
    //         .get('/posts/feed', {
    //             params: {
    //                 petId: pet?.id,
    //             },
    //         })
    //         .then((res) => {
    //             setPosts(res.data);
    //         });
    // }, [pet]);

    const mutation = useMutation({
        mutationFn: ({ postId }: { postId: number }) => toggleLike(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed', pet?.id] });
        },
    });
    const commentMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: ({ postId, petId, content }: any) =>
            createComment(postId, petId, content),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed'] });
        },
    });
    const handleLike = async (postId: number) => {
        // try {
        //     if (!userToken) {
        //         navigate('/login');
        //         return;
        //     }

        //     const response = await toggleLike(postId);
        //     const liked = response.liked; // 👈 clave

        //     setPosts((prevPosts) =>
        //         prevPosts.map((post) => {
        //             if (post.id === postId) {
        //                 return {
        //                     ...post,
        //                     likedByUser: liked,
        //                     _count: {
        //                         ...post._count,
        //                         likes: liked
        //                             ? post._count.likes + 1
        //                             : post._count.likes - 1,
        //                     },
        //                 };
        //             }
        //             return post;
        //         }),
        //     );
        // } catch (error) {
        //     console.error('Error toggling like:', error);
        // }
        if (!userToken) {
            navigate('/login');
            return;
        }
        mutation.mutate({ postId });
    };

    const handleComment = async (
        e: React.FormEvent<HTMLFormElement>,
        postId: number,
        petId: number,
    ) => {
        e.preventDefault();

        // if (userToken) {
        //     const form = e.currentTarget;
        //     const formData = new FormData(e.currentTarget);
        //     const content = formData.get('comment') as string;

        //     try {
        //         await createComment(postId, petId, content);

        //         setPosts((prevPosts) =>
        //             prevPosts.map((post) => {
        //                 if (post.id === postId) {
        //                     return {
        //                         ...post,
        //                         newComment: content,
        //                         _count: {
        //                             ...post._count,
        //                             comments: post._count.comments + 1,
        //                         },
        //                     };
        //                 }
        //                 return post;
        //             }),
        //         );
        //         form.reset();
        //     } catch (error) {
        //         console.error('Error creating comment:', error);
        //     }
        // } else {
        //     navigate('/login');
        // }
        if (!userToken) {
            navigate('/login');
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form);
        const content = formData.get('comment') as string;

        commentMutation.mutate({ postId, petId, content });

        form.reset();
    };
    if (isLoading) {
        return <PostSkeleton />;
    }
    return (
        <>
            {userToken && <CreatePostButton />}
            {posts.map((p: Post) => (
                <PostCard
                    key={p.id}
                    post={p}
                    handleLike={(postId) => handleLike(postId)}
                    handleComment={(e, postId, petId) =>
                        handleComment(e, postId, petId)
                    }
                />
            ))}
        </>
    );
};
