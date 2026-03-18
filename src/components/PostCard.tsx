import { useState } from 'react';
import { CommentIcon } from '../icons/CommentIcon';
import { HeartIcon } from '../icons/LikeIcon';
import { CatPorfileIcon } from '../icons/CatPorfileIcon';
import { useAuth } from '../context/useAuth';

export default function PostCard() {
    const [liked, setLiked] = useState(false);

    const { user } = useAuth();

    return (
        <div className=" rounded-xl w-full border  border-[#b6a5ad11] mb-6 mt-11">
            {user ? (
                <p>Welcome, !</p>
            ) : (
                <p>Please log in to view your posts.</p>
            )}

            <div className=" flex items-center p-4 gap-3">
                {/* <img
                    src={ImgPerfil}
                    className="w-10 h-10 rounded-full mx-3"
                /> */}
                <CatPorfileIcon width={37} />
                <span className="font-content  ">Catlover</span>
            </div>
            <picture>
                <img
                    src="https://www.mirringo.com.co/Portals/mirringo/Images/articulos-actualidad-gatuna/ciclo-de-vida-de-los-gatos/Interna-1-ciclo-de-vida-de-los-gatos.jpg?ver=2024-03-20-160432-910"
                    alt="Cat"
                    className=" aspect-60/70 w-[45%] object-cover mx-auto rounded-lg"
                />
            </picture>
            <div className="p-4 mx-4">
                <div className="flex items-center gap-4 mb-2">
                    <span
                        className="flex items-center gap-1  "
                        onClick={() => {
                            setLiked(!liked);
                        }}
                    >
                        <HeartIcon
                            className="w-7 h-7 cursor-pointer "
                            stroke={liked ? '#ED6B86' : '#000'}
                            fill={liked ? '#ED6B86' : 'none'}
                        />

                        <span>5</span>
                    </span>

                    <span className="flex items-center gap-2">
                        <CommentIcon className="w-6 h-6" />
                        <span>3</span>
                    </span>
                </div>

                <p className="text-sm">
                    Descripcion de la fotito todo piola :D
                </p>
                <form className="mt-3 ">
                    <input
                        placeholder="Escribe un comentario..."
                        className="bg-transparent border border-[#b6a5ad28] focus:outline-none focus:ring-1 focus:ring-[#fab2a96e] w-full rounded-lg px-3 py-2 text-sm"
                    />
                </form>
            </div>
        </div>
    );
}
