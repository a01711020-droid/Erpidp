-- =====================================================
-- ESQUEMA SQL COMPLETO PARA SUPABASE (PostgreSQL)
-- Sistema de Gestión Empresarial IDP
-- =====================================================

-- Extensiones para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: obras
-- =====================================================
CREATE TABLE IF NOT EXISTS obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  numero_contrato VARCHAR(100) UNIQUE NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  residente VARCHAR(255) NOT NULL,
  residente_iniciales VARCHAR(10),
  direccion TEXT,
  monto_contratado DECIMAL(15, 2) NOT NULL,
  anticipo_porcentaje DECIMAL(5, 2) DEFAULT 0,
  retencion_porcentaje DECIMAL(5, 2) DEFAULT 0,
  saldo_actual DECIMAL(15, 2) DEFAULT 0,
  total_estimaciones DECIMAL(15, 2) DEFAULT 0,
  total_gastos DECIMAL(15, 2) DEFAULT 0,
  avance_fisico_porcentaje DECIMAL(5, 2) DEFAULT 0,
  fecha_inicio DATE NOT NULL,
  fecha_fin_programada DATE NOT NULL,
  plazo_ejecucion INTEGER NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('activa', 'suspendida', 'terminada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para obras
CREATE INDEX idx_obras_codigo ON obras(codigo);
CREATE INDEX idx_obras_estado ON obras(estado);

-- =====================================================
-- TABLA: proveedores
-- =====================================================
CREATE TABLE IF NOT EXISTS proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
  alias_proveedor VARCHAR(100),
  nombre_comercial VARCHAR(255),
  rfc VARCHAR(13) UNIQUE NOT NULL,
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  telefono VARCHAR(20),
  email VARCHAR(255),
  contacto_principal VARCHAR(255),
  banco VARCHAR(100),
  numero_cuenta VARCHAR(50),
  clabe VARCHAR(18),
  tipo_proveedor VARCHAR(50) CHECK (tipo_proveedor IN ('material', 'servicio', 'renta', 'mixto')),
  credito_dias INTEGER DEFAULT 0,
  limite_credito DECIMAL(15, 2) DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para proveedores
CREATE INDEX idx_proveedores_rfc ON proveedores(rfc);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);

-- =====================================================
-- TABLA: requisiciones
-- =====================================================
CREATE TABLE IF NOT EXISTS requisiciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_requisicion VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  solicitado_por VARCHAR(255) NOT NULL,
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
  urgencia VARCHAR(50) NOT NULL CHECK (urgencia IN ('normal', 'urgente', 'muy_urgente')),
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada')),
  observaciones TEXT,
  aprobado_por VARCHAR(255),
  fecha_aprobacion TIMESTAMP,
  motivo_rechazo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para requisiciones
CREATE INDEX idx_requisiciones_obra ON requisiciones(obra_id);
CREATE INDEX idx_requisiciones_estado ON requisiciones(estado);
CREATE INDEX idx_requisiciones_numero ON requisiciones(numero_requisicion);

-- =====================================================
-- TABLA: requisicion_items
-- =====================================================
CREATE TABLE IF NOT EXISTS requisicion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicion_id UUID NOT NULL REFERENCES requisiciones(id) ON DELETE CASCADE,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  descripcion TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para items de requisición
CREATE INDEX idx_requisicion_items_requisicion ON requisicion_items(requisicion_id);

-- =====================================================
-- TABLA: ordenes_compra
-- =====================================================
CREATE TABLE IF NOT EXISTS ordenes_compra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_orden VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  requisicion_id UUID REFERENCES requisiciones(id) ON DELETE SET NULL,
  comprador_nombre VARCHAR(255),
  fecha_emision TIMESTAMP DEFAULT NOW(),
  fecha_entrega DATE NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('borrador', 'emitida', 'recibida', 'facturada', 'pagada', 'cancelada')),
  tipo_entrega VARCHAR(50) CHECK (tipo_entrega IN ('en_obra', 'bodega', 'recoger')),
  has_iva BOOLEAN DEFAULT TRUE,
  subtotal DECIMAL(15, 2) NOT NULL,
  descuento DECIMAL(5, 2) DEFAULT 0,
  descuento_monto DECIMAL(15, 2) DEFAULT 0,
  iva DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  observaciones TEXT,
  creado_por VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para órdenes de compra
