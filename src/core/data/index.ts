/**
 * DATA ADAPTER - EXPORT POINT
 *
 * Cambia entre mockAdapter (desarrollo) y apiAdapter (producción)
 * según la variable VITE_DATA_MODE en .env
 *
 * VITE_DATA_MODE=mock  → usa datos en memoria (sin backend)
 * VITE_DATA_MODE=api   → conecta al backend FastAPI real
 */

import { mockAdapterWithDevMode } from "./mockAdapterWithDevMode";
import { ApiDataAdapter } from "./apiAdapter.example"; // renombrar a apiAdapter.ts cuando el BE esté listo
import { MOCK_MODE } from "../config";

const apiAdapter = new ApiDataAdapter();

/**
 * DataAdapter activo
 * Controlado por VITE_DATA_MODE en .env
 */
export const dataAdapter = MOCK_MODE ? mockAdapterWithDevMode : apiAdapter;

// Re-exports
export * from "./dataAdapter";
export * from "./types";
