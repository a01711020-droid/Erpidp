# Backend IDP (FastAPI)

## Requisitos
- Python 3.11+
- PostgreSQL (Supabase)

## Configuración de entorno
Crea `backend/.env` con la conexión a Supabase (incluye `sslmode=require`):

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
FRONTEND_URL=http://localhost:5173
```

> Si `DATABASE_URL` no existe o es inválida, el backend fallará en el arranque con un mensaje claro.

## Schema management (Supabase)
- El backend ejecuta `ensure_schema()` al iniciar para crear extensiones, tablas e índices **idempotentes**.
- Se usa `gen_random_uuid()` (extensión **pgcrypto**) como default para UUID, recomendado en Supabase.
- Se instala `pgcrypto` y `uuid-ossp` con `CREATE EXTENSION IF NOT EXISTS`, sin destruir datos.

## Comandos (Windows Git Bash)

```bash
cd /workspace/Erpidp/backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Verificar esquema (opcional)
```bash
python backend/scripts/check_db.py
```

## Health Check
- `GET http://localhost:8000/health`
- Respuesta esperada cuando la BD está conectada:

```json
{"status":"healthy","database":"connected"}
```

Si la base de datos no está disponible, `/health` responde **503** con un mensaje de error.

## Dashboard (métricas)
- `GET /api/dashboard/obras/{obra_id}/metricas` devuelve comprometido, pagado y saldo en tiempo real.
