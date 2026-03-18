import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '../icons/EyeIcon';
import { registerUser } from '../api/axios';
import { toast, Toaster } from 'sonner';

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const username = data.get('username') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        try {
            await registerUser(username, email, password);
            toast.success('Usuario registrado exitosamente');
            await new Promise((resolve) => setTimeout(resolve, 3000));
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error);
            toast.error('Error registering user');
        }
        console.log();
    };
    return (
        <main className="min-h-screen w-[30%]  flex justify-center items-center mx-auto">
            <Toaster
                position="top-center"
                richColors
            />
            <div className="flex flex-col items-center gap-16 border p-6 rounded-lg h-full w-full shadow-lg bg-[#fab2a918] border-[#b6a5ad5e] ">
                <Link
                    to="/"
                    className="font-title text-[2.5rem] text-primary mb-4"
                >
                    Michigram
                </Link>
                <form
                    className="flex flex-col gap-7 w-[75%] "
                    onSubmit={registerHandler}
                >
                    <div className="mb-4 ">
                        <input
                            name="username"
                            type="text"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 py-2"
                            placeholder="Nombre de usuario"
                        />
                    </div>
                    <div className="mb-5 ">
                        <input
                            name="email"
                            type="email"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-gray-500 py-2"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-12 flex items-center gap-2 w-full border-b border-gray-300  focus:border-gray-500 py-2">
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
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
                        className="w-full py-2 rounded-full text-white font-semibold bg-linear-to-r from-[#FAB3A9] to-[#ED6B86] hover:opacity-90 transition"
                    >
                        Regístrate
                    </button>
                    <p className="mx-auto mt-20">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to="/login"
                            className="font-bold"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Register;
