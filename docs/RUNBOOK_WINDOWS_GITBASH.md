# RUNBOOK WINDOWS + GIT BASH (DESDE CERO)

## 1) Clonar repositorio
```bash
git clone <URL_DEL_REPO> erpidp
cd erpidp
git checkout work
```

## 2) Backend (FastAPI + Python 3.11)
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

### Crear `backend/.env`
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
FRONTEND_URL=http://localhost:5173
```

## 3) Aplicar schema en Supabase
1. Abrir Supabase → SQL Editor.
2. Ejecutar `backend/db/schema.sql`.
3. Verificar tablas con `docs/SQL_RUNBOOK.md`.

## 4) Levantar backend (dos opciones)

### Opción A: Automático (load_dotenv)
`backend/app/main.py` carga `backend/.env` automáticamente al iniciar.
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Opción B: CLI explícito
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000 --env-file .env
```

## 5) Frontend (Vite + React)
```bash
cd frontend
npm install
```

Crear `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Levantar frontend:
```bash
npm run dev
```

## 6) Pruebas manuales (smoke test)
1. Crear proveedor desde UI → valida POST `/api/v1/proveedores`.
2. Crear obra desde UI → valida POST `/api/v1/obras`.
3. Crear OC vinculando obra + proveedor → valida POST `/api/v1/ordenes-compra`.
4. Crear pago referenciando OC/proveedor/obra según la pantalla → valida POST `/api/v1/pagos`.
5. Refrescar rutas profundas (`/proveedores`, `/compras/ordenes`, `/pagos`) y confirmar que no rompe navegación.

## 7) Nota de deploy SPA (refresh)
Para hosting estático, el archivo `frontend/public/_redirects` debe contener:
```txt
/*    /index.html   200
```
Ver `docs/DEPLOY_NOTES.md`.
