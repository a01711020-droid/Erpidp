/**
 * RUTAS DEL SISTEMA
 *
 * Todas las rutas de módulos están protegidas con ProtectedRoute.
 * Cada módulo define qué roles tienen acceso.
 *
 * Flujo:
 *   / → LoginPage (si no hay sesión)
 *         → redirige a ruta del rol automáticamente
 *   /dashboard   → admin, director
 *   /compras     → admin, comprador
 *   /requisiciones → admin, residente, comprador
 *   /pagos       → admin, finanzas
 *   /destajos    → admin, residente
 *   /almacen     → admin, almacenista
 *   /personal    → admin, rh
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

// Error
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  // ── Ruta raíz → redirige a login (la sesión decide a dónde después) ──────
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // ── Login (pública) ──────────────────────────────────────────────────────
  {
    path: '/login',
    Component: LoginPage,
  },

  // ── Dashboard (director, admin) ──────────────────────────────────────────
  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRoles={['admin', 'director']} />,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, Component: GlobalDashboard },
          { path: 'obras', Component: DashboardObras },
          { path: 'obras/:codigoObra', Component: DashboardObraDetalle },
        ],
      },
    ],
  },

  // ── Compras (comprador, admin) ───────────────────────────────────────────
  {
    path: '/compras',
    element: <ProtectedRoute allowedRoles={['admin', 'comprador']} />,
    children: [
      {
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
      },
    ],
  },

  // ── Pagos (finanzas, admin) ──────────────────────────────────────────────
  {
    path: '/pagos',
    element: <ProtectedRoute allowedRoles={['admin', 'finanzas']} />,
    children: [
      {
        Component: PagosLayout,
        children: [
          { index: true, Component: PagosProgramacion },
          { path: 'programacion', Component: PagosProgramacion },
          { path: 'facturas', Component: FacturasList },
          { path: 'facturas/nueva', Component: FacturaCreate },
          { path: 'procesar', Component: PagosProcesar },
          { path: 'historial', Component: PagosHistorial },
        ],
      },
    ],
  },

  // ── Destajos (residente, admin) ──────────────────────────────────────────
  {
    path: '/destajos',
    element: <ProtectedRoute allowedRoles={['admin', 'residente']} />,
    children: [
      {
        Component: DestajosLayout,
        children: [
          { index: true, Component: DestajistasCatalogo },
          { path: 'catalogo', Component: DestajistasCatalogo },
          { path: 'captura', Component: CapturaAvances },
          { path: 'resumen', Component: ResumenDestajos },
        ],
      },
    ],
  },

  // ── Requisiciones (residente, comprador, admin) ──────────────────────────
  {
    path: '/requisiciones',
    element: <ProtectedRoute allowedRoles={['admin', 'residente', 'comprador']} />,
    children: [
      {
        Component: RequisicionesLayout,
        children: [
          { index: true, Component: RequisicionesList },
          { path: 'nueva', Component: RequisicionCreate },
          { path: ':id', Component: RequisicionDetail },
        ],
      },
    ],
  },

  // ── Almacén y Personal → stub hasta Commit 5 ────────────────────────────
  {
    path: '/almacen',
    element: <ProtectedRoute allowedRoles={['admin', 'almacenista']} />,
    children: [
      {
        index: true,
        element: (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Módulo Almacén</h2>
              <p className="text-slate-500">En construcción — próximos commits</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    path: '/personal',
    element: <ProtectedRoute allowedRoles={['admin', 'rh']} />,
    children: [
      {
        index: true,
        element: (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Módulo Personal</h2>
              <p className="text-slate-500">En construcción — próximos commits</p>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────────────────
  {
    path: '*',
    Component: NotFoundPage,
  },
]);
