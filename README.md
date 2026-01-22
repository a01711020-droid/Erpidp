# ERP IDP (API-first)

Sistema ERP para obras, proveedores, requisiciones, órdenes de compra y pagos. **La fuente de verdad es el backend (FastAPI + Supabase)**.

## Prerrequisitos
- Node.js 18+
- Python 3.11+
- PostgreSQL (Supabase)
- Windows + Git Bash (soportado)

## Configuración de entorno

### Backend (`backend/.env`)
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
FRONTEND_URL=http://localhost:5173
```

> El backend falla en el arranque si `DATABASE_URL` no existe. Esto evita conexiones locales por error.

### Frontend (`.env` en la raíz)
```bash
VITE_API_URL=http://localhost:8000
```

> Si `VITE_API_URL` falta, el UI muestra un error visible.

## Comandos (Windows Git Bash)

### Backend
```bash
cd /workspace/Erpidp/backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd /workspace/Erpidp
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## Rutas principales
- `/dashboard`
- `/dashboard/obras/:obraId`
- `/dashboard/obras/:obraId/desglose`
- `/compras`
- `/compras/nueva`
- `/compras/:ocId`
- `/compras/obra/:obraId`
- `/pagos`
- `/pagos/conciliacion`
- `/pagos/obra/:obraId`

## SPA routing (Render)
El archivo **`public/_redirects`** debe existir como archivo con el contenido:
```
/* /index.html 200
```

## Flujos a probar
1) **Crear obra** → aparece en `/dashboard` → refrescar y confirmar persistencia.
2) **Crear OC** en `/compras/nueva` → aparece en `/compras` → refrescar.
3) **Registrar pago** en `/pagos` → reduce saldo en la lista.
4) **Conciliar CSV** en `/pagos/conciliacion` → auto-match por folio OC o match manual.

## Troubleshooting
- **ERR_CONNECTION_REFUSED**: backend apagado o `VITE_API_URL` incorrecto.
- **422 (FastAPI)**: revisar payload y conversiones camelCase ↔ snake_case (API Provider).
- **Refresh en Render vuelve al home**: falta `public/_redirects` como archivo.
- **Imágenes no cargan**: verifica rutas absolutas desde `/public` (ej: `/logo-idp-normal.svg`).

