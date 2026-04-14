import { DotsIcon } from "../icons/DotsIcon";

export const ConfigPost = ({
  handleDelete,
  handleEdit,
  classGroup,
}: {
  handleEdit: () => void;
  handleDelete: () => void;
  classGroup?: string;
}) => {
  return (
    <span className="group relative ml-auto">
      <DotsIcon className="h-6 w-6 transform cursor-pointer stroke-3 transition-all duration-400 group-hover:scale-110 dark:fill-pink-200" />

      <div
        className={`bg-primaryText text-background ${classGroup ? classGroup : "right-6 bottom-4"} absolute translate-x-[-9] overflow-hidden rounded-md text-sm whitespace-nowrap opacity-0 shadow-lg transition-all duration-400 group-hover:translate-x-2 group-hover:opacity-100 dark:bg-[#1d181ace]`}
      >
        <li className="flex flex-col">
          <button
            className="cursor-pointer px-9 py-4 text-[1rem] hover:bg-[#b6a5ad28]"
            onClick={handleEdit}
          >
            Editar
          </button>
          <button
            className="cursor-pointer px-9 py-4 text-[1rem] hover:bg-[#b6a5ad28]"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </li>
      </div>
    </span>
  );
};
