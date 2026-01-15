# 🏗️ Sistema de Gestión IDP Construcción

## ⚡ VERSIÓN 2.0 - MODELO UNIFICADO

Sistema integral de gestión empresarial para IDP Construcción, Consultoría y Diseño con **modelo de dominio único y congruente** en las tres capas: Base de Datos, Backend y Frontend.

---

## 🎯 ¿Qué es este sistema?

Sistema ERP completo para gestión de construcción con:
- ✅ **Base de Datos**: PostgreSQL con UUIDs y tablas normalizadas
- ✅ **Backend**: FastAPI con Pydantic (modelos unificados)
- ✅ **Frontend**: React + TypeScript (tipos alineados 100%)
- ✅ **Modelo Único**: Un solo esquema que gobierna las 3 capas

---

## 📊 Arquitectura del Modelo Unificado

```
Frontend (React + TypeScript)
    ↓ camelCase, UUID strings
  API REST
    ↓
Backend (FastAPI + Pydantic)
    ↓ camelCase DTOs, UUID natives
  PostgreSQL
    ↓
Base de Datos (PostgreSQL)
    ↓ snake_case, UUID PRIMARY KEYS
  Tablas Normalizadas + Triggers
```

### Decisiones de Diseño

| Aspecto | Decisión | Razón |
|---------|----------|-------|
| **IDs** | UUID (universal) | Escalabilidad, distribución, seguridad |
| **Items** | Tablas normalizadas | Integridad, eficiencia, reportes |
| **Nomenclatura** | snake_case (BD), camelCase (código) | Estándares de cada tecnología |
| **Cálculos** | Triggers automáticos en BD | Consistencia, rendimiento |
| **Relaciones** | Foreign Keys UUID | Integridad referencial |

---

## 🚀 Quick Start

### Requisitos

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+

### Instalación

#### 1. Frontend

```bash
npm install
npm run dev
# → http://localhost:5173
```

#### 2. Backend

```bash
cd backend
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
# Editar DATABASE_* con tus credenciales

python main.py
# → http://localhost:8000
```

#### 3. Base de Datos

```bash
# Crear base de datos
createdb idp_construccion

# Aplicar esquema unificado
psql -U postgres -d idp_construccion -f backend/schema_unificado.sql
```

---

## 📁 Estructura del Proyecto

```
/
├── backend/
│   ├── schema_unificado.sql       # ⭐ Esquema PostgreSQL unificado
│   ├── models.py                  # ⭐ Modelos Pydantic (DTOs)
│   ├── main_unificado.py          # ⭐ API FastAPI completa
│   ├── migration_script.sql       # Script de migración de datos
│   ├── requirements.txt
│   └── .env.example
│
├── src/
│   ├── types/
│   │   └── index.ts               # ⭐ Tipos TypeScript unificados
│   ├── services/
│   │   ├── api.ts                 # Endpoints CRUD
│   │   ├── apiClient.ts           # Cliente HTTP
│   │   └── database.ts            # Adaptador (API + fallback)
│   ├── app/
│   │   ├── Home.tsx
│   │   ├── GlobalDashboard.tsx
│   │   ├── PurchaseOrderManagement.tsx
│   │   └── ...
│   └── data/                      # JSON de fallback (modo demo)
│
├── public/
│   ├── _redirects                 # Para React Router en Render
│   └── *.svg                      # Logos
│
├── UNIFICACION-COMPLETADA.md      # ⭐ Resumen ejecutivo
├── MIGRACION-MODELO-UNIFICADO.md  # ⭐ Guía de migración
└── README.md                       # Este archivo
```

---

## 📚 Documentación Completa

### Para Empezar

1. **[UNIFICACION-COMPLETADA.md](./UNIFICACION-COMPLETADA.md)**
   - Resumen ejecutivo de la unificación
   - Decisiones de diseño
   - Comparación antes/después
   - Estado actual del sistema

