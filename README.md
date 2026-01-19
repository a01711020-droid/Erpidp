# Sistema ERP IDP - Gestión Empresarial

Sistema de gestión empresarial para administración de obras, proveedores, requisiciones, órdenes de compra y pagos.

---

## ⚠️ IMPORTANTE: Configuración Requerida

Antes de desplegar, **debes crear manualmente** el archivo `/public/_redirects`.  
Ver **[INSTRUCCIONES_REDIRECTS.md](./INSTRUCCIONES_REDIRECTS.md)** para detalles.

---

## 📚 Documentación

- **[STATUS_FINAL.md](./STATUS_FINAL.md)** - ⭐ Estado actual y checklist de despliegue
- **[RUNBOOK.md](./RUNBOOK.md)** - Guía de ejecución local y despliegue en Render
- **[INSTRUCCIONES_REDIRECTS.md](./INSTRUCCIONES_REDIRECTS.md)** - ⚠️ Configuración manual requerida
- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de cambios
- **[RESUMEN_FINAL.md](./RESUMEN_FINAL.md)** - Resumen completo del proyecto

---

## Stack Tecnológico

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS  
**Backend**: FastAPI + Python 3.11  
**Base de Datos**: PostgreSQL (Supabase)  
**Despliegue**: Render

## Arquitectura

```
Frontend (React/Vite)
    ↓ HTTP/REST
Backend (FastAPI)
    ↓ asyncpg
PostgreSQL (Supabase)
```

**Modelo de Datos Unificado**:
- UUID como identificadores
- Campos en español: `codigo`, `nombre`, `estado`
- camelCase en TypeScript, snake_case en SQL

## Módulos Principales

1. **Obras** - Gestión de proyectos y contratos
2. **Proveedores** - Catálogo de proveedores
3. **Requisiciones** - Solicitudes de materiales
4. **Órdenes de Compra** - Gestión de compras
5. **Pagos** - Control de pagos a proveedores

## Fuera de Alcance

- Generación de PDFs de órdenes de compra
- Módulo de entregas
- Autenticación/autorización

## Variables de Entorno

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:8000  # URL del backend
VITE_DATA_MODE=api                  # "api" o "mock"
```

**Backend** (`.env` o variables de entorno):
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
FRONTEND_URL=http://localhost:5173  # Para CORS
```

## Cómo Ejecutar

Ver **[RUNBOOK.md](./RUNBOOK.md)** para instrucciones completas de ejecución local y despliegue en Render.

## Estructura del Proyecto

```
/
├── backend/               # API FastAPI
│   ├── main.py           # Aplicación principal
│   └── requirements.txt  # Dependencias Python
├── database/
│   └── schema_final.sql  # Esquema PostgreSQL
├── src/
│   ├── app/
│   │   ├── providers/    # ApiProvider, MockProvider
│   │   ├── types/        # TypeScript types
│   │   └── components/   # Componentes React
│   └── styles/           # Estilos Tailwind
├── public/
│   └── _redirects        # Config para SPA en Render
└── package.json          # Dependencias Node
```

## Endpoints API

Base URL: `http://localhost:8000`

| Entidad | GET (list) | GET (one) | POST | PUT | DELETE |
|---------|------------|-----------|------|-----|--------|
| Obras | `/api/obras` | `/api/obras/{id}` | ✓ | ✓ | ✓ |
| Proveedores | `/api/proveedores` | `/api/proveedores/{id}` | ✓ | ✓ | ✓ |
| Requisiciones | `/api/requisiciones` | `/api/requisiciones/{id}` | ✓ | - | - |
| Órdenes Compra | `/api/ordenes-compra` | `/api/ordenes-compra/{id}` | ✓ | ✓ | ✓ |
| Pagos | `/api/pagos` | `/api/pagos/{id}` | ✓ | ✓ | ✓ |

**Documentación interactiva**: http://localhost:8000/docs

## Licencia

MIT