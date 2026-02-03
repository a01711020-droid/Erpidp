# 🗄️ ESQUEMA DE BASE DE DATOS SQL - SUPABASE

## 📋 TABLAS Y ESTRUCTURA COMPLETA

---

## 1. TABLA: obras

**Descripción**: Almacena información de todas las obras/contratos activos de la constructora.

```sql
CREATE TABLE obras (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  
  -- Información básica
  nombre VARCHAR(255) NOT NULL,
  ubicacion TEXT NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  
  -- Información financiera
  monto_contrato DECIMAL(15, 2) NOT NULL,
  ejecutado DECIMAL(15, 2) DEFAULT 0,
  pendiente DECIMAL(15, 2) GENERATED ALWAYS AS (monto_contrato - ejecutado) STORED,
  avance DECIMAL(5, 2) DEFAULT 0 CHECK (avance >= 0 AND avance <= 100),
  
  -- Fechas
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  
  -- Responsables
  responsable VARCHAR(255) NOT NULL,
  residente_iniciales VARCHAR(10) NOT NULL,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_obras_codigo ON obras(codigo);
CREATE INDEX idx_obras_status ON obras(status);
CREATE INDEX idx_obras_fecha_fin ON obras(fecha_fin);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON obras
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO obras (codigo, nombre, ubicacion, cliente, monto_contrato, ejecutado, avance, fecha_inicio, fecha_fin, responsable, residente_iniciales, status) VALUES
('230', 'CASTELLO H', 'Av. Constituyentes 950, CDMX', 'INMOBILIARIA CASTELLO SA DE CV', 8500000.00, 6800000.00, 80, '2025-03-15', '2026-09-30', 'Ing. Juan Ramírez', 'JR', 'active'),
('227', 'CASTELLO E', 'Av. Revolución 1425, CDMX', 'INMOBILIARIA CASTELLO SA DE CV', 7200000.00, 6480000.00, 90, '2024-11-20', '2026-04-15', 'Ing. Gabriel Méndez', 'GM', 'active'),
('228', 'CASTELLO F', 'Calle Monterrey 385, CDMX', 'INMOBILIARIA CASTELLO SA DE CV', 6800000.00, 4760000.00, 70, '2025-01-10', '2026-06-30', 'Ing. Juan Ramírez', 'JR', 'active'),
('229', 'CASTELLO G', 'Insurgentes Sur 2345, CDMX', 'INMOBILIARIA CASTELLO SA DE CV', 9200000.00, 2760000.00, 30, '2025-06-01', '2026-12-31', 'Ing. Gabriel Méndez', 'GM', 'active'),
('231', 'DOZA A', 'Periférico Norte 456, Estado de México', 'DESARROLLOS DOZA SA DE CV', 12500000.00, 3750000.00, 30, '2025-07-15', '2027-01-31', 'Ing. Roberto Silva', 'RS', 'active'),
('232', 'DOZA B', 'Av. Central 789, Estado de México', 'DESARROLLOS DOZA SA DE CV', 10800000.00, 5400000.00, 50, '2025-04-01', '2026-10-15', 'Ing. Gabriel Méndez', 'GM', 'active'),
('233', 'DOZA C', 'Calzada Vallejo 1234, CDMX', 'DESARROLLOS DOZA SA DE CV', 8900000.00, 2670000.00, 30, '2025-08-01', '2026-12-31', 'Ing. Juan Ramírez', 'JR', 'active');
```

---

## 2. TABLA: proveedores

**Descripción**: Catálogo de proveedores con sus datos fiscales y de contacto.

