/**
 * AUTH CONTEXT
 *
 * Maneja toda la autenticación del sistema:
 * - Login / Logout
 * - JWT almacenado en localStorage
 * - Usuario y rol activos
 * - Redirect automático por rol al iniciar sesión
 *
 * Roles del sistema:
 *   director    → /dashboard
 *   comprador   → /compras
 *   residente   → /requisiciones
 *   finanzas    → /pagos
 *   almacenista → /almacen
 *   rh          → /personal
 *   admin       → /dashboard (ve todo)
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { API_BASE_URL } from '@/core/config';
import { MOCK_MODE } from '@/core/config';

// ============================================================================
// TIPOS
// ============================================================================

export type UserRole =
  | 'admin'
  | 'director'
  | 'comprador'
  | 'residente'
  | 'finanzas'
  | 'almacenista'
  | 'rh';

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  obrasPermitidas: string[]; // IDs de obras a las que tiene acceso
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getRedirectPath: (rol: UserRole) => string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const TOKEN_KEY = 'erp_token';
const USER_KEY = 'erp_user';

/** Ruta de inicio por rol */
export const ROLE_HOME: Record<UserRole, string> = {
  admin: '/dashboard',
  director: '/dashboard',
  comprador: '/compras',
  residente: '/requisiciones',
  finanzas: '/pagos',
  almacenista: '/almacen',
  rh: '/personal',
};

/** Roles que tienen acceso a cada ruta base */
export const ROUTE_ROLES: Record<string, UserRole[]> = {
  '/dashboard': ['admin', 'director'],
  '/compras': ['admin', 'comprador'],
  '/requisiciones': ['admin', 'residente', 'comprador'],
  '/pagos': ['admin', 'finanzas'],
  '/destajos': ['admin', 'residente'],
  '/almacen': ['admin', 'almacenista'],
  '/personal': ['admin', 'rh'],
};

// ============================================================================
// MOCK LOGIN (solo cuando VITE_MOCK_MODE=true)
// Usuarios de prueba para desarrollo sin backend
// ============================================================================

const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@idp.mx': {
    password: 'admin123',
    user: {
      id: 'usr_admin',
      nombre: 'Administrador IDP',
      email: 'admin@idp.mx',
      rol: 'admin',
      obrasPermitidas: [],
    },
  },
  'director@idp.mx': {
    password: 'director123',
    user: {
      id: 'usr_director',
      nombre: 'Director General',
      email: 'director@idp.mx',
      rol: 'director',
      obrasPermitidas: [],
    },
  },
  'compras@idp.mx': {
    password: 'compras123',
    user: {
      id: 'usr_comprador',
      nombre: 'Departamento de Compras',
      email: 'compras@idp.mx',
      rol: 'comprador',
      obrasPermitidas: [],
    },
  },
  'residente@idp.mx': {
    password: 'residente123',
    user: {
      id: 'usr_residente',
      nombre: 'Residente de Obra',
      email: 'residente@idp.mx',
      rol: 'residente',
      obrasPermitidas: ['obra_001', 'obra_002'],
    },
  },
  'finanzas@idp.mx': {
    password: 'finanzas123',
    user: {
      id: 'usr_finanzas',
      nombre: 'Departamento de Finanzas',
      email: 'finanzas@idp.mx',
      rol: 'finanzas',
      obrasPermitidas: [],
    },
  },
  'almacen@idp.mx': {
    password: 'almacen123',
    user: {
      id: 'usr_almacenista',
      nombre: 'Almacenista',
      email: 'almacen@idp.mx',
      rol: 'almacenista',
      obrasPermitidas: [],
    },
  },
  'rh@idp.mx': {
    password: 'rh123',
    user: {
      id: 'usr_rh',
      nombre: 'Recursos Humanos',
      email: 'rh@idp.mx',
      rol: 'rh',
      obrasPermitidas: [],
    },
  },
};

async function mockLogin(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser } | null> {
  // Simular delay de red
  await new Promise((r) => setTimeout(r, 600));
  const entry = MOCK_USERS[email.toLowerCase()];
  if (!entry || entry.password !== password) return null;
  return { token: `mock_token_${entry.user.rol}_${Date.now()}`, user: entry.user };
}

// ============================================================================
// CONTEXTO
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restaurar sesión desde localStorage al arrancar
  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);
      if (token && userRaw) {
        const user: AuthUser = JSON.parse(userRaw);
        setState({ user, token, isLoading: false, isAuthenticated: true });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((s) => ({ ...s, isLoading: true }));

      try {
        let token: string;
        let user: AuthUser;

        if (MOCK_MODE) {
          // ---- MOCK LOGIN ----
          const result = await mockLogin(email, password);
          if (!result) {
            setState((s) => ({ ...s, isLoading: false }));
            return { success: false, error: 'Email o contraseña incorrectos' };
          }
          token = result.token;
          user = result.user;
        } else {
          // ---- API LOGIN REAL ----
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            setState((s) => ({ ...s, isLoading: false }));
            return {
              success: false,
              error: err.detail || 'Email o contraseña incorrectos',
            };
          }

          const data = await response.json();
          token = data.access_token;
          user = data.user;
        }

        // Persistir sesión
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        setState({ user, token, isLoading: false, isAuthenticated: true });
        return { success: true };
      } catch (error) {
        setState((s) => ({ ...s, isLoading: false }));
        return { success: false, error: 'Error al conectar con el servidor' };
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  const getRedirectPath = useCallback((rol: UserRole) => {
    return ROLE_HOME[rol] || '/dashboard';
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
