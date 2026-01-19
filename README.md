# Sistema ERP IDP

Sistema de gestión empresarial para obras, proveedores, requisiciones, órdenes de compra y pagos.

---

## ⚠️ IMPORTANTE: Archivo _redirects

**Antes de desplegar en Render**, ejecuta:

```bash
cd public
cat _redirects/main.tsx > _redirects_temp
rm -rf _redirects
mv _redirects_temp _redirects
```

**Por qué**: Figma Make no puede crear archivos con `_`. Ver [RUNBOOK.md](./RUNBOOK.md) para detalles.

---

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **Base de Datos**: PostgreSQL (Supabase)

## Arquitectura

```
Frontend (React) → Backend (FastAPI) → PostgreSQL (Supabase)
```

## Módulos

1. Obras
2. Proveedores
3. Requisiciones
4. Órdenes de Compra
5. Pagos

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

## Ejecutar

Ver **[RUNBOOK.md](./RUNBOOK.md)** para instrucciones completas.

## API Endpoints

- `GET/POST/PUT/DELETE /api/obras`
- `GET/POST/PUT/DELETE /api/proveedores`
- `GET/POST /api/requisiciones`
- `GET/POST/PUT/DELETE /api/ordenes-compra`
- `GET/POST/PUT/DELETE /api/pagos`

**Docs**: http://localhost:8000/docs
