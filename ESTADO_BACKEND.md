# 🔧 Estado del Backend y Compatibilidad

## Sistema de Gestión Empresarial IDP

**Fecha de Análisis:** Enero 2025  
**Versión del Sistema:** 1.0

---

## 📋 Resumen Ejecutivo

Este documento confirma el **estado actual del backend** del sistema y analiza su **compatibilidad con FastAPI y bases de datos SQL**.

---

## 🏗️ Arquitectura Actual del Backend

### Stack Implementado

```
BACKEND ACTUAL:
┌─────────────────────────────────────────────────┐
│           SUPABASE (Backend as a Service)        │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │   Supabase Edge Functions (Deno)       │    │
│  │   ─────────────────────────────────    │    │
│  │   • Runtime: Deno (TypeScript)         │    │
│  │   • Framework: Hono v3                 │    │
│  │   • Endpoint: /make-server-4298db9c/*  │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │   PostgreSQL Database                   │    │
│  │   ────────────────────────────────────  │    │
│  │   • Tabla: kv_store_4298db9c           │    │
│  │   • Tipo: Key-Value Store              │    │
│  │   • Esquema:                           │    │
│  │     - key: TEXT (PK)                   │    │
│  │     - value: JSONB                     │    │
│  │     - created_at: TIMESTAMP            │    │
│  │     - updated_at: TIMESTAMP            │    │
│  └────────────────────────────────────────┘    │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │   Supabase Storage (Opcional)           │    │
│  │   ────────────────────────────────────  │    │
│  │   • Bucket: make-4298db9c              │    │
│  │   • Para archivos/PDFs/imágenes        │    │
│  └────────────────────────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Componentes Existentes

#### 1. Servidor Hono (Edge Function)

**Ubicación**: `/supabase/functions/server/index.tsx`

**Tecnología**: 
- Hono (framework web minimalista para Deno/Cloudflare Workers)
- NO es FastAPI (FastAPI es Python)

**Código Actual**:
```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Health check
app.get("/make-server-4298db9c/health", (c) => {
  return c.json({ status: "ok" });
});

// Iniciar servidor
Deno.serve(app.fetch);
```

**Estado**: 
- ✅ Configurado y funcional
- ✅ CORS habilitado
- ⚠️ Solo tiene endpoint `/health`
- ❌ NO tiene rutas CRUD implementadas

#### 2. KV Store (Key-Value)

**Ubicación**: `/supabase/functions/server/kv_store.tsx`

**Funcionalidad**: Proporciona operaciones básicas sobre la tabla `kv_store_4298db9c`

**Métodos Disponibles**:
```typescript
// Obtener un valor por clave
get(key: string): Promise<any>

// Guardar un valor
set(key: string, value: any): Promise<void>

// Eliminar una clave
del(key: string): Promise<void>

// Obtener múltiples claves
mget(keys: string[]): Promise<any[]>

// Guardar múltiples valores
mset(entries: Record<string, any>): Promise<void>

// Eliminar múltiples claves
mdel(keys: string[]): Promise<void>

