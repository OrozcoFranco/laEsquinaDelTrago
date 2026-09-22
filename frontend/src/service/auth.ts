import api from '../api/axios';
import type { LoginForm, RegisterForm } from '../types';

// funcion para registrarse
export async function register(formData: Omit<RegisterForm, 'password_confirmation'>) {
    const { data } = await api.post('/auth/register', formData);
    return data;
}

export async function login(formData: LoginForm) {
    const { data } = await api.post('/auth/login', formData);
    return data;
}