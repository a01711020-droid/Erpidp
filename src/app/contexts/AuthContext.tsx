/**
 * AUTH CONTEXT
 * Maneja autenticación JWT y control de acceso por rol
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================
// TIPOS
// ============================================================

export type UserRole =
  | 'admin'
  | 'director'
  | 'residente'
  | 'comprador'
  | 'finanzas'
  | 'almacenista'
  | 'rh';

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  obrasPermitidas: string[]; // IDs de obras — vacío = todas
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getDefaultRoute: () => string;
}

// ============================================================
// MAPA DE RUTAS POR ROL
// ============================================================

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  admin:       '/dashboard',
  director:    '/dashboard',
  residente:   '/requisiciones',
  comprador:   '/compras',
  finanzas:    '/pagos',
  almacenista: '/almacen',
  rh:          '/personal',
};

export const ROLE_ALLOWED_MODULES: Record<UserRole, string[]> = {
  admin:       ['dashboard', 'requisiciones', 'compras', 'pagos', 'almacen', 'personal', 'destajos'],
  director:    ['dashboard', 'requisiciones', 'compras', 'pagos', 'almacen', 'personal', 'destajos'],
  residente:   ['requisiciones', 'destajos'],
  comprador:   ['compras', 'requisiciones'],
  finanzas:    ['pagos', 'compras'],
  almacenista: ['almacen', 'compras'],
  rh:          ['personal'],
};

// ============================================================
// CONTEXTO
// ============================================================

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'erp_token';
const USER_KEY  = 'erp_user';

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user:            null,
    token:           null,
    isLoading:       true,
    isAuthenticated: false,
  });

  // Restaurar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);

    if (token && userRaw) {
      try {
        const user: AuthUser = JSON.parse(userRaw);
        setState({ user, token, isLoading: false, isAuthenticated: true });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

    const res = await fetch(`${apiUrl}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Credenciales incorrectas');
    }

    const data: { access_token: string; user: AuthUser } = await res.json();

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    setState({
      user:            data.user,
      token:           data.access_token,
      isLoading:       false,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  };

  const getDefaultRoute = () => {
    if (!state.user) return '/login';
    return ROLE_DEFAULT_ROUTES[state.user.rol] ?? '/dashboard';
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, getDefaultRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const auth = useAuth();

  const hasAccess =
    auth.isAuthenticated &&
    auth.user &&
    (!allowedRoles || allowedRoles.includes(auth.user.rol));

  return { ...auth, hasAccess: !!hasAccess };
}
