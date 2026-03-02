/**
 * DATA ADAPTER — Punto de entrada único
 *
 * Lee VITE_MOCK_MODE del entorno:
 *   VITE_MOCK_MODE=true  (o no definida) → mockAdapterWithDevMode
 *   VITE_MOCK_MODE=false                 → apiAdapter real
 *
 * Para cambiar de mock a API real:
 *   1. Asegúrate de tener el backend corriendo
 *   2. Agrega VITE_MOCK_MODE=false en tu .env.local
 *   3. Agrega VITE_API_BASE_URL=http://localhost:8000/api/v1
 */

import { mockAdapterWithDevMode } from './mockAdapterWithDevMode';
import { apiAdapter } from './apiAdapter';
import { MOCK_MODE } from '../config';

export const dataAdapter = MOCK_MODE ? mockAdapterWithDevMode : apiAdapter;

// Re-exports para que los módulos solo importen desde aquí
export * from './dataAdapter';
export * from './types';
