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
    <div className={`group relative ${classGroup}`}>
      <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
        <DotsIcon className="h-5 w-5" />
      </button>
      <div className="absolute top-8 right-0 z-50 hidden min-w-30 rounded-md bg-white py-1 shadow-lg group-hover:block dark:bg-gray-800">
        <button
          onClick={handleEdit}
          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
