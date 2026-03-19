import { useState } from 'react';
import { ButtonFile } from '../components/ButtonFile';
import { createPost } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export const CreatePost = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const { pet } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (file: File) => {
        setFile(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Aquí puedes manejar el envío del formulario, incluyendo la imagen y la descripción
        if (!file) {
            console.error('No se ha seleccionado una imagen');
            return;
        }
        const formData = new FormData(e.currentTarget);
        const content = formData.get('content') as string;

        try {
            await createPost(pet?.id, content, file);
            navigate('/');
            // Aquí puedes llamar a tu función para crear la publicación con los datos del formulario
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className=" h-[30vh] flex  mt-14 gap-10   w-full  ">
            {/* Imagen */}
            {/* <div className="">
                <img
                    src={
                        preview ||
                        'https://cnpspca.org/wp-content/uploads/2020/07/Placeholder_Cat.png'
                    }
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl border"
                />
            </div> */}
            <div className="w-[50%] h-[45%] ">
                <ButtonFile
                    preview={preview}
                    onChange={handleImageChange}
                    className="aspect-3/4"
                />
            </div>

            {/* Form */}
            <form
                className="flex flex-col  w-[50%] gap-8 mt-11 "
                onSubmit={handleSubmit}
            >
                {/* Input imagen */}

                {/* Descripción */}
                <input
                    name="content"
                    type="text"
                    placeholder="Descripción de la publicación"
                    className="w-[95%] mx-auto border-b border-[#FAB3A9] focus:outline-none focus:border-[#ED6B86] py-2"
                />

                {/* <input
                name='image'
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm border-2 border-[#fab2a973] focus:outline-none focus:border-gray-500 py-2 rounded-lg w-[95%] mx-auto"

                /> */}
                {/* Botón */}
                <button
                    type="submit"
                    className="bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Post
                </button>
            </form>
        </div>
    );
};
