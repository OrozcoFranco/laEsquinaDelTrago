import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-amber-50 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-950 text-white p-4">
          <h1 className="ml-2 text-xl font-bold">Distribuidora</h1>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 max-w-lg mx-auto pt-10 px-5">
          <div className="py-10">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-blue-950 text-white text-center p-4">
          <p>© Distribuidora 2026. Todos los derechos reservados.</p>
        </footer>
      </div>

      <Toaster position="top-right" />
    </>
  );
}
