import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons/EyeIcon";
import { loginUser, myPets } from "../api/axios";
import { useAuth } from "../context/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../types/validationsForm";
import { toast, Toaster } from "sonner";
type FormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data.email, data.password);
      await refreshUser();
      const pets = await myPets();
      if (pets.length === 0) {
        navigate("/pets");
      } else {
        toast.success("Usuario logueado exitosamente");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error: any) {
      console.log("llego al error", error);
      if (error.response?.data?.message) {
        setError("root", {
          type: "server",
          message: "Error inesperado",
        });
        toast.error("Correo o contraseña incorrectos");
      }
    }
  };

  return (
    <main className="dark:bg-primaryBlack dark:text-primaryWhite mx-auto flex min-h-screen w-full items-center justify-center">
      <Toaster position="top-center" richColors />

      <div className="dark:bg-primaryBlack flex h-full w-[80%] flex-col items-center gap-16 rounded-lg border border-[#b6a5ad5e] bg-[#fab2a918] px-6 py-18 shadow-lg md:w-[45%] dark:border-[#ee73ac27]">
        <Link
          to="/"
          className="font-title text-primary mb-4 hidden text-[2.5rem] transition-all duration-700 ease-in-out md:block"
        >
          Michigram
        </Link>
        <Link
          to="/"
          className="font-title text-primary mb-4 block text-[2.5rem] transition-all duration-700 ease-in-out md:hidden"
        >
          M
        </Link>
        <form
          className="flex w-[75%] flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-5">
            <input
              {...register("email")}
              type="email"
              className={`w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none ${errors.root ? "border-redPink" : ""} `}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-redPink mt-1">{errors.email.message}</p>
            )}
          </div>
          <div
            className={
              "relative mb-5 flex w-full items-center gap-2 border-b border-gray-300 py-2 focus:border-gray-500 " +
              (errors.root ? "border-redPink" : "")
            }
          >
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full focus:outline-none"
              placeholder="Contraseña"
            />

            {showPassword ? (
              <EyeIcon
                className="cursor-pointer dark:stroke-pink-200"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOffIcon
                className="cursor-pointer dark:stroke-pink-200"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
            {errors.password && (
              <p className="text-redPink absolute bottom-[-1.9rem]">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className="from-formColorLight to-formColorDark text-primaryWhite w-full cursor-pointer rounded-full bg-linear-to-r py-2 font-semibold transition hover:opacity-90">
            Login
          </button>
          <p className="mx-auto mt-20">
            No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-formColorDark cursor-pointer font-bold"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