// Obtener por prefijo (ej: "obra_*")
getByPrefix(prefix: string): Promise<any[]>
```

**Limitaciones**:
- ❌ No tiene función `list()` genérica
- ❌ No soporta consultas complejas (JOIN, WHERE con condiciones múltiples)
- ⚠️ Almacena datos como JSON sin esquema estricto

#### 3. DataProvider (Frontend)

**Ubicación**: `/src/app/providers/`

**Estructura**:
```
providers/
├── DataProvider.interface.ts   # Interface CRUD completa
├── MockProvider.ts             # Implementación en memoria (ACTIVO)
├── ApiProvider.ts              # Implementación HTTP (INACTIVO)
├── mockData.ts                 # Datos de demostración
└── index.ts                    # Export del provider activo
```

**Provider Activo**: 
```typescript
// index.ts
export const dataProvider = MockProvider; // ✅ Modo MOCK activo
// export const dataProvider = ApiProvider; // ❌ Comentado
```

**Estado del ApiProvider**:
- ✅ Tiene estructura completa para llamadas HTTP
- ✅ Usa `fetch()` para conectar con backend
- ⚠️ Apunta a rutas que NO EXISTEN en el servidor actual:
  ```typescript
  // Ejemplos de rutas esperadas (NO implementadas):
  GET  /make-server-4298db9c/obras
  POST /make-server-4298db9c/obras
  GET  /make-server-4298db9c/proveedores
  POST /make-server-4298db9c/ordenes-compra
  ```

---

## ⚠️ Estado Actual: BACKEND INCOMPLETO

### ✅ Lo que SÍ funciona

1. **MockProvider** (Frontend):
   - Datos completos de demostración
   - 1 obra: CASTELLO E (227)
   - 10 proveedores documentados
   - Requisiciones, OCs, Pagos simulados
   - CRUD completo en memoria

2. **Supabase Edge Function** (Backend):
   - Servidor Hono desplegado
   - Endpoint `/health` funcional
   - CORS configurado
   - KV Store listo para usar

3. **Base de Datos**:
   - PostgreSQL de Supabase activo
   - Tabla `kv_store_4298db9c` creada
   - Funciones del KV Store operativas

### ❌ Lo que NO funciona

1. **Rutas CRUD en el Servidor**:
   - No existen endpoints para:
     - `/obras`
     - `/proveedores`
     - `/requisiciones`
     - `/ordenes-compra`
     - `/pagos`
     - `/destajos`
     - `/usuarios`

2. **Integración Frontend-Backend**:
   - ApiProvider no puede conectarse (rutas inexistentes)
   - Sistema funciona solo en modo MOCK

3. **Autenticación**:
   - No hay sistema de login implementado
   - No hay validación de tokens
   - No hay control de sesiones

---

## 🔄 Compatibilidad con FastAPI y SQL

### ❓ ¿Es compatible con FastAPI?

**Respuesta corta**: NO directamente, pero SÍ es migrable.

### Análisis Detallado

#### Situación Actual

```
STACK ACTUAL:
Frontend (React/TypeScript) 
    ↓ HTTP
Supabase Edge Functions (Deno/Hono/TypeScript)
    ↓ SQL
PostgreSQL (Supabase)
```

#### Stack Propuesto (FastAPI)

```
STACK CON FASTAPI:
Frontend (React/TypeScript) 
    ↓ HTTP
FastAPI (Python)
    ↓ ORM (SQLAlchemy/Prisma)
