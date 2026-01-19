# MODELO DE DOMINIO UNIFICADO - Sistema IDP

## Convenciones Globales

- **IDs**: UUID v4 (formato: `550e8400-e29b-41d4-a716-446655440000`)
- **Timestamps**: ISO 8601 con timezone (ej: `2025-01-19T10:30:00Z`)
- **Fechas**: ISO 8601 date (ej: `2025-01-19`)
- **Decimales**: Numeric(15,2) para montos, Numeric(10,2) para cantidades
- **Nomenclatura**: snake_case en SQL/API, camelCase en TypeScript

---

## ENTIDADES PRINCIPALES

### 1. OBRA (Project)

**SQL**: `obras`
**API**: `/api/obras`
**TypeScript**: `Obra`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| codigo | VARCHAR(50) | string | ✅ | Código de obra (ej: "227") |
| nombre | VARCHAR(255) | string | ✅ | Nombre del proyecto |
| numero_contrato | VARCHAR(100) | string | ✅ | Número de contrato |
| cliente | VARCHAR(255) | string | ✅ | Nombre del cliente |
| residente | VARCHAR(255) | string | ✅ | Nombre del residente |
| direccion | TEXT | string \| null | ❌ | Dirección física |
| monto_contratado | NUMERIC(15,2) | number | ✅ | Monto total contratado |
| fecha_inicio | DATE | string | ✅ | Fecha de inicio (ISO) |
| fecha_fin_programada | DATE | string | ✅ | Fecha fin programada (ISO) |
| plazo_ejecucion | INTEGER | number | ✅ | Días de ejecución |
| estado | VARCHAR(50) | 'activa' \| 'suspendida' \| 'terminada' \| 'cancelada' | ✅ | Estado actual |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |
| updated_at | TIMESTAMP | string | ✅ | Última actualización |

---

### 2. PROVEEDOR (Supplier)

**SQL**: `proveedores`
**API**: `/api/proveedores`
**TypeScript**: `Proveedor`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| razon_social | VARCHAR(255) | string | ✅ | Razón social |
| nombre_comercial | VARCHAR(255) | string \| null | ❌ | Nombre comercial |
| rfc | VARCHAR(13) | string | ✅ | RFC (único) |
| direccion | TEXT | string \| null | ❌ | Dirección |
| ciudad | VARCHAR(100) | string \| null | ❌ | Ciudad |
| codigo_postal | VARCHAR(10) | string \| null | ❌ | Código postal |
| telefono | VARCHAR(20) | string \| null | ❌ | Teléfono |
| email | VARCHAR(255) | string \| null | ❌ | Email |
| contacto_principal | VARCHAR(255) | string \| null | ❌ | Contacto principal |
| banco | VARCHAR(100) | string \| null | ❌ | Banco |
| numero_cuenta | VARCHAR(50) | string \| null | ❌ | Número de cuenta |
| clabe | VARCHAR(18) | string \| null | ❌ | CLABE interbancaria |
| tipo_proveedor | VARCHAR(50) | 'material' \| 'servicio' \| 'renta' \| 'mixto' | ✅ | Tipo de proveedor |
| credito_dias | INTEGER | number | ✅ | Días de crédito (default: 0) |
| limite_credito | NUMERIC(15,2) | number | ✅ | Límite de crédito (default: 0) |
| activo | BOOLEAN | boolean | ✅ | Activo (default: true) |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |
| updated_at | TIMESTAMP | string | ✅ | Última actualización |

---

### 3. REQUISICIÓN (Material Request)

**SQL**: `requisiciones`
**API**: `/api/requisiciones`
**TypeScript**: `Requisicion`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| numero_requisicion | VARCHAR(50) | string | ✅ | Número (ej: "REQ-2025-001") |
| obra_id | UUID | string | ✅ | FK a obras.id |
| solicitado_por | VARCHAR(255) | string | ✅ | Quien solicita |
| fecha_solicitud | TIMESTAMP | string | ✅ | Fecha de solicitud |
| urgencia | VARCHAR(50) | 'normal' \| 'urgente' \| 'muy_urgente' | ✅ | Nivel de urgencia |
| estado | VARCHAR(50) | 'pendiente' \| 'aprobada' \| 'rechazada' \| 'en_proceso' \| 'completada' | ✅ | Estado |
| observaciones | TEXT | string \| null | ❌ | Observaciones |
| aprobado_por | VARCHAR(255) | string \| null | ❌ | Quien aprobó |
| fecha_aprobacion | TIMESTAMP | string \| null | ❌ | Fecha aprobación |
| motivo_rechazo | TEXT | string \| null | ❌ | Motivo rechazo |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |
| updated_at | TIMESTAMP | string | ✅ | Última actualización |

**Relación**: Una requisición tiene múltiples items (1:N con requisicion_items)

---

### 4. REQUISICIÓN ITEM (Material Request Item)

**SQL**: `requisicion_items`
**API**: (nested en requisiciones)
**TypeScript**: `RequisicionItem`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| requisicion_id | UUID | string | ✅ | FK a requisiciones.id |
| cantidad | NUMERIC(10,2) | number | ✅ | Cantidad solicitada |
| unidad | VARCHAR(20) | string | ✅ | Unidad de medida (ej: "TON", "M3") |
| descripcion | TEXT | string | ✅ | Descripción del material |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |

---

### 5. ORDEN DE COMPRA (Purchase Order)

