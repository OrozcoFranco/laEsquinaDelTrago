import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { isAxiosError } from "axios";
import { toast } from "sonner"
import type { RegisterForm } from '../types'
import ErrorMessage from "../components/ErrorMessage";
import api from "../api/axios";



export default function RegisterView() {
    const initialValues: RegisterForm = {
        name: '',
        email: '',
        dni: '',
        password: '',
        password_confirmation: '',

    }

    const { register, watch, reset, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ defaultValues: initialValues })

    const password = watch('password');

    const handleRegister = async (formData: RegisterForm) => {
        try {
            const { data } = await api.post(`/auth/register`, formData)
            toast.success(data)
            reset()
            console.log(data);
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error);
            }
        }
    }

    return (
        <>
            <h1 className=" text-4xl text-black font-bold text-center ">Crear cuenta</h1>
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-gray-400 px-10 py-20 rounded-lg w-110 space-y-1-8 mt-10"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-black font-bold text-center">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu Nombre"
                        className="bg-slate-100 border-none p-3 w-full rounded-lg  placeholder-slate-400"
                        {...register('name', {
                            required: "El Nombre es obligatorio",
                            pattern: {
                                value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
                                message: "Solo se permiten letras"
                            }
                        })}

                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-2">
                    <label htmlFor="dni" className="text-2xl text-black font-bold text-center pt-2">
                        D.N.I
                    </label>
                    <input 
                        id="dni"
                        type="text" 
                        placeholder="D.N.I"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('dni',{
                            required: " El D.N.I es obligatorio",
                            pattern: {
                                value: /^[0-9]{7,8}$/,
                                message: "Debe contener solo números (7 u 8 dígitos)",
                            }
                        })}
                    />

                    {errors.dni && <ErrorMessage>{errors.dni?.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-black font-bold text-center pt-2">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('email', {
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
                    <label htmlFor="password" className="text-2xl text-black font-bold text-center pt-2">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password', {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 8,
                                message: "El Password debe tener al menos 8 caracteres"
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-black font-bold text-center pt-2">Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repetir Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password_confirmation', {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || "Las contraseñas no coinciden"
                        })}
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    className="bg-fuchsia-950 mt-13 p-3 text-lg w-full uppercase text-slate-100 rounded-lg font-bold cursor-pointer"
                    value='Crear Cuenta'
                />
            </form>
            <nav className=" mt-10">
                <Link
                    className=" text-center text-white text-lg block"
                    to="/auth/login">
                    Registrado! Inicia sesion
                </Link>
            </nav>
        </>
    )
}

