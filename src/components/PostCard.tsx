import { useState } from "react";
import { CommentIcon } from "../icons/CommentIcon";
import { HeartIcon } from "../icons/LikeIcon";
import { timeAgoShort } from "../utils/time";
import { useAuth } from "../context/useAuth";
import { CommentModal } from "./CommentModal";
import type { Perfil, Post } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { ConfigPost } from "./ConfigPost";
import { deletePost } from "../api/axios";
import { toast, Toaster } from "sonner";

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
      <div
        key={post.id}
        className="mt-11 mb-24 w-full rounded-xl border border-[#b6a5ad11] md:mb-6 md:py-4"
      >
        <div className="flex items-center gap-1 p-2 py-6 md:p-1">
          <Link to={`/profile/${post.pet.id}`}>
            <img
              src={post.pet.image}
              alt={post.pet.name}
              className="mx-3 h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
            />
          </Link>
          <Link to={`/profile/${post.pet.id}`}>
            <span className="font-content">{post.pet.name} </span>
          </Link>
          <span className="ml-auto text-xs text-[#a58e99]">
            {timeAgoShort(post.createdAt)}
          </span>
        </div>
        <picture>
          <img
            src={post.image}
            alt="Cat"
            className="mx-auto w-[90%] rounded-md object-fill md:aspect-65/70 md:w-[50%]"
          />
        </picture>
        <div className="mx-4 p-2 py-6 md:p-4 md:py-0">
          <div className="mb-2 flex items-center gap-4">
            <span
              className="flex items-center gap-1"
              onClick={() => handleLike(post.id, post.pet.id)}
            >
              <HeartIcon
                className={`h-7 w-7 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 ${post.likedByUser ? "dark:fill-[#ED6B86]" : "dark:stroke-background"} `}
                stroke={post.likedByUser ? "#ED6B86 " : "#000 "}
                fill={post.likedByUser ? "#ED6B86 " : "none"}
              />

              <span className="">{post._count.likes}</span>
            </span>

            <span className="flex items-center gap-2">
              <CommentIcon
                className="dark:stroke-background h-6 w-6 cursor-pointer"
                onClick={() =>
                  openCommentModal({
                    id: post.pet.id,
                    name: post.pet.name,
                    image: post.pet.image,
                    content: post.content,
                    postId: post.id,
                    postImg: post.image,
                    createdAt: post.createdAt,
                  })
                }
              />
              <span>{post._count.comments}</span>
            </span>
            {post.pet.id === userToken && (
              <ConfigPost
                handleDelete={() => handleDelete(post.id)}
                handleEdit={() => handleEdit(post)}
              />
            )}
          </div>

          <div className="items-center gap-2 md:flex md:text-lg">
            <Link to={`/profile/${post.pet.id}`}>
              <span className="font-semibold">{post.pet.name}</span>
            </Link>
            <p className="ml-1 text-sm md:ml-0 md:text-lg">{post.content}</p>
          </div>
          {post.newComment && (
            <p className="md:text-md animate-fadeIn text-md ml-2 py-1">
              <span className="font-semibold">{pet?.name} </span>{" "}
              {post.newComment}
            </p>
          )}
          <form
            className="mt-3"
            onSubmit={(e) => handleComment(e, post.id, post.pet.id)}
          >
            <input
              type="text"
              placeholder="Escribe un comentario..."
              className="w-full rounded-lg border border-[#b6a5ad28] bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-[#5f59596e] focus:outline-none"
              name="comment"
            />
          </form>
        </div>
      </div>
    </>
  );
}
