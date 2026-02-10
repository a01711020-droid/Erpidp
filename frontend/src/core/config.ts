/**
 * CONFIGURACIÓN GLOBAL
 * 
 * Configuración centralizada de la aplicación
 */

// ============================================================================
// CONFIGURACIÓN DE API
// ============================================================================

/**
 * URL del backend FastAPI
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Timeout de requests (ms)
 */
export const API_TIMEOUT = 30000;

// ============================================================================
// CONFIGURACIÓN DE UI
// ============================================================================

/**
 * Mostrar indicadores de carga
 */
export const SHOW_LOADING_INDICATORS = true;

/**
 * Duración mínima de loading states (ms)
 * Evita flashes visuales en respuestas muy rápidas
 */
export const MIN_LOADING_DURATION = 300;

/**
 * Máximo de items por página en listas
 */
export const DEFAULT_PAGE_SIZE = 50;

// ============================================================================
// CONFIGURACIÓN DE FORMATO
// ============================================================================

/**
 * Formato de fechas
 */
export const DATE_FORMAT = 'es-MX';

/**
 * Formato de moneda
 */
export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

// ============================================================================
// DEBUGGING
// ============================================================================

/**
 * Habilitar logs de debug en consola
 */
export const DEBUG_MODE = import.meta.env.DEV;

/**
 * Log de llamadas al adapter
 */
export const LOG_ADAPTER_CALLS = DEBUG_MODE && false;
