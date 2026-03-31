import { useNavigate } from 'react-router-dom';
import { createPet } from '../api/axios';

const Pet = () => {
    const navigate = useNavigate();
    const petSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const namepet = formData.get('name') as string;
        const bio = formData.get('bio') as string;
        const image = formData.get('image') as File;

        try {
            const response = await createPet(namepet, bio, image);
            if (response?.status === 201) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating pet:', error);
        }
    };
    return (
        <main className=" mt-26 w-[90%]  flex justify-center items-center mx-auto">
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
                        />
                    </div>
                    <div className="mb-3 ">
                        <input
                            name="bio"
                            type="text"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 py-2"
                            placeholder="Biografía o descripción de su mascota"
                        />
                    </div>
                    <div className="mb-14 flex flex-col gap-2  py-2">
                        <label className="block text-xl font-medium text-gray-700">
                            Foto de la mascota
                        </label>
                        <input
                            name="image"
                            accept="image/png, image/jpeg"
                            type="file"
                            className="w-full border-2 border-[#fab2a973] focus:outline-none focus:border-gray-500 py-2 rounded-lg"
                            placeholder="Suba una foto de su mascota"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 rounded-full text-white font-semibold bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] hover:opacity-90 transition"
                    >
                        Registrar Mascota
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Pet;
