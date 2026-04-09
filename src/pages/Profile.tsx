import { useState } from "react";
import { followPet, getPerfil } from "../api/axios";

import { useNavigate, useParams } from "react-router-dom";
import { CommentModal } from "../components/CommentModal";
import { useAuth } from "../context/useAuth";
import { EditIcon } from "../icons/EditIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PerfilSkeleton } from "../skeleton/PerfilSkeleton";
import type { Post } from "../types";

interface PostPerfil {
  id: number;
  image: string;
  content: string;
  createdAt: string;
}

interface Perfil {
  id: number;
  name: string;
  image: string;
  content: string;
  postId: number;
  postImg: string;
  createdAt: string;
}

export const Profile = () => {
  // const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
  const [commentData, setCommentData] = useState<Perfil | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { id } = useParams();
  const { pet } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: perfilData, isLoading } = useQuery({
    queryKey: ["profile", id, pet?.id],
    queryFn: () => getPerfil(Number(id), pet?.id),
    enabled: !!id,
  });
  queryClient.prefetchQuery({
    queryKey: ["profile", id],
    queryFn: () => getPerfil(Number(id)),
  });

  const followMutation = useMutation({
    mutationFn: (profileId: number) => followPet(profileId),

    onMutate: async (profileId) => {
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

    onError: (err, variables, context) => {
      queryClient.setQueryData(["profile", id, pet?.id], context?.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", id] });
    },
  });

  // useEffect(() => {
  //     if (!id) return;

  //     const getPerfilData = async () => {
  //         try {
  //             const idPet = Number(id);

  //             let response;

  //             if (!pet) {
  //                 response = await getPerfil(idPet);
  //             } else {
  //                 response = await getPerfil(idPet, pet.id);
  //             }

  //             setPerfilData(response);
  //         } catch (error) {
  //             console.error('Error fetching profile data:', error);
  //         }
  //     };

  //     getPerfilData();
  // }, [id, pet]);
  const handlePost = (post: PostPerfil) => {
    // setCommentData({
    //     id: perfilData!.id,
    //     name: perfilData!.name,
    //     image: perfilData!.image,
    //     content: perfilData!.posts[i]!.content,
    //     postId: perfilData!.posts[i]!.id,
    //     postImg: perfilData!.posts[i]!.image,
    //     createdAt: perfilData!.posts[i]!.createdAt,
    // });
    // setOpenModal(!openModal);
    setCommentData({
      id: perfilData!.id,
      name: perfilData!.name,
      image: perfilData!.image,
      content: post.content,
      postId: post.id,
      postImg: post.image,
      createdAt: post.createdAt,
    });

    setOpenModal(true);
  };
  const handleFollow = async () => {
    if (!pet) {
      navigate("/login");
      return;
    }
    if (perfilData.id === pet.id) {
      return;
    }
    followMutation.mutate(perfilData.id);
    // if (!pet) {
    //     navigate('/login');
    //     return;
    // }
    // if (perfilData) {
    //     try {
    //         if (perfilData.id === pet.id) {
    //             return;
    //         }
    //         const data = await followPet(perfilData.id);
    //         setPerfilData((prev) =>
    //             prev
    //                 ? {
    //                       ...prev,
    //                       isFollowing: data.following,
    //                       followersCount: data.following
    //                           ? prev.followersCount + 1
    //                           : prev.followersCount - 1,
    //                   }
    //                 : prev,
    //         );
    //     } catch (error) {
    //         console.error('Error following pet:', error);
    //     }
    // } else {
    //     console.error('Perfil data is not available');
    // }
  };

  const handleEditProfile = async () => {
    navigate("/pets", {
      state: {
        pet: {
          id: perfilData?.id,
          name: perfilData?.name,
          bio: perfilData?.bio,
          image: perfilData?.image,
        },
      },
    });
  };
  if (isLoading) {
    return <PerfilSkeleton />;
  }
  return (
    <>
      {openModal && perfilData && (
        <CommentModal
          pcomment={commentData}
          closeModal={() => setOpenModal(false)}
        />
      )}

      <header className="relative mt-12 flex items-center gap-9 md:gap-18">
        <img
          src={perfilData?.image}
          alt=""
          className="h-40 w-40 rounded-full object-cover md:h-75 md:w-75"
        />
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-xl font-bold md:text-2xl">{perfilData?.name}</h1>
          <div className="text-md flex gap-4 md:gap-8">
            <p>{perfilData?.posts.length} publicaciones</p>
            <p>{perfilData?.followersCount} seguidores</p>
            <p>{perfilData?.followingCount} seguidos</p>
          </div>
          <p className="text-md">{perfilData?.bio}</p>
        </div>
        <button
          onClick={handleFollow}
          className="text-background absolute bottom-[-1.9rem] left-[40%] w-[30%] cursor-pointer rounded-full bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] py-2 font-semibold transition hover:opacity-70 md:relative md:bottom-0 md:left-0 md:w-[15%]"
        >
          {perfilData?.isFollowing ? (
            "Siguiendo"
          ) : perfilData?.id === pet?.id ? (
            <div
              onClick={handleEditProfile}
              className="flex h-10 items-center justify-center gap-2"
            >
              Editar perfil
              <EditIcon className="stroke-background mr-1 inline-block h-7 w-6" />
            </div>
          ) : (
            "Seguir"
          )}
        </button>
      </header>
      <main className="mt-20 mb-20 grid place-items-center gap-5 sm:grid-cols-1 md:mt-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {perfilData && perfilData.posts && perfilData.posts.length > 0 ? (
          perfilData.posts.map((post: Post) => (
            <div key={post.id} onClick={() => handlePost(post)}>
              <img
                src={post.image}
                alt=""
                className="h-120 w-full cursor-pointer rounded-sm object-cover shadow-lg transition md:hover:opacity-70"
              />
            </div>
          ))
        ) : (
          <p className="p-2 text-xl">No hay publicaciones aún...</p>
        )}
      </main>
    </>
  );
};
