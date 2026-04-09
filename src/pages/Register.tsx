import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons/EyeIcon";
import { registerUser } from "../api/axios";
import { toast, Toaster } from "sonner";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = data.get("username") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    try {
      await registerUser(username, email, password);
      toast.success("Usuario registrado exitosamente");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Error registering user");
    }
    console.log();
  };
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
          onSubmit={registerHandler}
        >
          <div className="mb-4">
            <input
              name="username"
              type="text"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Nombre de usuario"
            />
          </div>
          <div className="mb-5">
            <input
              name="email"
              type="email"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Email"
            />
          </div>
          <div className="mb-12 flex w-full items-center gap-2 border-b border-gray-300 py-2 focus:border-gray-500">
            <input
              name="password"
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
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] py-2 font-semibold text-white transition hover:opacity-90"
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
