import { useRef } from "react";

type props = {
  preview: string | null;
  onChange: (file: File) => void;
  className?: string;
};
export const ButtonFile = ({ preview, onChange, className }: props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onChange(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        accept="image/*"
      />

      <div
        onClick={handleClick}
        className={`${className || ""} group relative cursor-pointer`}
      >
        <img
          src={
            preview ||
            "https://cnpspca.org/wp-content/uploads/2020/07/Placeholder_Cat.png"
          }
          alt="preview"
          className={"object-cover " + (className || "") + " "}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white opacity-0 transition group-hover:opacity-100">
          Cambiar foto
        </div>
      </div>
    </div>
  );
};
