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

## Comandos (Windows Git Bash)

```bash
cd /workspace/Erpidp/backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Health Check
- `GET http://localhost:8000/health`
- Respuesta esperada cuando la BD está conectada:

```json
{"status":"healthy","database":"connected"}
```

Si la base de datos no está disponible, `/health` responde **503** con un mensaje de error.
