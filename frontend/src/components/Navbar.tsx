import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RoleGuard from "./RoleGuard";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-fuchsia-950 text-white px-6 py-4 flex justify-between items-center">
            <div className="flex gap-6 items-center">
                <Link to="/" className="font-bold text-lg">Distribuidora</Link>
                <Link to="/products">Productos</Link>
                <Link to="/sales">Ventas</Link>
                <Link to="/categories">Categorías</Link>
                <RoleGuard allowedRoles={['owner', 'manager']}>
                    <Link to="/purchases">Compras</Link>
                    <Link to="/providers">Proveedores</Link>
                </RoleGuard>

                <RoleGuard allowedRoles={['owner']}>
                    <Link to="/users">Usuarios</Link>
                </RoleGuard>
            </div>

            <div className="flex gap-4 items-center">
                <span className="text-sm">
                    {user?.name} <span className="opacity-70">({user?.role})</span>
                </span>
                <button
                    onClick={logout}
                    className="bg-fuchsia-800 px-3 py-1 rounded hover:bg-fuchsia-700"
                >
                    Salir
                </button>
            </div>
        </nav>
    );
}