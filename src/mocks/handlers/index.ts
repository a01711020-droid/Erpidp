/**
 * MSW HANDLERS — Índice
 * Agrega todos los handlers de todos los dominios
 */

import { obrasHandlers } from './obras';
import { dashboardHandlers } from './dashboard';

export const handlers = [
  ...obrasHandlers,
  ...dashboardHandlers,
];
