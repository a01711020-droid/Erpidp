/**
 * RUTAS DEL SISTEMA — Completas
 *
 * Todos los módulos protegidos con ProtectedRoute por rol.
 *
 * Roles:
 *   admin       → acceso total
 *   director    → /dashboard
 *   comprador   → /compras, /requisiciones
 *   residente   → /requisiciones, /destajos
 *   finanzas    → /pagos
 *   almacenista → /almacen
 *   rh          → /personal
 */

import { createBrowserRouter, Navigate } from 'react-router';

// Auth
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ComprasLayout from './layouts/ComprasLayout';
import PagosLayout from './layouts/PagosLayout';
import DestajosLayout from './layouts/DestajosLayout';
import RequisicionesLayout from './layouts/RequisicionesLayout';
import AlmacenLayout from './layouts/AlmacenLayout';
import PersonalLayout from './layouts/PersonalLayout';

// Dashboard
import GlobalDashboard from './GlobalDashboard';
import DashboardObras from './pages/dashboard/DashboardObras';
import DashboardObraDetalle from './pages/dashboard/DashboardObraDetalle';

// Compras
import OrdenesCompraList from './pages/compras/OrdenesCompraList';
import OrdenCompraCreate from './pages/compras/OrdenCompraCreate';
import OrdenCompraDetail from './pages/compras/OrdenCompraDetail';
import ProveedoresList from './pages/compras/ProveedoresList';
import ProveedorCreate from './pages/compras/ProveedorCreate';
import ProveedorDetail from './pages/compras/ProveedorDetail';

// Pagos
import PagosProgramacion from './pages/pagos/PagosProgramacion';
import FacturasList from './pages/pagos/FacturasList';
import FacturaCreate from './pages/pagos/FacturaCreate';
import PagosProcesar from './pages/pagos/PagosProcesar';
import PagosHistorial from './pages/pagos/PagosHistorial';

// Destajos
import DestajistasCatalogo from './pages/destajos/DestajistasCatalogo';
import CapturaAvances from './pages/destajos/CapturaAvances';
import ResumenDestajos from './pages/destajos/ResumenDestajos';

// Requisiciones
import RequisicionesList from './pages/requisiciones/RequisicionesList';
import RequisicionCreate from './pages/requisiciones/RequisicionCreate';
import RequisicionDetail from './pages/requisiciones/RequisicionDetail';

// Almacén
import AlmacenInventario from './pages/almacen/AlmacenInventario';
import AlmacenEntradas from './pages/almacen/AlmacenEntradas';
import AlmacenSalidas from './pages/almacen/AlmacenSalidas';

// Personal
import PersonalDirectorio from './pages/personal/PersonalDirectorio';
import PersonalNuevo from './pages/personal/PersonalNuevo';
import PersonalAsistencia from './pages/personal/PersonalAsistencia';
import PersonalReportes from './pages/personal/PersonalReportes';

// Error
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  // ── Raíz ────────────────────────────────────────────────────────────────
  { path: '/', element: <Navigate to="/login" replace /> },

  // ── Login (pública) ──────────────────────────────────────────────────────
  { path: '/login', Component: LoginPage },

  // ── Dashboard ────────────────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRoles={['admin', 'director']} />,
    children: [{
      Component: DashboardLayout,
      children: [
        { index: true, Component: GlobalDashboard },
        { path: 'obras', Component: DashboardObras },
        { path: 'obras/:codigoObra', Component: DashboardObraDetalle },
      ],
    }],
  },

  // ── Compras ───────────────────────────────────────────────────────────────
  {
    path: '/compras',
    element: <ProtectedRoute allowedRoles={['admin', 'comprador']} />,
    children: [{
      Component: ComprasLayout,
      children: [
        { index: true, Component: OrdenesCompraList },
        { path: 'ordenes', Component: OrdenesCompraList },
        { path: 'ordenes/nueva', Component: OrdenCompraCreate },
        { path: 'ordenes/:id', Component: OrdenCompraDetail },
        { path: 'proveedores', Component: ProveedoresList },
        { path: 'proveedores/nuevo', Component: ProveedorCreate },
        { path: 'proveedores/:id', Component: ProveedorDetail },
      ],
    }],
  },

  // ── Pagos ─────────────────────────────────────────────────────────────────
  {
    path: '/pagos',
    element: <ProtectedRoute allowedRoles={['admin', 'finanzas']} />,
    children: [{
      Component: PagosLayout,
      children: [
        { index: true, Component: PagosProgramacion },
        { path: 'programacion', Component: PagosProgramacion },
        { path: 'facturas', Component: FacturasList },
        { path: 'facturas/nueva', Component: FacturaCreate },
        { path: 'procesar', Component: PagosProcesar },
        { path: 'historial', Component: PagosHistorial },
      ],
    }],
  },

  // ── Destajos ──────────────────────────────────────────────────────────────
  {
    path: '/destajos',
    element: <ProtectedRoute allowedRoles={['admin', 'residente']} />,
    children: [{
      Component: DestajosLayout,
      children: [
        { index: true, Component: DestajistasCatalogo },
        { path: 'catalogo', Component: DestajistasCatalogo },
        { path: 'captura', Component: CapturaAvances },
        { path: 'resumen', Component: ResumenDestajos },
      ],
    }],
  },

  // ── Requisiciones ─────────────────────────────────────────────────────────
  {
    path: '/requisiciones',
    element: <ProtectedRoute allowedRoles={['admin', 'residente', 'comprador']} />,
    children: [{
      Component: RequisicionesLayout,
      children: [
        { index: true, Component: RequisicionesList },
        { path: 'nueva', Component: RequisicionCreate },
        { path: ':id', Component: RequisicionDetail },
      ],
    }],
  },

  // ── Almacén ───────────────────────────────────────────────────────────────
  {
    path: '/almacen',
    element: <ProtectedRoute allowedRoles={['admin', 'almacenista']} />,
    children: [{
      Component: AlmacenLayout,
      children: [
        { index: true, Component: AlmacenInventario },
        { path: 'entradas', Component: AlmacenEntradas },
        { path: 'salidas', Component: AlmacenSalidas },
      ],
    }],
  },

  // ── Personal ──────────────────────────────────────────────────────────────
  {
    path: '/personal',
    element: <ProtectedRoute allowedRoles={['admin', 'rh']} />,
    children: [{
      Component: PersonalLayout,
      children: [
        { index: true, Component: PersonalDirectorio },
        { path: 'nuevo', Component: PersonalNuevo },
        { path: 'asistencia', Component: PersonalAsistencia },
        { path: 'reportes', Component: PersonalReportes },
      ],
    }],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  { path: '*', Component: NotFoundPage },
]);
