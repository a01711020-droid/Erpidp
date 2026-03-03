/**
 * MSW BROWSER SETUP
 *
 * Configura el Service Worker para interceptar fetch() en el navegador.
 * Solo se activa en desarrollo (VITE_MSW_ENABLED=true).
 *
 * El archivo public/mockServiceWorker.js se genera con:
 *   npx msw init public/ --save
 * (Este comando lo ejecutas una sola vez en tu máquina)
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
