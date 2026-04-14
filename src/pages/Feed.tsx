import PostCard from "../components/PostCard";
import { useAuth } from "../context/useAuth";
import { getFeed } from "../api/axios";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types";
import { useQuery } from "@tanstack/react-query";
import { PostSkeleton } from "../skeleton/FeedSkeleton";
import { useLikePost } from "../hooks/useLike";
import { useCreateComment } from "../hooks/useComments";

export const Feed = () => {
  const { userToken, pet } = useAuth();
  const navigate = useNavigate();

  const likeMutation = useLikePost();
  const commentMutation = useCreateComment();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed", pet?.id],
    queryFn: () => getFeed(pet?.id),
  });

  // const commentMutation = useMutation({
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   mutationFn: ({ postId, petId, content }: any) =>
  //     createComment(postId, petId, content),

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["feed"] });
  //   },
  // });
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

  return (
    <>
      {posts.map((p: Post) => (
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
