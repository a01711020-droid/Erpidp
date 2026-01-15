-- ==========================================
-- ESQUEMA UNIFICADO - Sistema IDP Construcción
-- Versión: 2.0 (Unificación de modelos)
-- Base de datos: PostgreSQL 14+
-- ==========================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto

-- ==========================================
-- ELIMINAR TABLAS EXISTENTES (Solo desarrollo)
-- ==========================================
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS orden_compra_items CASCADE;
DROP TABLE IF EXISTS ordenes_compra CASCADE;
DROP TABLE IF EXISTS requisicion_items CASCADE;
DROP TABLE IF EXISTS requisiciones CASCADE;
DROP TABLE IF EXISTS destajos CASCADE;
DROP TABLE IF EXISTS gastos_directos CASCADE;
DROP TABLE IF EXISTS gastos_indirectos CASCADE;
DROP TABLE IF EXISTS distribucion_gastos_indirectos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS obras CASCADE;

-- ==========================================
-- 1. TABLA: OBRAS
-- ==========================================
CREATE TABLE obras (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    
    -- Cliente y contrato
    cliente VARCHAR(255),
    numero_contrato VARCHAR(100),
    monto_contrato DECIMAL(15, 2) DEFAULT 0,
    
    -- Ubicación
    direccion TEXT,
    
    -- Fechas
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    
    -- Residente (sin autenticación por ahora)
    residente VARCHAR(255),
    residente_iniciales VARCHAR(10),
    residente_password VARCHAR(50), -- Solo para acceso simple
    residente_telefono VARCHAR(20),
    residente_email VARCHAR(255),
    
    -- Porcentajes
    porcentaje_anticipo DECIMAL(5, 2) DEFAULT 0,
    porcentaje_retencion DECIMAL(5, 2) DEFAULT 0,
    
    -- Montos y balances (calculados o capturados)
    balance_actual DECIMAL(15, 2) DEFAULT 0,
    total_estimaciones DECIMAL(15, 2) DEFAULT 0,
    total_gastos DECIMAL(15, 2) DEFAULT 0,
    total_gastos_oc DECIMAL(15, 2) DEFAULT 0,
    total_gastos_destajos DECIMAL(15, 2) DEFAULT 0,
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'Activa' CHECK (estado IN ('Activa', 'Pausada', 'Finalizada', 'Cancelada', 'Archivada')),
    
    -- Metadata
    observaciones TEXT,
    metadata JSONB DEFAULT '{}', -- Datos adicionales flexibles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_obras_codigo ON obras(codigo);
CREATE INDEX idx_obras_estado ON obras(estado);
CREATE INDEX idx_obras_residente ON obras(residente);
CREATE INDEX idx_obras_nombre_trgm ON obras USING gin (nombre gin_trgm_ops);

COMMENT ON TABLE obras IS 'Proyectos de construcción';

-- ==========================================
-- 2. TABLA: PROVEEDORES
-- ==========================================
CREATE TABLE proveedores (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE,
    
    -- Nombres
    nombre VARCHAR(255) NOT NULL, -- Nombre comercial
    razon_social VARCHAR(255), -- Razón social completa
    nombre_corto VARCHAR(100),
    
    -- Datos fiscales
    rfc VARCHAR(20),
    direccion TEXT,
    
    -- Contacto
    contacto VARCHAR(255),
    vendedor VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(255),
    
    -- Crédito
    linea_credito DECIMAL(15, 2) DEFAULT 0,
    linea_credito_usada DECIMAL(15, 2) DEFAULT 0,
    dias_credito INTEGER DEFAULT 0,
    vencimiento_linea DATE,
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    observaciones TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_proveedores_codigo ON proveedores(codigo);
CREATE INDEX idx_proveedores_nombre ON proveedores(nombre);
CREATE INDEX idx_proveedores_rfc ON proveedores(rfc);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);

COMMENT ON TABLE proveedores IS 'Proveedores de materiales y servicios';

-- ==========================================
-- 3. TABLA: USUARIOS (Opcional - para futuro)
-- ==========================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    iniciales VARCHAR(10),
    
    -- Rol
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Admin', 'Residente', 'Compras', 'Pagos', 'Visualizador')),
    
    -- Obra asignada (para residentes)
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadata
    telefono VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_obra ON usuarios(obra_id);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

COMMENT ON TABLE usuarios IS 'Usuarios del sistema (opcional para autenticación futura)';

-- ==========================================
-- 4. TABLA: REQUISICIONES
-- ==========================================
CREATE TABLE requisiciones (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_requisicion VARCHAR(100) UNIQUE NOT NULL,
    
    -- Relaciones
    obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    residente_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Residente (redundante pero útil para queries)
    residente VARCHAR(255),
    residente_iniciales VARCHAR(10),
    
    -- Fechas
    fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_necesaria DATE,
    
    -- Urgencia y prioridad
    urgencia VARCHAR(50) DEFAULT 'Normal' CHECK (urgencia IN ('Urgente', 'Normal', 'Planeado')),
    prioridad INTEGER DEFAULT 5 CHECK (prioridad BETWEEN 1 AND 10),
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN (
        'Pendiente', 
        'En Revisión', 
        'Aprobada', 
        'Rechazada', 
        'En Proceso',
        'Convertida a OC',
        'Completada',
        'Cancelada'
    )),
    
    -- Totales (calculados desde items)
    total DECIMAL(15, 2) DEFAULT 0,
    
    -- Observaciones
    observaciones TEXT,
    observaciones_rechazo TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisiciones_numero ON requisiciones(numero_requisicion);
CREATE INDEX idx_requisiciones_obra ON requisiciones(obra_id);
CREATE INDEX idx_requisiciones_residente ON requisiciones(residente_id);
CREATE INDEX idx_requisiciones_estado ON requisiciones(estado);
CREATE INDEX idx_requisiciones_urgencia ON requisiciones(urgencia);
CREATE INDEX idx_requisiciones_fecha ON requisiciones(fecha_solicitud);

COMMENT ON TABLE requisiciones IS 'Requisiciones de material de obra';

-- ==========================================
-- 5. TABLA: REQUISICION_ITEMS
-- ==========================================
CREATE TABLE requisicion_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisicion_id UUID NOT NULL REFERENCES requisiciones(id) ON DELETE CASCADE,
    
    -- Descripción del material
    descripcion TEXT NOT NULL,
    especificaciones TEXT,
    
    -- Cantidad
    cantidad DECIMAL(15, 3) NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    
    -- Precio estimado (opcional)
    precio_unitario_estimado DECIMAL(15, 2),
    total_estimado DECIMAL(15, 2),
    
    -- Orden
    orden INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisicion_items_requisicion ON requisicion_items(requisicion_id);
CREATE INDEX idx_requisicion_items_orden ON requisicion_items(requisicion_id, orden);

COMMENT ON TABLE requisicion_items IS 'Items/materiales de cada requisición';

-- ==========================================
-- 6. TABLA: ÓRDENES DE COMPRA
-- ==========================================
CREATE TABLE ordenes_compra (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_orden VARCHAR(100) UNIQUE NOT NULL,
    
    -- Relaciones
    obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
    comprador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    requisicion_id UUID REFERENCES requisiciones(id) ON DELETE SET NULL,
    
    -- Comprador (redundante pero útil)
    comprador VARCHAR(255),
    comprador_iniciales VARCHAR(10),
    
    -- Fechas
    fecha_orden DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_entrega_programada DATE,
    fecha_entrega_real DATE,
    
    -- Tipo de entrega
    tipo_entrega VARCHAR(50) DEFAULT 'Entrega' CHECK (tipo_entrega IN ('Entrega', 'Recolección')),
    
    -- Importes
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0,
    descuento_monto DECIMAL(15, 2) DEFAULT 0,
    tiene_iva BOOLEAN DEFAULT true,
    iva DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    
    -- Pago
    forma_pago VARCHAR(100) DEFAULT 'Crédito',
    dias_credito INTEGER DEFAULT 0,
    fecha_vencimiento_pago DATE,
    monto_pagado DECIMAL(15, 2) DEFAULT 0,
    saldo_pendiente DECIMAL(15, 2) DEFAULT 0,
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN (
        'Borrador',
        'Pendiente', 
        'Aprobada', 
        'Rechazada',
        'En Tránsito',
        'Entregada',
        'Parcialmente Pagada',
        'Pagada',
        'Cancelada'
    )),
    estado_pago VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado_pago IN (
        'Pendiente',
        'Parcial',
        'Pagada',
        'Vencida'
    )),
    
    -- Observaciones
    observaciones TEXT,
    observaciones_entrega TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ordenes_numero ON ordenes_compra(numero_orden);
