/**
 * DATA PROVIDER - API REAL (FastAPI)
 */

import { ApiProvider } from "./ApiProvider";
import type { IDataProvider } from './DataProvider.interface';

/**
 * Provider activo (API real)
 */
export const dataProvider: IDataProvider = new ApiProvider();

/**
 * Exportar tipos y clases
 */
export type { IDataProvider } from './DataProvider.interface';
export { ApiProvider };
