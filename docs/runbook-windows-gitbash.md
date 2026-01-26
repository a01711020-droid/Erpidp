# Runbook (Windows + Git Bash)

> Objetivo: levantar backend + frontend con Supabase y validar persistencia real.

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

## 4) Pruebas manuales de persistencia
1) **Proveedores**
   - Ir a `/proveedores`
   - Crear proveedor
   - Ver en lista
   - Refresh (F5) y confirmar que persiste
   - Editar y eliminar
2) **Obras**
   - Ir a `/obras`
   - Crear obra
   - Refresh y validar persistencia
   - Editar y eliminar
3) **Órdenes de Compra**
   - Ir a `/compras/ordenes-compra`
   - Crear OC (requiere obra + proveedor)
   - Ver en lista, abrir PDF
   - Refresh y validar persistencia
   - Editar y eliminar
4) **Pagos**
   - Ir a `/pagos`
   - Crear pago (requiere OC)
   - Ver en lista
   - Refresh y validar persistencia
   - Editar y eliminar

## 5) Validación de rutas
- Entrar directo a cada URL (por ejemplo `/pagos`) y confirmar que se carga correctamente.
- Hacer refresh y confirmar que no se pierde la navegación.
