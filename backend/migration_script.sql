-- ==========================================
-- SCRIPT DE MIGRACIÓN DE DATOS
-- De modelo antiguo (SERIAL/JSONB) a modelo unificado (UUID/normalizado)
-- ==========================================

-- IMPORTANTE: Este script es un EJEMPLO
-- Ajústalo según tus datos existentes

-- ==========================================
-- PREPARACIÓN
-- ==========================================

-- Crear extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tablas temporales para mapeo de IDs
CREATE TEMP TABLE IF NOT EXISTS id_mapping_obras (
    old_id INTEGER,
    old_code VARCHAR(50),
    new_id UUID
);

CREATE TEMP TABLE IF NOT EXISTS id_mapping_proveedores (
    old_id INTEGER,
    new_id UUID
);

CREATE TEMP TABLE IF NOT EXISTS id_mapping_requisiciones (
    old_id INTEGER,
    new_id UUID
);

CREATE TEMP TABLE IF NOT EXISTS id_mapping_ordenes_compra (
    old_id INTEGER,
    new_id UUID
);

-- ==========================================
-- MIGRACIÓN: OBRAS
-- ==========================================

-- Insertar obras y guardar mapeo de IDs
INSERT INTO obras (
    id,
    codigo,
    nombre,
    cliente,
    numero_contrato,
    monto_contrato,
    direccion,
    fecha_inicio,
    fecha_fin_estimada,
    residente,
    residente_iniciales,
    residente_password,
    residente_telefono,
    porcentaje_anticipo,
    porcentaje_retencion,
    balance_actual,
    total_estimaciones,
    total_gastos,
    total_gastos_oc,
    total_gastos_destajos,
    estado,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4() as id,  -- Generar nuevo UUID
    code as codigo,
    name as nombre,
    client as cliente,
    contract_number as numero_contrato,
    contract_amount as monto_contrato,
    address as direccion,
    start_date::date as fecha_inicio,
    estimated_end_date::date as fecha_fin_estimada,
    resident as residente,
    resident_initials as residente_iniciales,
    resident_password as residente_password,
    resident_phone as residente_telefono,
    advance_percentage as porcentaje_anticipo,
    retention_percentage as porcentaje_retencion,
    actual_balance as balance_actual,
    total_estimates as total_estimaciones,
    total_expenses as total_gastos,
    total_expenses_from_ocs as total_gastos_oc,
    total_expenses_from_destajos as total_gastos_destajos,
    status as estado,
    created_at,
    updated_at
FROM old_obras  -- Renombra tu tabla antigua
ON CONFLICT (codigo) DO NOTHING;

-- Guardar mapeo de IDs
INSERT INTO id_mapping_obras (old_id, old_code, new_id)
SELECT 
    o_old.id,
    o_old.code,
    o_new.id
FROM old_obras o_old
JOIN obras o_new ON o_old.code = o_new.codigo;

-- ==========================================
-- MIGRACIÓN: PROVEEDORES
-- ==========================================

INSERT INTO proveedores (
    id,
    codigo,
    nombre,
    razon_social,
    rfc,
    direccion,
    contacto,
    vendedor,
    telefono,
    email,
    linea_credito,
    linea_credito_usada,
    dias_credito,
    vencimiento_linea,
    activo,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4() as id,
    NULL as codigo,  -- Generar código si es necesario
    nombre as nombre,
    razon_social as razon_social,
    rfc as rfc,
    direccion as direccion,
    contacto as contacto,
    vendedor as vendedor,
    telefono as telefono,
    email as email,
    linea_credito as linea_credito,
    0 as linea_credito_usada,  -- Calcular después
    dias_credito as dias_credito,
    vencimiento_linea::date as vencimiento_linea,
    true as activo,
    created_at,
    updated_at
FROM old_proveedores
ON CONFLICT DO NOTHING;

-- Guardar mapeo de IDs
INSERT INTO id_mapping_proveedores (old_id, new_id)
SELECT 
    p_old.id,
    p_new.id
FROM old_proveedores p_old
JOIN proveedores p_new ON p_old.nombre = p_new.nombre AND p_old.rfc = p_new.rfc;

-- ==========================================
-- MIGRACIÓN: REQUISICIONES
-- ==========================================

-- Migrar requisiciones (sin items aún)
INSERT INTO requisiciones (
    id,
    numero_requisicion,
    obra_id,
    residente,
    residente_iniciales,
    fecha_solicitud,
    fecha_necesaria,
    urgencia,
    estado,
    observaciones,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4() as id,
    r_old.codigo_requisicion as numero_requisicion,
    om.new_id as obra_id,  -- Mapear usando tabla temporal
    r_old.residente as residente,
    r_old.residente_iniciales as residente_iniciales,
    r_old.fecha::date as fecha_solicitud,
    NULL as fecha_necesaria,
    'Normal' as urgencia,  -- Default
    r_old.status as estado,
    r_old.notas as observaciones,
    r_old.created_at,
    r_old.updated_at
FROM old_requisiciones r_old
JOIN id_mapping_obras om ON r_old.obra_code = om.old_code;

-- Guardar mapeo
INSERT INTO id_mapping_requisiciones (old_id, new_id)
SELECT 
    r_old.id,
    r_new.id
FROM old_requisiciones r_old
JOIN requisiciones r_new ON r_old.codigo_requisicion = r_new.numero_requisicion;

-- Migrar items de requisiciones (de JSONB a tabla normalizada)
INSERT INTO requisicion_items (
    id,
    requisicion_id,
    descripcion,
    cantidad,
    unidad,
    precio_unitario_estimado,
    total_estimado,
    orden
)
SELECT 
    uuid_generate_v4() as id,
    rm.new_id as requisicion_id,
    item->>'concepto' as descripcion,
    (item->>'cantidad')::DECIMAL as cantidad,
    item->>'unidad' as unidad,
    (item->>'precioUnitario')::DECIMAL as precio_unitario_estimado,
    (item->>'total')::DECIMAL as total_estimado,
    (row_number() OVER (PARTITION BY r_old.id ORDER BY (item->>'concepto')))::INTEGER - 1 as orden
FROM old_requisiciones r_old
JOIN id_mapping_requisiciones rm ON r_old.id = rm.old_id
CROSS JOIN LATERAL jsonb_array_elements(r_old.materiales::jsonb) AS item;

-- El trigger actualizará automáticamente el total de cada requisición

-- ==========================================
-- MIGRACIÓN: ÓRDENES DE COMPRA
-- ==========================================

-- Migrar órdenes de compra (sin items aún)
INSERT INTO ordenes_compra (
    id,
    numero_orden,
    obra_id,
    proveedor_id,
    comprador,
    comprador_iniciales,
    fecha_orden,
    fecha_entrega_programada,
    tipo_entrega,
    subtotal,
    descuento_porcentaje,
    descuento_monto,
    tiene_iva,
    iva,
    total,
    forma_pago,
    dias_credito,
    estado,
    estado_pago,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4() as id,
    oc_old.codigo_oc as numero_orden,
    om.new_id as obra_id,
    pm.new_id as proveedor_id,
    oc_old.comprador as comprador,
    oc_old.comprador_iniciales as comprador_iniciales,
    oc_old.fecha::date as fecha_orden,
    oc_old.fecha_entrega::date as fecha_entrega_programada,
    'Entrega' as tipo_entrega,  -- Default
    oc_old.subtotal as subtotal,
    0 as descuento_porcentaje,
    0 as descuento_monto,
    true as tiene_iva,
    oc_old.iva as iva,
    oc_old.total as total,
    oc_old.forma_pago as forma_pago,
    oc_old.dias_credito as dias_credito,
    oc_old.status as estado,
    CASE 
        WHEN oc_old.monto_pagado = 0 THEN 'Pendiente'
        WHEN oc_old.monto_pagado < oc_old.total THEN 'Parcial'
        ELSE 'Pagada'
    END as estado_pago,
    oc_old.created_at,
    oc_old.updated_at
FROM old_ordenes_compra oc_old
JOIN id_mapping_obras om ON oc_old.obra_code = om.old_code
JOIN id_mapping_proveedores pm ON oc_old.proveedor_id = pm.old_id;

-- Guardar mapeo
INSERT INTO id_mapping_ordenes_compra (old_id, new_id)
SELECT 
    oc_old.id,
    oc_new.id
FROM old_ordenes_compra oc_old
JOIN ordenes_compra oc_new ON oc_old.codigo_oc = oc_new.numero_orden;

-- Migrar items de órdenes de compra (de JSONB a tabla normalizada)
INSERT INTO orden_compra_items (
    id,
    orden_compra_id,
    descripcion,
    cantidad,
    unidad,
    precio_unitario,
    subtotal,
    descuento,
    total,
    orden
)
SELECT 
    uuid_generate_v4() as id,
    ocm.new_id as orden_compra_id,
    item->>'concepto' as descripcion,
    (item->>'cantidad')::DECIMAL as cantidad,
    item->>'unidad' as unidad,
    (item->>'precioUnitario')::DECIMAL as precio_unitario,
    (item->>'total')::DECIMAL as subtotal,
    0 as descuento,
    (item->>'total')::DECIMAL as total,
    (row_number() OVER (PARTITION BY oc_old.id ORDER BY (item->>'concepto')))::INTEGER - 1 as orden
FROM old_ordenes_compra oc_old
JOIN id_mapping_ordenes_compra ocm ON oc_old.id = ocm.old_id
CROSS JOIN LATERAL jsonb_array_elements(oc_old.materiales::jsonb) AS item;

-- El trigger recalculará automáticamente los totales

-- ==========================================
-- MIGRACIÓN: PAGOS
-- ==========================================

INSERT INTO pagos (
    id,
    numero_pago,
    orden_compra_id,
    proveedor_id,
    obra_id,
    monto,
    tipo_pago,
    referencia_bancaria,
    banco,
    cuenta_bancaria,
    fecha_pago,
    estado,
    observaciones,
    created_at
)
SELECT 
    uuid_generate_v4() as id,
    'PAG-' || p_old.id as numero_pago,  -- Generar número si no existe
    ocm.new_id as orden_compra_id,
    pm.new_id as proveedor_id,
    om.new_id as obra_id,
    p_old.monto as monto,
    p_old.metodo_pago as tipo_pago,
    p_old.referencia as referencia_bancaria,
    p_old.banco as banco,
    p_old.cuenta_bancaria as cuenta_bancaria,
    p_old.fecha::date as fecha_pago,
    'Procesado' as estado,  -- Default
    p_old.notas as observaciones,
    p_old.created_at
FROM old_pagos p_old
JOIN id_mapping_ordenes_compra ocm ON p_old.orden_compra_id = ocm.old_id
JOIN id_mapping_proveedores pm ON (
    SELECT proveedor_id FROM old_ordenes_compra WHERE id = p_old.orden_compra_id
) = pm.old_id
JOIN id_mapping_obras om ON (
    SELECT obra_code FROM old_ordenes_compra WHERE id = p_old.orden_compra_id
) = om.old_code;

-- El trigger actualizará automáticamente el estado_pago de las órdenes de compra

-- ==========================================
-- MIGRACIÓN: DESTAJOS
-- ==========================================

INSERT INTO destajos (
    id,
    obra_id,
    destajista,
    concepto,
    semana,
    fecha_inicio,
    fecha_fin,
    cantidad,
    unidad,
    precio_unitario,
    total,
    estado,
    created_at
)
SELECT 
    uuid_generate_v4() as id,
    om.new_id as obra_id,
    d_old.destajista as destajista,
    d_old.concepto as concepto,
    d_old.semana as semana,
    NULL as fecha_inicio,  -- Calcular si es necesario
    NULL as fecha_fin,
    d_old.cantidad as cantidad,
    d_old.unidad as unidad,
    d_old.precio_unitario as precio_unitario,
    d_old.total as total,
    'Pendiente' as estado,  -- Default
    d_old.created_at
FROM old_destajos d_old
JOIN id_mapping_obras om ON d_old.obra_code = om.old_code;

-- ==========================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ==========================================

-- Verificar conteos
SELECT 'Obras' as tabla, COUNT(*) as total_original FROM old_obras
UNION ALL
SELECT 'Obras migradas', COUNT(*) FROM obras
UNION ALL
SELECT 'Proveedores', COUNT(*) FROM old_proveedores
UNION ALL
SELECT 'Proveedores migrados', COUNT(*) FROM proveedores
UNION ALL
SELECT 'Requisiciones', COUNT(*) FROM old_requisiciones
UNION ALL
SELECT 'Requisiciones migradas', COUNT(*) FROM requisiciones
UNION ALL
SELECT 'Items de requisiciones', COUNT(*) FROM requisicion_items
UNION ALL
SELECT 'Órdenes de compra', COUNT(*) FROM old_ordenes_compra
UNION ALL
SELECT 'Órdenes migradas', COUNT(*) FROM ordenes_compra
UNION ALL
SELECT 'Items de OC', COUNT(*) FROM orden_compra_items
UNION ALL
SELECT 'Pagos', COUNT(*) FROM old_pagos
UNION ALL
SELECT 'Pagos migrados', COUNT(*) FROM pagos
UNION ALL
SELECT 'Destajos', COUNT(*) FROM old_destajos
UNION ALL
SELECT 'Destajos migrados', COUNT(*) FROM destajos;

-- Verificar que los totales se calcularon correctamente
SELECT 
    numero_requisicion,
    total as total_calculado,
    (SELECT SUM(total_estimado) FROM requisicion_items WHERE requisicion_id = r.id) as total_items
FROM requisiciones r
LIMIT 10;

-- Verificar que los estados de pago se actualizaron
SELECT 
    numero_orden,
    total,
    monto_pagado,
    saldo_pendiente,
    estado_pago
FROM ordenes_compra
WHERE monto_pagado > 0
LIMIT 10;

-- ==========================================
-- LIMPIEZA (Opcional - solo si todo está correcto)
-- ==========================================

-- DROP TABLE old_obras CASCADE;
-- DROP TABLE old_proveedores CASCADE;
-- DROP TABLE old_requisiciones CASCADE;
-- DROP TABLE old_ordenes_compra CASCADE;
-- DROP TABLE old_pagos CASCADE;
-- DROP TABLE old_destajos CASCADE;

-- ==========================================
-- FIN DE LA MIGRACIÓN
-- ==========================================

COMMIT;
