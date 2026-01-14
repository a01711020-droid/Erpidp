-- ================================================
-- MIGRACIÓN INICIAL: Sistema de Gestión Constructora
-- ================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. TABLA: OBRAS
-- ================================================
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  cliente TEXT,
  direccion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  presupuesto_total DECIMAL(15, 2),
  estado VARCHAR(50) DEFAULT 'Activa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_obras_codigo ON obras(codigo);
CREATE INDEX idx_obras_estado ON obras(estado);

-- ================================================
-- 2. TABLA: PROVEEDORES
-- ================================================
CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre_completo TEXT NOT NULL,
  nombre_corto VARCHAR(100),
  contacto TEXT,
  telefono VARCHAR(50),
  email VARCHAR(255),
  rfc VARCHAR(20),
  direccion TEXT,
  linea_credito DECIMAL(15, 2) DEFAULT 0,
  linea_credito_usada DECIMAL(15, 2) DEFAULT 0,
  dias_credito INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_proveedores_codigo ON proveedores(codigo);
CREATE INDEX idx_proveedores_nombre ON proveedores(nombre_completo);

-- ================================================
-- 3. TABLA: USUARIOS (para autenticación)
-- ================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('Admin', 'Residente', 'Compras', 'Pagos')),
  iniciales VARCHAR(10),
  obra_asignada UUID REFERENCES obras(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_auth_user_id ON usuarios(auth_user_id);

-- ================================================
-- 4. TABLA: REQUISICIONES
-- ================================================
CREATE TABLE requisiciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_requisicion VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  residente_id UUID REFERENCES usuarios(id),
  urgencia VARCHAR(50) CHECK (urgencia IN ('Urgente', 'Normal', 'Planeado')),
  fecha_necesaria DATE,
  estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Revisión', 'Aprobada', 'Rechazada', 'Convertida a OC')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisiciones_numero ON requisiciones(numero_requisicion);
CREATE INDEX idx_requisiciones_obra ON requisiciones(obra_id);
CREATE INDEX idx_requisiciones_estado ON requisiciones(estado);

-- ================================================
-- 5. TABLA: ITEMS DE REQUISICIONES
-- ================================================
CREATE TABLE requisicion_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requisicion_id UUID REFERENCES requisiciones(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  cantidad DECIMAL(15, 3) NOT NULL,
  unidad VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisicion_items_requisicion ON requisicion_items(requisicion_id);

-- ================================================
-- 6. TABLA: COMENTARIOS DE REQUISICIONES
-- ================================================
CREATE TABLE requisicion_comentarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requisicion_id UUID REFERENCES requisiciones(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id),
  autor VARCHAR(255) NOT NULL,
  rol VARCHAR(50),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisicion_comentarios_requisicion ON requisicion_comentarios(requisicion_id);

-- ================================================
-- 7. TABLA: ÓRDENES DE COMPRA
-- ================================================
CREATE TABLE ordenes_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_orden VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  proveedor_id UUID REFERENCES proveedores(id),
  comprador_id UUID REFERENCES usuarios(id),
  requisicion_id UUID REFERENCES requisiciones(id),
  fecha_entrega DATE,
  tipo_entrega VARCHAR(50) CHECK (tipo_entrega IN ('Entrega', 'Recolección')),
  tiene_iva BOOLEAN DEFAULT true,
  descuento_porcentaje DECIMAL(5, 2) DEFAULT 0,
  subtotal DECIMAL(15, 2) NOT NULL,
  descuento_monto DECIMAL(15, 2) DEFAULT 0,
  iva DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada', 'Entregada', 'Cancelada')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ordenes_compra_numero ON ordenes_compra(numero_orden);
CREATE INDEX idx_ordenes_compra_obra ON ordenes_compra(obra_id);
CREATE INDEX idx_ordenes_compra_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_compra_estado ON ordenes_compra(estado);

-- ================================================
-- 8. TABLA: ITEMS DE ÓRDENES DE COMPRA
-- ================================================
CREATE TABLE orden_compra_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_compra_id UUID REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  cantidad DECIMAL(15, 3) NOT NULL,
  unidad VARCHAR(20),
  precio_unitario DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orden_compra_items_orden ON orden_compra_items(orden_compra_id);

-- ================================================
-- 9. TABLA: PAGOS
-- ================================================
CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_pago VARCHAR(50) UNIQUE NOT NULL,
  orden_compra_id UUID REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  proveedor_id UUID REFERENCES proveedores(id),
  obra_id UUID REFERENCES obras(id),
  monto DECIMAL(15, 2) NOT NULL,
  tipo_pago VARCHAR(50) CHECK (tipo_pago IN ('Transferencia', 'Cheque', 'Efectivo')),
  referencia_bancaria VARCHAR(100),
  fecha_pago DATE NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Procesado', 'Rechazado')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pagos_numero ON pagos(numero_pago);
CREATE INDEX idx_pagos_orden_compra ON pagos(orden_compra_id);
CREATE INDEX idx_pagos_proveedor ON pagos(proveedor_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);

-- ================================================
-- 10. TABLA: DESTAJOS
-- ================================================
CREATE TABLE destajos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  destajista VARCHAR(255) NOT NULL,
  concepto TEXT NOT NULL,
  semana VARCHAR(20) NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  cantidad DECIMAL(15, 3),
  unidad VARCHAR(20),
  precio_unitario DECIMAL(15, 2),
  total DECIMAL(15, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobado', 'Pagado')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_destajos_obra ON destajos(obra_id);
CREATE INDEX idx_destajos_destajista ON destajos(destajista);
CREATE INDEX idx_destajos_semana ON destajos(semana);

-- ================================================
-- 11. TABLA: GASTOS DIRECTOS (por obra)
-- ================================================
CREATE TABLE gastos_directos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  mes VARCHAR(7) NOT NULL, -- Formato: YYYY-MM
  concepto VARCHAR(255) NOT NULL,
  monto DECIMAL(15, 2) NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gastos_directos_obra ON gastos_directos(obra_id);
CREATE INDEX idx_gastos_directos_mes ON gastos_directos(mes);

-- ================================================
-- 12. TABLA: GASTOS INDIRECTOS (empresa)
-- ================================================
CREATE TABLE gastos_indirectos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mes VARCHAR(7) NOT NULL, -- Formato: YYYY-MM
  concepto VARCHAR(255) NOT NULL,
  monto DECIMAL(15, 2) NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gastos_indirectos_mes ON gastos_indirectos(mes);

-- ================================================
-- 13. TABLA: DISTRIBUCIÓN GASTOS INDIRECTOS
-- ================================================
CREATE TABLE distribucion_gastos_indirectos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  mes VARCHAR(7) NOT NULL,
  total_gastos_directos DECIMAL(15, 2) NOT NULL,
  porcentaje_asignado DECIMAL(5, 4) NOT NULL,
  monto_indirecto_asignado DECIMAL(15, 2) NOT NULL,
  total_gastos_obra DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_distribucion_obra ON distribucion_gastos_indirectos(obra_id);
CREATE INDEX idx_distribucion_mes ON distribucion_gastos_indirectos(mes);

-- ================================================
-- 14. TABLA: BALANCE DINERO (por obra/sucursal)
-- ================================================
CREATE TABLE balance_dinero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  mes VARCHAR(7) NOT NULL,
  ingresos DECIMAL(15, 2) DEFAULT 0,
  egresos DECIMAL(15, 2) DEFAULT 0,
  saldo DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_balance_obra ON balance_dinero(obra_id);
CREATE INDEX idx_balance_mes ON balance_dinero(mes);

-- ================================================
-- FUNCIONES Y TRIGGERS
-- ================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON obras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requisiciones_updated_at BEFORE UPDATE ON requisiciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ordenes_compra_updated_at BEFORE UPDATE ON ordenes_compra
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at BEFORE UPDATE ON pagos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destajos_updated_at BEFORE UPDATE ON destajos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_balance_dinero_updated_at BEFORE UPDATE ON balance_dinero
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisicion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisicion_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_compra_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE destajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_directos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_indirectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribucion_gastos_indirectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_dinero ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo para usuarios autenticados por ahora)
-- En producción, deberías crear políticas más específicas por rol

CREATE POLICY "Permitir lectura autenticada obras" ON obras
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura autenticada proveedores" ON proveedores
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura autenticada usuarios" ON usuarios
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado requisiciones" ON requisiciones
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado requisicion_items" ON requisicion_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado requisicion_comentarios" ON requisicion_comentarios
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado ordenes_compra" ON ordenes_compra
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado orden_compra_items" ON orden_compra_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado pagos" ON pagos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado destajos" ON destajos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado gastos_directos" ON gastos_directos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado gastos_indirectos" ON gastos_indirectos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado distribucion_gastos_indirectos" ON distribucion_gastos_indirectos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todo autenticado balance_dinero" ON balance_dinero
  FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- COMENTARIOS EN TABLAS
-- ================================================

COMMENT ON TABLE obras IS 'Proyectos de construcción';
COMMENT ON TABLE proveedores IS 'Proveedores de materiales y servicios';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema con roles';
COMMENT ON TABLE requisiciones IS 'Requisiciones de material de residentes';
COMMENT ON TABLE ordenes_compra IS 'Órdenes de compra generadas';
COMMENT ON TABLE pagos IS 'Pagos realizados a proveedores';
COMMENT ON TABLE destajos IS 'Destajos por obra y destajista';
COMMENT ON TABLE gastos_directos IS 'Gastos directos por obra';
COMMENT ON TABLE gastos_indirectos IS 'Gastos indirectos de la empresa';
COMMENT ON TABLE distribucion_gastos_indirectos IS 'Distribución proporcional de gastos indirectos';
COMMENT ON TABLE balance_dinero IS 'Balance financiero por obra';
