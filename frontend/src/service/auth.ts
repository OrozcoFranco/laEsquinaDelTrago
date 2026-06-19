import axios from "axios";

const api = import.meta.env.VITE_API_URL;

// funcion para registrarse
export async function register(name: string, dni: string, email: string, password: string) {
    const { data } = await axios.post(`${api}/auth/register`, {
        name,
        dni,
        email,
        password,
    });
    return data;
}

// para registrar el login
export async function login(email: string, password: string) {
    const { data } = await axios.post(`${api}/auth/login`, { email, password });
    localStorage.setItem("token", data.accessToken);
    return data;
}