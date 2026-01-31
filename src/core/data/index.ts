/**
 * DATA ADAPTER - EXPORT POINT
 * 
 * Punto de entrada único para el adaptador de datos
 * Cambia entre mockAdapter y apiAdapter según configuración
 */

import { mockAdapterWithDevMode } from './mockAdapterWithDevMode';
import { apiAdapter } from './apiAdapter';

/**
 * DataAdapter activo
 * 
 * En desarrollo: mockAdapterWithDevMode (solo si VITE_DATA_MODE=mock)
 * En producción: apiAdapter
 */
const dataMode = import.meta.env.VITE_DATA_MODE ?? 'api';
const shouldUseMock = import.meta.env.DEV && dataMode === 'mock';
export const dataAdapter = shouldUseMock ? mockAdapterWithDevMode : apiAdapter;

// Re-exports
export * from './dataAdapter';
export * from './types';
