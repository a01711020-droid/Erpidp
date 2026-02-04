# RUNBOOK Windows (Git Bash)

## Requisitos
- Git Bash instalado
- Python 3.11+
- Node.js 18+
- Acceso a Supabase/Postgres

## 1) Clonar repo
```bash
git clone <repo-url>
cd Erpidp
git checkout work
```

## 2) Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

### Variables de entorno
Crea un archivo `.env` en `backend`:
```
DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>
DATABASE_SSLMODE=require
ADMIN_PASSWORD=idpjedi01
CORS_ORIGINS=http://localhost:5173
```
> Nota: el backend carga automáticamente `.env` al iniciar (no hace falta `source .env`, aunque puedes hacerlo si deseas).

### Ejecutar API
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Abre `http://localhost:8000/docs` para verificar que la API responde.

## 3) Base de datos (Supabase/Postgres)
1. Abre la consola SQL de Supabase.
2. Ejecuta el archivo `backend/db/schema.sql` completo.

## 4) Frontend (Vite/React)
```bash
cd ../frontend
npm install
```

### Variables de entorno
Crea `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_USER_NAME=Sistema de Gestión
VITE_USER_ROLE=admin
```

### Ejecutar Frontend
```bash
npm run dev
```

## 5) Pruebas reales (manual)
1. **Crear proveedor** → verificar persistencia → refrescar (F5) y confirmar que sigue visible.
2. **Crear obra** → verificar persistencia → refrescar (F5) y confirmar que sigue visible.
3. **Crear orden de compra** → verificar persistencia y items → refrescar (F5) y confirmar que sigue visible.
4. **Crear pago** → verificar persistencia y estado → refrescar (F5) y confirmar que sigue visible.
5. **Ir a Compras** → crear OC y confirmar que en los selects aparezcan la Obra y Proveedor creados.
6. **Ver Dashboard** → confirmar que los totales cambian al crear OC y Pago.
7. **Refresh (F5)** → confirmar que la ruta actual se conserva.

## 6) Pruebas API (pytest)
```bash
cd ../backend
export API_BASE_URL=http://localhost:8000
pytest -q
```

## 7) Estados esperados
- **Backend apagado** → UI muestra ErrorState.
- **DB vacía** → UI muestra EmptyState.
