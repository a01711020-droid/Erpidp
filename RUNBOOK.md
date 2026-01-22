# RUNBOOK - ERP IDP

## Ejecución local (Windows Git Bash)

### Base de datos (Supabase o local)
- Ejecuta `database/schema_final.sql` en tu instancia de PostgreSQL.
- En Supabase, usa el SQL Editor.

### Backend
```bash
cd /workspace/Erpidp/backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Variables requeridas (`backend/.env`):
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
FRONTEND_URL=http://localhost:5173
```

### Frontend
```bash
cd /workspace/Erpidp
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Variables requeridas (`.env` en la raíz):
```bash
VITE_API_URL=http://localhost:8000
```

## Rutas principales
- `/dashboard`
- `/compras`
- `/pagos`

## Render (SPA routing)
El archivo `public/_redirects` ya existe como archivo y contiene:
```
/* /index.html 200
```

## Validaciones rápidas
- `/health` responde `{"status":"healthy","database":"connected"}`.
- Crear obra → refrescar → persiste.
- Crear OC → refrescar → persiste.
- Registrar pago → saldo disminuye.

## Troubleshooting
- **ERR_CONNECTION_REFUSED**: backend caído o `VITE_API_URL` incorrecto.
- **422**: revisar payload (camelCase ↔ snake_case) y detalle de error.
- **Refresh en Render vuelve al home**: falta `public/_redirects`.
- **Imágenes no cargan**: verificar rutas absolutas desde `/public`.
