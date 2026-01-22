/**
 * DATA PROVIDER - Exportación y Selección
 * 
 * REGLAS:
 * - ApiProvider siempre como fuente de verdad
 * - Sin fallbacks silenciosos ni mocks
 */

import { ApiProvider, apiProvider } from './ApiProvider';
import type { IDataProvider } from './DataProvider.interface';

/**
 * Provider activo (solo API)
 */
export const dataProvider: IDataProvider = apiProvider;

/**
 * Exportar tipos y clases
 */
export type { IDataProvider } from './DataProvider.interface';
export { ApiProvider, apiProvider };
