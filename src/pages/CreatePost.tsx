/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ButtonFile } from "../components/ButtonFile";
import { createPost, updatePost } from "../api/axios";
import { useAuth } from "../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropped";
import { toast, Toaster } from "sonner";

export const CreatePost = () => {
  const location = useLocation();
  const post = location.state?.post;

  const [preview, setPreview] = useState<string | undefined>(post?.image);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState(post?.content || "");
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
      console.error("Error cropping image:", error);
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
    const content = formData.get("content") as string;

    try {
      if (post) {
        const res = await updatePost(post!.id, content, file as File);

        if (res === 200) {
          toast.success("Post actualizado correctamente");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          navigate("/");
        }
      } else {
        if (!file) {
          console.error("No se ha seleccionado una imagen");
          return;
        }
        await createPost(pet?.id, content, file);
        toast.success("Post creado correctamente");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="mt-14 flex h-full w-full flex-col gap-5 md:h-[30vh] md:flex-row md:gap-10">
      <Toaster position="top-center" richColors />
      {modalOpen && (
        <div className="fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-black/50">
          <div className="absolute top-0 right-0 left-0 z-10 mx-auto h-full">
            <div className="mx-auto flex h-0 items-center">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={3 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedePixels) =>
                  setCroppedAreaPixels(croppedePixels)
                }
              />
            </div>
          </div>
          <button
            className="from-formColorLight to-formColorDark absolute bottom-40 z-20 mt-5 w-1/4 cursor-pointer rounded-lg bg-linear-to-r py-2 font-semibold text-white transition hover:opacity-90 md:bottom-10"
            onClick={getCroppedImage}
          >
            Recortar Imagen
          </button>
        </div>
      )}

      <div className="mx-auto h-[40%] w-[55%] md:mx-0 md:h-[45%] md:w-[50%]">
        <ButtonFile
          preview={preview ? preview : null}
          onChange={handleImageChange}
          className="md: flex aspect-square h-full w-full cursor-pointer items-center justify-center border-dashed border-gray-400 bg-gray-100"
        />
      </div>

      <form
        className="mx-auto mt-5 flex w-[90%] flex-col gap-8 md:mx-0 md:mt-11 md:w-[50%]"
        onSubmit={handleSubmit}
      >
        <input
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder="Descripción de la publicación"
          className="border-formColorLight focus:border-formColorDark mx-auto w-[95%] border-b py-2 focus:outline-none"
        />

        <button
          type="submit"
          className="from-formColorLight to-formColorDark cursor-pointer rounded-lg bg-linear-to-r py-2 font-semibold text-white transition hover:opacity-70"
        >
          {post ? "Actualizar Publicación" : "Crear Publicación"}
        </button>
      </form>
    </div>
  );
};
