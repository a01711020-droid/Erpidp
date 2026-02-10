CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS requisiciones_comentarios;
DROP TABLE IF EXISTS requisiciones_items;
DROP TABLE IF EXISTS requisiciones;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS ordenes_compra_items;
DROP TABLE IF EXISTS ordenes_compra;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS obras;

CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  cliente TEXT NOT NULL,
  numero_contrato TEXT NOT NULL,
  monto_contrato NUMERIC NOT NULL,
  anticipo_porcentaje NUMERIC NOT NULL DEFAULT 0,
  retencion_porcentaje NUMERIC NOT NULL DEFAULT 0,
  fecha_inicio DATE NOT NULL,
  fecha_fin_estimada DATE NOT NULL,
  residente_nombre TEXT NOT NULL,
  residente_iniciales TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Activa', 'Archivada')),
  balance_actual NUMERIC,
  total_estimaciones NUMERIC,
  total_gastos NUMERIC
);

CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_comercial TEXT NOT NULL,
  razon_social TEXT NOT NULL,
  rfc TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  codigo_postal TEXT,
  telefono TEXT,
  email TEXT,
  contacto_principal TEXT,
  banco TEXT,
  numero_cuenta TEXT,
  clabe TEXT,
  tipo_proveedor TEXT CHECK (tipo_proveedor IN ('material', 'servicio', 'renta', 'mixto')),
  dias_credito NUMERIC NOT NULL DEFAULT 0,
  limite_credito NUMERIC NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ordenes_compra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT NOT NULL UNIQUE,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE RESTRICT,
  obra_codigo TEXT NOT NULL,
  obra_nombre TEXT NOT NULL,
  cliente TEXT NOT NULL,
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  proveedor_nombre TEXT NOT NULL,
  proveedor_razon_social TEXT NOT NULL,
  proveedor_contacto TEXT,
  proveedor_rfc TEXT,
  proveedor_direccion TEXT,
  proveedor_telefono TEXT,
  proveedor_banco TEXT,
  proveedor_cuenta TEXT,
  proveedor_clabe TEXT,
  comprador TEXT NOT NULL,
  fecha_entrega DATE NOT NULL,
  tipo_entrega TEXT NOT NULL CHECK (tipo_entrega IN ('Entrega', 'Recolección')),
  incluye_iva BOOLEAN NOT NULL DEFAULT TRUE,
  descuento NUMERIC NOT NULL DEFAULT 0,
  descuento_monto NUMERIC NOT NULL DEFAULT 0,
  observaciones TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  iva NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  fecha_creacion DATE NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada', 'Entregada'))
);

CREATE TABLE ordenes_compra_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  cantidad NUMERIC NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  total NUMERIC NOT NULL
);

CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  referencia TEXT NOT NULL,
  monto NUMERIC NOT NULL,
  fecha_pago DATE NOT NULL,
  metodo TEXT NOT NULL,
  folio_factura TEXT,
  fecha_factura DATE,
  monto_factura NUMERIC
);

CREATE TABLE requisiciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT NOT NULL UNIQUE,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE RESTRICT,
  obra_codigo TEXT NOT NULL,
  obra_nombre TEXT NOT NULL,
  residente_nombre TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('En Revisión', 'Comprado')),
  fecha_creacion DATE NOT NULL,
  urgencia TEXT NOT NULL CHECK (urgencia IN ('Urgente', 'Normal', 'Planeado')),
  fecha_entrega DATE NOT NULL
);

CREATE TABLE requisiciones_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicion_id UUID NOT NULL REFERENCES requisiciones(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  cantidad NUMERIC NOT NULL,
  unidad TEXT NOT NULL
);

CREATE TABLE requisiciones_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicion_id UUID NOT NULL REFERENCES requisiciones(id) ON DELETE CASCADE,
  autor TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('Residente', 'Compras')),
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ordenes_compra_obra_id ON ordenes_compra(obra_id);
CREATE INDEX idx_ordenes_compra_proveedor_id ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_compra_items_oc_id ON ordenes_compra_items(orden_compra_id);
CREATE INDEX idx_pagos_oc_id ON pagos(orden_compra_id);
CREATE INDEX idx_requisiciones_obra_id ON requisiciones(obra_id);
CREATE INDEX idx_requisiciones_items_req_id ON requisiciones_items(requisicion_id);
CREATE INDEX idx_requisiciones_comentarios_req_id ON requisiciones_comentarios(requisicion_id);
