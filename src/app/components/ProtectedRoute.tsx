/**
 * PROTECTED ROUTE
 *
 * Guard que protege rutas según autenticación y rol.
 *
 * Uso en routes.ts:
 *   <ProtectedRoute allowedRoles={['admin', 'comprador']}>
 *     <ComprasLayout />
 *   </ProtectedRoute>
 *
 * Comportamiento:
 *   - No autenticado → redirige a /login guardando la ruta de origen
 *   - Autenticado sin rol permitido → redirige a su ruta de inicio
 *   - Autenticado con rol permitido → renderiza el children
 */

import { Navigate, useLocation, Outlet } from 'react-router';
import { useAuth, type UserRole, ROLE_HOME } from '@/app/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Todavía restaurando sesión desde localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Cargando sesión...</span>
        </div>
      </div>
    );
  }

  // No autenticado → al login, guardando a dónde quería ir
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Rol sin acceso → a su ruta de inicio
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to={ROLE_HOME[user.rol]} replace />;
  }

  return <Outlet />;
}
