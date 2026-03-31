import { useEffect, useState } from 'react';
import { getPerfil } from '../api/axios';

import { useParams } from 'react-router-dom';
import { CommentModal } from '../components/CommentModal';

interface PostPerfil {
    id: number;
    image: string;
    content: string;
    createdAt: string;
}

interface PerfilData {
    id: number;
    name: string;
    bio: string;
    image: string;
    createdAt: string;
    followersCount: number;
    followingCount: number;
    posts: PostPerfil[];
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
    const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
    const [commentData, setCommentData] = useState<Perfil | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { id } = useParams();

    useEffect(() => {
        const getPerfilData = async () => {
            try {
                const idPet = Number(id);
                const response = await getPerfil(idPet);

                setPerfilData(response);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        getPerfilData();
    }, [id]);

    const handlePost = (i: number) => {
        setCommentData({
            id: perfilData!.id,
            name: perfilData!.name,
            image: perfilData!.image,
            content: perfilData!.posts[i]!.content,
            postId: perfilData!.posts[i]!.id,
            postImg: perfilData!.posts[i]!.image,
            createdAt: perfilData!.posts[i]!.createdAt,
        });
        setOpenModal(!openModal);
    };

    return (
        <>
            {openModal && perfilData && (
                <CommentModal
                    pcomment={commentData}
                    closeModal={() => setOpenModal(false)}
                />
            )}

            <header className="flex items-center gap-18 p-6 ">
                <img
                    src={perfilData?.image}
                    alt=""
                    className="w-75 h-75 object-cover rounded-full "
                />
                <div className="flex flex-col gap-4 flex-1">
                    <h1 className="text-2xl font-bold">{perfilData?.name}</h1>
                    <div className="flex gap-8">
                        <p>{perfilData?.posts.length} publicaciones</p>
                        <p>{perfilData?.followersCount} seguidores</p>
                        <p>{perfilData?.followingCount} seguidos</p>
                    </div>
                    <p>{perfilData?.bio}</p>
                </div>
            </header>
            <main className="mt-10 grid place-items-center  gap-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 ">
                {perfilData &&
                perfilData.posts &&
                perfilData.posts.length > 0 ? (
                    perfilData.posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() =>
                                handlePost(perfilData.posts.indexOf(post))
                            }
                        >
                            <img
                                src={post.image}
                                alt=""
                                className="w-full h-120 object-cover shadow-lg rounded-sm cursor-pointer  hover:opacity-70 transition"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-xl p-2">No hay publicaciones aún...</p>
                )}
            </main>
        </>
    );
};
