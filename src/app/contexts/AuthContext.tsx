/**
 * AUTH CONTEXT
 * Maneja autenticación JWT y control de acceso por rol.
 * El token se guarda en memoria (no localStorage) para mayor seguridad.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ============================================================================
// TIPOS
// ============================================================================

export type UserRole =
  | "admin"
  | "director"
  | "residente"
  | "comprador"
  | "finanzas"
  | "almacenista"
  | "rh";

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  obrasPermitidas: string[]; // IDs de obras asignadas (vacío = todas)
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ============================================================================
// MÓDULO POR ROL
// ============================================================================

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/dashboard",
  director: "/dashboard",
  residente: "/requisiciones",
  comprador: "/compras",
  finanzas: "/pagos",
  almacenista: "/almacen",
  rh: "/personal",
};

// ============================================================================
// RUTAS PERMITIDAS POR ROL
// ============================================================================

export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: ["/", "/dashboard", "/compras", "/pagos", "/requisiciones", "/destajos", "/almacen", "/personal"],
  director: ["/", "/dashboard"],
  residente: ["/", "/requisiciones"],
  comprador: ["/", "/compras"],
  finanzas: ["/", "/pagos"],
  almacenista: ["/", "/almacen"],
  rh: ["/", "/personal"],
};

// ============================================================================
// CONTEXTO
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Credenciales incorrectas");
      }

      const data = await response.json();
      // Espera: { access_token: string, user: AuthUser }

      setState({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error al iniciar sesión",
      }));
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
