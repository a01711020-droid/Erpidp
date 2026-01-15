import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import GlobalDashboard from "./GlobalDashboard";
import MaterialRequisitions from "./MaterialRequisitions";
import PurchaseOrderManagement from "./PurchaseOrderManagement";
import PaymentManagement from "./PaymentManagement";
import ContractTracking from "./ContractTracking";
import ExpenseDetails from "./ExpenseDetails";
import DestajosModule from "./DestajosModule";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - Home (Pantalla de selección) */}
        <Route path="/" element={<Home />} />
        
        {/* Dashboard Global */}
        <Route path="/dashboard" element={<GlobalDashboard />} />
        
        {/* Sub-rutas del Dashboard por obra */}
        <Route path="/dashboard/:obraSlug/contratos" element={<ContractTracking />} />
        <Route path="/dashboard/:obraSlug/gastos" element={<ExpenseDetails />} />
        <Route path="/dashboard/:obraSlug/destajos" element={<DestajosModule />} />
        
        {/* Módulo de Compras (antes Órdenes de Compra) */}
        <Route path="/compras" element={<PurchaseOrderManagement />} />
        
        {/* Módulo de Requisiciones */}
        <Route path="/requisiciones" element={<MaterialRequisitions />} />
        
        {/* Módulo de Pagos */}
        <Route path="/pagos" element={<PaymentManagement />} />
        
        {/* Ruta no encontrada - redirige al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}