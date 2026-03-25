import { useRef } from 'react';

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
        }
    };

    return (
        <div className="flex-col w-full  ">
            {/* input oculto */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="image/*"
            />

            {/* botón custom */}
            <div
                onClick={handleClick}
                className={`${className || ''}   w-full h-112  cursor-pointer group relative`}
            >
                <img
                    src={
                        preview ||
                        'https://cnpspca.org/wp-content/uploads/2020/07/Placeholder_Cat.png'
                    }
                    alt="preview"
                    className=" w-full h-full object-cover  rounded-xl border"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm rounded-xl transition">
                    Cambiar foto
                </div>
            </div>
        </div>
    );
};