CREATE INDEX idx_ordenes_obra ON ordenes_compra(obra_id);
CREATE INDEX idx_ordenes_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_comprador ON ordenes_compra(comprador_id);
CREATE INDEX idx_ordenes_requisicion ON ordenes_compra(requisicion_id);
CREATE INDEX idx_ordenes_estado ON ordenes_compra(estado);
CREATE INDEX idx_ordenes_estado_pago ON ordenes_compra(estado_pago);
CREATE INDEX idx_ordenes_fecha ON ordenes_compra(fecha_orden);
CREATE INDEX idx_ordenes_vencimiento ON ordenes_compra(fecha_vencimiento_pago);

COMMENT ON TABLE ordenes_compra IS 'Órdenes de compra a proveedores';

-- ==========================================
-- 7. TABLA: ORDEN_COMPRA_ITEMS
-- ==========================================
CREATE TABLE orden_compra_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    
    -- Descripción del material
    descripcion TEXT NOT NULL,
    especificaciones TEXT,
    
    -- Cantidad
    cantidad DECIMAL(15, 3) NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    
    -- Precios
    precio_unitario DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    descuento DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    
    -- Cantidad entregada (para entregas parciales)
    cantidad_entregada DECIMAL(15, 3) DEFAULT 0,
    
    -- Orden
    orden INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orden_items_orden ON orden_compra_items(orden_compra_id);
