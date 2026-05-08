/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likesService } from "../api";

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: number }) => likesService.toggle(postId),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previousFeed = queryClient.getQueryData(["feed"]);
      const previousPost = queryClient.getQueryData(["post", postId]);

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

      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          likedByUser: !old.likedByUser,
          _count: {
            ...old._count,
            likes: old.likedByUser
              ? old._count.likes - 1
              : old._count.likes + 1,
          },
        };
      });

      return { previousFeed, previousPost };
    },

    onError: (_err, { postId }, context) => {
      queryClient.setQueryData(["feed"], context?.previousFeed);
      queryClient.setQueryData(["post", postId], context?.previousPost);
    },

    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
