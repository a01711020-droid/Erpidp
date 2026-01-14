import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
        {/* Ruta principal - Dashboard Global */}
        <Route path="/" element={<GlobalDashboard />} />
        
        {/* Módulo de Requisiciones */}
        <Route path="/requisiciones" element={<MaterialRequisitions />} />
        
        {/* Módulo de Órdenes de Compra */}
        <Route path="/ordenes-compra" element={<PurchaseOrderManagement />} />
        
        {/* Módulo de Pagos */}
        <Route path="/pagos" element={<PaymentManagement />} />
        
        {/* Módulo de Destajos */}
        <Route path="/destajos" element={<DestajosModule />} />
        
        {/* Módulo de Contratos (Físico) */}
        <Route path="/contratos" element={<ContractTracking />} />
        
        {/* Módulo de Gastos */}
        <Route path="/gastos" element={<ExpenseDetails />} />
        
        {/* Ruta no encontrada - redirige al dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