```sql
CREATE TABLE proveedores (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Información comercial
  proveedor VARCHAR(255) NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  rfc VARCHAR(13) NOT NULL UNIQUE,
  
  -- Ubicación
  direccion TEXT NOT NULL,
  
  -- Contacto
  vendedor VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  
  -- Configuración de facturación
  requiere_factura BOOLEAN DEFAULT TRUE,
  dias_credito INTEGER DEFAULT 0 CHECK (dias_credito >= 0),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_proveedores_proveedor ON proveedores(proveedor);
CREATE INDEX idx_proveedores_rfc ON proveedores(rfc);

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO proveedores (proveedor, razon_social, rfc, direccion, vendedor, telefono, correo, requiere_factura, dias_credito) VALUES
('CEMEX', 'CEMEX México S.A. de C.V.', 'CMX850101ABC', 'Av. Constitución 444, Monterrey, N.L.', 'Ing. Roberto Martínez', '(55) 5555-1234', 'roberto.martinez@cemex.com', TRUE, 30),
('LEVINSON', 'Aceros Levinson S.A. de C.V.', 'ACL920315XYZ', 'Calz. Vallejo 1020, CDMX', 'Ing. Carlos Pérez', '(55) 5555-3456', 'carlos.perez@levinson.com.mx', TRUE, 15),
('HOME DEPOT', 'Homer TLC, Inc.', 'HTL030625MNO', 'Periférico Sur 3720, CDMX', 'mostrador', '(55) 5555-7890', 'ventas@homedepot.com.mx', TRUE, 0),
('FERREMAT', 'Ferretería y Materiales del Centro S.A.', 'FMC880420DEF', 'Av. Juárez 234, CDMX', 'Lic. María González', '(55) 5555-2345', 'maria.gonzalez@ferremat.com.mx', TRUE, 40),
('BEREL', 'Berel S.A. de C.V.', 'BER750815GHI', 'Insurgentes Norte 567, CDMX', 'Ing. Luis Torres', '(55) 5555-4567', 'luis.torres@berel.com.mx', TRUE, 45),
('INTERCERAMIC', 'Interceramic S.A. de C.V.', 'INT820910JKL', 'Av. Universidad 890, Monterrey, N.L.', 'Arq. Ana Ruiz', '(55) 5555-6789', 'ana.ruiz@interceramic.com', TRUE, 30),
('POLIESTIRENOS', 'Poliestirenos del Norte S.A.', 'PDN900525PQR', 'Calzada México-Tacuba 456, CDMX', 'Ing. Pedro Sánchez', '(55) 5555-8901', 'pedro.sanchez@poliestirenos.com.mx', TRUE, 30),
('HIERROS', 'Hierros y Aceros del Valle S.A.', 'HAV870630STU', 'Av. Central 123, Estado de México', 'Ing. Jorge Díaz', '(55) 5555-0123', 'jorge.diaz@hierros.com.mx', TRUE, 20),
('ELECTRICSA', 'Eléctrica y Construcción S.A.', 'ELC910815VWX', 'Insurgentes Sur 789, CDMX', 'Ing. Raúl Fernández', '(55) 5555-2468', 'raul.fernandez@electricsa.com.mx', TRUE, 25),
('PINTURAMA', 'Pinturas del Mayorista S.A.', 'PDM850920YZA', 'Av. Revolución 456, CDMX', 'Lic. Laura Medina', '(55) 5555-1357', 'laura.medina@pinturama.com.mx', TRUE, 30),
('PIPA LUIS GOMEZ', 'Luis Gómez Transporte de Agua', 'GOML780512BCD', 'Calle Allende 78, Estado de México', 'Luis Gómez', '(55) 5555-9876', 'luisgomez@gmail.com', FALSE, 0),
('ACARREOS JOSE', 'José Martínez Acarreos', 'MAJO850623EFG', 'Av. Hidalgo 234, CDMX', 'José Martínez', '(55) 5555-5432', 'josemartinez@hotmail.com', FALSE, 0),
('MANO DE OBRA EVENTUAL', 'Contratistas Eventuales', 'N/A', 'Varios', 'varios', '(55) 5555-0000', 'eventual@constructora.com', FALSE, 0);
```

---

## 3. TABLA: ordenes_compra

**Descripción**: Órdenes de compra generadas por el departamento de compras.

