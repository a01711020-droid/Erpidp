# LOGIC_SPEC

## Entidades universales
- **Obras**: identifican proyectos y son la base para OC, requisiciones y seguimiento.
- **Proveedores**: fuente de compras y pagos.
- **Órdenes de compra**: dependen de Obra + Proveedor y contienen items.
- **Pagos**: se vinculan a una Orden de compra.
- **Requisiciones**: dependen de Obra y contienen items + comentarios.

## Reglas observadas (UI Figma)
- **Folios**: se presentan como identificadores legibles en OC/Requisiciones (el backend conserva el valor entregado por el frontend).
- **Estados**:
  - Obra: `Activa`/`Archivada`.
  - Orden de compra: `Pendiente`/`Aprobada`/`Rechazada`/`Entregada`.
  - Requisición: `En Revisión`/`Comprado`.
  - Pagos: dependen de los montos facturados/pagados.
- **Relaciones**:
  - `ordenes_compra.obra_id` → `obras.id`.
  - `ordenes_compra.proveedor_id` → `proveedores.id`.
  - `pagos.orden_compra_id` → `ordenes_compra.id`.
  - `requisiciones.obra_id` → `obras.id`.

## Cálculos (backend/services)
- **Resumen por obra**:
  - `total_ordenes_compra`: suma de `ordenes_compra.total` por obra.
  - `total_pagos`: suma de `pagos.monto` por obra (vía ordenes de compra).
  - `total_pendiente`: `total_ordenes_compra - total_pagos`.

## Dependencias entre módulos
- **Dashboard/Seguimiento** depende de la suma de OC y pagos por obra.
- **Compras** necesita obras + proveedores para crear OC.
- **Pagos** depende de OC existentes para registrar pagos.
