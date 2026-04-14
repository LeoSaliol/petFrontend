/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/axios";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, petId, content }: any) =>
      createComment(postId, petId, content),

    onMutate: async ({ postId, content, petId }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previous = queryClient.getQueryData(["comments", postId]);

      queryClient.setQueryData(["comments", postId], (old: any = []) => [
        ...old,
        {
          id: Math.random(),
          content,
          createdAt: new Date().toISOString(),
          pet: { id: petId },
        },
      ]);

      return { previous };
    },

    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ["comments", variables.postId],
        context?.previous,
      );
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
