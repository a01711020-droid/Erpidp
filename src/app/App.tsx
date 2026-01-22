import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import DashboardObraPage from "./pages/DashboardObraPage";
import DashboardObraDesglosePage from "./pages/DashboardObraDesglosePage";
import ComprasListPage from "./pages/ComprasListPage";
import ComprasNuevaPage from "./pages/ComprasNuevaPage";
import ComprasDetallePage from "./pages/ComprasDetallePage";
import ComprasObraPage from "./pages/ComprasObraPage";
import PagosListPage from "./pages/PagosListPage";
import PagosConciliacionPage from "./pages/PagosConciliacionPage";
import PagosObraPage from "./pages/PagosObraPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/obras/:obraId" element={<DashboardObraPage />} />
          <Route
            path="dashboard/obras/:obraId/desglose"
            element={<DashboardObraDesglosePage />}
          />
          <Route path="compras" element={<ComprasListPage />} />
          <Route path="compras/nueva" element={<ComprasNuevaPage />} />
          <Route path="compras/:ocId" element={<ComprasDetallePage />} />
          <Route path="compras/obra/:obraId" element={<ComprasObraPage />} />
          <Route path="pagos" element={<PagosListPage />} />
          <Route path="pagos/conciliacion" element={<PagosConciliacionPage />} />
          <Route path="pagos/obra/:obraId" element={<PagosObraPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