```sql
CREATE TABLE ordenes_compra (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio VARCHAR(50) UNIQUE NOT NULL,
  
  -- Relaciones
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE RESTRICT,
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  
  -- Fechas
  fecha_orden DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_entrega DATE NOT NULL,
  
  -- Montos
  subtotal DECIMAL(15, 2) NOT NULL,
  iva DECIMAL(15, 2) NOT NULL,
  descuento DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  
  -- Información adicional
  notas TEXT,
  tipo_entrega VARCHAR(50) DEFAULT 'Entrega en Obra' CHECK (tipo_entrega IN ('Entrega en Obra', 'Recolección en Sucursal', 'Otro')),
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'delivered', 'cancelled')),
  
  -- Auditoría
  creado_por VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ordenes_folio ON ordenes_compra(folio);
CREATE INDEX idx_ordenes_obra ON ordenes_compra(obra_id);
CREATE INDEX idx_ordenes_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_fecha ON ordenes_compra(fecha_orden);
CREATE INDEX idx_ordenes_status ON ordenes_compra(status);

CREATE TRIGGER update_ordenes_compra_updated_at BEFORE UPDATE ON ordenes_compra
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO ordenes_compra (folio, obra_id, proveedor_id, fecha_orden, fecha_entrega, subtotal, iva, descuento, total, tipo_entrega, status, creado_por) VALUES
-- Usar los UUIDs reales de obras y proveedores
('230-A01JR-CEMEX', (SELECT id FROM obras WHERE codigo = '230'), (SELECT id FROM proveedores WHERE proveedor = 'CEMEX'), '2026-01-10', '2026-01-15', 34722.00, 5555.52, 0, 40277.52, 'Entrega en Obra', 'approved', 'admin'),
('227-A01GM-CEMEX', (SELECT id FROM obras WHERE codigo = '227'), (SELECT id FROM proveedores WHERE proveedor = 'CEMEX'), '2025-12-05', '2025-12-10', 34550.00, 5528.00, 0, 40078.00, 'Entrega en Obra', 'delivered', 'admin'),
('227-A02RS-LEVINSON', (SELECT id FROM obras WHERE codigo = '227'), (SELECT id FROM proveedores WHERE proveedor = 'LEVINSON'), '2025-12-15', '2025-12-20', 35001.72, 5600.28, 0, 40602.00, 'Recolección en Sucursal', 'delivered', 'admin');
```

---

## 4. TABLA: orden_compra_items

**Descripción**: Partidas/items de cada orden de compra.

```sql
CREATE TABLE orden_compra_items (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  
  -- Información del item
  descripcion TEXT NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(15, 2) NOT NULL CHECK (precio_unitario >= 0),
  total DECIMAL(15, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orden_items_orden ON orden_compra_items(orden_compra_id);
```

**Datos de ejemplo**:
```sql
INSERT INTO orden_compra_items (orden_compra_id, descripcion, unidad, cantidad, precio_unitario) VALUES
-- Para orden 230-A01JR-CEMEX
((SELECT id FROM ordenes_compra WHERE folio = '230-A01JR-CEMEX'), 'Concreto premezclado f''c=250 kg/cm²', 'm³', 20, 1736.10),
-- Para orden 227-A01GM-CEMEX
((SELECT id FROM ordenes_compra WHERE folio = '227-A01GM-CEMEX'), 'Concreto premezclado f''c=250 kg/cm²', 'm³', 20, 1727.50),
-- Para orden 227-A02RS-LEVINSON
((SELECT id FROM ordenes_compra WHERE folio = '227-A02RS-LEVINSON'), 'Varilla corrugada 3/8" grado 42', 'ton', 2.5, 14000.69);
```

---

## 5. TABLA: requisiciones_material

**Descripción**: Requisiciones de material solicitadas por residentes de obra.

```sql
CREATE TABLE requisiciones_material (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio VARCHAR(50) UNIQUE NOT NULL,
  
  -- Relaciones
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE RESTRICT,
  
  -- Información
  residente VARCHAR(255) NOT NULL,
  fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_requerida DATE NOT NULL,
  prioridad VARCHAR(20) DEFAULT 'normal' CHECK (prioridad IN ('normal', 'urgent')),
  
  -- Observaciones
  notas TEXT,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'purchased', 'rejected')),
  
  -- Vinculación con OC (cuando se compra)
  orden_compra_id UUID REFERENCES ordenes_compra(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisiciones_folio ON requisiciones_material(folio);
CREATE INDEX idx_requisiciones_obra ON requisiciones_material(obra_id);
CREATE INDEX idx_requisiciones_status ON requisiciones_material(status);
CREATE INDEX idx_requisiciones_prioridad ON requisiciones_material(prioridad);
CREATE INDEX idx_requisiciones_fecha_requerida ON requisiciones_material(fecha_requerida);

CREATE TRIGGER update_requisiciones_updated_at BEFORE UPDATE ON requisiciones_material
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO requisiciones_material (folio, obra_id, residente, fecha_solicitud, fecha_requerida, prioridad, notas, status) VALUES
('REQ-1706895234567', (SELECT id FROM obras WHERE codigo = '230'), 'Ing. Juan Ramírez', '2026-01-25', '2026-01-30', 'urgent', 'Para avanzar con losa de entrepiso', 'in_review'),
('REQ-1706895334567', (SELECT id FROM obras WHERE codigo = '227'), 'Ing. Gabriel Méndez', '2026-01-20', '2026-02-05', 'normal', 'Material para acabados', 'pending'),
('REQ-1706895434567', (SELECT id FROM obras WHERE codigo = '228'), 'Ing. Juan Ramírez', '2026-01-22', '2026-01-28', 'urgent', 'Cemento para cimentación urgente', 'purchased'),
('REQ-1706895534567', (SELECT id FROM obras WHERE codigo = '229'), 'Ing. Gabriel Méndez', '2026-01-18', '2026-02-10', 'normal', 'Impermeabilizantes para azotea', 'pending'),
('REQ-1706895634567', (SELECT id FROM obras WHERE codigo = '231'), 'Ing. Roberto Silva', '2026-01-15', '2026-02-01', 'normal', 'Block y mortero para muros', 'in_review');
```

