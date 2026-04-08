/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ButtonFile } from '../components/ButtonFile';
import { createPost, updatePost } from '../api/axios';
import { useAuth } from '../context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropped';
import { toast, Toaster } from 'sonner';

export const CreatePost = () => {
    const location = useLocation();
    const post = location.state?.post;

    const [preview, setPreview] = useState<string | undefined>(post?.image);
    const [file, setFile] = useState<File | null>(null);
    const [content, setContent] = useState(post?.content || '');
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

        const formData = new FormData(e.currentTarget);
        const content = formData.get('content') as string;

        try {
            if (post) {
                const res = await updatePost(post!.id, content, file as File);

                if (res === 200) {
                    toast.success('Post actualizado correctamente');
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    navigate('/');
                }
            } else {
                if (!file) {
                    console.error('No se ha seleccionado una imagen');
                    return;
                }
                await createPost(pet?.id, content, file);
                toast.success('Post creado correctamente');
                await new Promise((resolve) => setTimeout(resolve, 1000));
                navigate('/');
            }

            navigate('/');
            // Aquí puedes llamar a tu función para crear la publicación con los datos del formulario
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className=" h-[30vh] flex  mt-14 gap-10   w-full  ">
            <Toaster
                position="top-center"
                richColors
            />
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

            <div className="w-[50%] h-[45%] ">
                <ButtonFile
                    preview={preview}
                    onChange={handleImageChange}
                    className="aspect-3/4"
                />
            </div>

            <form
                className="flex flex-col  w-[50%] gap-8 mt-11 "
                onSubmit={handleSubmit}
            >
                <input
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    type="text"
                    placeholder="Descripción de la publicación"
                    className="w-[95%] mx-auto border-b border-[#FAB3A9] focus:outline-none focus:border-[#ED6B86] py-2"
                />

                <button
                    type="submit"
                    className="bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
                >
                    {post ? 'Actualizar Publicación' : 'Crear Publicación'}
                </button>
            </form>
        </div>
    );
};
