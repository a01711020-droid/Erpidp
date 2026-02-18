/**
 * CONFIGURACIÓN GLOBAL - Fase 1
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const API_TIMEOUT = 30000;

export const SHOW_LOADING_INDICATORS = true;
export const MIN_LOADING_DURATION = 300;
export const DEFAULT_PAGE_SIZE = 50;

export const DATE_FORMAT = 'es-MX';

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

export const DEBUG_MODE = import.meta.env.DEV;
export const LOG_ADAPTER_CALLS = false;
