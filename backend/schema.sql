-- ==========================================
-- SCHEMA DE BASE DE DATOS
-- Sistema IDP Construcción
-- ==========================================

-- Eliminar tablas si existen (solo para desarrollo)
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS ordenes_compra CASCADE;
DROP TABLE IF EXISTS requisiciones CASCADE;
DROP TABLE IF EXISTS destajos CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS obras CASCADE;

-- ==========================================
-- TABLA: OBRAS
-- ==========================================

CREATE TABLE obras (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    contract_number VARCHAR(100),
    contract_amount DECIMAL(15, 2) DEFAULT 0,
    advance_percentage DECIMAL(5, 2) DEFAULT 0,
    retention_percentage DECIMAL(5, 2) DEFAULT 0,
    start_date DATE,
    estimated_end_date DATE,
    resident VARCHAR(255),
    resident_initials VARCHAR(10),
    resident_password VARCHAR(50),
    resident_phone VARCHAR(20),
    address TEXT,
    status VARCHAR(50) DEFAULT 'Activa',
    actual_balance DECIMAL(15, 2) DEFAULT 0,
    total_estimates DECIMAL(15, 2) DEFAULT 0,
    total_expenses DECIMAL(15, 2) DEFAULT 0,
    total_expenses_from_ocs DECIMAL(15, 2) DEFAULT 0,
    total_expenses_from_destajos DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_obras_code ON obras(code);
CREATE INDEX idx_obras_status ON obras(status);

-- ==========================================
-- TABLA: PROVEEDORES
-- ==========================================

CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    razon_social VARCHAR(255),
    rfc VARCHAR(50),
    direccion TEXT,
    contacto VARCHAR(255),
    vendedor VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255),
    linea_credito DECIMAL(15, 2) DEFAULT 0,
    dias_credito INTEGER DEFAULT 0,
    vencimiento_linea DATE,
    saldo_pendiente DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proveedores_nombre ON proveedores(nombre);
CREATE INDEX idx_proveedores_rfc ON proveedores(rfc);

-- ==========================================
-- TABLA: REQUISICIONES
-- ==========================================

CREATE TABLE requisiciones (
    id SERIAL PRIMARY KEY,
    codigo_requisicion VARCHAR(100) UNIQUE NOT NULL,
    obra_code VARCHAR(50) NOT NULL,
    obra_nombre VARCHAR(255),
    residente VARCHAR(255),
    residente_iniciales VARCHAR(10),
    fecha DATE NOT NULL,
    materiales JSONB NOT NULL, -- [{concepto, unidad, cantidad, precioUnitario, total}]
    total DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pendiente',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (obra_code) REFERENCES obras(code) ON DELETE CASCADE
);

CREATE INDEX idx_requisiciones_codigo ON requisiciones(codigo_requisicion);
CREATE INDEX idx_requisiciones_obra ON requisiciones(obra_code);
CREATE INDEX idx_requisiciones_status ON requisiciones(status);

-- ==========================================
-- TABLA: ÓRDENES DE COMPRA
-- ==========================================

CREATE TABLE ordenes_compra (
    id SERIAL PRIMARY KEY,
    codigo_oc VARCHAR(100) UNIQUE NOT NULL,
    obra_code VARCHAR(50) NOT NULL,
    obra_nombre VARCHAR(255),
    proveedor VARCHAR(255) NOT NULL,
    proveedor_id INTEGER NOT NULL,
    comprador VARCHAR(255),
    comprador_iniciales VARCHAR(10),
    fecha DATE NOT NULL,
    fecha_entrega DATE,
    materiales JSONB NOT NULL, -- [{concepto, unidad, cantidad, precioUnitario, total}]
    subtotal DECIMAL(15, 2) DEFAULT 0,
    iva DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) DEFAULT 0,
    forma_pago VARCHAR(100) DEFAULT 'Crédito',
    dias_credito INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pendiente',
    monto_pagado DECIMAL(15, 2) DEFAULT 0,
    saldo_pendiente DECIMAL(15, 2) DEFAULT 0,
    requisiciones_vinculadas JSONB DEFAULT '[]', -- [id1, id2, ...]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (obra_code) REFERENCES obras(code) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT
);

CREATE INDEX idx_ordenes_codigo ON ordenes_compra(codigo_oc);
CREATE INDEX idx_ordenes_obra ON ordenes_compra(obra_code);
CREATE INDEX idx_ordenes_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_status ON ordenes_compra(status);

-- ==========================================
-- TABLA: PAGOS
-- ==========================================

CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    orden_compra_id INTEGER NOT NULL,
    codigo_oc VARCHAR(100) NOT NULL,
    proveedor VARCHAR(255) NOT NULL,
    monto DECIMAL(15, 2) NOT NULL,
    metodo_pago VARCHAR(100) NOT NULL,
    referencia VARCHAR(255),
    banco VARCHAR(255),
    cuenta_bancaria VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id) ON DELETE CASCADE
);

CREATE INDEX idx_pagos_orden ON pagos(orden_compra_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha);

-- ==========================================
-- TABLA: DESTAJOS
-- ==========================================

CREATE TABLE destajos (
    id SERIAL PRIMARY KEY,
    obra_id VARCHAR(50),
    obra_code VARCHAR(50) NOT NULL,
    semana VARCHAR(50) NOT NULL,
    destajista VARCHAR(255) NOT NULL,
    concepto TEXT NOT NULL,
    unidad VARCHAR(50),
    cantidad DECIMAL(10, 2) NOT NULL,
    precio_unitario DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (obra_code) REFERENCES obras(code) ON DELETE CASCADE
);

CREATE INDEX idx_destajos_obra ON destajos(obra_code);
CREATE INDEX idx_destajos_semana ON destajos(semana);

-- ==========================================
-- TRIGGERS PARA updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_obras_updated_at
    BEFORE UPDATE ON obras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at
    BEFORE UPDATE ON proveedores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requisiciones_updated_at
    BEFORE UPDATE ON requisiciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ordenes_compra_updated_at
    BEFORE UPDATE ON ordenes_compra
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ==========================================

-- Insertar obra de ejemplo
INSERT INTO obras (
    code, name, client, contract_number, contract_amount,
    resident, resident_initials, resident_password, status
) VALUES (
    '227', '227-CASTELLO E', 'Cliente Ejemplo', 'CONT-2025-001', 5000000.00,
    'Ing. Juan Pérez', 'JP', '1234', 'Activa'
);

-- Insertar proveedor de ejemplo
INSERT INTO proveedores (
    nombre, razon_social, rfc, contacto, telefono, email, linea_credito, dias_credito
) VALUES (
    'Ferretería López', 'Ferretería López SA de CV', 'FER-123456-ABC',
    'Carlos López', '555-1234', 'contacto@ferreterialopez.com', 100000.00, 30
);

-- ==========================================
-- FIN DEL SCHEMA
-- ==========================================
