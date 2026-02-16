# ESQUEMA DE DATOS Y SQL - ERP CONSTRUCTORA IDP

Este documento define la arquitectura de datos completa para el sistema, incluyendo las tablas necesarias para Obras, Usuarios, Requisiciones y el módulo de Gestión de Personal recientemente rediseñado.

Debido a que el sistema utiliza **Supabase KV Store**, este esquema sirve como:
1. **Referencia Lógica**: Definición de entidades y relaciones.
2. **Referencia SQL**: Código DDL para un eventual paso a base de datos relacional.
3. **Estructura JSON**: Formato de los objetos a guardar en el KV Store.

---

## 1. CÓDIGO SQL (DDL)

Copie y pegue este código en el SQL Editor de Supabase si decide migrar a tablas relacionales en el futuro. Para el sistema actual (Make/KV Store), utilice estas definiciones para estructurar sus objetos JSON.

```sql
-- 1. USUARIOS (Usuarios del Sistema)
CREATE TABLE usuarios (
  usuario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre_completo VARCHAR(255) NOT NULL,
  rol VARCHAR(50) CHECK (rol IN ('admin', 'gerente', 'residente', 'comprador', 'contador', 'auditor')),
  obras_asignadas TEXT[], -- Array de IDs de obras
  activo BOOLEAN DEFAULT TRUE,
  ultimo_acceso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OBRAS (Proyectos)
CREATE TABLE obras (
  obra_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_obra VARCHAR(20) UNIQUE NOT NULL, -- Ej: 228
  nombre_obra VARCHAR(255) NOT NULL,
  numero_contrato VARCHAR(100),
  cliente VARCHAR(255),
  residente VARCHAR(255),
  direccion TEXT,
  monto_contratado DECIMAL(15, 2) DEFAULT 0,
  fecha_inicio DATE,
  fecha_fin_programada DATE,
  estado VARCHAR(50) CHECK (estado IN ('activa', 'suspendida', 'terminada', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROVEEDORES
CREATE TABLE proveedores (
  proveedor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
  nombre_comercial VARCHAR(255),
  rfc VARCHAR(20) UNIQUE NOT NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  email VARCHAR(255),
  banco VARCHAR(100),
  numero_cuenta VARCHAR(50),
  clabe VARCHAR(20),
  dias_credito INTEGER DEFAULT 0,
  limite_credito DECIMAL(15, 2) DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REQUISICIONES
CREATE TABLE requisiciones (
  requisicion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID REFERENCES obras(obra_id),
  solicitado_por UUID REFERENCES usuarios(usuario_id),
  fecha_solicitud DATE NOT NULL,
  fecha_requerida DATE,
  urgencia VARCHAR(20) CHECK (urgencia IN ('normal', 'urgente', 'muy_urgente')),
  estado VARCHAR(20) CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada')),
  observaciones TEXT,
  aprobado_por UUID REFERENCES usuarios(usuario_id),
  fecha_aprobacion TIMESTAMPTZ,
  motivo_rechazo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE requisicion_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicion_id UUID REFERENCES requisiciones(requisicion_id) ON DELETE CASCADE,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  descripcion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ÓRDENES DE COMPRA
CREATE TABLE ordenes_compra (
  orden_compra_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID REFERENCES obras(obra_id),
  proveedor_id UUID REFERENCES proveedores(proveedor_id),
  requisicion_id UUID REFERENCES requisiciones(requisicion_id),
  fecha_emision DATE NOT NULL,
  fecha_entrega DATE,
  estado VARCHAR(20) CHECK (estado IN ('borrador', 'emitida', 'recibida', 'facturada', 'pagada', 'cancelada')),
  tipo_entrega VARCHAR(20),
  subtotal DECIMAL(15, 2) DEFAULT 0,
  iva DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) DEFAULT 0,
  observaciones TEXT,
  creado_por UUID REFERENCES usuarios(usuario_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orden_compra_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_compra_id UUID REFERENCES ordenes_compra(orden_compra_id) ON DELETE CASCADE,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_unitario DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERSONAL (NUEVO MÓDULO)
CREATE TABLE personal (
  personal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo VARCHAR(255) NOT NULL,
  puesto VARCHAR(100) NOT NULL,
  obra_default_id UUID REFERENCES obras(obra_id), -- Obra asignada por defecto
  salario_diario DECIMAL(10, 2) NOT NULL,
  dias_semana_base DECIMAL(3, 1) DEFAULT 6, -- Días laborables por semana (5 o 6)
  banco VARCHAR(100),
  numero_cuenta VARCHAR(50),
  observaciones TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NÓMINA SEMANAL (Histórico de pagos)
CREATE TABLE nomina_semanal (
  nomina_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_id UUID REFERENCES personal(personal_id),
  obra_id UUID REFERENCES obras(obra_id), -- Obra donde trabajó esa semana
  semana INTEGER NOT NULL, -- 1-52
  anio INTEGER NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  dias_trabajados DECIMAL(3, 1) NOT NULL,
  salario_diario DECIMAL(10, 2) NOT NULL, -- Snapshot del salario en ese momento
  importe_pagado DECIMAL(10, 2) NOT NULL,
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'pagado',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAGOS A PROVEEDORES
CREATE TABLE pagos (
  pago_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pago VARCHAR(50) UNIQUE,
  obra_id UUID REFERENCES obras(obra_id),
  proveedor_id UUID REFERENCES proveedores(proveedor_id),
  orden_compra_id UUID REFERENCES ordenes_compra(orden_compra_id),
  monto DECIMAL(15, 2) NOT NULL,
  metodo_pago VARCHAR(50),
  fecha_programada DATE,
  fecha_procesado TIMESTAMPTZ,
  estado VARCHAR(20) CHECK (estado IN ('programado', 'procesando', 'completado', 'cancelado')),
  referencia_bancaria VARCHAR(100),
  comprobante_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. ESTRUCTURA PARA KV STORE (JSON)

Al usar el KV Store, utilizaremos las siguientes claves y estructuras JSON.

### Claves y Prefijos

| Entidad | Prefijo de Clave | Ejemplo |
|---------|------------------|---------|
| Usuario | `user:` | `user:uuid-1234` |
| Obra | `project:` | `project:uuid-5678` |
| Personal | `staff:` | `staff:uuid-9012` |
| Nómina | `payroll:` | `payroll:uuid-3456` |
| Requisición | `req:` | `req:uuid-7890` |
| Orden Compra | `po:` | `po:uuid-2468` |
| Proveedor | `supplier:` | `supplier:uuid-1357` |
| Pago | `payment:` | `payment:uuid-8642` |

### Índices (Listas de IDs)

Para poder listar los elementos, mantenemos claves especiales que contienen arrays de IDs:

*   `user:ids`: `["uuid-1", "uuid-2"]`
*   `project:ids`: `["uuid-5", "uuid-6"]`
*   `staff:ids`: `["uuid-9", "uuid-0"]`
*   `req:project:{projectId}`: `["uuid-req-1", "uuid-req-2"]` (Índice por proyecto)
*   `payroll:staff:{staffId}`: `["uuid-pay-1", "uuid-pay-2"]` (Índice por empleado)

### Interfaces TypeScript (JSON Data)

```typescript
// PERSONAL (Empleados)
interface Personal {
  id: string;
  nombreCompleto: string;
  puesto: string;
  obraDefaultId: string; // Relación con Project
  salarioDiario: number;
  diasSemanaBase: number;
  banco?: string;
  numeroCuenta?: string;
  observaciones?: string;
  activo: boolean;
  createdAt: string;
}

// NÓMINA (Registro Semanal)
interface NominaSemanal {
  id: string;
  personalId: string;
  obraId: string;
  semana: number;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  diasTrabajados: number;
  salarioDiario: number;
  importePagado: number;
  observaciones?: string;
  estado: 'pagado' | 'pendiente';
}

// USUARIO
interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'residente' | 'auditor';
  obrasIds: string[]; // Obras a las que tiene acceso
  activo: boolean;
}

// OBRA
interface Obra {
  id: string;
  codigo: string;
  nombre: string;
  cliente: string;
  residente: string; // Nombre o ID de usuario
  montoContratado: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activa' | 'suspendida' | 'terminada';
}
```
