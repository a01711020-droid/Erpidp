/**
 * ENDPOINTS
 *
 * Catálogo de todas las URLs del backend.
 * Cambia aquí y se propaga a toda la app.
 */

export const EP = {
  // Auth
  login:              '/auth/login',

  // Obras
  obras:              '/obras',
  obra:              (id: string) => `/obras/${id}`,

  // Dashboard
  dashboardMetricas:  '/dashboard/metricas',

  // Proveedores
  proveedores:        '/proveedores',
  proveedor:         (id: string) => `/proveedores/${id}`,

  // Requisiciones
  requisiciones:      '/requisiciones',
  requisicion:       (id: string) => `/requisiciones/${id}`,
  requisicionComentarios: (id: string) => `/requisiciones/${id}/comentarios`,

  // Órdenes de Compra
  ordenes:            '/ordenes-compra',
  orden:             (id: string) => `/ordenes-compra/${id}`,
  ordenItems:        (id: string) => `/ordenes-compra/${id}/items`,

  // Pagos
  pagos:              '/pagos',
  pago:              (id: string) => `/pagos/${id}`,

  // Almacén
  inventario:         '/almacen/inventario',
  entradas:           '/almacen/entradas',
  salidas:            '/almacen/salidas',

  // Personal
  empleados:          '/personal/empleados',
  empleado:          (id: string) => `/personal/empleados/${id}`,

  // Destajos
  destajistas:        '/destajos/destajistas',
  destajista:        (id: string) => `/destajos/destajistas/${id}`,
  avances:            '/destajos/avances',
};