---

## 6. TABLA: requisicion_items

**Descripción**: Materiales solicitados en cada requisición.

```sql
CREATE TABLE requisicion_items (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requisicion_id UUID NOT NULL REFERENCES requisiciones_material(id) ON DELETE CASCADE,
  
  -- Información del material
  material TEXT NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL CHECK (cantidad > 0),
  precio_estimado DECIMAL(15, 2),
  notas TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requisicion_items_requisicion ON requisicion_items(requisicion_id);
```

**Datos de ejemplo**:
```sql
INSERT INTO requisicion_items (requisicion_id, material, unidad, cantidad, precio_estimado, notas) VALUES
-- Para REQ-1706895234567
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895234567'), 'Concreto premezclado f''c=250 kg/cm²', 'm³', 15, 1750.00, 'Para losa nivel 2'),
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895234567'), 'Malla electrosoldada 6x6-10/10', 'm²', 200, 85.00, NULL),
-- Para REQ-1706895334567
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895334567'), 'Azulejo blanco 20x30 cm', 'm²', 80, 120.00, 'Marca Interceramic'),
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895334567'), 'Adhesivo para azulejo', 'bulto', 20, 180.00, NULL);
```

---

## 7. TABLA: facturas

**Descripción**: Facturas emitidas por proveedores (una OC puede tener múltiples facturas).

```sql
CREATE TABLE facturas (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio_factura VARCHAR(50) UNIQUE NOT NULL,
  
  -- Relaciones
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE RESTRICT,
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  
  -- Montos
  monto_factura DECIMAL(15, 2) NOT NULL CHECK (monto_factura > 0),
  
  -- Fechas y crédito
  fecha_factura DATE NOT NULL,
  dias_credito INTEGER DEFAULT 0 CHECK (dias_credito >= 0),
  fecha_vencimiento DATE GENERATED ALWAYS AS (fecha_factura + dias_credito * INTERVAL '1 day') STORED,
  
  -- XML/PDF
  xml_path TEXT,
  pdf_path TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_facturas_folio ON facturas(folio_factura);
CREATE INDEX idx_facturas_orden ON facturas(orden_compra_id);
CREATE INDEX idx_facturas_proveedor ON facturas(proveedor_id);
CREATE INDEX idx_facturas_fecha_vencimiento ON facturas(fecha_vencimiento);

CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO facturas (folio_factura, orden_compra_id, proveedor_id, monto_factura, fecha_factura, dias_credito) VALUES
('FACT-2026-001', (SELECT id FROM ordenes_compra WHERE folio = '230-A01JR-CEMEX'), (SELECT id FROM proveedores WHERE proveedor = 'CEMEX'), 40277.52, '2026-01-12', 30),
('FACT-2025-998', (SELECT id FROM ordenes_compra WHERE folio = '227-A01GM-CEMEX'), (SELECT id FROM proveedores WHERE proveedor = 'CEMEX'), 40078.00, '2025-12-06', 30),
('FACT-2025-875', (SELECT id FROM ordenes_compra WHERE folio = '227-A02RS-LEVINSON'), (SELECT id FROM proveedores WHERE proveedor = 'LEVINSON'), 40602.00, '2025-12-16', 15);
```

---

## 8. TABLA: pagos

