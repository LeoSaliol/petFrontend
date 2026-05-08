import { useLocation, useNavigate } from "react-router-dom";
import { petsService } from "../api";
import { useEffect, useState } from "react";
import { ButtonFile } from "../components/ButtonFile";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropped";
import { toast, Toaster } from "sonner";
import { useAuth } from "../context/useAuth";

const Pet = () => {
  const { pet } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const petProps: { id: number; name: string; bio: string; image: string } =
    location.state?.pet;

  const [content, setContent] = useState({
    name: petProps?.name || "",
    bio: petProps?.bio || "",
  });
  const [preview, setPreview] = useState<string | undefined>(petProps?.image);
  const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  const petSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const namepet = formData.get("name") as string;
    const bio = formData.get("bio") as string;

    if (petProps) {
      try {
        await petsService.update(petProps.id, namepet, bio, file);
        toast.success("Perfil actualizado correctamente");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate(`/profile/${petProps.id}`);
      } catch (error) {
        console.error("Error updating pet:", error);
      }
    } else {
      try {
        if (!file) {
          toast.error("La imagen es obligatoria");
          return;
        }
        await petsService.create({ name: namepet, bio, image: file as File });
        toast.success("Perfil creado correctamente");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/");
      } catch (error) {
        console.error("Error creating pet:", error);
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
      console.error("Error cropping image:", error);
    }
  };

  useEffect(() => {
    if (pet) {
      toast.error(
        "Ya tienes una mascota creada, solo puedes tener una mascota por cuenta",
      );

      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [pet, navigate]);
  // if (petId !== null) {
  //   toast.error(
  //     "Ya tienes una mascota creada, solo puedes tener una mascota por cuenta",
  //   );
  //   new Promise((resolve) => setTimeout(() => resolve(navigate(`/`)), 3000));
  // }

  return (
    <main className="mx-auto flex w-[90%] items-center justify-center md:mt-8 md:w-[85%]">
      <Toaster position="top-center" richColors />
      {modalOpen && (
        <div className="fixed top-0 left-0 z-60 flex h-full w-full items-center justify-center bg-black/90">
          <div className="absolute top-0 right-0 left-0 z-10 mx-auto h-full">
            <div className="mx-auto flex h-0 items-center">
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
            className="from-formColorLight to-formColorDark absolute bottom-40 z-20 mt-5 w-1/4 cursor-pointer rounded-lg bg-linear-to-r py-2 font-semibold text-white transition hover:opacity-90 md:bottom-25"
            onClick={getCroppedImage}
          >
            Recortar Imagen
          </button>
          <button
            className="absolute bottom-52 z-20 w-1/4 cursor-pointer rounded-lg bg-gray-500 py-2 font-semibold text-white transition hover:opacity-90 md:bottom-10"
            onClick={() => {
              setPreview("");
              setModalOpen(false);
            }}
          >
            Cancelar
          </button>
        </div>
      )}
      <div className="flex h-full w-full flex-col items-center gap-16 rounded-lg border border-[#b6a5ad5e] bg-[#fab2a918] py-5 shadow-lg md:p-6 dark:bg-[#161515]">
        <h1 className="text-2xl">Ingrese los datos de su mascota</h1>
        <form className="flex w-[75%] flex-col gap-7" onSubmit={petSubmit}>
          <div className="mb-4">
            <input
              name="name"
              type="text"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Nombre de la mascota"
              value={content.name}
              onChange={(e) =>
                setContent({
                  ...content,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <input
              name="bio"
              type="text"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Biografía o descripción de su mascota"
              value={content.bio}
              onChange={(e) =>
                setContent({
                  ...content,
                  bio: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-14 flex flex-col gap-2 py-2">
            <label className="mb-5 block text-center text-lg font-medium text-gray-700 md:mb-0 md:text-xl dark:text-pink-100">
              Foto de la mascota
            </label>
            <ButtonFile
              preview={preview!}
              onChange={handleImageChange}
              className="mx-auto aspect-3/4 h-90 w-90 rounded-full border border-[#b6a5ad5e]"
            />
          </div>
          <button
            type="submit"
            className="from-formColorLight to-formColorDark w-full cursor-pointer rounded-full bg-linear-to-r py-2 font-semibold text-white transition hover:opacity-70"
          >
            {petProps ? "Actualizar mascota" : "Crear mascota"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Pet;
