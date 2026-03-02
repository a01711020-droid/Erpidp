/**
 * CONFIGURACIÓN GLOBAL
 *
 * Toda la configuración se lee desde variables de entorno.
 * En desarrollo: archivo .env.local
 * En producción: variables configuradas en Azure / CI
 */

// ============================================================================
// MODO DE DATOS
// ============================================================================

/**
 * MOCK_MODE
 *
 * true  → usa mockAdapter (datos en memoria, sin backend)
 * false → usa apiAdapter real (requiere VITE_API_BASE_URL apuntando al backend)
 *
 * Controlado por variable de entorno VITE_MOCK_MODE
 * Por defecto: true (seguro para desarrollo sin backend)
 */
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false';

/**
 * TEST_EMPTY_STATE
 * Usa base de datos vacía para probar empty states
 */
export const TEST_EMPTY_STATE = import.meta.env.VITE_TEST_EMPTY_STATE === 'true';

/**
 * SIMULATE_NETWORK_DELAY
 * Simula latencia en mockAdapter para UX realista
 */
export const SIMULATE_NETWORK_DELAY = import.meta.env.VITE_SIMULATE_DELAY !== 'false';

// ============================================================================
// CONFIGURACIÓN DE API
// ============================================================================

/**
 * URL base del backend FastAPI
 * Ejemplo desarrollo : http://localhost:8000/api/v1
 * Ejemplo producción : https://erp-api.azurewebsites.net/api/v1
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Timeout de requests en ms
 */
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// ============================================================================
// CONFIGURACIÓN DE UI
// ============================================================================

export const SHOW_LOADING_INDICATORS = true;

/** Duración mínima del loading state (evita flashes) */
export const MIN_LOADING_DURATION = 300;

/** Items por página en listas */
export const DEFAULT_PAGE_SIZE = 50;

// ============================================================================
// FORMATO
// ============================================================================

export const DATE_FORMAT = 'es-MX';

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

// ============================================================================
// DEBUGGING
// ============================================================================

export const DEBUG_MODE = import.meta.env.DEV;
export const LOG_ADAPTER_CALLS = DEBUG_MODE && import.meta.env.VITE_LOG_ADAPTER === 'true';
