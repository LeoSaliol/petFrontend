/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { motion } from "framer-motion";

import { commentsService } from "../api";
import { postsService } from "../api";

const createComment = (postId: number, petId: number, content: string) =>
  commentsService.create({ postId, petId, content });
const getComments = (postId: number) => commentsService.getByPost(postId);
const getPost = (postId: number) => postsService.getById(postId);
const deletePost = (postId: number) => postsService.delete(postId);
import { timeAgoShort } from "../utils/time";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Perfil, Comment } from "../types";
import { toast } from "sonner";
import { ConfigPost } from "./ConfigPost";
import { CommentIcon } from "../icons/CommentIcon";
import { HeartIcon } from "../icons/LikeIcon";
import { useLikePost } from "../hooks/useLike";
import { CommentSkeleton } from "./skeletons";

export const CommentModal = ({
  pcomment,
  closeModal,
}: {
  pcomment: Perfil | null;
  closeModal: () => void;
}) => {
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", pcomment?.postId],
    queryFn: () => getComments(pcomment!.postId),
    enabled: !!pcomment?.postId,
  });
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", pcomment?.postId],
    queryFn: () => getPost(pcomment!.postId),
    enabled: !!pcomment?.postId,
  });
  const navigate = useNavigate();
  const likeMutation = useLikePost();

  const queryClient = useQueryClient();
  useEffect(() => {
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

    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ["comments", variables.postId],
        context?.previousComments,
      );
    },

    onSettled: (_data, _error, variables) => {
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
  const handleDelete = async (postId: number) => {
    try {
      const res = await deletePost(postId);
      if (res === "Post deleted") {
        toast.success("Post eliminado correctamente");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate(0);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post: { id: number; content: string; image: string }) => {
    navigate("/create-post", {
      state: {
        post: {
          id: post!.id,
          content: post.content,
          image: post.image,
        },
      },
    });
  };

  if (commentsLoading || postLoading) {
    return <CommentSkeleton />;
  }

  return (
    <div
      className="text-primaryWhite fixed top-0 left-0 z-90 h-full w-full bg-[#0d0e0ff3] md:bg-[#34363471]"
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

        <div className="relative">
          <div
            className="absolute right-3 bottom-[-2.4rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <ConfigPost
              classGroup=" right-2 top-8  "
              handleDelete={() => handleDelete(pcomment!.postId)}
              handleEdit={() =>
                handleEdit({
                  id: pcomment!.postId,
                  content: pcomment!.content,
                  image: pcomment!.postImg,
                })
              }
            />
          </div>
        </div>
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
          <div className="mt-4 mb-3 ml-1 flex items-center gap-3">
            <motion.span
              className="flex items-center gap-1"
              onClick={() => likeMutation.mutate({ postId: pcomment!.postId })}
              whileTap={{ scale: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: post?.likes.some((like: any) => like.petId === pet?.id) ? -15 : 0 }}
                whileTap={{ scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <HeartIcon
                  width={24}
                  className={`h-7 w-7 cursor-pointer ${post?.likes.some((like: any) => like.petId === pet?.id) ? "fill-likeColor dark:stroke-likeColor" : "dark:stroke-primaryWhite"} `}
                />
              </motion.div>{" "}
              {post?._count.likes}
            </motion.span>
            <motion.span 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                <CommentIcon
                  width={24}
                  className="dark:stroke-primaryWhite h-6 w-6 cursor-pointer"
                />
              </motion.div>{" "}
              {pcomment?._count.comments}
            </motion.span>
          </div>
          <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            {comments.length > 0 ? (
              comments.map((comment: Comment) => (
                <div key={comment.id} className="mt-3 flex items-center gap-3">
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