CREATE INDEX idx_ordenes_compra_obra ON ordenes_compra(obra_id);
CREATE INDEX idx_ordenes_compra_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_compra_estado ON ordenes_compra(estado);
CREATE INDEX idx_ordenes_compra_numero ON ordenes_compra(numero_orden);

-- =====================================================
-- TABLA: orden_compra_items
-- =====================================================
CREATE TABLE IF NOT EXISTS orden_compra_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_unitario DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para items de OC
CREATE INDEX idx_orden_compra_items_orden ON orden_compra_items(orden_compra_id);

-- =====================================================
-- TABLA: pagos
-- =====================================================
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pago VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE RESTRICT,
  monto DECIMAL(15, 2) NOT NULL,
  metodo_pago VARCHAR(50) CHECK (metodo_pago IN ('transferencia', 'cheque', 'efectivo')),
  fecha_programada DATE NOT NULL,
  fecha_procesado TIMESTAMP,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('programado', 'procesando', 'completado', 'cancelado')),
  referencia VARCHAR(100),
  folio_factura VARCHAR(100),
  monto_factura DECIMAL(15, 2),
  fecha_factura DATE,
  dias_credito INTEGER DEFAULT 0,
  fecha_vencimiento DATE,
  comprobante TEXT,
  observaciones TEXT,
  procesado_por VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para pagos
CREATE INDEX idx_pagos_obra ON pagos(obra_id);
CREATE INDEX idx_pagos_proveedor ON pagos(proveedor_id);
CREATE INDEX idx_pagos_orden_compra ON pagos(orden_compra_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);

-- =====================================================
-- TABLA: bank_transactions (conciliación bancaria)
-- =====================================================
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  descripcion_banco TEXT NOT NULL,
  descripcion_banco_normalizada TEXT,
  monto DECIMAL(15, 2) NOT NULL,
  referencia_bancaria VARCHAR(100),
  orden_compra_id UUID REFERENCES ordenes_compra(id) ON DELETE SET NULL,
  matched BOOLEAN DEFAULT FALSE,
  origen VARCHAR(50) NOT NULL DEFAULT 'csv',
  match_confidence INTEGER DEFAULT 0,
  match_manual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bank_transactions_fecha ON bank_transactions(fecha);
CREATE INDEX idx_bank_transactions_matched ON bank_transactions(matched);
CREATE INDEX idx_bank_transactions_oc ON bank_transactions(orden_compra_id);

-- =====================================================
-- TABLA: destajos
-- =====================================================
CREATE TABLE IF NOT EXISTS destajos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  concepto VARCHAR(255) NOT NULL,
  destajista VARCHAR(255) NOT NULL,
  monto_contratado DECIMAL(15, 2) NOT NULL,
  avance_porc DECIMAL(5, 2) DEFAULT 0 CHECK (avance_porc >= 0 AND avance_porc <= 100),
  saldo_pendiente DECIMAL(15, 2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin_estimada DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para destajos
CREATE INDEX idx_destajos_obra ON destajos(obra_id);

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'residente', 'compras', 'pagos')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON obras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requisiciones_updated_at BEFORE UPDATE ON requisiciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ordenes_compra_updated_at BEFORE UPDATE ON ordenes_compra
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at BEFORE UPDATE ON pagos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destajos_updated_at BEFORE UPDATE ON destajos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE PRUEBA (SEED)
-- =====================================================

-- Insertar obra de ejemplo: CASTELLO E
INSERT INTO obras (codigo, nombre, numero_contrato, cliente, residente, direccion, monto_contratado, fecha_inicio, fecha_fin_programada, plazo_ejecucion, estado)
VALUES 
  ('227', 'CASTELLO E', 'IDP-2024-227', 'Desarrolladora Inmobiliaria XYZ', 'Ing. Carlos Mendoza', 'Av. Constitución 123, Col. Centro, Toluca, Estado de México', 15000000.00, '2024-01-15', '2024-07-13', 180, 'activa')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar 10 proveedores
