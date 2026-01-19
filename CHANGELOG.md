# CHANGELOG

## [1.0.0] - 2025-01-19

### ✅ Sistema Operativo End-to-End

Sistema ERP completo con persistencia real en PostgreSQL/Supabase.

### Correcciones de Integración

**Backend**:
- ✅ CORS configurado correctamente (sin `*` con credentials)
- ✅ Soporte automático para Supabase (`sslmode=require`)
- ✅ Endpoints CRUD completos para todas las entidades
- ✅ Respuestas paginadas correctas

**Frontend**:
- ✅ ApiProvider con conversión snake_case → camelCase
- ✅ Archivo `_redirects` correcto para SPA en Render
- ✅ Modelo unificado (codigo, nombre, estado)
- ✅ Sin fallbacks a mock/localStorage

**Base de Datos**:
- ✅ Schema SQL final con UUID
- ✅ Relaciones normalizadas
- ✅ Triggers para updated_at
- ✅ Datos de prueba (seed)

### Documentación

- ✅ README.md - Descripción del proyecto
- ✅ RUNBOOK.md - Guía de ejecución
- ✅ Eliminados 21 archivos .md redundantes

### Módulos Implementados

1. **Obras** - Gestión de proyectos
2. **Proveedores** - Catálogo de proveedores  
3. **Requisiciones** - Solicitudes de material
4. **Órdenes de Compra** - Gestión de compras
5. **Pagos** - Control de pagos

### Fuera de Alcance

- Generación de PDFs
- Módulo de entregas
- Autenticación/autorización

### Stack Tecnológico

- React 18 + TypeScript + Vite
- FastAPI + Python 3.11
- PostgreSQL (Supabase)
- Tailwind CSS
- asyncpg
