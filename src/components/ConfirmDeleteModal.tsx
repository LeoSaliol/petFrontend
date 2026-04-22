import { motion, AnimatePresence } from "framer-motion";

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background w-[90%] max-w-md rounded-2xl p-6 shadow-xl dark:bg-[#0d0e0f]"
          >
            <h2 className="text-lg font-semibold">¿Eliminar publicación?</h2>

            <p className="mt-2 text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>

              <button
                onClick={onConfirm}
                className="cursor-pointer rounded-lg bg-[#da1b41] px-4 py-2 text-sm text-white hover:bg-[#da1b41]/50"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
