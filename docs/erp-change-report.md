# Reporte de Cambios ERP

## Endpoints
### Existentes (backend)
- `GET /api/obras`, `POST /api/obras`, `GET /api/obras/{id}`, `PUT /api/obras/{id}`, `DELETE /api/obras/{id}`
- `GET /api/proveedores`, `POST /api/proveedores`, `GET /api/proveedores/{id}`, `PUT /api/proveedores/{id}`, `DELETE /api/proveedores/{id}`
- `GET /api/ordenes-compra`, `POST /api/ordenes-compra`, `GET /api/ordenes-compra/{id}`, `PUT /api/ordenes-compra/{id}`, `DELETE /api/ordenes-compra/{id}`
- `GET /api/pagos`, `POST /api/pagos`, `GET /api/pagos/{id}`, `PUT /api/pagos/{id}`, `DELETE /api/pagos/{id}`
- `GET /api/dashboard/obras/{obra_id}/metricas`

### Añadidos / Ajustados en esta entrega
- No se añadieron rutas nuevas; se ajustaron **PUT** de obras/proveedores/OC/pagos para aceptar modelos tipados y reportar errores 422 por campo.
- Se actualizó **PUT /api/ordenes-compra/{id}** para actualizar items y recalcular totales cuando sea necesario.

## Tablas/Columnas
- No se agregaron nuevas tablas ni columnas en esta entrega.
- Se mantiene el esquema existente (`obras`, `proveedores`, `ordenes_compra`, `orden_compra_items`, `pagos`).

## Rutas frontend
Se reorganizaron rutas por módulo para evitar saltos entre módulos y soportar refresh:
- Dashboard: `/dashboard`, `/dashboard/obras/:obraId`, `/dashboard/obras/:obraId/desglose`
- Catálogos: `/catalogos/obras`, `/catalogos/proveedores`
- Compras: `/compras`, `/compras/nueva`, `/compras/:ocId`
- Pagos: `/pagos`, `/pagos/oc/:ocId`

Motivo: Encerrar navegación por módulo, habilitar deep links y evitar retorno al home al refrescar.

## Guard temporales
- Se añadió PIN temporal (localStorage) para `/catalogos/*` y `/pagos/*` para evitar accesos accidentales durante pruebas.
