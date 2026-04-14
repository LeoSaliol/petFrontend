import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons/EyeIcon";
import { registerUser } from "../api/axios";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../types/validationsForm";

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
      await registerUser(data.username, data.email, data.password);
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
  // const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const data = new FormData(e.currentTarget);
  //   const username = data.get("username") as string;
  //   const email = data.get("email") as string;
  //   const password = data.get("password") as string;
  //   try {
  //     await registerUser(username, email, password);
  //     toast.success("Usuario registrado exitosamente");
  //     await new Promise((resolve) => setTimeout(resolve, 3000));
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Error registering user:", error);
  //     toast.error("Error registering user");
  //   }
  //   console.log();
  // };
  return (
    <main className="dark:bg-primaryText dark:text-background mx-auto flex min-h-screen w-full items-center justify-center">
      <Toaster position="top-center" richColors />
      <div className="dark:bg-primaryText flex h-full w-[80%] flex-col items-center gap-16 rounded-lg border border-[#b6a5ad5e] bg-[#fab2a918] px-5 py-18 shadow-lg md:w-[45%] dark:border-[#ee73ac27]">
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
            <input
              {...register("username")}
              type="text"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Nombre de usuario"
            />
            {errors.username && (
              <p className="mt-1 text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-5">
            <input
              {...register("email")}
              type="email"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Email"
            />
            {errors.email && (
              <p className="mt-1 text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="relative mb-12 flex w-full items-center gap-2 border-b border-gray-300 py-2 focus:border-gray-500">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full focus:outline-none"
              placeholder="Contraseña"
            />

            {showPassword ? (
              <EyeIcon
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOffIcon
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
            {errors.password && (
              <p className="absolute bottom-[-1.9rem] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] py-2 font-semibold text-white transition hover:opacity-90"
          >
            Regístrate
          </button>
          <p className="mx-auto mt-20">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-bold text-[#ED6B86]">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
