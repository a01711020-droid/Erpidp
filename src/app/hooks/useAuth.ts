/**
 * useAuth — re-export del hook desde AuthContext
 * Importa desde aquí para mantener rutas de importación limpias:
 *   import { useAuth } from '@/app/hooks/useAuth';
 */
export { useAuth } from '@/app/contexts/AuthContext';
export type { AuthUser, UserRole } from '@/app/contexts/AuthContext';
