import { useEffect, useState } from "react";

import { createComment, getComments } from "../api/axios";
import { timeAgoShort } from "../utils/time";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Perfil } from "../types";

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
    queryKey: ["comments", pcomment?.postId],
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
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [closeModal]);

  const { pet } = useAuth();

  const commentMutation = useMutation({
    mutationFn: ({ postId, petId, content }: any) =>
      createComment(postId, petId, content),

    onMutate: async ({ postId, content, petId }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);

      queryClient.setQueryData(["comments", postId], (old: any = []) => [
        ...old,
        {
          id: Math.random(), // temporal
          content,
          createdAt: new Date().toISOString(),
          pet: {
            id: petId,
            name: pet?.name || "",
            image: pet?.image || "",
          },
          petId,
          postId,
        },
      ]);

      return { previousComments };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["comments", variables.postId],
        context?.previousComments,
      );
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });

      // 🔥 también actualiza contador en feed
      queryClient.invalidateQueries({ queryKey: ["feed"] });
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
    const content = formData.get("comment") as string;

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
      className="text-background fixed top-0 left-0 z-50 h-full w-full bg-[#0d0e0ff3] md:bg-[#34363471]"
      onClick={() => {
        closeModal();
      }}
    >
      <div className="mt-5 flex h-full flex-col items-center justify-center rounded-xl md:h-full md:flex-row md:items-start md:py-16">
        <img
          src={pcomment?.postImg}
          alt="Post"
          className="h-[45%] object-cover md:h-[85%] md:w-140 md:rounded-l-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="relative mb-7 flex h-[85%] flex-col overflow-hidden bg-[#130f11] px-12 pt-6 md:mt-0 md:w-[25%] md:rounded-r-lg md:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3 md:items-center">
            <Link to={`/profile/${pcomment?.id}`} onClick={closeModal}>
              <img
                src={pcomment?.image}
                alt={pcomment?.name}
                className="h-11 w-11 rounded-full object-cover md:h-12 md:w-12"
              />
            </Link>
            <Link to={`/profile/${pcomment?.id}`} onClick={closeModal}>
              <p className="pt-[0.10rem] font-semibold md:pt-0 md:text-lg">
                {pcomment?.name}
              </p>
            </Link>
            <span className="ml-auto text-sm md:text-lg">
              {" "}
              {timeAgoShort(pcomment!.createdAt)}{" "}
            </span>
          </div>

          <p className="mx-6 -mt-5 pl-[2.1rem] text-sm font-light md:-mt-2 md:pl-9">
            {pcomment?.content}
          </p>
          <div className="custom-scrollbar mt-4 flex-1 overflow-y-auto pr-2">
            {comments.length > 0 ? (
              comments.map((comment: Comment) => (
                <div key={comment.id} className="mt-4 flex items-center gap-3">
                  <Link to={`/profile/${comment.pet.id}`} onClick={closeModal}>
                    <img
                      src={comment.pet.image}
                      alt={comment.pet.name}
                      className="h-10 w-10 self-start rounded-full object-cover"
                    />
                  </Link>

                  <p className="flex-1 text-sm">
                    <Link
                      to={`/profile/${comment.pet.id}`}
                      className="font-bold"
                      onClick={closeModal}
                    >
                      {comment.pet.name}
                    </Link>{" "}
                    {comment.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    {timeAgoShort(comment.createdAt)}{" "}
                  </p>
                </div>
              ))
            ) : (
              <p className="mt-4 text-center text-sm text-gray-500">
                No hay comentarios aún
              </p>
            )}
          </div>
          <form
            className="-mx-6 mt-2"
            onSubmit={(e) => handleComment(e, pcomment!.postId, pet!.id)}
          >
            <input
              type="text"
              placeholder="Escribe un comentario..."
              className={`w-full border border-[#b6a5ad28] bg-transparent px-3 py-3 text-sm focus:ring-1 focus:ring-[#5f59596e] focus:outline-none ${!pet ? "cursor-not-allowed opacity-70" : ""} `}
              name="comment"
              disabled={!pet}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
