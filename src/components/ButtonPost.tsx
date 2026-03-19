import { Link } from 'react-router-dom';

export const CreatePostButton = () => {
    return (
        <div className="fixed bottom-12 left-10 group">
            {/* Tooltip */}
            <div
                className="
        absolute left-14 top-1/2 -translate-y-1/2
        opacity-0 group-hover:opacity-100
        translate-x-[-4] group-hover:translate-x-1
        transition-all duration-400
        bg-primaryText text-background text-sm px-3 py-1 rounded-lg shadow-lg
        whitespace-nowrap
      "
            >
                Crear publicación
            </div>

            {/* Botón */}
            <Link
                to="/create-post"
                className="
          w-14 h-14 rounded-full bg-[#ED6B86] text-background text-[3.4rem]
          flex items-center justify-center
          shadow-lg cursor-pointer

          transition-all duration-400
          transform group-hover:scale-110
          hover:bg-[#c2546cf1]
        "
            >
                +
            </Link>
        </div>
    );
};
