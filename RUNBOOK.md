# RUNBOOK - ERP IDP

---

## ⚠️ PASO 0: Corregir _redirects

**OBLIGATORIO antes de desplegar en Render:**

```bash
cd public
cat _redirects/main.tsx > _redirects_temp
rm -rf _redirects
mv _redirects_temp _redirects
```

Verificar: `cat _redirects` debe mostrar `/*    /index.html   200`

**Por qué**: Figma Make crea carpeta en vez de archivo. Render necesita archivo simple para que React Router funcione al refrescar rutas.

---

## 🚀 Ejecución Local

### 0. Actualizar rama (Windows + Git Bash)

```bash
git fetch origin
git reset --hard origin/work
```

### 1. Base de Datos

```bash
# PostgreSQL local
psql -U postgres -d tu_db -f database/schema_final.sql

# O usar Supabase:
# 1. Crear proyecto en https://supabase.com
# 2. Copiar DATABASE_URL (Settings → Database)
# 3. Ejecutar schema_final.sql en SQL Editor
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows (Git Bash): source venv/Scripts/activate
pip install -r requirements.txt

cat > .env << EOF
DATABASE_URL=postgresql://user:pass@localhost:5432/idp_db
FRONTEND_URL=http://localhost:5173
EOF

export $(cat .env | xargs)

uvicorn main:app --reload --port 8000
```

Verificar: http://localhost:8000/api/v1/health → `{"status": "success", "data": {"database": "connected"}, "error": null}`
Docs: http://localhost:8000/docs

### 3. Frontend

```bash
npm install

cat > .env.local << EOF
VITE_API_URL=http://localhost:8000/api/v1
VITE_DATA_MODE=api
EOF

npm run dev
```

Verificar: http://localhost:5173

### 4. Test

- [ ] Backend health responde
- [ ] Frontend carga
- [ ] Sin errores CORS
- [ ] Crear obra → refrescar (F5) → obra persiste
- [ ] Crear proveedor → refrescar (F5) → persiste en Supabase
- [ ] Crear OC con items → refrescar (F5) → persiste
- [ ] Crear pago → refrescar (F5) → persiste
- [ ] Backend apagado → ErrorState con retry
- [ ] DB vacía → EmptyState con CTA
- [ ] Abrir /pagos directo + F5 → permanece en /pagos
- [ ] Smoke: `VITE_API_URL=http://localhost:8000/api/v1 npm run smoke`

---

## 🌐 Render

### Backend (Web Service)

```
Build: pip install -r requirements.txt
Start: uvicorn main:app --host 0.0.0.0 --port $PORT
Root: backend
```

**Env vars**:
```bash
DATABASE_URL=postgresql://...supabase.com:6543/postgres?sslmode=require
FRONTEND_URL=https://tu-frontend.onrender.com
```

Health Check: `/api/v1/health`

### Frontend (Static Site)

```
Build: npm install && npm run build
Publish: dist
```

**Env vars**:
```bash
VITE_API_URL=https://tu-backend.onrender.com/api/v1
VITE_DATA_MODE=api
```

### Orden

1. Backend → copiar URL
2. Frontend → usar URL backend en `VITE_API_URL`
3. Actualizar `FRONTEND_URL` en backend con URL frontend
4. Re-desplegar backend

### Verificar

- [ ] Backend: `https://tu-backend.onrender.com/api/v1/health`
- [ ] Frontend carga
- [ ] Sin errores CORS
- [ ] Crear obra → refrescar → persiste
- [ ] Refrescar `/ordenes-compra` → NO da 404

---

## 🐛 Problemas Comunes

**CORS error**
→ Verificar `FRONTEND_URL` en backend coincide con URL real
→ Re-desplegar backend

**Datos no persisten**
→ Verificar `VITE_DATA_MODE=api` (no `mock`)
→ Verificar `DATABASE_URL` correcto
→ Confirmar que `DATABASE_URL` apunta a Postgres/Supabase (no SQLite)

**404 al refrescar**
→ Verificar `/public/_redirects` es archivo (no carpeta)
→ Re-desplegar frontend

**Error SSL Supabase**
→ Agregar `?sslmode=require` al `DATABASE_URL`
→ (El backend lo hace automáticamente)
