import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../pages/AppLayout";
import HomePage from "../pages/HomePage";
import ObrasPage from "../pages/ObrasPage";
import ProveedoresPage from "../pages/ProveedoresPage";
import OrdenesCompraPage from "../pages/OrdenesCompraPage";
import PagosPage from "../pages/PagosPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="obras" element={<ObrasPage />} />
          <Route path="proveedores" element={<ProveedoresPage />} />
          <Route path="compras/ordenes-compra" element={<OrdenesCompraPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
