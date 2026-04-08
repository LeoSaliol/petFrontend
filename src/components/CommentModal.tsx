import { useEffect, useState } from 'react';

import { createComment, getComments } from '../api/axios';
import { timeAgoShort } from '../utils/time';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Perfil } from '../types';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    pet: {
        id: number;
        name: string;
        image: string;
    };
    petId: number;
    postId: number;
    newComment?: string;
}

export const CommentModal = ({
    pcomment,
    closeModal,
}: {
    pcomment: Perfil | null;
    closeModal: () => void;
}) => {
    // const [comments, setComments] = useState<Comment[]>([]);

    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', pcomment?.postId],
        queryFn: () => getComments(pcomment!.postId),
        enabled: !!pcomment?.postId,
    });

    const queryClient = useQueryClient();
    useEffect(() => {
        // const fetchComments = async () => {
        //     const commentsData = await getComments(pcomment!.postId);
        //     setComments(commentsData);
        // };
        // fetchComments();
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [closeModal]);

    const { pet } = useAuth();

    const commentMutation = useMutation({
        mutationFn: ({ postId, petId, content }: any) =>
            createComment(postId, petId, content),

        onMutate: async ({ postId, content, petId }) => {
            await queryClient.cancelQueries({
                queryKey: ['comments', postId],
            });

            const previousComments = queryClient.getQueryData([
                'comments',
                postId,
            ]);

            queryClient.setQueryData(['comments', postId], (old: any = []) => [
                ...old,
                {
                    id: Math.random(), // temporal
                    content,
                    createdAt: new Date().toISOString(),
                    pet: {
                        id: petId,
                        name: pet?.name || '',
                        image: pet?.image || '',
                    },
                    petId,
                    postId,
                },
            ]);

            return { previousComments };
        },

        onError: (err, variables, context) => {
            queryClient.setQueryData(
                ['comments', variables.postId],
                context?.previousComments,
            );
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['comments', variables.postId],
            });

            // 🔥 también actualiza contador en feed
            queryClient.invalidateQueries({ queryKey: ['feed'] });
        },
    });

    const handleComment = async (
        e: React.FormEvent<HTMLFormElement>,
        postId: number,
        petId: number,
    ) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(e.currentTarget);
        const content = formData.get('comment') as string;

        commentMutation.mutate({ postId, petId, content });

        form.reset();
        // try {
        //     const newComment = await createComment(postId, petId, content);

        //     setComments((prevComments) => [
        //         ...prevComments,
        //         {
        //             id: newComment.id,
        //             content: newComment.content,
        //             createdAt: newComment.createdAt,
        //             pet: {
        //                 id: petId,
        //                 name: pet?.name || '',
        //                 image: pet?.image || '',
        //             },
        //             petId,
        //             postId,
        //         },
        //     ]);
        //     form.reset();
        // } catch (error) {
        //     console.log(error);
        // }
    };

    if (isLoading) {
        <div className="text-xl">cargando</div>;
    }

    return (
        <div
            className="bg-[#34363471] text-background   fixed top-0 left-0 h-full w-full z-50"
            onClick={() => {
                closeModal();
            }}
        >
            <div className="flex    py-16 justify-center  h-full    ">
                <img
                    src={pcomment?.postImg}
                    alt="Post"
                    className="w-140 h-[85%] object-cover rounded-l-lg"
                    onClick={(e) => e.stopPropagation()}
                />
                <div
                    className="pt-7 px-5  relative h-[85%] w-[25%] bg-[#130f11] rounded-r-lg flex flex-col overflow-hidden "
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex gap-3 items-center">
                        <Link
                            to={`/profile/${pcomment?.id}`}
                            onClick={closeModal}
                        >
                            <img
                                src={pcomment?.image}
                                alt={pcomment?.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </Link>
                        <Link
                            to={`/profile/${pcomment?.id}`}
                            onClick={closeModal}
                        >
                            <p className="font-semibold text-lg">
                                {pcomment?.name}
                            </p>
                        </Link>
                        <span className="ml-auto">
                            {' '}
                            {timeAgoShort(pcomment!.createdAt)}{' '}
                        </span>
                    </div>

                    <p className="mx-6 pl-9 text-sm font-light -mt-2">
                        {pcomment?.content}
                    </p>
                    <div className="flex-1 overflow-y-auto  custom-scrollbar mt-4 pr-2">
                        {comments.length > 0 ? (
                            comments.map((comment: Comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-center gap-3 mt-4"
                                >
                                    <Link
                                        to={`/profile/${comment.pet.id}`}
                                        onClick={closeModal}
                                    >
                                        <img
                                            src={comment.pet.image}
                                            alt={comment.pet.name}
                                            className="self-start w-10 h-10 rounded-full object-cover"
                                        />
                                    </Link>

                                    <p className="text-sm flex-1 ">
                                        <Link
                                            to={`/profile/${comment.pet.id}`}
                                            className="font-bold"
                                            onClick={closeModal}
                                        >
                                            {comment.pet.name}
                                        </Link>{' '}
                                        {comment.content}
                                    </p>
                                    <p className="text-sm  text-gray-500">
                                        {timeAgoShort(comment.createdAt)}{' '}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500 mt-4">
                                No hay comentarios aún
                            </p>
                        )}
                    </div>
                    <form
                        className="mt-2 -mx-5"
                        onSubmit={(e) =>
                            handleComment(e, pcomment!.postId, pet!.id)
                        }
                    >
                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            className={`bg-transparent border border-[#b6a5ad28] focus:outline-none focus:ring-1 focus:ring-[#5f59596e] w-full  px-3 py-3 text-sm ${!pet ? 'opacity-70 cursor-not-allowed' : ''} `}
                            name="comment"
                            disabled={!pet}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};
