import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons/EyeIcon";
import { authService, petsService } from "../api";
import { useAuth } from "../context/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../types/validations";
import { toast } from "sonner";
import { AxiosError } from "axios";
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
      await authService.login({ email: data.email, password: data.password });
      await refreshUser();
      const pets = await petsService.getMyPets();
      if (pets.length === 0) {
        navigate("/pets");
      } else {
        toast.success("Usuario logueado exitosamente");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.log("llego al error", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
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
      <div className="dark:bg-primaryBlack flex h-full w-4/5 flex-col items-center gap-16 rounded-lg border border-pink-200/40 bg-pink-50/10 px-6 py-12 shadow-lg md:w-[45%] dark:border-pink-900/30">
        <Link
          to="/"
          className="font-title text-primary mb-4 hidden text-4xl transition-all duration-700 ease-in-out md:block"
        >
          Michigram
        </Link>
        <Link
          to="/"
          className="font-title text-primary mb-4 block text-4xl transition-all duration-700 ease-in-out md:hidden"
        >
          M
        </Link>
        <form
          className="flex w-[75%] flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-5">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`w-full border-b border-gray-300 bg-transparent py-2 text-inherit placeholder:text-gray-400 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 ${errors.root ? "border-redPink" : ""}`}
              placeholder="Email"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-redPink mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div
            className={`relative mb-5 flex w-full items-center gap-2 border-b border-gray-300 py-2 focus-within:border-gray-500 dark:border-gray-600 ${errors.root ? "border-redPink" : ""}`}
          >
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent text-inherit placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500"
              placeholder="Contraseña"
              aria-describedby={errors.password ? "password-error" : undefined}
            />

            {showPassword ? (
              <EyeIcon
                className="cursor-pointer text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Ocultar contraseña"
              />
            ) : (
              <EyeOffIcon
                className="cursor-pointer text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostrar contraseña"
              />
            )}
            {errors.password && (
              <p
                id="password-error"
                className="text-redPink absolute -bottom-6 left-0 text-sm"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-linear-to-r from-pink-300 to-pink-500 py-2 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Iniciar sesión
          </button>
          <p className="mx-auto mt-20">
            No tienes cuenta?{" "}
            <Link
              to="/register"
              className="cursor-pointer rounded font-bold text-pink-500 hover:text-pink-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
