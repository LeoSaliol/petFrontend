import PostCard from "../components/PostCard";
import { useAuth } from "../context/useAuth";
import { postsService } from "../api";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types";
import { useQuery } from "@tanstack/react-query";
import { PostSkeleton } from "../components/skeletons/FeedSkeleton";
import { useLikePost } from "../hooks/useLike";
import { useCreateComment } from "../hooks/useComments";

export const Feed = () => {
  const { userToken, pet } = useAuth();
  const navigate = useNavigate();

  const likeMutation = useLikePost();
  const commentMutation = useCreateComment();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed", pet?.id],
    queryFn: () => postsService.getFeed(pet?.id),
  });

  const handleLike = async (postId: number) => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    likeMutation.mutate({ postId });
  };

  const handleComment = async (
    e: React.FormEvent<HTMLFormElement>,
    postId: number,
    petId: number,
  ) => {
    e.preventDefault();

    if (!userToken) {
      navigate("/login");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("comment") as string;

    commentMutation.mutate({ postId, petId, content });

    form.reset();
  };
  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center text-center">
        <svg
          className="h-20 w-20 text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-300">
          No hay publicaciones aún
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          ¡Sé el primero en compartir una foto de tu mascota!
        </p>
      </div>
    );
  }

  return (
    <>
      {posts?.map((p: Post) => (
        <PostCard
          key={p.id}
          post={p}
          handleLike={(postId) => handleLike(postId)}
          handleComment={(e, postId, petId) => handleComment(e, postId, petId)}
        />
      ))}
    </>
  );
};