**Descripción**: Pagos realizados a facturas o directos (proveedores sin factura).

```sql
CREATE TABLE pagos (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referencia VARCHAR(100) UNIQUE NOT NULL,
  
  -- Relaciones (una u otra, no ambas)
  factura_id UUID REFERENCES facturas(id) ON DELETE RESTRICT,
  orden_compra_id UUID REFERENCES ordenes_compra(id) ON DELETE RESTRICT,
  
  -- Monto y método
  monto DECIMAL(15, 2) NOT NULL CHECK (monto > 0),
  fecha_pago DATE NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('Transferencia', 'Cheque', 'Efectivo')),
  
  -- Comprobantes
  comprobante_path TEXT,
  
  -- Metadata
  creado_por VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: Debe tener factura_id O orden_compra_id, no ambas
  CONSTRAINT check_pago_tipo CHECK (
    (factura_id IS NOT NULL AND orden_compra_id IS NULL) OR
    (factura_id IS NULL AND orden_compra_id IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_pagos_referencia ON pagos(referencia);
CREATE INDEX idx_pagos_factura ON pagos(factura_id);
CREATE INDEX idx_pagos_orden ON pagos(orden_compra_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
```

**Datos de ejemplo**:
```sql
INSERT INTO pagos (referencia, factura_id, monto, fecha_pago, metodo_pago, creado_por) VALUES
('TRF-2025-0123', (SELECT id FROM facturas WHERE folio_factura = 'FACT-2025-998'), 40078.00, '2025-12-20', 'Transferencia', 'admin'),
('CHQ-45678', (SELECT id FROM facturas WHERE folio_factura = 'FACT-2025-875'), 20000.00, '2025-12-28', 'Cheque', 'admin');

-- Ejemplo de pago directo (sin factura)
INSERT INTO pagos (referencia, orden_compra_id, monto, fecha_pago, metodo_pago, creado_por) VALUES
('EFE-001', (SELECT id FROM ordenes_compra WHERE folio LIKE '%PIPA LUIS GOMEZ%'), 8500.00, '2026-01-07', 'Efectivo', 'admin');
```

---

## 9. TABLA: contratos

**Descripción**: Contratos/obras con tracking de estimaciones progresivas.

```sql
CREATE TABLE contratos (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_contrato VARCHAR(50) UNIQUE NOT NULL,
  
  -- Relación con obra
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE RESTRICT,
  
  -- Cliente
  cliente VARCHAR(255) NOT NULL,
  
  -- Montos
  monto_contrato DECIMAL(15, 2) NOT NULL,
  anticipo DECIMAL(15, 2) DEFAULT 0,
  
  -- Fechas
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  
  -- Avance
  avance_fisico DECIMAL(5, 2) DEFAULT 0 CHECK (avance_fisico >= 0 AND avance_fisico <= 100),
  
  -- Estado
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contratos_numero ON contratos(numero_contrato);
CREATE INDEX idx_contratos_obra ON contratos(obra_id);
CREATE INDEX idx_contratos_status ON contratos(status);

CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON contratos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO contratos (numero_contrato, obra_id, cliente, monto_contrato, anticipo, fecha_inicio, fecha_fin, avance_fisico, status) VALUES
('CONT-230-2025', (SELECT id FROM obras WHERE codigo = '230'), 'INMOBILIARIA CASTELLO SA DE CV', 8500000.00, 850000.00, '2025-03-15', '2026-09-30', 80, 'active'),
('CONT-227-2024', (SELECT id FROM obras WHERE codigo = '227'), 'INMOBILIARIA CASTELLO SA DE CV', 7200000.00, 720000.00, '2024-11-20', '2026-04-15', 90, 'active');
```

---

## 10. TABLA: estimaciones

**Descripción**: Estimaciones progresivas por contrato.

