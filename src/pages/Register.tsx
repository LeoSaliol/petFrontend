/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons/EyeIcon";
import { authService } from "../api";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../types/validations";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: FormData) => {
    try {
      await authService.register({ name: data.username, username: data.username, email: data.email, password: data.password });
      toast.success("Usuario registrado exitosamente");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError("email", {
          type: "server",
          message: error.response.data.message,
        });
      } else {
        setError("root", {
          type: "server",
          message: "Error inesperado",
        });
      }
    }
  };

  return (
    <main className="dark:bg-primaryBlack dark:text-primaryWhite mx-auto flex min-h-screen w-full items-center justify-center">
      <Toaster position="top-center" richColors />
      <div className="dark:bg-primaryBlack flex h-full w-[80%] flex-col items-center gap-16 rounded-lg border border-pink-200/40 bg-pink-50/10 px-5 py-12 shadow-lg md:w-[45%] dark:border-pink-900/30">
        <Link
          to="/"
          className="font-title text-primary mb-4 hidden text-[2.5rem] md:block"
        >
          Michigram
        </Link>
        <Link
          to="/"
          className="font-title text-primary mb-4 text-[2.5rem] md:hidden"
        >
          M
        </Link>
        <form
          className="flex w-[75%] flex-col gap-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">Nombre de usuario</label>
            <input
              {...register("username")}
              id="username"
              type="text"
              className="w-full border-b border-gray-300 bg-transparent py-2 text-inherit placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500"
              placeholder="Nombre de usuario"
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-red-500 mt-1 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="w-full border-b border-gray-300 bg-transparent py-2 text-inherit placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500"
              placeholder="Email"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="relative mb-12 flex w-full items-center gap-2 border-b border-gray-300 py-2 focus-within:border-gray-500 dark:border-gray-600">
            <label htmlFor="password" className="sr-only">Contraseña</label>
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
              <p id="password-error" className="text-red-500 absolute -bottom-6 left-0 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-gradient-to-r from-pink-300 to-pink-500 py-2 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2"
          >
            Regístrate
          </button>
          <p className="mx-auto mt-20">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-bold text-pink-500 hover:text-pink-600 hover:underline focus-visible:outline-2 focus-visible:outline-gray-500 focus-visible:outline-offset-2 rounded">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
