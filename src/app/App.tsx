import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../pages/layouts/DashboardLayout";
import CatalogosLayout from "../pages/layouts/CatalogosLayout";
import ComprasLayout from "../pages/layouts/ComprasLayout";
import PagosLayout from "../pages/layouts/PagosLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import DashboardObraPage from "../pages/dashboard/DashboardObraPage";
import DashboardObraDesglosePage from "../pages/dashboard/DashboardObraDesglosePage";
import ObrasCatalogoPage from "../pages/catalogos/ObrasCatalogoPage";
import ProveedoresCatalogoPage from "../pages/catalogos/ProveedoresCatalogoPage";
import ComprasListPage from "../pages/compras/ComprasListPage";
import ComprasNuevaPage from "../pages/compras/ComprasNuevaPage";
import ComprasDetallePage from "../pages/compras/ComprasDetallePage";
import PagosListPage from "../pages/pagos/PagosListPage";
import PagosOcPage from "../pages/pagos/PagosOcPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="obras/:obraId" element={<DashboardObraPage />} />
          <Route path="obras/:obraId/desglose" element={<DashboardObraDesglosePage />} />
        </Route>

        <Route path="/obras" element={<CatalogosLayout />}>
          <Route index element={<ObrasCatalogoPage />} />
        </Route>

        <Route path="/proveedores" element={<CatalogosLayout />}>
          <Route index element={<ProveedoresCatalogoPage />} />
        </Route>

        <Route path="/compras" element={<ComprasLayout />}>
          <Route index element={<Navigate to="/compras/ordenes-compra" replace />} />
          <Route path="ordenes-compra" element={<ComprasListPage />} />
          <Route path="ordenes-compra/nueva" element={<ComprasNuevaPage />} />
          <Route path="ordenes-compra/:ocId" element={<ComprasDetallePage />} />
        </Route>

        <Route path="/pagos" element={<PagosLayout />}>
          <Route index element={<PagosListPage />} />
          <Route path="oc/:ocId" element={<PagosOcPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