PostgreSQL (Supabase o cualquier servidor)
```

### Comparación Técnica

| Característica | Hono (Actual) | FastAPI (Propuesto) |
|----------------|---------------|---------------------|
| **Lenguaje** | TypeScript/Deno | Python |
| **Runtime** | Deno | Python 3.10+ |
| **Performance** | Muy alta (Edge) | Alta |
| **Hosting** | Supabase Edge Functions | Render/Heroku/Railway/AWS |
| **ORM** | Manual (KV Store) | SQLAlchemy/Tortoise/Prisma |
| **Tipado** | TypeScript nativo | Pydantic |
| **Validación** | Manual | Automática (Pydantic) |
| **Docs** | Manual | Auto-generada (OpenAPI/Swagger) |
| **Madurez** | Nuevo | Muy maduro |
| **Ecosistema** | Creciendo | Enorme |

### 🔀 Estrategias de Migración

#### Opción 1: Mantener Supabase + Implementar Rutas Hono

**Ventajas**:
- ✅ Sin cambio de infraestructura
- ✅ Continúa usando Supabase gratis
- ✅ Edge Functions (baja latencia)
- ✅ TypeScript end-to-end

**Desventajas**:
- ❌ Hono es menos maduro que FastAPI
- ❌ Ecosistema limitado
- ❌ Documentación menos extensa

**Pasos**:
1. Implementar rutas CRUD en `/supabase/functions/server/index.tsx`
2. Usar KV Store o crear tablas SQL reales
3. Activar ApiProvider en frontend

**Estimado**: 2-3 semanas de desarrollo

#### Opción 2: Migrar a FastAPI + PostgreSQL

**Ventajas**:
- ✅ FastAPI es estándar de industria
- ✅ ORM robusto (SQLAlchemy)
- ✅ Validación automática (Pydantic)
- ✅ Documentación auto-generada
- ✅ Ecosistema Python enorme

**Desventajas**:
- ❌ Requiere servidor dedicado (Render/AWS)
- ❌ Cambio de lenguaje (TypeScript → Python)
- ❌ Costos de hosting

**Pasos**:
1. Crear proyecto FastAPI desde cero
2. Definir modelos SQLAlchemy
3. Implementar rutas CRUD
4. Migrar datos del KV Store a tablas SQL
5. Actualizar ApiProvider para apuntar a nuevo backend
6. Desplegar en Render/Railway

**Estimado**: 3-4 semanas de desarrollo

#### Opción 3: Híbrido (Supabase DB + FastAPI API)

**Ventajas**:
- ✅ FastAPI para lógica de negocio
- ✅ PostgreSQL gratis de Supabase
- ✅ Sin costo de base de datos

**Desventajas**:
- ⚠️ Dos servicios separados
- ⚠️ Configuración de conexión externa

**Pasos**:
1. Crear FastAPI en Render
2. Conectar a PostgreSQL de Supabase (connection string)
3. Implementar modelos y rutas
4. Actualizar frontend

**Estimado**: 3 semanas de desarrollo

---

## 📊 Esquema SQL Propuesto (Para FastAPI)

Si se migra a FastAPI con SQL tradicional, estas serían las tablas:

### Tabla: obras

```sql
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  numero_contrato VARCHAR(100) UNIQUE NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  residente VARCHAR(255) NOT NULL,
  direccion TEXT,
  monto_contratado DECIMAL(15, 2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin_programada DATE NOT NULL,
  plazo_ejecucion INTEGER NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('activa', 'suspendida', 'terminada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: proveedores

```sql
CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
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
```

### Tabla: requisiciones

```sql
CREATE TABLE requisiciones (
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
```

### Tabla: requisicion_items

```sql
CREATE TABLE requisicion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicion_id UUID NOT NULL REFERENCES requisiciones(id) ON DELETE CASCADE,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  descripcion TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: ordenes_compra

```sql
CREATE TABLE ordenes_compra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_orden VARCHAR(50) UNIQUE NOT NULL,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
  requisicion_id UUID REFERENCES requisiciones(id) ON DELETE SET NULL,
  fecha_emision TIMESTAMP DEFAULT NOW(),
  fecha_entrega DATE NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('borrador', 'emitida', 'recibida', 'facturada', 'pagada', 'cancelada')),
  tipo_entrega VARCHAR(50) CHECK (tipo_entrega IN ('en_obra', 'bodega', 'recoger')),
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
```

### Tabla: orden_compra_items

```sql
CREATE TABLE orden_compra_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  cantidad DECIMAL(10, 2) NOT NULL,
  unidad VARCHAR(20) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_unitario DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: pagos

```sql
CREATE TABLE pagos (
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
  comprobante TEXT,
  observaciones TEXT,
  procesado_por VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: destajos

```sql
CREATE TABLE destajos (
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
```

### Tabla: usuarios

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'residente', 'compras', 'pagos')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Recomendación Final

### Para Producción Inmediata (1-2 semanas)

**Opción**: Implementar rutas en Hono (Opción 1)

**Razones**:
- ✅ Más rápido (ya está configurado)
- ✅ Sin costo adicional (Supabase gratuito)
- ✅ TypeScript consistente
- ✅ Menos cambios en infraestructura

**Entregables**:
1. Rutas CRUD completas en `/supabase/functions/server/index.tsx`
2. Migración de MockData a KV Store o tablas SQL
3. Activación de ApiProvider
4. Testing completo

### Para Escalabilidad a Largo Plazo (3-4 semanas)

**Opción**: Migrar a FastAPI + PostgreSQL (Opción 2 o 3)

**Razones**:
- ✅ Estándar de industria
- ✅ Mejor para equipos Python
- ✅ Documentación automática
- ✅ ORM robusto
- ✅ Ecosistema maduro

**Entregables**:
1. Backend FastAPI completo
2. Modelos SQLAlchemy
3. Endpoints con validación Pydantic
4. Swagger/OpenAPI docs
5. Tests unitarios
6. Despliegue en Render

---

## 📞 Próximos Pasos

1. **Decidir** qué opción de backend implementar
2. **Planificar** el sprint de desarrollo
3. **Asignar recursos** (desarrollador backend)
4. **Implementar** endpoints CRUD
5. **Probar** integración frontend-backend
6. **Desplegar** a producción

---

**Fin del Documento de Estado del Backend**
