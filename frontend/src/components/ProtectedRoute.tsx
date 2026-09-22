import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

type ProtectedRouteProps = {
    allowedRoles?: Role[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p className="text-center text-white text-xl mt-20">Cargando...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // o a una página "No autorizado"
    }

    return <Outlet />; // renderiza la ruta hija
}