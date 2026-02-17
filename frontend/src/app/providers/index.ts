import type { IDataProvider } from './DataProvider.interface';

/**
 * Provider de runtime deshabilitado en Fase 1.
 * El consumo de datos se realiza vía hooks en src/core.
 */
export const dataProvider: IDataProvider | null = null;

export type { IDataProvider } from './DataProvider.interface';