```sql
CREATE TABLE estimaciones (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER NOT NULL,
  
  -- Relación
  contrato_id UUID NOT NULL REFERENCES contratos(id) ON DELETE RESTRICT,
  
  -- Periodo
  periodo VARCHAR(100) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  
  -- Montos
  monto_bruto DECIMAL(15, 2) NOT NULL,
  amortizacion_anticipo DECIMAL(15, 2) DEFAULT 0,
  retencion DECIMAL(15, 2) DEFAULT 0,
  monto_neto DECIMAL(15, 2) GENERATED ALWAYS AS (monto_bruto - amortizacion_anticipo - retencion) STORED,
  
  -- Pago
  fecha_pago DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: numero único por contrato
  UNIQUE (contrato_id, numero)
);

-- Índices
CREATE INDEX idx_estimaciones_contrato ON estimaciones(contrato_id);
CREATE INDEX idx_estimaciones_numero ON estimaciones(numero);
CREATE INDEX idx_estimaciones_status ON estimaciones(status);

CREATE TRIGGER update_estimaciones_updated_at BEFORE UPDATE ON estimaciones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Datos de ejemplo**:
```sql
INSERT INTO estimaciones (numero, contrato_id, periodo, fecha_inicio, fecha_fin, monto_bruto, amortizacion_anticipo, retencion, fecha_pago, status) VALUES
(1, (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025'), 'Marzo 2025', '2025-03-15', '2025-03-31', 850000.00, 85000.00, 42500.00, '2025-04-20', 'paid'),
(2, (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025'), 'Abril 2025', '2025-04-01', '2025-04-30', 1200000.00, 120000.00, 60000.00, '2025-05-25', 'paid'),
(3, (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025'), 'Mayo 2025', '2025-05-01', '2025-05-31', 1100000.00, 110000.00, 55000.00, '2025-06-22', 'paid'),
(4, (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025'), 'Junio 2025', '2025-06-01', '2025-06-30', 980000.00, 98000.00, 49000.00, NULL, 'pending');
```

---

## 11. TABLA: estimacion_conceptos

**Descripción**: Conceptos/partidas ejecutadas en cada estimación.

```sql
CREATE TABLE estimacion_conceptos (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimacion_id UUID NOT NULL REFERENCES estimaciones(id) ON DELETE CASCADE,
  
  -- Concepto
  concepto TEXT NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  
  -- Cantidades
  cantidad_contratada DECIMAL(10, 2) NOT NULL,
  cantidad_ejecutada DECIMAL(10, 2) NOT NULL CHECK (cantidad_ejecutada > 0),
  
  -- Precio
  precio_unitario DECIMAL(15, 2) NOT NULL,
  importe DECIMAL(15, 2) GENERATED ALWAYS AS (cantidad_ejecutada * precio_unitario) STORED,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_estimacion_conceptos_estimacion ON estimacion_conceptos(estimacion_id);
```

**Datos de ejemplo**:
```sql
INSERT INTO estimacion_conceptos (estimacion_id, concepto, unidad, cantidad_contratada, cantidad_ejecutada, precio_unitario) VALUES
-- Estimación 1
((SELECT id FROM estimaciones WHERE numero = 1 AND contrato_id = (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025')), 'Excavación para desplante', 'm³', 500, 150, 320.00),
((SELECT id FROM estimaciones WHERE numero = 1 AND contrato_id = (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025')), 'Cimentación de concreto armado', 'm³', 200, 80, 4500.00),
((SELECT id FROM estimaciones WHERE numero = 1 AND contrato_id = (SELECT id FROM contratos WHERE numero_contrato = 'CONT-230-2025')), 'Acero de refuerzo fy=4200 kg/cm²', 'ton', 50, 15, 18000.00);
```

---

## 12. TABLA: mensajes_requisicion

**Descripción**: Sistema de mensajería entre residentes y departamento de compras.

```sql
CREATE TABLE mensajes_requisicion (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requisicion_id UUID NOT NULL REFERENCES requisiciones_material(id) ON DELETE CASCADE,
  
  -- Mensaje
  remitente VARCHAR(20) NOT NULL CHECK (remitente IN ('resident', 'buyer')),
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_mensajes_requisicion ON mensajes_requisicion(requisicion_id);
CREATE INDEX idx_mensajes_created_at ON mensajes_requisicion(created_at);
CREATE INDEX idx_mensajes_leido ON mensajes_requisicion(leido);
```

**Datos de ejemplo**:
```sql
INSERT INTO mensajes_requisicion (requisicion_id, remitente, mensaje, leido) VALUES
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895234567'), 'resident', 'Necesito el cemento lo antes posible para no detener la losa', TRUE),
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895234567'), 'buyer', 'Ya contacté a CEMEX, confirman entrega para el viernes', TRUE),
((SELECT id FROM requisiciones_material WHERE folio = 'REQ-1706895234567'), 'resident', 'Perfecto, muchas gracias', FALSE);
```

---

## 📊 VISTAS ÚTILES

### Vista: reporte_pagos_completo

```sql
CREATE VIEW reporte_pagos_completo AS
SELECT 
  oc.folio AS orden_compra,
  oc.fecha_orden,
  o.codigo AS codigo_obra,
  o.nombre AS nombre_obra,
  p.proveedor,
  oc.total AS monto_oc,
  p.requiere_factura,
  p.dias_credito,
  COALESCE(f.folio_factura, 'Sin Factura') AS folio_factura,
  f.monto_factura,
  f.fecha_factura,
  f.fecha_vencimiento,
  CASE 
    WHEN f.fecha_vencimiento IS NOT NULL AND CURRENT_DATE > f.fecha_vencimiento 
    THEN CURRENT_DATE - f.fecha_vencimiento 
    ELSE 0 
  END AS dias_vencidos,
  COALESCE(SUM(pag.monto), 0) AS total_pagado,
  oc.total - COALESCE(SUM(pag.monto), 0) AS saldo_pendiente,
  CASE 
    WHEN COALESCE(SUM(pag.monto), 0) >= oc.total THEN 'paid'
    WHEN COALESCE(SUM(pag.monto), 0) > 0 THEN 'partial'
    WHEN f.id IS NULL THEN 'not_invoiced'
    WHEN CURRENT_DATE > f.fecha_vencimiento THEN 'overdue'
    ELSE 'pending'
  END AS status
FROM ordenes_compra oc
JOIN obras o ON oc.obra_id = o.id
JOIN proveedores p ON oc.proveedor_id = p.id
LEFT JOIN facturas f ON f.orden_compra_id = oc.id
LEFT JOIN pagos pag ON pag.factura_id = f.id OR pag.orden_compra_id = oc.id
GROUP BY oc.id, o.codigo, o.nombre, p.proveedor, p.requiere_factura, p.dias_credito, f.id, f.folio_factura, f.monto_factura, f.fecha_factura, f.fecha_vencimiento;
```

### Vista: dashboard_obras

```sql
CREATE VIEW dashboard_obras AS
SELECT 
  o.id,
  o.codigo,
  o.nombre,
  o.monto_contrato,
  o.ejecutado,
  o.pendiente,
  o.avance,
  o.fecha_inicio,
  o.fecha_fin,
  o.responsable,
  o.status,
  COUNT(DISTINCT oc.id) AS total_ocs,
  COUNT(DISTINCT rm.id) AS total_requisiciones,
  COALESCE(SUM(oc.total), 0) AS monto_comprado
FROM obras o
LEFT JOIN ordenes_compra oc ON oc.obra_id = o.id
LEFT JOIN requisiciones_material rm ON rm.obra_id = o.id
GROUP BY o.id;
```

---

## 🔐 ROW LEVEL SECURITY (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_compra_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisiciones_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisicion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimacion_conceptos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_requisicion ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo (ajustar según roles reales)
CREATE POLICY "Permitir lectura a usuarios autenticados" ON obras
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a administradores" ON obras
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 📝 TIPOS DE DATOS - RESUMEN

| Campo | Tipo SQL | Descripción | Ejemplo |
|-------|----------|-------------|---------|
| id | UUID | Identificador único | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| codigo | VARCHAR(10) | Código de obra | `"230"` |
| nombre | VARCHAR(255) | Nombre descriptivo | `"CASTELLO H"` |
| monto | DECIMAL(15,2) | Montos en pesos | `8500000.00` |
| fecha | DATE | Fechas | `'2026-01-15'` |
| timestamp | TIMESTAMP WITH TIME ZONE | Fecha/hora con zona horaria | `'2026-01-15 14:30:00-06'` |
| status | VARCHAR(20) con CHECK | Estado con validación | `'active'`, `'pending'` |
| avance | DECIMAL(5,2) | Porcentaje 0-100 | `80.50` |
| rfc | VARCHAR(13) | RFC mexicano | `'CMX850101ABC'` |
| telefono | VARCHAR(20) | Teléfono | `'(55) 5555-1234'` |
| correo | VARCHAR(255) | Email | `'correo@ejemplo.com'` |
| folio | VARCHAR(50) | Folios únicos | `'230-A01JR-CEMEX'` |

---

**Última actualización**: 2026-02-03  
**Versión**: 1.0
