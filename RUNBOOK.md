# RUNBOOK - Sistema ERP IDP

Guía operativa para ejecutar el sistema en local y producción.

---

## ⚠️ IMPORTANTE: Archivo _redirects para Render

**El sistema Figma Make tiene una limitación**: No puede crear archivos que empiezan con `_`.

**Actualmente existe**: `/public/_redirects/main.tsx` (carpeta con archivo)  
**Render necesita**: `/public/_redirects` (archivo simple, sin extensión)

**SOLUCIÓN MANUAL OBLIGATORIA**:

```bash
# Después de descargar el proyecto:
cd public
cat _redirects/main.tsx > _redirects_temp
rm -rf _redirects
mv _redirects_temp _redirects

# Verificar:
cat _redirects
# Debe mostrar: /*    /index.html   200
```

**Sin este paso, React Router NO funcionará en Render al refrescar rutas.**

---

## 🚀 EJECUCIÓN LOCAL

### 1. Base de Datos

Crear schema en PostgreSQL o Supabase:

```bash
# PostgreSQL local
psql -U postgres -d tu_db -f database/schema_final.sql

# O usar Supabase
# 1. Crear proyecto en https://supabase.com
# 2. Copiar DATABASE_URL (Settings → Database → Connection String)
# 3. Ejecutar schema_final.sql en SQL Editor
```

### 2. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Variables de entorno
export DATABASE_URL="postgresql://user:pass@localhost:5432/idp_db"
export FRONTEND_URL="http://localhost:5173"

# Ejecutar
uvicorn main:app --reload --port 8000
```

**Verificar**: http://localhost:8000/health → `{"status": "healthy"}`

### 3. Frontend

```bash
# Instalar dependencias
pnpm install

# Variables de entorno
cat > .env << EOF
VITE_API_URL=http://localhost:8000
VITE_DATA_MODE=api
EOF

# Ejecutar
pnpm run dev
```

**Verificar**: http://localhost:5173 → Dashboard debe cargar

### 4. Checklist Local

- [ ] Backend: http://localhost:8000/health responde
- [ ] Frontend: http://localhost:5173 carga
- [ ] Sin errores de CORS en consola
- [ ] Crear obra → refrescar (F5) → obra persiste

---

## 🌐 DESPLIEGUE EN RENDER

### 1. Backend (Web Service)

**Build Command**: `pip install -r requirements.txt`  
**Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`  
**Root Directory**: `backend`

**Variables de Entorno**:
```bash
DATABASE_URL=postgresql://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
FRONTEND_URL=https://tu-frontend.onrender.com
```

**Health Check**: `/health`

### 2. Frontend (Static Site)

**Build Command**: `pnpm install && pnpm run build`  
**Publish Directory**: `dist`

**Variables de Entorno**:
```bash
VITE_API_URL=https://tu-backend.onrender.com
VITE_DATA_MODE=api
```

**Nota**: El archivo `/public/_redirects` está configurado para SPA.

### 3. Orden de Despliegue

1. **Backend primero** → obtener URL
2. **Frontend segundo** → configurar `VITE_API_URL` con URL del backend
3. **Actualizar** `FRONTEND_URL` en backend con URL del frontend
4. **Re-desplegar** backend

### 4. Checklist Render

- [ ] Backend health: `https://tu-backend.onrender.com/health`
- [ ] Frontend carga: `https://tu-frontend.onrender.com`
- [ ] Sin errores CORS
- [ ] Crear obra → refrescar → obra persiste
- [ ] Rutas funcionan al refrescar (ej: `/ordenes-compra`)

---

## 🐛 Troubleshooting

### Error de CORS

**Síntoma**: `Access to fetch blocked by CORS policy`

**Solución**:
1. Verificar que `FRONTEND_URL` en backend coincida con URL real del frontend
2. Re-desplegar backend

### Datos no persisten

**Síntoma**: Al refrescar, datos desaparecen

**Solución**:
1. Verificar `VITE_DATA_MODE=api` (no `mock`)
2. Verificar `DATABASE_URL` correcto
3. Verificar conexión: `curl https://tu-backend.onrender.com/health`

### Error 404 al refrescar en Render

**Síntoma**: Refrescar ruta diferente a `/` da 404

**Solución**:
- Verificar que existe `/public/_redirects` con: `/*    /index.html   200`
- Re-desplegar frontend

### Error conexión Supabase

**Síntoma**: `SSL connection has been closed unexpectedly`

**Solución**:
- Verificar `DATABASE_URL` incluye `?sslmode=require`
- El sistema lo agrega automáticamente si detecta "supabase" en URL

---

## 📊 Verificación

### Flujo Completo

1. Usuario crea obra en frontend
2. Frontend → POST `/api/obras`
3. Backend → guarda en PostgreSQL
4. Backend → devuelve obra creada
5. Frontend → actualiza lista
6. **Usuario refresca (F5)**
7. Frontend → GET `/api/obras`
8. Backend → consulta PostgreSQL
9. Frontend → muestra obras (incluyendo la nueva)

**Persistencia confirmada** ✓

---

## 📞 Soporte

- **API Docs Local**: http://localhost:8000/docs
- **API Docs Producción**: https://tu-backend.onrender.com/docs
- **Código**: Ver `/backend/main.py` y `/src/app/providers/ApiProvider.ts`