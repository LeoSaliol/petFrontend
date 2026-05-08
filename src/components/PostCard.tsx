import { useState } from "react";
import { CommentIcon } from "../icons/CommentIcon";
import { HeartIcon } from "../icons/LikeIcon";
import { timeAgoShort } from "../utils/time";
import { useAuth } from "../context/useAuth";
import { CommentModal } from "./CommentModal";
import type { Perfil, Post } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { ConfigPost } from "./ConfigPost";
import { postsService } from "../api";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
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
  // console.log(post, 'Post Card');
  const [openModal, setOpenModal] = useState<boolean | null>(false);
  const [selectedPostId, setSelectedPostId] = useState<Perfil | null>(null);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string | null>(null);
  const { pet, userToken } = useAuth();

  const openCommentModal = (post: Perfil) => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    setOpenModal(true);
    setSelectedPostId(post);
  };

  const handleDelete = async (postId: number) => {
    try {
      const res = await postsService.delete(postId);
      if (res === "Post deleted") {
        toast.success("Post eliminado correctamente");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate(0);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post: Post) => {
    navigate("/create-post", {
      state: {
        post: {
          id: post.id,
          content: post.content,
          image: post.image,
        },
      },
    });
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      {openModal && (
        <CommentModal
          pcomment={selectedPostId}
          closeModal={() => setOpenModal(false)}
        />
      )}
      <article className="z-10 mt-11 mb-24 w-full rounded-xl border border-gray-200 bg-white md:mb-6 md:py-4 dark:border-pink-500/10 dark:bg-inherit">
        <div className="mx-2 flex items-center gap-2 p-2 md:mx-3 md:p-1">
          <Link to={`/profile/${post.pet.id}`}>
            <img
              src={post.pet.image}
              alt={post.pet.name}
              className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <Link to={`/profile/${post.pet.id}`}>
            <span className="font-content font-semibold">{post.pet.name}</span>
          </Link>
          <span className="ml-auto text-xs text-[#a58e99]">
            {timeAgoShort(post.createdAt)}
          </span>
        </div>
        <picture>
          <img
            src={post.image}
            alt="Cat"
            className="mx-auto w-[90%] rounded-md object-fill md:aspect-5/5 md:w-[50%]"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="mx-4 p-2 md:p-4">
          <div className="mb-2 flex items-center gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.2 }}
              className="flex items-center gap-1 rounded p-1 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:hover:bg-inherit"
              onClick={() => handleLike(post.id, post.pet.id)}
              aria-label={post.likedByUser ? "Quitar me gusta" : "Dar me gusta"}
            >
              <HeartIcon
                className={`h-7 w-7 cursor-pointer ease-in-out ${post.likedByUser ? "fill-likeColor stroke-likeColor" : "stroke-primaryBlack dark:stroke-primaryWhite fill-primaryWhite dark:fill-none"} `}
              />

              <span>{post._count.likes}</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.2 }}
              aria-label="Ver comentarios"
              className="flex cursor-pointer items-center gap-2 rounded border-none bg-transparent p-0 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:hover:bg-inherit"
              onClick={() =>
                openCommentModal({
                  id: post.pet.id,
                  name: post.pet.name,
                  image: post.pet.image,
                  content: post.content,
                  postId: post.id,
                  postImg: post.image,
                  createdAt: post.createdAt,
                  _count: {
                    likes: post._count.likes,
                    comments: post._count.comments,
                  },
                  likedByUser: post.likedByUser,
                })
              }
            >
              <CommentIcon className="dark:stroke-primaryWhite h-6 w-6 cursor-pointer" />
              <span>{post._count.comments}</span>
            </motion.button>

            {post.pet.id === pet?.id && (
              <ConfigPost
                handleDelete={() => handleDelete(post.id)}
                handleEdit={() => handleEdit(post)}
              />
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Link
              to={`/profile/${post.pet.id}`}
              className="text-md font-semibold md:text-lg"
            >
              {post.pet.name}
            </Link>
            <p className="md:text-base">{post.content}</p>
          </div>
          {newComment && (
            <p className="animate-fadeIn text-md ml-2 py-1 font-light md:text-[15px]">
              <span className="font-semibold">{pet?.name} </span> {newComment}
            </p>
          )}
          <form
            className="mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              setNewComment(e.currentTarget.comment.value);
              handleComment(e, post.id, post.pet.id);
            }}
          >
            <input
              type="text"
              placeholder="Escribe un comentario..."
              className="placeholder:text-primaryBlack/50 dark:placeholder:text-primaryWhite/50 w-full rounded-lg border border-[#b6a5ad28] bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-[#5f59596e] focus:outline-none"
              name="comment"
            />
          </form>
        </div>
      </article>
    </>
  );
}
