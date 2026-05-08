/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { usersService } from "../api";

import { useNavigate, useParams } from "react-router-dom";
import { CommentModal } from "../components/CommentModal";
import { useAuth } from "../context/useAuth";
import { EditIcon } from "../icons/EditIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PerfilSkeleton } from "../components/skeletons/PerfilSkeleton";
import type { Perfil, PostPerfil } from "../types";
import { useChat } from "../hooks/useChat";

export const Profile = () => {
  const { openConversation } = useChat();
  const [commentData, setCommentData] = useState<Perfil | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { id } = useParams();
  const { pet } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: perfilData, isLoading } = useQuery({
    queryKey: ["profile", id, pet?.id],
    queryFn: () => usersService.getProfile(Number(id), pet?.id),
    enabled: !!id,
  });
  queryClient.prefetchQuery({
    queryKey: ["profile", id],
    queryFn: () => usersService.getProfile(Number(id)),
  });

  const followMutation = useMutation({
    mutationFn: (profileId: number) => usersService.follow(profileId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profile", id] });

      const previousData = queryClient.getQueryData(["profile", id, pet?.id]);

      queryClient.setQueryData(["profile", id, pet?.id], (old: any) => {
        if (!old) return old;

        const isFollowing = !old.isFollowing;

        return {
          ...old,
          isFollowing,
          followersCount: isFollowing
            ? old.followersCount + 1
            : old.followersCount - 1,
        };
      });

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["profile", id, pet?.id], context?.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", id] });
    },
  });

  const handlePost = (post: PostPerfil) => {
    setCommentData({
      id: perfilData!.id,
      name: perfilData!.name,
      image: perfilData!.image,
      content: post.content,
      postId: post.id,
      postImg: post.image,
      createdAt: post.createdAt,
      _count: {
        likes: post._count.likes,
        comments: post._count.comments,
      },
    });

    setOpenModal(true);
  };
  const handleFollow = async () => {
    if (!pet || !perfilData) {
      navigate("/login");
      return;
    }
    if (perfilData.id === pet.id) {
      return;
    }
    followMutation.mutate(perfilData.id);
  };

  const handleEditProfile = async () => {
    if (!perfilData) return;
    navigate("/pets", {
      state: {
        pet: {
          id: perfilData.id,
          name: perfilData.name,
          bio: perfilData.bio,
          image: perfilData.image,
        },
      },
    });
  };
  if (isLoading) {
    return <PerfilSkeleton />;
  }

  const handleOpenChat = () => {
    if (!perfilData?.ownerId) return;
    openConversation(perfilData.ownerId);
    navigate("/chats", {
      state: { targetUserId: perfilData.ownerId, pet: perfilData },
    });
  };
  return (
    <>
      {openModal && perfilData && (
        <CommentModal
          pcomment={commentData}
          closeModal={() => setOpenModal(false)}
        />
      )}

      <header className="relative mt-6 flex items-center gap-9 md:gap-16">
        <img
          src={perfilData?.image}
          alt={`Foto de perfil de ${perfilData?.name || "mascota"}`}
          className="h-40 w-40 rounded-full object-cover md:h-56 md:w-56"
        />
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-xl font-bold md:text-2xl">{perfilData?.name}</h1>
          <div className="text-base flex gap-4 md:gap-8">
            <p>{perfilData?.posts?.length || 0} publicaciones</p>
            <p>{perfilData?.followersCount || 0} seguidores</p>
            <p>{perfilData?.followingCount || 0} seguidos</p>
          </div>
          <p className="text-base">{perfilData?.bio}</p>
        </div>
        <div className="items-center absolute inset-x-0 bottom-[-3.5rem] mx-auto flex w-fit gap-3 md:relative md:bottom-0 md:left-0">
          <button
            onClick={handleFollow}
            className="w-40 cursor-pointer rounded-full bg-gradient-to-r from-pink-300 to-pink-500 py-2 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2"
          >
            {perfilData?.isFollowing ? (
              "Siguiendo"
            ) : perfilData?.id === pet?.id ? (
              <div
                onClick={handleEditProfile}
                className="flex h-10 items-center justify-center gap-2"
              >
                Editar perfil
                <EditIcon className="stroke-primaryWhite mr-1 inline-block h-7 w-6" />
              </div>
            ) : (
              "Seguir"
            )}
          </button>
          {pet && perfilData?.id !== pet.id && (
            <button
              className="w-40 cursor-pointer rounded-full bg-gradient-to-r from-pink-300 to-pink-500 py-2 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2"
              onClick={handleOpenChat}
            >
              Enviar Mensaje
            </button>
          )}
        </div>
      </header>
      <main className="mt-20 grid grid-cols-3 place-items-center gap-1 md:mt-10 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {perfilData && perfilData.posts && perfilData.posts.length > 0 ? (
          perfilData.posts.map((post: PostPerfil) => (
            <button
              key={post.id}
              type="button"
              onClick={() => handlePost(post)}
              className="group relative aspect-square overflow-hidden rounded focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2"
            >
              <img
                src={post.image}
                alt={`Publicación de ${perfilData?.name}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
          ))
        ) : (
          <p className="col-span-full p-2 text-xl text-gray-500 dark:text-gray-400">No hay publicaciones aún...</p>
        )}
      </main>
    </>
  );
};
