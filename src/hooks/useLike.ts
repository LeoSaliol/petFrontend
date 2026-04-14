/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../api/axios";

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: number }) => toggleLike(postId),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previous = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(["feed"], (old: any = []) =>
        old.map((post: any) =>
          post.postId === postId
            ? {
                ...post,
                likedByUser: !post.likedByUser,
                _count: {
                  ...post._count,
                  likes: post.likedByUser
                    ? post._count.likes - 1
                    : post._count.likes + 1,
                },
              }
            : post,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["feed"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
