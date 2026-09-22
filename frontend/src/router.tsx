import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayouts";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoriesView from "./views/CategoriesView";


export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/auth/login" element={<LoginView />} />
        </Route>
        {/* Rutas protegidas - cualquier usuario logueado */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardView />} />
          </Route>
        </Route>
        {/* // Dentro de las rutas protegidas (cualquier usuario logueado puede ver,
        OWNER/MANAGER pueden editar): */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/categories" element={<CategoriesView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