2. **[MIGRACION-MODELO-UNIFICADO.md](./MIGRACION-MODELO-UNIFICADO.md)**
   - Guía completa de migración
   - Pasos detallados (completa y gradual)
   - Scripts de ejemplo
   - Troubleshooting

3. **[DOCUMENTACION_SISTEMA.md](./DOCUMENTACION_SISTEMA.md)**
   - Arquitectura del sistema
   - Módulos y funcionalidades
   - Flujos de trabajo

---

## 🔄 Modelo Unificado en Acción

### Ejemplo: Crear Requisición con Items

```typescript
// Frontend (TypeScript)
const requisicion: RequisicionCreate = {
  numero_requisicion: "REQ-227-001",
  obra_id: "uuid-obra",
  residente: "Ing. Juan Pérez",
  urgencia: "Normal",
  items: [
    {
      descripcion: "Cemento",
      cantidad: 100,
      unidad: "bulto",
      precio_unitario_estimado: 150
    }
  ]
};

await requisicionesAPI.create(requisicion);
```

```python
# Backend (Pydantic)
@app.post("/api/requisiciones")
async def create_requisicion(req: RequisicionCreate):
    # Validación automática con Pydantic
    # Inserción en PostgreSQL
    # Trigger calcula total automáticamente
    return nueva_requisicion
```

```sql
-- Base de Datos (PostgreSQL)
-- Trigger automático calcula total
CREATE TRIGGER trigger_calcular_total_requisicion
    AFTER INSERT ON requisicion_items
    FOR EACH ROW 
    EXECUTE FUNCTION calcular_total_requisicion();

-- Resultado:
-- requisiciones.total = suma(requisicion_items.total_estimado)
```

---

## 🌐 API Endpoints

### Obras

```
GET    /api/obras
GET    /api/obras/{codigo}
POST   /api/obras
PUT    /api/obras/{codigo}
DELETE /api/obras/{codigo}
```

### Proveedores

```
GET    /api/proveedores
GET    /api/proveedores/{id}
POST   /api/proveedores
PUT    /api/proveedores/{id}
DELETE /api/proveedores/{id}
```

### Requisiciones (con items normalizados)

```
GET    /api/requisiciones
GET    /api/requisiciones/{id}        # Incluye array de items
POST   /api/requisiciones              # Crea requisición + items
PUT    /api/requisiciones/{id}
DELETE /api/requisiciones/{id}         # CASCADE a items
```

### Órdenes de Compra (con items normalizados)

```
GET    /api/ordenes-compra
GET    /api/ordenes-compra/{id}       # Incluye array de items
POST   /api/ordenes-compra            # Trigger calcula totales
PUT    /api/ordenes-compra/{id}
DELETE /api/ordenes-compra/{id}       # CASCADE a items
```

### Pagos (actualiza OC automáticamente)

```
GET    /api/pagos
GET    /api/pagos/{id}
POST   /api/pagos                     # Trigger actualiza OC
DELETE /api/pagos/{id}                # Trigger revierte OC
```

### Destajos

```
GET    /api/destajos
POST   /api/destajos
```

### Vistas y Estadísticas

```
GET    /api/vistas/ordenes-completas
GET    /api/vistas/resumen-obras
GET    /api/dashboard/estadisticas
```

### Utilidades

```
GET    /health                        # Health check
GET    /docs                          # Swagger UI
```

---

## 🔧 Características del Modelo Unificado

### ✅ Integridad de Datos

- **UUIDs** como IDs en todas las tablas
- **Foreign Keys** para todas las relaciones
- **CHECK constraints** para estados válidos
- **NOT NULL** en campos obligatorios
- **CASCADE** en eliminaciones donde corresponde

### ✅ Cálculos Automáticos (Triggers)

- **Total de requisiciones**: Se calcula desde items
- **Total de órdenes de compra**: Se calcula desde items + IVA - descuento
- **Estado de pago de OC**: Se actualiza al registrar/eliminar pagos
- **Saldo pendiente**: Se mantiene actualizado automáticamente

### ✅ Rendimiento

