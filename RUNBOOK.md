# RUNBOOK - Sistema ERP IDP

Guía operativa para ejecutar el sistema en local y en producción (Render).

---

## 🚀 EJECUCIÓN LOCAL

### Prerrequisitos

- **Node.js** 18+ y **pnpm**
- **Python** 3.11+
- **PostgreSQL** (local o Supabase)

### 1. Base de Datos

**Crear schema en PostgreSQL**:
```bash
psql -U postgres -d tu_db -f database/schema_final.sql
```

**O usar Supabase**:
1. Crear proyecto en https://supabase.com
2. Copiar DATABASE_URL (Settings → Database → Connection String)
3. Ejecutar `schema_final.sql` en SQL Editor

### 2. Backend (FastAPI)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
export DATABASE_URL="postgresql://user:pass@localhost:5432/idp_db"
export FRONTEND_URL="http://localhost:5173"

# Ejecutar servidor
uvicorn main:app --reload --port 8000
```

**Verificar**: http://localhost:8000/health → `{"status": "healthy"}`

### 3. Frontend (React + Vite)

```bash
# Desde la raíz del proyecto

# Instalar dependencias
pnpm install

# Configurar .env
cat > .env << EOF
VITE_API_URL=http://localhost:8000
VITE_DATA_MODE=api
EOF

# Ejecutar dev server
pnpm run dev
```

**Verificar**: http://localhost:5173 → Dashboard debe cargar

### 4. Checklist de Verificación Local

- [ ] Backend responde en http://localhost:8000/health
- [ ] Frontend carga en http://localhost:5173
- [ ] Consola del navegador sin errores de CORS
- [ ] Crear una obra → refrescar (F5) → la obra persiste
- [ ] API docs funcionan en http://localhost:8000/docs

---

## 🌐 DESPLIEGUE EN RENDER

### ⚠️ IMPORTANTE: Configuración Manual del Archivo _redirects

Antes de desplegar, **debes crear manualmente** el archivo `/public/_redirects`:

1. Crea un archivo llamado `_redirects` (sin extensión) en la carpeta `public/`
2. Contenido exacto (una línea):
   ```
   /*    /index.html   200
   ```
3. Alternativamente, renombra `/public/redirects-config.txt` a `_redirects`

**Ver instrucciones detalladas en [INSTRUCCIONES_REDIRECTS.md](./INSTRUCCIONES_REDIRECTS.md)**

---

### 1. Backend (Web Service)

**Configuración**:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Root Directory**: `backend`

**Variables de Entorno**:
```bash
DATABASE_URL=postgresql://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
FRONTEND_URL=https://tu-frontend.onrender.com
```

**Notas**:
- El sistema detecta Supabase y agrega `?sslmode=require` automáticamente
- No usar `?sslmode=require` duplicado en DATABASE_URL

**Health Check**: `/health`

### 2. Frontend (Static Site)

**Configuración**:
- **Build Command**: `pnpm install && pnpm run build`
- **Publish Directory**: `dist`

**Variables de Entorno**:
```bash
VITE_API_URL=https://tu-backend.onrender.com
VITE_DATA_MODE=api
```

**Importante**: El archivo `/public/_redirects` ya está configurado para SPA.

### 3. Orden de Despliegue

1. **Primero**: Desplegar backend
2. **Obtener URL del backend**: https://idp-backend-xxx.onrender.com
3. **Segundo**: Configurar `VITE_API_URL` en frontend
4. **Tercero**: Desplegar frontend
5. **Obtener URL del frontend**: https://idp-frontend-xxx.onrender.com
6. **Cuarto**: Actualizar `FRONTEND_URL` en backend (para CORS)
7. **Quinto**: Re-desplegar backend para aplicar nueva URL

### 4. Checklist de Verificación en Render

- [ ] Backend health check: `https://tu-backend.onrender.com/health`
- [ ] Frontend carga: `https://tu-frontend.onrender.com`
- [ ] Sin errores CORS en consola del navegador
- [ ] Crear una obra → refrescar (F5) → la obra persiste
- [ ] Rutas funcionan al refrescar (ej: /ordenes-compra)

---

## 🐛 Troubleshooting

### Error de CORS

**Síntoma**: `Access to fetch blocked by CORS policy`

**Solución**:
1. Verificar que `FRONTEND_URL` en backend coincida con la URL real del frontend
2. Re-desplegar backend después de actualizar la variable

### Datos no persisten

**Síntoma**: Al refrescar, los datos desaparecen

**Solución**:
1. Verificar que `VITE_DATA_MODE=api` (no `mock`)
2. Verificar que `DATABASE_URL` en backend sea correcto
3. Verificar conexión a la BD: `curl https://tu-backend.onrender.com/health`

### Error 404 al refrescar en Render

**Síntoma**: Al refrescar una ruta diferente a `/`, se obtiene 404

**Solución**:
- Verificar que exista `/public/_redirects` con contenido: `/*    /index.html   200`
- Re-desplegar frontend

### Error de conexión a Supabase

**Síntoma**: `SSL connection has been closed unexpectedly`

**Solución**:
- Verificar que `DATABASE_URL` incluya `?sslmode=require`
- O dejar que el sistema lo agregue automáticamente (detecta "supabase" en la URL)

---

## 📊 Monitoreo

### Logs en Render

**Backend**:
```bash
# Ver logs en tiempo real
Render Dashboard → tu-backend → Logs
```

**Frontend**:
```bash
# Build logs
Render Dashboard → tu-frontend → Logs
```

### Logs Locales

**Backend**:
```bash
# Uvicorn muestra logs en la terminal
INFO:     127.0.0.1:xxxxx - "GET /api/obras HTTP/1.1" 200 OK
```

**Frontend**:
```bash
# Console del navegador (F12 → Console)
# Errores de API aparecen como: API Error [/api/obras]: ...
```

---

## 🔄 Flujo de Datos

```
1. Usuario crea una obra en el frontend
2. Frontend envía POST a /api/obras
3. Backend valida y guarda en PostgreSQL (Supabase)
4. Backend devuelve la obra creada (con ID)
5. Frontend actualiza la lista
6. Usuario refresca (F5)
7. Frontend solicita GET /api/obras
8. Backend consulta PostgreSQL
9. Frontend muestra las obras (incluyendo la nueva)
```

**Persistencia confirmada** ✓

---

## 📞 Soporte

Ver código en `/backend/main.py` y `/src/app/providers/ApiProvider.ts` para detalles de implementación.

**API Docs**: http://localhost:8000/docs (local) o https://tu-backend.onrender.com/docs (producción)