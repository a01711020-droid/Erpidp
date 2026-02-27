/**
 * REQUIRE AUTH
 * Guard que protege rutas. Si no hay sesión, redirige a /login.
 * Si hay sesión pero el rol no tiene acceso a esa ruta, redirige a su módulo.
 */

import { Navigate, useLocation } from "react-router";
import { useAuth, ROLE_ROUTES, ROLE_HOME } from "../contexts/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // No autenticado → login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el rol tiene acceso a esta ruta
  const allowedRoutes = ROLE_ROUTES[user.rol];
  const currentPath = "/" + location.pathname.split("/")[1]; // e.g. "/compras"
  const hasAccess = allowedRoutes.some((route) =>
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  if (!hasAccess) {
    // Redirigir a su módulo principal
    return <Navigate to={ROLE_HOME[user.rol]} replace />;
  }

  return <>{children}</>;
}
