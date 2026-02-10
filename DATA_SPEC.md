# DATA_SPEC

## Entidades y relaciones

### obras
- **PK**: `id` (UUID)
- **Columnas**:
  - `codigo` (TEXT, UNIQUE, NOT NULL)
  - `nombre` (TEXT, NOT NULL)
  - `cliente` (TEXT, NOT NULL)
  - `numero_contrato` (TEXT, NOT NULL)
  - `monto_contrato` (NUMERIC, NOT NULL)
  - `anticipo_porcentaje` (NUMERIC, NOT NULL)
  - `retencion_porcentaje` (NUMERIC, NOT NULL)
  - `fecha_inicio` (DATE, NOT NULL)
  - `fecha_fin_estimada` (DATE, NOT NULL)
  - `residente_nombre` (TEXT, NOT NULL)
  - `residente_iniciales` (TEXT, NOT NULL)
  - `estado` (TEXT, NOT NULL; valores: Activa | Archivada)
  - `balance_actual` (NUMERIC, NULL)
  - `total_estimaciones` (NUMERIC, NULL)
  - `total_gastos` (NUMERIC, NULL)
- **Relaciones**:
  - 1:n con `ordenes_compra`
  - 1:n con `requisiciones`

### proveedores
- **PK**: `id` (UUID)
- **Columnas**:
  - `nombre_comercial` (TEXT, NOT NULL)
  - `razon_social` (TEXT, NOT NULL)
  - `rfc` (TEXT, NOT NULL)
  - `direccion` (TEXT, NULL)
  - `ciudad` (TEXT, NULL)
  - `codigo_postal` (TEXT, NULL)
  - `telefono` (TEXT, NULL)
  - `email` (TEXT, NULL)
  - `contacto_principal` (TEXT, NULL)
  - `banco` (TEXT, NULL)
  - `numero_cuenta` (TEXT, NULL)
  - `clabe` (TEXT, NULL)
  - `tipo_proveedor` (TEXT, NULL; valores: material | servicio | renta | mixto)
  - `dias_credito` (NUMERIC, NOT NULL)
  - `limite_credito` (NUMERIC, NOT NULL)
  - `activo` (BOOLEAN, NOT NULL)
- **Relaciones**:
  - 1:n con `ordenes_compra`

### ordenes_compra
- **PK**: `id` (UUID)
- **FK**: `obra_id` → `obras.id`, `proveedor_id` → `proveedores.id`
- **Columnas**:
  - `folio` (TEXT, UNIQUE, NOT NULL)
  - `obra_codigo` (TEXT, NOT NULL)
  - `obra_nombre` (TEXT, NOT NULL)
  - `cliente` (TEXT, NOT NULL)
  - `proveedor_nombre` (TEXT, NOT NULL)
  - `proveedor_razon_social` (TEXT, NOT NULL)
  - `proveedor_contacto` (TEXT, NULL)
  - `proveedor_rfc` (TEXT, NULL)
  - `proveedor_direccion` (TEXT, NULL)
  - `proveedor_telefono` (TEXT, NULL)
  - `proveedor_banco` (TEXT, NULL)
  - `proveedor_cuenta` (TEXT, NULL)
  - `proveedor_clabe` (TEXT, NULL)
  - `comprador` (TEXT, NOT NULL)
  - `fecha_entrega` (DATE, NOT NULL)
  - `tipo_entrega` (TEXT, NOT NULL; valores: Entrega | Recolección)
  - `incluye_iva` (BOOLEAN, NOT NULL)
  - `descuento` (NUMERIC, NOT NULL)
  - `descuento_monto` (NUMERIC, NOT NULL)
  - `observaciones` (TEXT, NULL)
  - `subtotal` (NUMERIC, NOT NULL)
  - `iva` (NUMERIC, NOT NULL)
  - `total` (NUMERIC, NOT NULL)
  - `fecha_creacion` (DATE, NOT NULL)
  - `estado` (TEXT, NOT NULL; valores: Pendiente | Aprobada | Rechazada | Entregada)
