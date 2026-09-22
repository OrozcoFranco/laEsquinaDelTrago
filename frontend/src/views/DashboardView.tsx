import { useAuth } from "../hooks/useAuth";

export default function DashboardView() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">
                Bienvenido, {user?.name}
            </h1>
            <p className="text-gray-500 mt-2">
                Rol actual: <span className="font-semibold">{user?.role}</span>
            </p>
        </div>
    );
}