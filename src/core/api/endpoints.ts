/**
 * ENDPOINTS — alineados a spec funcional v1
 * Fuente: 12_CONTRATOS_API_Y_CONVENCIONES.md
 */
export const EP = {
  // Auth
  login:   '/auth/login',
  me:      '/auth/me',

  // Obras
  obras:             '/obras',
  obra:             (id: string) => `/obras/${id}`,
  obraModificacion: (id: string) => `/obras/${id}/contrato/modificaciones`,

  // Panel
  panelEmpresa:      '/panel/empresa/resumen',
  panelObra:        (id: string) => `/panel/obras/${id}/resumen`,

  // Requisiciones
  requisiciones:     '/requisiciones',
  requisicion:      (id: string) => `/requisiciones/${id}`,
  requisicionEnviar:(id: string) => `/requisiciones/${id}/enviar`,
  requisicionComentario: (id: string) => `/requisiciones/${id}/comentar`,
  requisicionConvertir:  (id: string) => `/requisiciones/${id}/convertir-a-oc`,

  // OCs (Compras)
  ocs:               '/ocs',
  oc:               (id: string) => `/ocs/${id}`,
  ocEmitir:         (id: string) => `/ocs/${id}/emitir`,
  ocCancelar:       (id: string) => `/ocs/${id}/cancelar`,

  // Proveedores
  proveedores:       '/proveedores',
  proveedor:        (id: string) => `/proveedores/${id}`,

  // Almacén
  recepciones:       '/recepciones',
  recepcion:        (id: string) => `/recepciones/${id}`,
  recepcionEvidencia:(id: string) => `/recepciones/${id}/adjuntar-evidencia`,
  prestamos:         '/prestamos',

  // Pagos
  cxp:               '/cxp',
  pagos:             '/pagos',
  pago:             (id: string) => `/pagos/${id}`,
  pagoFactura:      (id: string) => `/pagos/${id}/adjuntar-factura`,

  // Destajos
  destajos:          '/destajos',
  destajo:          (id: string) => `/destajos/${id}`,
  destajoAutorizar: (id: string) => `/destajos/${id}/autorizar`,
  destajoPagar:     (id: string) => `/destajos/${id}/pagar`,

  // Personal
  empleados:         '/personal/empleados',
  empleado:         (id: string) => `/personal/empleados/${id}`,
};
