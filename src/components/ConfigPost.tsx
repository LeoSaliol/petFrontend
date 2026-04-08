import { DotsIcon } from '../icons/DotsIcon';

export const ConfigPost = ({
    handleDelete,
    handleEdit,
}: {
    handleEdit: () => void;
    handleDelete: () => void;
}) => {
    return (
        <span className="ml-auto group relative ">
            <div
                className="absolute right-6 bottom-4 
        opacity-0 group-hover:opacity-100
        translate-x-[-9] group-hover:translate-x-2
        transition-all duration-400
        bg-primaryText text-background text-sm  rounded-md shadow-lg 
        whitespace-nowrap"
            >
                <li className="flex flex-col ">
                    <button
                        className="py-4 px-9 text-[1rem] cursor-pointer hover:bg-[#b6a5ad28] "
                        onClick={handleEdit}
                    >
                        Editar
                    </button>
                    <button
                        className="py-4 px-9 text-[1rem] cursor-pointer hover:bg-[#b6a5ad28] "
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                </li>
            </div>
            <DotsIcon
                className="w-6 h-6  stroke-3 cursor-pointer

          transition-all duration-400
          transform group-hover:scale-110"
            />
        </span>
    );
};
