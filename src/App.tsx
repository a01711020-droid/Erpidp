import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import ObrasPage from "./pages/ObrasPage";
import OrdenesCompraPage from "./pages/OrdenesCompraPage";
import PagosPage from "./pages/PagosPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import RequisicionesPage from "./pages/RequisicionesPage";
import ErrorState from "./ui/common/ErrorState";

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <ErrorState
          title="Falta configurar VITE_API_URL"
          description="Define VITE_API_URL en .env.local para habilitar la conexión con el backend."
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, #f5f3f0 0%, #f8f6f3 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.008) 2px,
            rgba(0, 0, 0, 0.008) 4px
          )
        `,
        backgroundBlendMode: "overlay",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="obras" element={<ObrasPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="compras/ordenes-compra" element={<OrdenesCompraPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="requisiciones" element={<RequisicionesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
