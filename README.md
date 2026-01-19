# Sistema ERP IDP

Sistema de gestión empresarial para administración de obras, proveedores, requisiciones, órdenes de compra y pagos.

**Estado**: 🟢 PRODUCCIÓN | **Versión**: 1.0.0 | [Ver cierre del proyecto →](./SISTEMA_CERRADO.md)

---

## ⚠️ ACCIÓN REQUERIDA ANTES DE DESPLEGAR

El archivo `/public/_redirects` debe convertirse de carpeta a archivo simple.  
Ver instrucciones en **[RUNBOOK.md](./RUNBOOK.md)** (sección superior).

---

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **Base de Datos**: PostgreSQL (Supabase)

## Arquitectura

```
Frontend (React + Vite)
    ↓ HTTP/REST
Backend (FastAPI)
    ↓ asyncpg
PostgreSQL (Supabase)
```

**Modelo Unificado**: UUID, campos en español (`codigo`, `nombre`, `estado`)

## Módulos Incluidos

1. **Obras** - Gestión de proyectos y contratos
2. **Proveedores** - Catálogo de proveedores
3. **Requisiciones** - Solicitudes de materiales
4. **Órdenes de Compra** - Gestión de compras
5. **Pagos** - Control de pagos a proveedores

## NO Incluido

- Generación de PDFs
- Módulo de entregas
- Autenticación/autorización

## Variables de Entorno

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:8000
VITE_DATA_MODE=api
```

**Backend** (`.env`):
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
FRONTEND_URL=http://localhost:5173
```

## Cómo Ejecutar

Ver **[RUNBOOK.md](./RUNBOOK.md)** para instrucciones completas.

## API Endpoints

Base: `http://localhost:8000`

- `GET/POST/PUT/DELETE /api/obras`
- `GET/POST/PUT/DELETE /api/proveedores`
- `GET/POST /api/requisiciones`
- `GET/POST/PUT/DELETE /api/ordenes-compra`
- `GET/POST/PUT/DELETE /api/pagos`

**Docs interactivos**: http://localhost:8000/docs

## Estructura

```
/
├── backend/           # API FastAPI
├── database/          # Schema SQL
├── src/app/           # Frontend React
│   ├── providers/     # ApiProvider
│   ├── types/         # TypeScript types
│   └── components/    # UI
└── public/
    └── _redirects     # Config Render (SPA)
```