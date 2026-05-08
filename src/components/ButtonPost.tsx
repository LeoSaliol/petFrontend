import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface CreatePostButtonProps {
  clasN?: string;
}

export const CreatePostButton = ({ clasN = "" }: CreatePostButtonProps) => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <motion.button
      onClick={handleCreatePost}
      className={`from-formColorLight to-formColorDark flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r px-2 py-2 font-semibold text-white transition hover:opacity-90 ${clasN}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-7 w-7"
        whileHover={{ rotate: 90, scale: 1.2 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.2,
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </motion.svg>
    </motion.button>
  );
};
