/**
 * DATA PROVIDER - Exportación y Selección
 * 
 * REGLAS:
 * - Por defecto: ApiProvider (conexión real al backend)
 * - Modo Mock: Solo si VITE_DATA_MODE=mock
 * - Sin fallbacks silenciosos
 */

import { ApiProvider, apiProvider } from './ApiProvider';
import { MockProvider, mockProvider } from './MockProvider';
import type { IDataProvider } from './DataProvider.interface';

/**
 * Seleccionar provider según configuración
 */
const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'api';

let activeProvider: IDataProvider;

if (DATA_MODE === 'mock') {
  console.warn('⚠️ Using MOCK DATA PROVIDER - No persistence');
  activeProvider = mockProvider;
} else {
  console.log('✅ Using API DATA PROVIDER - Real backend connection');
  activeProvider = apiProvider;
}

/**
 * Provider activo (api o mock según configuración)
 */
export const dataProvider = activeProvider;

/**
 * Exportar tipos y clases
 */
export type { IDataProvider } from './DataProvider.interface';
export { ApiProvider, apiProvider, MockProvider, mockProvider };
