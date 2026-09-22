import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginForm, AuthContextType, AuthResponse } from "../types";
import { login as loginService } from "../service/auth";
import api from "../api/axios";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Al cargar la app, si hay token guardado, recuperamos el perfil
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("AUTH_TOKEN");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await api.get<User>("/users/profile");
                setUser(data);
            } catch (error) {
                // Token inválido o expirado
                localStorage.removeItem("AUTH_TOKEN");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (formData: LoginForm) => {
        const data: AuthResponse = await loginService(formData);
        localStorage.setItem("AUTH_TOKEN", data.access_token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN");
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}