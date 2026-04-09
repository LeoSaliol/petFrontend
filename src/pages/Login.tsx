import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons/EyeIcon";
import { loginUser, myPets } from "../api/axios";
import { useAuth } from "../context/useAuth";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const email = data.get("email") as string;
    const password = data.get("password") as string;
    try {
      await loginUser(email, password);

      await refreshUser();

      const pets = await myPets();
      if (pets.length === 0) {
        navigate("/pets");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };
  return (
    <main className="dark:bg-primaryText dark:text-background mx-auto flex min-h-screen w-full items-center justify-center">
      <div className="dark:bg-primaryText flex h-full w-[80%] flex-col items-center gap-16 rounded-lg border border-[#b6a5ad5e] bg-[#fab2a918] px-6 py-18 shadow-lg md:w-[45%] dark:border-[#ee73ac27]">
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
        <form className="flex w-[75%] flex-col gap-8" onSubmit={loginHandler}>
          <div className="mb-5">
            <input
              name="email"
              type="email"
              className="w-full border-b border-gray-300 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Email"
            />
          </div>
          <div className="mb-5 flex w-full items-center gap-2 border-b border-gray-300 py-2 focus:border-gray-500">
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
            className="w-full cursor-pointer rounded-full bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] py-2 font-semibold text-white transition hover:opacity-90"
          >
            Login
          </button>
          <p className="mx-auto mt-20">
            No tienes cuenta?{" "}
            <Link to="/register" className="font-bold text-[#ED6B86]">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
