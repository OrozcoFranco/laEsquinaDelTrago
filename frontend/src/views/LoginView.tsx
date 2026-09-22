import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ErrorMessage from "../components/ErrorMessage";
import { isAxiosError } from "axios";
import type { LoginForm } from "../types";
import { login as loginUser } from "../service/auth"
import { useAuth } from "../hooks/useAuth";

export default function LoginView() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const initialVAlues: LoginForm = {
        email: "",
        password: "",
    };

    const { register, handleSubmit, formState: { errors },} = useForm({ defaultValues: initialVAlues });

    const handleLogin = async (formData: LoginForm) => {
        try {
            await login (formData);
            toast.success('Bienvenido');
            navigate("/")

        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    return (
        <>
        <h1 className=" text-4xl text-black font-bold text-center">Iniciar Sesion</h1>

        <form
            onSubmit={handleSubmit(handleLogin)}
            className="bg-gray-400 px-10 py-20 rounded-lg w-110 space-y-1-8 mt-10"
            noValidate
        >
            <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="email" className="text-2xl text-black font-bold text-center">
                E-mail
            </label>
            <input
                id="email"
                type="email"
                placeholder="Email de Registro"
                className="bg-slate-100 border-none p-3 w-full rounded-lg  placeholder-slate-400"
                {...register("email", {
                required: "El Email es obligatorio",
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "E-mail no válido",
                },
                })}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>
            <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="password" className="text-2xl text-black font-bold text-center pt-2">
                Password
            </label>
            <input
                id="password"
                type="password"
                placeholder="Password de Registro"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register("password", {
                required: "El Password es obligatorio",
                })}
            />
            {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
            </div>

            <input
            type="submit"
            className="bg-fuchsia-950 mt-13 p-3 text-lg w-full uppercase text-slate-100 rounded-lg font-bold cursor-pointer"
            value="Iniciar Sesión"
            />
        </form>

        <nav className=" mt-10">
            <Link
            className=" text-center text-black text-lg block"
            to="/auth/register"
            >
            ¿No tienes cuenta? Crea una aquí
            </Link>
        </nav>
        </>
    );
}