INSERT INTO proveedores (razon_social, nombre_comercial, rfc, direccion, ciudad, codigo_postal, telefono, email, contacto_principal, banco, numero_cuenta, clabe, tipo_proveedor, credito_dias, limite_credito, activo)
VALUES 
  ('Cementos Cruz Azul SA de CV', 'Cruz Azul', 'CCR850101ABC', 'Av. Industrial 456', 'Toluca', '50100', '55-1234-5678', 'ventas@cruzazul.com', 'Juan Pérez', 'BBVA Bancomer', '0123456789', '012180001234567890', 'material', 30, 500000.00, TRUE),
  ('Aceros Levinson SA de CV', 'Levinson', 'ALE900215DEF', 'Calle del Acero 789', 'Toluca', '50200', '55-2345-6789', 'compras@levinson.com.mx', 'María García', 'Santander', '9876543210', '014180009876543210', 'material', 30, 750000.00, TRUE),
  ('CEMEX SA de CV', 'CEMEX', 'CEM850320GHI', 'Blvd. Cemex 321', 'Toluca', '50300', '55-3456-7890', 'contacto@cemex.com', 'Pedro Ramírez', 'Banamex', '1122334455', '002180001122334455', 'material', 45, 1000000.00, TRUE),
  ('Ferretería EPA SA de CV', 'EPA', 'FEP920510JKL', 'Av. Morelos 567', 'Toluca', '50150', '55-4567-8901', 'ventas@epa.com.mx', 'Laura Sánchez', 'HSBC', '5544332211', '021180005544332211', 'material', 15, 200000.00, TRUE),
  ('Transportes García e Hijos SC', 'García Transportes', 'TGH880725MNO', 'Carr. Toluca-Lerma km 5', 'Toluca', '50400', '55-5678-9012', 'logistica@garciatransportes.com', 'Roberto García', 'Banorte', '6677889900', '072180006677889900', 'servicio', 0, 100000.00, TRUE),
  ('Maderas del Norte SA de CV', 'Maderas del Norte', 'MDN870630PQR', 'Av. Solidaridad 890', 'Toluca', '50250', '55-6789-0123', 'ventas@maderasdelnorte.com', 'Ana Martínez', 'Scotiabank', '3344556677', '044180003344556677', 'material', 30, 300000.00, TRUE),
  ('Vidrios y Aluminios SA de CV', 'Vidrios y Aluminios', 'VYA910815STU', 'Calle Industria 234', 'Toluca', '50350', '55-7890-1234', 'contacto@vidriosyaluminios.com', 'Carlos López', 'BBVA Bancomer', '7788990011', '012180007788990011', 'material', 30, 400000.00, TRUE),
  ('Pinturas Comex SA de CV', 'Comex', 'PCO750920VWX', 'Av. Revolución 678', 'Toluca', '50180', '55-8901-2345', 'ventas@comex.com.mx', 'Sofía Hernández', 'Santander', '2233445566', '014180002233445566', 'material', 30, 250000.00, TRUE),
  ('Instalaciones Eléctricas Omega SA', 'Omega Eléctrica', 'IEO830405YZA', 'Blvd. Electricidad 901', 'Toluca', '50220', '55-9012-3456', 'proyectos@omegaelectrica.com', 'Miguel Ángel Torres', 'Banamex', '8899001122', '002180008899001122', 'servicio', 30, 600000.00, TRUE),
  ('Plomería y Gas Industrial SA de CV', 'Plomería Industrial', 'PGI860110BCD', 'Calle Gas 345', 'Toluca', '50280', '55-0123-4567', 'ventas@plomeriaindustrial.com', 'Patricia Flores', 'HSBC', '4455667788', '021180004455667788', 'mixto', 30, 350000.00, TRUE)
ON CONFLICT (rfc) DO NOTHING;

-- =====================================================
-- FIN DEL ESQUEMA SQL
-- =====================================================
