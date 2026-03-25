/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ButtonFile } from '../components/ButtonFile';
import { createPost } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropped';

export const CreatePost = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const { pet } = useAuth();
    const navigate = useNavigate();

    const getCroppedImage = async () => {
        if (!preview || !croppedAreaPixels) return null;
        try {
            const croppedFile = await getCroppedImg(preview, croppedAreaPixels);
            setFile(croppedFile);
            const croppedUrl = URL.createObjectURL(croppedFile);
            setPreview(croppedUrl);
            setModalOpen(!modalOpen);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    const handleImageChange = (file: File) => {
        setFile(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
        setModalOpen(true);
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
            {modalOpen && (
                <div className=" w-full h-full fixed top-0 left-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="absolute  h-full mx-auto left-0 right-0 top-0  z-10">
                        <div className="  mx-auto flex items-center h-0 ">
                            <Cropper
                                image={preview}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedePixels) =>
                                    setCroppedAreaPixels(croppedePixels)
                                }
                            />
                        </div>
                    </div>
                    <button
                        className="bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition w-1/4  mt-5 bottom-10 z-20 absolute cursor-pointer"
                        onClick={getCroppedImage}
                    >
                        Recortar Imagen
                    </button>
                </div>
            )}
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
