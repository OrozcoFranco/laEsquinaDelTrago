// ─── ROL ─────────────────────────────────────────────────────────
export type Role = 'owner' | 'manager' | 'operator';

// ─── USUARIO AUTENTICADO (lo que devuelve el backend) ─────────────
export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
};

// ─── FORMULARIOS ────────────────────────────────────────────────
export type RegisterForm = {
    name: string;
    dni: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type LoginForm = {
    email: string;
    password: string;
};

// ─── RESPUESTA DEL BACKEND AL HACER LOGIN/REGISTER ────────────────
export type AuthResponse = {
    message: string;
    access_token: string;
    user: User;
};

// ─── CONTEXTO DE AUTENTICACIÓN (lo vamos a usar en el AuthContext) ─
export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (formData: LoginForm) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
};

// ─── CATEGORÍAS ─────────────────────────────────────────────────
export type Category = {
    id_category: number;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CategoryForm = {
    name: string;
};