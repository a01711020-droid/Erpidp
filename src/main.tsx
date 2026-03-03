/**
 * MAIN — Punto de entrada
 *
 * En desarrollo con VITE_MSW_ENABLED=true:
 *   1. Arranca el MSW Service Worker
 *   2. Renderiza la app
 *
 * En producción:
 *   - MSW no se importa ni se ejecuta (tree-shaken por Vite)
 */

import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './app/contexts/AuthContext';
import { router } from './app/routes';
import './styles/index.css';

async function prepare() {
  if (import.meta.env.VITE_MSW_ENABLED === 'true') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass', // deja pasar requests no mockeados
    });
  }
  return Promise.resolve();
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
});
