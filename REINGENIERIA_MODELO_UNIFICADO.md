# 🔄 REINGENIERÍA DEL MODELO UNIFICADO

## 🎯 OBJETIVO

Eliminar TODAS las inconsistencias entre capas y dejar UN SOLO MODELO DE DOMINIO funcionando end-to-end:

```
UI (React) → API (FastAPI) → Supabase (PostgreSQL) → API → UI
```

---

## ❌ PROBLEMA ACTUAL

**INCONSISTENCIA CRÍTICA**:

| Capa | Campos |
|------|--------|
| **Frontend** | `code`, `name`, `status` (inglés) |
| **Backend + SQL** | `codigo`, `nombre`, `estado` (español) |

Esto impide que el sistema funcione correctamente end-to-end.

---

## ✅ SOLUCIÓN: MODELO UNIFICADO

### Decisión Arquitectónica:

**Usar el modelo del backend/SQL como verdad única**:

- UUID como IDs
- Campos en español: `codigo`, `nombre`, `estado`
- camelCase en TypeScript: `numeroContrato`, `razonSocial`
- Estados coinciden con SQL CHECK constraints

---

## 📋 PLAN DE REINGENIERÍA

### 1. TIPOS (entities.ts) ✅

**Archivo**: `/src/app/types/entities.ts`

**Cambios**:
- `code` → `codigo`
- `name` → `nombre`
- `status` → `estado`
- Todos los enums coinciden con SQL CHECK

**Resultado**: Modelo TypeScript alineado 100% con SQL

---

### 2. DATA PROVIDER INTERFACE ✅

**Archivo**: `/src/app/providers/DataProvider.interface.ts`

**Cambios**:
- Métodos CRUD estándar
- Sin traducciones
- Tipos del modelo unificado

---

### 3. API PROVIDER ✅

**Archivo**: `/src/app/providers/ApiProvider.ts`

**Cambios**:
- Endpoints correctos (`/api/obras`, `/api/proveedores`, etc.)
- Sin fallback a mock/localStorage
- Sin conversiones de datos
- Conexión directa al backend

---

### 4. MOCK PROVIDER ✅

**Archivo**: `/src/app/providers/MockProvider.ts`

**Cambios**:
- Usa modelo unificado
- Solo activo si `VITE_DATA_MODE=mock`
- Sin persistencia

---

### 5. ARCHIVO _redirects ✅

**Archivo**: `/public/_redirects`

**Cambios**:
- Eliminado carpeta `/public/_redirects/`
- Eliminado `/public/_redirects.txt`
- Creado `/public/_redirects` correcto

**Contenido**:
```
/*    /index.html   200
```

---

### 6. COMPONENTES DEL FRONTEND (PENDIENTE)

**Archivos a actualizar**:
- `/src/app/PurchaseOrderManagement.tsx`
- `/src/app/components/PurchaseOrderForm.tsx`
- `/src/app/components/WorkForm.tsx`
- `/src/app/GlobalDashboard.tsx`
- `/src/app/Home.tsx`

**Cambios**:
- Actualizar todas las referencias a propiedades del modelo
- `order.code` → `order.codigo`
- `order.name` → `order.nombre`
- `order.status` → `order.estado`

---

### 7. BACKEND FastAPI (VERIFICACIÓN PENDIENTE)

**Archivo**: `/backend/main.py`

**Verificar**:
- CORS correcto (sin wildcard con credentials)
- Conexión Supabase con sslmode=require
- Endpoints consistentes con SQL
- Respuestas paginadas correctas

---

## 📊 PROGRESO

| Tarea | Estado |
|-------|--------|
| 1. Tipos unificados | ✅ COMPLETADO |
| 2. DataProvider interface | ✅ COMPLETADO |
| 3. ApiProvider | ✅ COMPLETADO |
| 4. MockProvider | ✅ COMPLETADO |
| 5. providers/index.ts | ✅ COMPLETADO |
| 6. Archivo _redirects | ✅ COMPLETADO |
| 7. Componentes frontend | 🔄 EN PROGRESO |
| 8. Verificar backend | ⏳ PENDIENTE |
| 9. Pruebas end-to-end | ⏳ PENDIENTE |

---

## 🎯 RESULTADO ESPERADO

Sistema funcionando con:

1. ✅ Un solo modelo de datos
2. ✅ Sin traducciones innecesarias
3. ✅ Frontend → Backend → SQL coherente
4. ✅ Persistencia real en Supabase
5. ✅ Crear → Refrescar → Los datos persisten
6. ✅ PDF funcionando correctamente

---

**Estado**: 🔄 **REINGENIERÍA EN PROGRESO**

**Próximo paso**: Actualizar componentes del frontend