**SQL**: `ordenes_compra`
**API**: `/api/ordenes-compra`
**TypeScript**: `OrdenCompra`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| numero_orden | VARCHAR(50) | string | ✅ | Número (ej: "OC-2025-001") |
| obra_id | UUID | string | ✅ | FK a obras.id |
| proveedor_id | UUID | string | ✅ | FK a proveedores.id |
| requisicion_id | UUID | string \| null | ❌ | FK a requisiciones.id |
| fecha_emision | TIMESTAMP | string | ✅ | Fecha de emisión |
| fecha_entrega | DATE | string | ✅ | Fecha programada de entrega |
| estado | VARCHAR(50) | 'borrador' \| 'emitida' \| 'recibida' \| 'facturada' \| 'pagada' \| 'cancelada' | ✅ | Estado |
| tipo_entrega | VARCHAR(50) | 'en_obra' \| 'bodega' \| 'recoger' | ✅ | Tipo de entrega |
| subtotal | NUMERIC(15,2) | number | ✅ | Subtotal |
| descuento | NUMERIC(5,2) | number | ✅ | % descuento (default: 0) |
| descuento_monto | NUMERIC(15,2) | number | ✅ | Monto descontado (default: 0) |
| iva | NUMERIC(15,2) | number | ✅ | IVA calculado |
| total | NUMERIC(15,2) | number | ✅ | Total final |
| observaciones | TEXT | string \| null | ❌ | Observaciones |
| creado_por | VARCHAR(255) | string \| null | ❌ | Usuario creador |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |
| updated_at | TIMESTAMP | string | ✅ | Última actualización |

**Relación**: Una OC tiene múltiples items (1:N con orden_compra_items)

---

### 6. ORDEN DE COMPRA ITEM (Purchase Order Item)

**SQL**: `orden_compra_items`
**API**: (nested en ordenes-compra)
**TypeScript**: `OrdenCompraItem`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| orden_compra_id | UUID | string | ✅ | FK a ordenes_compra.id |
| cantidad | NUMERIC(10,2) | number | ✅ | Cantidad |
| unidad | VARCHAR(20) | string | ✅ | Unidad de medida |
| descripcion | TEXT | string | ✅ | Descripción |
| precio_unitario | NUMERIC(15,2) | number | ✅ | Precio por unidad |
| total | NUMERIC(15,2) | number | ✅ | Total (cantidad * precio_unitario) |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |

---

### 7. PAGO (Payment)

**SQL**: `pagos`
**API**: `/api/pagos`
**TypeScript**: `Pago`

| Campo SQL | Tipo SQL | TypeScript | Requerido | Descripción |
|-----------|----------|------------|-----------|-------------|
| id | UUID | string | ✅ | ID único |
| numero_pago | VARCHAR(50) | string | ✅ | Número (ej: "PAG-2025-001") |
| obra_id | UUID | string | ✅ | FK a obras.id |
| proveedor_id | UUID | string | ✅ | FK a proveedores.id |
| orden_compra_id | UUID | string | ✅ | FK a ordenes_compra.id |
| monto | NUMERIC(15,2) | number | ✅ | Monto a pagar |
| metodo_pago | VARCHAR(50) | 'transferencia' \| 'cheque' \| 'efectivo' | ✅ | Método de pago |
| fecha_programada | DATE | string | ✅ | Fecha programada |
| fecha_procesado | TIMESTAMP | string \| null | ❌ | Fecha procesado |
| estado | VARCHAR(50) | 'programado' \| 'procesando' \| 'completado' \| 'cancelado' | ✅ | Estado |
| referencia | VARCHAR(100) | string \| null | ❌ | Referencia bancaria |
| comprobante | TEXT | string \| null | ❌ | URL del comprobante |
| observaciones | TEXT | string \| null | ❌ | Observaciones |
| procesado_por | VARCHAR(255) | string \| null | ❌ | Usuario procesador |
| created_at | TIMESTAMP | string | ✅ | Fecha de creación |
| updated_at | TIMESTAMP | string | ✅ | Última actualización |

---

## REGLAS DE NEGOCIO

### Generación de Números Automáticos

- **Requisiciones**: `REQ-{YYYY}-{XXX}` (ej: REQ-2025-001)
- **Órdenes de Compra**: `OC-{YYYY}-{XXX}` (ej: OC-2025-001)
- **Pagos**: `PAG-{YYYY}-{XXX}` (ej: PAG-2025-001)

### Cálculos Automáticos

- **Subtotal OC**: SUM(item.total) de todos los items
- **IVA**: subtotal * 0.16 (si aplica)
- **Total OC**: subtotal - descuento_monto + iva

### Estados Válidos

- **Obra**: activa, suspendida, terminada, cancelada
- **Requisición**: pendiente, aprobada, rechazada, en_proceso, completada
- **Orden de Compra**: borrador, emitida, recibida, facturada, pagada, cancelada
- **Pago**: programado, procesando, completado, cancelado

---

## MAPEO DE NOMBRES

### SQL ↔ TypeScript

| SQL | TypeScript |
|-----|------------|
| id | id |
| codigo | codigo |
| nombre | nombre |
| numero_contrato | numeroContrato |
| cliente | cliente |
| residente | residente |
| direccion | direccion |
| monto_contratado | montoContratado |
| fecha_inicio | fechaInicio |
| fecha_fin_programada | fechaFinProgramada |
| plazo_ejecucion | plazoEjecucion |
| estado | estado |
| created_at | createdAt |
| updated_at | updatedAt |

**Regla**: El backend (FastAPI) devuelve snake_case, el frontend (TypeScript) usa camelCase.

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025
