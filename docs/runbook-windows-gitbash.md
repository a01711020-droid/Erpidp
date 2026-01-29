# Runbook (Windows + Git Bash)

> Objetivo: levantar backend + frontend con Supabase y validar persistencia real (Obra → Proveedor → OC → Pago → Dashboard).

## Prerrequisitos
- Windows 10/11
- Git Bash instalado
- Node.js 18+ y npm
- Python 3.11+
- Supabase CLI instalado (si usas stack local)

## 1) Clonar y preparar
```bash
# En Git Bash
cd /c/Projects

git clone <repo-url> erpidp
cd erpidp
```

## 2) Backend + Supabase
```bash
# Desde la raíz del repo
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt

# Configura tu .env (ejemplo)
# DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
# SUPABASE_URL=http://localhost:54321
# SUPABASE_ANON_KEY=...

# Si usas Supabase local
cd ..
supabase start
```

```bash
# Arrancar backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 3) Frontend
```bash
# En otra terminal Git Bash
cd /c/Projects/erpidp

# Instalar dependencias
npm install

# Configura .env del frontend
# VITE_API_URL=http://localhost:8000

# Arrancar FE
npm run dev
```

## 4) PIN temporal para módulos
- Catálogos: PIN `1234`
- Pagos: PIN `1234`

> El PIN se guarda en `localStorage` (no es seguridad real, solo guard temporal).

## 5) Checklist E2E (persistencia)
1) **Catálogos → Obras** (`/catalogos/obras`)
   - Crear obra
   - Ver en lista
   - Refresh (F5) y confirmar persistencia
   - Editar y eliminar
2) **Catálogos → Proveedores** (`/catalogos/proveedores`)
   - Crear proveedor
   - Ver en lista
   - Refresh y confirmar persistencia
   - Editar y eliminar
3) **Compras → Órdenes** (`/compras`)
   - Crear OC en `/compras/nueva` (requiere obra + proveedor)
   - Ver en lista
   - Abrir detalle `/compras/:ocId`
   - Refresh y confirmar persistencia
   - Editar y eliminar
4) **Pagos** (`/pagos`)
   - Crear pago parcial asociado a OC
   - Ver en lista
   - Refresh y confirmar persistencia
   - Editar y eliminar
5) **Dashboard** (`/dashboard`)
   - Entrar a una obra y validar métricas reales
   - Si no hay datos, ver 0/empty state

## 6) Validación de rutas
- Entrar directo a cada URL (por ejemplo `/pagos/oc/<id>`) y confirmar que carga correctamente.
- Hacer refresh y confirmar que no regresa a un home.