- **Índices** en todos los campos de búsqueda/filtro
- **GIN indexes** para búsquedas de texto (pg_trgm)
- **Vistas** pre-calculadas para queries complejas
- **Paginación** en todos los endpoints

### ✅ Validación en 3 Niveles

1. **PostgreSQL**: Constraints, tipos, foreign keys
2. **Pydantic**: Validación de DTOs en backend
3. **TypeScript**: Tipos estrictos en frontend

---

## 🧪 Verificación

### Health Check

```bash
curl http://localhost:8000/health
```

Debe responder:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "database": "connected",
  "model": "unified",
  "id_type": "UUID"
}
```

### Probar Triggers

```bash
# 1. Crear requisición con items
curl -X POST http://localhost:8000/api/requisiciones \
  -H "Content-Type: application/json" \
  -d '{"numero_requisicion": "TEST-001", "obra_id": "...", "items": [...]}'

# 2. Verificar que el total se calculó automáticamente
curl http://localhost:8000/api/requisiciones/{id}
# total debe ser la suma de items.total_estimado

# 3. Crear pago
curl -X POST http://localhost:8000/api/pagos -d '{...}'

# 4. Verificar que la OC se actualizó
curl http://localhost:8000/api/ordenes-compra/{id}
# monto_pagado, saldo_pendiente, estado_pago deben estar actualizados
```

---

## 📈 Migración desde Modelo Antiguo

Si tienes datos en el modelo anterior (SERIAL/JSONB):

1. **Hacer backup**:
   ```bash
   pg_dump -U postgres -d idp_construccion > backup.sql
   ```

2. **Aplicar nuevo esquema**:
   ```bash
   psql -U postgres -d idp_construccion -f backend/schema_unificado.sql
   ```

3. **Migrar datos**:
   ```bash
   # Ajustar migration_script.sql según tus datos
   psql -U postgres -d idp_construccion -f backend/migration_script.sql
   ```

4. **Verificar**:
   - Conteos de registros
   - Totales calculados
   - Estados actualizados

Ver guía completa en [MIGRACION-MODELO-UNIFICADO.md](./MIGRACION-MODELO-UNIFICADO.md)

---

## 🚀 Deploy en Render

### 1. Base de Datos

```
Crear PostgreSQL en Render
Aplicar schema_unificado.sql
Obtener DATABASE_URL
```

### 2. Backend

```
Crear Web Service
Runtime: Python 3
Build: pip install -r backend/requirements.txt
Start: python backend/main_unificado.py
Variables de entorno: DATABASE_*
```

### 3. Frontend

```
Crear Static Site
Build: npm install && npm run build
Publish: dist
Variables de entorno: VITE_API_URL
```

---

## 🛠️ Scripts Disponibles

### Frontend

```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Build para producción
npm run preview  # Preview del build local
```

### Backend

```bash
python main_unificado.py              # Ejecutar servidor
uvicorn main_unificado:app --reload   # Con hot-reload
```

---

## 📊 Estado del Proyecto

✅ Modelo unificado completo  
✅ UUIDs en todas las capas  
✅ Tablas normalizadas  
✅ Triggers automáticos  
✅ Validación completa  
✅ Tipos alineados 100%  
✅ Documentación completa  
✅ Scripts de migración  
✅ Listo para producción  

---

## 📞 Soporte

- **Instalación**: Ver este README
- **Migración**: Ver [MIGRACION-MODELO-UNIFICADO.md](./MIGRACION-MODELO-UNIFICADO.md)
- **Arquitectura**: Ver [DOCUMENTACION_SISTEMA.md](./DOCUMENTACION_SISTEMA.md)
- **Resumen**: Ver [UNIFICACION-COMPLETADA.md](./UNIFICACION-COMPLETADA.md)

---

**Sistema IDP Construcción v2.0 - Modelo Unificado**  
**Stack**: PostgreSQL + FastAPI + React + TypeScript  
**Última actualización**: Enero 2025  
**Estado**: ✅ Producción Ready