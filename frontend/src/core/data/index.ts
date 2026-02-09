/**
 * DATA ADAPTER - EXPORT POINT
 * 
 * Punto de entrada único para el adaptador de datos
 * Usa el apiAdapter como fuente única
 */

import { ApiDataAdapter } from './apiAdapter';

/**
 * DataAdapter activo
 * 
 * En desarrollo y producción: apiAdapter
 */
export const dataAdapter = new ApiDataAdapter();

// Re-exports
export * from './dataAdapter';
export * from './types';
