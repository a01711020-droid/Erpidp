/**
 * DATA PROVIDER - Exportación y Selección
 * 
 * REGLAS:
 * - ApiProvider siempre como fuente de verdad
 * - Sin fallbacks silenciosos ni mocks
 */

import { ApiProvider, apiProvider } from "../../core/api";
import type { IDataProvider } from "../../core/api";

/**
 * Provider activo (solo API)
 */
export const dataProvider: IDataProvider = apiProvider;

/**
 * Exportar tipos y clases
 */
export type { IDataProvider } from "../../core/api";
export { ApiProvider, apiProvider };