- **Relaciones**:
  - 1:n con `ordenes_compra_items`
  - 1:n con `pagos`

### ordenes_compra_items
- **PK**: `id` (UUID)
- **FK**: `orden_compra_id` → `ordenes_compra.id`
- **Columnas**:
  - `descripcion` (TEXT, NOT NULL)
  - `cantidad` (NUMERIC, NOT NULL)
  - `precio_unitario` (NUMERIC, NOT NULL)
  - `total` (NUMERIC, NOT NULL)

### pagos
- **PK**: `id` (UUID)
- **FK**: `orden_compra_id` → `ordenes_compra.id`
- **Columnas**:
  - `referencia` (TEXT, NOT NULL)
  - `monto` (NUMERIC, NOT NULL)
  - `fecha_pago` (DATE, NOT NULL)
  - `metodo` (TEXT, NOT NULL)
  - `folio_factura` (TEXT, NULL)
  - `fecha_factura` (DATE, NULL)
  - `monto_factura` (NUMERIC, NULL)

### requisiciones
- **PK**: `id` (UUID)
- **FK**: `obra_id` → `obras.id`
- **Columnas**:
  - `folio` (TEXT, UNIQUE, NOT NULL)
  - `obra_codigo` (TEXT, NOT NULL)
  - `obra_nombre` (TEXT, NOT NULL)
  - `residente_nombre` (TEXT, NOT NULL)
  - `estado` (TEXT, NOT NULL; valores: En Revisión | Comprado)
  - `fecha_creacion` (DATE, NOT NULL)
  - `urgencia` (TEXT, NOT NULL; valores: Urgente | Normal | Planeado)
  - `fecha_entrega` (DATE, NOT NULL)
- **Relaciones**:
  - 1:n con `requisiciones_items`
  - 1:n con `requisiciones_comentarios`

### requisiciones_items
- **PK**: `id` (UUID)
- **FK**: `requisicion_id` → `requisiciones.id`
- **Columnas**:
  - `descripcion` (TEXT, NOT NULL)
  - `cantidad` (NUMERIC, NOT NULL)
  - `unidad` (TEXT, NOT NULL)

### requisiciones_comentarios
- **PK**: `id` (UUID)
- **FK**: `requisicion_id` → `requisiciones.id`
- **Columnas**:
  - `autor` (TEXT, NOT NULL)
  - `rol` (TEXT, NOT NULL; valores: Residente | Compras)
  - `mensaje` (TEXT, NOT NULL)
  - `fecha` (TIMESTAMP, NOT NULL)

## Campos visibles en UI (resumen)

### Obras
- Formulario: código, nombre, cliente, número de contrato, monto, anticipo %, fondo garantía %, fecha inicio, fecha fin estimada, residente, iniciales residente.
- Listados: código/nombre, cliente, contrato, monto, residente, periodo, estado.

### Proveedores
- Formulario: nombre comercial, razón social, RFC, dirección, ciudad, CP, teléfono, email, contacto, banco, cuenta, CLABE, tipo proveedor, días crédito, límite crédito, activo.
- Listados: nombre comercial, razón social, RFC, contacto, crédito.

### Órdenes de compra
- Formulario: obra, proveedor, comprador, folio, fecha entrega, tipo entrega, IVA, descuento, observaciones.
- Items: descripción, cantidad, precio unitario, total.
- Listados: folio, obra, proveedor, monto, fecha, estado.

### Pagos
- Formulario: orden compra, referencia, monto, fecha pago, método.
- Factura: folio, fecha, monto (si aplica).

### Requisiciones
- Formulario: folio, obra, urgencia, fecha requerida.
- Items: descripción, cantidad, unidad.
- Comentarios: autor, rol, mensaje, fecha.

