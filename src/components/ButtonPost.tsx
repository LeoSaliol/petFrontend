import { Link } from "react-router-dom";

export const CreatePostButton = ({ clasN }: { clasN?: string }) => {
  return (
    <div className={` ${clasN ? clasN : ""} group`}>
      <div
        className={
          "bg-primaryText text-background absolute top-1/2 left-14 translate-x-[-4] -translate-y-1/2 rounded-lg px-3 py-1 text-sm whitespace-nowrap opacity-0 shadow-lg transition-all duration-400 group-hover:translate-x-1 group-hover:opacity-100 " +
          (clasN ? "hidden md:block" : "")
        }
      >
        Crear publicación
      </div>

      <Link
        to="/create-post"
        className="text-background flex h-14 w-14 transform cursor-pointer items-center justify-center rounded-full bg-[#ED6B86] text-[3.4rem] shadow-lg transition-all duration-400 group-hover:scale-100 hover:bg-[#c2546cf1] dark:bg-[#463239]"
      >
        +
      </Link>
    </div>
  );
};