CREATE INDEX idx_orden_items_ordenamiento ON orden_compra_items(orden_compra_id, orden);

COMMENT ON TABLE orden_compra_items IS 'Items/materiales de cada orden de compra';

-- ==========================================
-- 8. TABLA: PAGOS
-- ==========================================
CREATE TABLE pagos (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_pago VARCHAR(100) UNIQUE NOT NULL,
    
    -- Relaciones
    orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
    obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    
    -- Importes
    monto DECIMAL(15, 2) NOT NULL,
    
    -- Datos del pago
    tipo_pago VARCHAR(50) NOT NULL CHECK (tipo_pago IN ('Transferencia', 'Cheque', 'Efectivo', 'Tarjeta')),
    referencia_bancaria VARCHAR(255),
    banco VARCHAR(255),
    cuenta_bancaria VARCHAR(100),
    
    -- Fechas
    fecha_pago DATE NOT NULL,
    fecha_aplicacion DATE,
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN (
        'Pendiente',
        'Procesado',
        'Aplicado',
        'Rechazado',
        'Cancelado'
    )),
    
    -- Observaciones
    observaciones TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pagos_numero ON pagos(numero_pago);
CREATE INDEX idx_pagos_orden ON pagos(orden_compra_id);
CREATE INDEX idx_pagos_proveedor ON pagos(proveedor_id);
CREATE INDEX idx_pagos_obra ON pagos(obra_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);

COMMENT ON TABLE pagos IS 'Pagos realizados a proveedores';

-- ==========================================
-- 9. TABLA: DESTAJOS
-- ==========================================
CREATE TABLE destajos (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relación
    obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    
    -- Destajista
    destajista VARCHAR(255) NOT NULL,
    destajista_rfc VARCHAR(20),
    destajista_telefono VARCHAR(20),
    
    -- Concepto
    concepto TEXT NOT NULL,
    categoria VARCHAR(100),
    
    -- Periodo
    semana VARCHAR(50) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    
    -- Cantidad y precio
    cantidad DECIMAL(15, 3),
    unidad VARCHAR(50),
    precio_unitario DECIMAL(15, 2),
    total DECIMAL(15, 2) NOT NULL,
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN (
        'Pendiente',
        'Aprobado',
        'Rechazado',
        'Pagado',
        'Cancelado'
    )),
    
    -- Pago
    fecha_pago DATE,
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(255),
    
    -- Observaciones
    observaciones TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_destajos_obra ON destajos(obra_id);
CREATE INDEX idx_destajos_destajista ON destajos(destajista);
CREATE INDEX idx_destajos_semana ON destajos(semana);
CREATE INDEX idx_destajos_estado ON destajos(estado);
CREATE INDEX idx_destajos_categoria ON destajos(categoria);

COMMENT ON TABLE destajos IS 'Destajos por obra y periodo';

-- ==========================================
-- 10. TABLA: GASTOS_DIRECTOS (Opcional)
-- ==========================================
CREATE TABLE gastos_directos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    
    -- Periodo
    mes VARCHAR(7) NOT NULL, -- YYYY-MM
    
    -- Concepto
    concepto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    
    -- Monto
    monto DECIMAL(15, 2) NOT NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gastos_directos_obra ON gastos_directos(obra_id);
CREATE INDEX idx_gastos_directos_mes ON gastos_directos(mes);
CREATE INDEX idx_gastos_directos_categoria ON gastos_directos(categoria);

