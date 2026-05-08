/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsService } from "../api";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, petId, content }: any) =>
      commentsService.create({ postId, petId, content }),

    onMutate: async ({ postId, content, petId }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      await queryClient.cancelQueries({
        queryKey: ["post", postId],
      });

      await queryClient.cancelQueries({
        queryKey: ["feed"],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);

      const previousPost = queryClient.getQueryData(["post", postId]);
      const previousFeed = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(["comments", postId], (old: any = []) => [
        ...old,
        {
          id: Math.random(),
          content,
          createdAt: new Date().toISOString(),
          pet: { id: petId },
        },
      ]);

      queryClient.setQueryData(["post", postId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          _count: {
            ...old._count,
            comments: old._count.comments + 1,
          },
        };
      });

      queryClient.setQueryData(["feed"], (old: any = []) =>
        old.map((post: any) =>
          post.postId === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  comments: post._count.comments + 1,
                },
              }
            : post,
        ),
      );

      return { previousComments, previousPost, previousFeed };
    },

    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ["comments", variables.postId],
        context?.previousComments,
      );

      queryClient.setQueryData(
        ["post", variables.postId],
        context?.previousPost,
      );

      queryClient.setQueryData(["feed"], context?.previousFeed);
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });
};
