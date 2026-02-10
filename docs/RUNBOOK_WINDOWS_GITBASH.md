# RUNBOOK WINDOWS (Git Bash)

## 1) Clonar repositorio
```bash
git clone <URL_DEL_REPO> erpidp
cd erpidp
git checkout <TU_BRANCH>
```

## 2) Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

### Configurar .env (backend)
Crear `backend/.env` con:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
FRONTEND_URL=http://localhost:5173
```

## 3) Aplicar schema en Supabase
1. Abrir Supabase → SQL Editor.
2. Ejecutar `backend/db/schema.sql`.
3. Verificar tablas con `docs/SQL_RUNBOOK.md`.

## 4) Levantar backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## 5) Frontend (Vite + React)
```bash
cd frontend
npm install
```

Crear `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

Levantar frontend:
```bash
npm run dev
```

## 6) Pruebas manuales (MVP)
1. Crear **obra**.
2. Crear **proveedor**.
3. Crear **requisición** con items.
4. Crear **orden de compra** referenciando obra/proveedor.
5. Crear **pago** referenciando OC.
6. Refrescar (F5) y confirmar persistencia + ruta.
