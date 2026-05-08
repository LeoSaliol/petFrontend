import { DotsIcon } from "../icons/DotsIcon";

interface ConfigPostProps {
  classGroup?: string;
  handleDelete: () => void;
  handleEdit: () => void;
}

export const ConfigPost = ({
  classGroup = "",
  handleDelete,
  handleEdit,
}: ConfigPostProps) => {
  return (
    <div className={`relative group ${classGroup}`}>
      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        <DotsIcon className="w-5 h-5" />
      </button>
      <div className="absolute right-0 top-8 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 min-w-[120px] z-50">
        <button
          onClick={handleEdit}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};