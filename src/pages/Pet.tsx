import { useLocation, useNavigate } from 'react-router-dom';
import { createPet, updatePet } from '../api/axios';
import { useState } from 'react';
import { ButtonFile } from '../components/ButtonFile';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropped';
import { toast, Toaster } from 'sonner';

const Pet = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pet: { id: number; name: string; bio: string; image: string } =
        location.state?.pet;

    const [content, setContent] = useState(pet || undefined);
    const [preview, setPreview] = useState<string | undefined>(content?.image);
    const [file, setFile] = useState<File | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const petSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const namepet = formData.get('name') as string;
        const bio = formData.get('bio') as string;
        const image = formData.get('image') as File;
        if (pet) {
            try {
                const res = await updatePet(namepet, bio, file, pet.id);
                if (res === 200) {
                    toast.success('Perfil actualizado correctamente');
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    navigate(`/profile/${pet.id}`);
                }
            } catch (error) {
                console.error('Error updating pet:', error);
            }
        } else {
            try {
                const response = await createPet(namepet, bio, image);
                if (response?.status === 201) {
                    toast.success('Perfil creado correctamente');
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    navigate('/');
                }
            } catch (error) {
                console.error('Error creating pet:', error);
            }
        }
    };
    const handleImageChange = (file: File) => {
        setFile(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
        setModalOpen(true);
    };
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
    return (
        <main className=" mt-26 w-[90%]  flex justify-center items-center mx-auto">
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
                                cropShape="round"
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
            <div className="flex flex-col items-center gap-16 border p-6 rounded-lg h-full w-full shadow-lg bg-[#fab2a918] border-[#b6a5ad5e] ">
                <h1 className="text-2xl">Ingrese los datos de su mascota</h1>
                <form
                    className="flex flex-col gap-7 w-[75%] "
                    onSubmit={petSubmit}
                >
                    <div className="mb-4 ">
                        <input
                            name="name"
                            type="text"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 py-2"
                            placeholder="Nombre de la mascota"
                            value={pet ? content.name : ''}
                            onChange={(e) =>
                                setContent({
                                    ...content,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="mb-3 ">
                        <input
                            name="bio"
                            type="text"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 py-2"
                            placeholder="Biografía o descripción de su mascota"
                            value={pet ? content.bio : ''}
                            onChange={(e) =>
                                setContent({
                                    ...content,
                                    bio: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="mb-14 flex flex-col gap-2  py-2">
                        <label className="block text-xl font-medium text-gray-700">
                            Foto de la mascota
                        </label>
                        <ButtonFile
                            preview={preview!}
                            onChange={handleImageChange}
                            className="aspect-3/4 rounded-full w-90 h-90 mx-auto border-[#b6a5ad5e] border"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 rounded-full text-white font-semibold bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] hover:opacity-70 transition cursor-pointer"
                    >
                        {pet ? 'Actualizar mascota' : 'Crear mascota'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Pet;