COMMENT ON TABLE gastos_directos IS 'Gastos directos por obra (opcional)';

-- ==========================================
-- 11. TABLA: GASTOS_INDIRECTOS (Opcional)
-- ==========================================
CREATE TABLE gastos_indirectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Periodo
    mes VARCHAR(7) NOT NULL, -- YYYY-MM
    
    -- Concepto
    concepto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    
    -- Monto
    monto DECIMAL(15, 2) NOT NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gastos_indirectos_mes ON gastos_indirectos(mes);
CREATE INDEX idx_gastos_indirectos_categoria ON gastos_indirectos(categoria);

COMMENT ON TABLE gastos_indirectos IS 'Gastos indirectos de la empresa (opcional)';

-- ==========================================
-- TRIGGERS: Actualización automática de updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_obras_updated_at
    BEFORE UPDATE ON obras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at
    BEFORE UPDATE ON proveedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requisiciones_updated_at
    BEFORE UPDATE ON requisiciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ordenes_compra_updated_at
    BEFORE UPDATE ON ordenes_compra
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at
    BEFORE UPDATE ON pagos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destajos_updated_at
    BEFORE UPDATE ON destajos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- TRIGGERS: Cálculos automáticos
-- ==========================================

-- Calcular total de requisición desde items
CREATE OR REPLACE FUNCTION calcular_total_requisicion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE requisiciones
    SET total = (
        SELECT COALESCE(SUM(total_estimado), 0)
        FROM requisicion_items
        WHERE requisicion_id = COALESCE(NEW.requisicion_id, OLD.requisicion_id)
    )
    WHERE id = COALESCE(NEW.requisicion_id, OLD.requisicion_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_total_requisicion
    AFTER INSERT OR UPDATE OR DELETE ON requisicion_items
    FOR EACH ROW EXECUTE FUNCTION calcular_total_requisicion();

-- Calcular totales de orden de compra desde items
CREATE OR REPLACE FUNCTION calcular_totales_orden_compra()
RETURNS TRIGGER AS $$
DECLARE
    v_orden_id UUID;
    v_subtotal DECIMAL(15, 2);
    v_descuento_monto DECIMAL(15, 2);
    v_iva DECIMAL(15, 2);
    v_total DECIMAL(15, 2);
    v_tiene_iva BOOLEAN;
BEGIN
    v_orden_id := COALESCE(NEW.orden_compra_id, OLD.orden_compra_id);
    
    -- Calcular subtotal
    SELECT COALESCE(SUM(total), 0) INTO v_subtotal
    FROM orden_compra_items
    WHERE orden_compra_id = v_orden_id;
    
    -- Obtener si tiene IVA y descuento
    SELECT tiene_iva, descuento_monto INTO v_tiene_iva, v_descuento_monto
    FROM ordenes_compra
    WHERE id = v_orden_id;
    
    v_descuento_monto := COALESCE(v_descuento_monto, 0);
    
    -- Calcular IVA (16%)
    IF v_tiene_iva THEN
        v_iva := (v_subtotal - v_descuento_monto) * 0.16;
    ELSE
        v_iva := 0;
    END IF;
    
    -- Calcular total
    v_total := v_subtotal - v_descuento_monto + v_iva;
    
    -- Actualizar orden de compra
    UPDATE ordenes_compra
    SET subtotal = v_subtotal,
        iva = v_iva,
        total = v_total,
        saldo_pendiente = v_total - COALESCE(monto_pagado, 0)
    WHERE id = v_orden_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_totales_orden_compra
    AFTER INSERT OR UPDATE OR DELETE ON orden_compra_items
    FOR EACH ROW EXECUTE FUNCTION calcular_totales_orden_compra();

-- Actualizar estado de pago de orden de compra
CREATE OR REPLACE FUNCTION actualizar_estado_pago_orden()
RETURNS TRIGGER AS $$
DECLARE
    v_total DECIMAL(15, 2);
    v_monto_pagado DECIMAL(15, 2);
    v_nuevo_estado VARCHAR(50);
BEGIN
    -- Obtener total de la orden
    SELECT total INTO v_total
    FROM ordenes_compra
    WHERE id = COALESCE(NEW.orden_compra_id, OLD.orden_compra_id);
    
    -- Calcular total pagado
    SELECT COALESCE(SUM(monto), 0) INTO v_monto_pagado
    FROM pagos
    WHERE orden_compra_id = COALESCE(NEW.orden_compra_id, OLD.orden_compra_id)
    AND estado IN ('Procesado', 'Aplicado');
    
    -- Determinar estado
    IF v_monto_pagado = 0 THEN
        v_nuevo_estado := 'Pendiente';
    ELSIF v_monto_pagado < v_total THEN
        v_nuevo_estado := 'Parcial';
    ELSE
        v_nuevo_estado := 'Pagada';
    END IF;
    
    -- Actualizar orden de compra
    UPDATE ordenes_compra
    SET monto_pagado = v_monto_pagado,
        saldo_pendiente = v_total - v_monto_pagado,
        estado_pago = v_nuevo_estado
    WHERE id = COALESCE(NEW.orden_compra_id, OLD.orden_compra_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_estado_pago
    AFTER INSERT OR UPDATE OR DELETE ON pagos
    FOR EACH ROW EXECUTE FUNCTION actualizar_estado_pago_orden();

-- ==========================================
-- DATOS DE EJEMPLO (Opcional - Solo para testing)
-- ==========================================

-- Insertar obra de ejemplo
INSERT INTO obras (
    codigo, nombre, cliente, numero_contrato, monto_contrato,
    residente, residente_iniciales, residente_password, estado
) VALUES (
    '227', '227-CASTELLO E', 'Cliente Ejemplo', 'CONT-2025-001', 5000000.00,
    'Ing. Juan Pérez', 'JP', '1234', 'Activa'
)
ON CONFLICT (codigo) DO NOTHING;

-- Insertar proveedor de ejemplo
INSERT INTO proveedores (
    codigo, nombre, razon_social, rfc, contacto, telefono, email, 
    linea_credito, dias_credito, activo
) VALUES (
    'PROV001', 'Ferretería López', 'Ferretería López SA de CV', 
    'FER123456ABC', 'Carlos López', '555-1234', 
    'contacto@ferreterialopez.com', 100000.00, 30, true
)
ON CONFLICT (codigo) DO NOTHING;

-- ==========================================
-- VISTAS ÚTILES
-- ==========================================

-- Vista de órdenes de compra con información completa
CREATE OR REPLACE VIEW v_ordenes_compra_completas AS
SELECT 
    oc.id,
    oc.numero_orden,
    oc.fecha_orden,
    oc.estado,
    oc.estado_pago,
    oc.total,
    oc.monto_pagado,
    oc.saldo_pendiente,
    o.codigo AS obra_codigo,
    o.nombre AS obra_nombre,
    p.nombre AS proveedor_nombre,
    p.rfc AS proveedor_rfc,
    oc.dias_credito,
    oc.fecha_vencimiento_pago,
    CASE 
        WHEN oc.fecha_vencimiento_pago < CURRENT_DATE AND oc.saldo_pendiente > 0 
        THEN 'VENCIDO'
        WHEN oc.fecha_vencimiento_pago BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 AND oc.saldo_pendiente > 0
        THEN 'POR_VENCER'
        ELSE 'VIGENTE'
    END AS estado_vencimiento
FROM ordenes_compra oc
JOIN obras o ON oc.obra_id = o.id
JOIN proveedores p ON oc.proveedor_id = p.id;

COMMENT ON VIEW v_ordenes_compra_completas IS 'Vista con información completa de órdenes de compra';

-- Vista de resumen de obras
CREATE OR REPLACE VIEW v_resumen_obras AS
SELECT 
    o.id,
    o.codigo,
    o.nombre,
    o.estado,
    o.monto_contrato,
    o.balance_actual,
    COUNT(DISTINCT oc.id) AS total_ordenes_compra,
    COALESCE(SUM(oc.total), 0) AS monto_total_oc,
    COALESCE(SUM(oc.saldo_pendiente), 0) AS saldo_pendiente_oc,
    COUNT(DISTINCT r.id) AS total_requisiciones,
    COUNT(DISTINCT d.id) AS total_destajos
FROM obras o
LEFT JOIN ordenes_compra oc ON o.id = oc.obra_id AND oc.estado != 'Cancelada'
LEFT JOIN requisiciones r ON o.id = r.obra_id AND r.estado != 'Cancelada'
LEFT JOIN destajos d ON o.id = d.obra_id
GROUP BY o.id, o.codigo, o.nombre, o.estado, o.monto_contrato, o.balance_actual;

COMMENT ON VIEW v_resumen_obras IS 'Vista con resumen financiero de obras';

-- ==========================================
-- FIN DEL ESQUEMA UNIFICADO
-- ==========================================

-- Verificar creación de tablas
SELECT 
    table_name, 
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
