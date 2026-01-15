# 🏗️ Sistema IDP Construcción - PRODUCCIÓN

## Sistema REAL listo para despliegue en Render

Este es un sistema completo de gestión de construcción con **frontend React** y **backend FastAPI + PostgreSQL**.

---

## 📋 Requisitos

- **Node.js** 18+ (frontend)
- **Python** 3.10+ (backend)
- **PostgreSQL** 14+ (base de datos)
- Cuenta en **Render.com** (para deploy)

---

## 🚀 INSTALACIÓN LOCAL

### 1️⃣ Frontend (React + Vite)

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con la URL de tu backend local
# VITE_API_URL=http://localhost:8000

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

El frontend estará en: **http://localhost:5173**

### 2️⃣ Backend (FastAPI + PostgreSQL)

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
```

**Contenido de `backend/.env`:**
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=idp_construccion
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
PORT=8000
```

### 3️⃣ Base de Datos PostgreSQL

**Opción A: PostgreSQL Local**

```bash
# Instalar PostgreSQL (si no lo tienes)
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Crear base de datos
createdb idp_construccion

# O con psql:
psql -U postgres
CREATE DATABASE idp_construccion;
\q

# Ejecutar el schema
psql -U postgres -d idp_construccion -f backend/schema.sql
```

**Opción B: PostgreSQL en Docker**

```bash
# Levantar PostgreSQL en Docker
docker run --name idp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=idp_construccion \
  -p 5432:5432 \
  -d postgres:14

# Ejecutar schema
docker exec -i idp-postgres psql -U postgres -d idp_construccion < backend/schema.sql
```

**Opción C: Supabase (Gratis)**

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En "Database" → "SQL Editor", ejecuta el contenido de `backend/schema.sql`
3. Copia las credenciales de conexión de "Project Settings" → "Database"
4. Actualiza `backend/.env` con las credenciales de Supabase

### 4️⃣ Ejecutar el Backend

```bash
cd backend

# Asegúrate de estar en el entorno virtual
python main.py

# O con uvicorn directamente:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará en: **http://localhost:8000**

Verifica:
- **Health Check**: http://localhost:8000/health
- **Docs**: http://localhost:8000/docs

### 5️⃣ Verificar que TODO funciona

```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
npm run dev

# Abrir navegador en http://localhost:5173
# La app debe cargar y conectarse a la API
# Verifica la consola del navegador: debe aparecer "✅ API conectada"
```

---

## 🌐 DEPLOY EN RENDER

### Deploy del Backend (Web Service)

1. **Crear cuenta en Render**: https://render.com

2. **Crear PostgreSQL Database** (si no usas Supabase):
   - Click "New +" → "PostgreSQL"
   - Name: `idp-construccion-db`
   - Plan: Free
   - Espera que se cree (2-3 minutos)
   - Ve a "Info" y copia la "Internal Database URL"

3. **Ejecutar schema en la base de datos**:
   ```bash
   # Conectarse a la DB de Render con psql
   psql postgresql://usuario:password@host/database -f backend/schema.sql
   ```

4. **Crear Web Service para el backend**:
   - Click "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     ```
     Name: idp-backend
     Region: Oregon (US West)
     Branch: main
     Root Directory: backend
     Runtime: Python 3
     Build Command: pip install -r requirements.txt
     Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

5. **Agregar variables de entorno**:
   - Click "Environment" → "Add Environment Variable"
   - Agregar las siguientes variables:
     ```
     DATABASE_HOST = [host de tu DB de Render]
     DATABASE_PORT = 5432
     DATABASE_NAME = [nombre de tu DB]
     DATABASE_USER = [usuario de tu DB]
     DATABASE_PASSWORD = [password de tu DB]
     PORT = 8000
     ```
   - Si creaste una DB en Render, Render proporciona automáticamente `DATABASE_URL`. Puedes usarla directamente o las variables individuales.

6. **Deploy**:
   - Click "Create Web Service"
   - Espera que el deploy termine (5-10 minutos)
   - La URL será algo como: `https://idp-backend.onrender.com`

7. **Verificar el backend**:
   - Visita: `https://idp-backend.onrender.com/health`
   - Debe responder: `{"status":"healthy", ...}`
   - Visita: `https://idp-backend.onrender.com/docs`
   - Debe aparecer la documentación de la API

### Deploy del Frontend (Static Site)

1. **Crear Static Site**:
   - Click "New +" → "Static Site"
   - Conecta el mismo repositorio
   - Configuración:
     ```
     Name: idp-frontend
     Branch: main
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

2. **Agregar variable de entorno**:
   - Click "Environment" → "Add Environment Variable"
     ```
     VITE_API_URL = https://idp-backend.onrender.com
     ```

3. **Deploy**:
   - Click "Create Static Site"
   - Espera que el build termine (3-5 minutos)
   - La URL será algo como: `https://idp-frontend.onrender.com`

4. **Verificar el frontend**:
   - Visita: `https://idp-frontend.onrender.com`
   - La app debe cargar correctamente
   - Verifica la consola del navegador: debe aparecer "✅ API conectada"
   - Navega a los módulos y verifica que los datos se carguen

### Actualizar CORS en el Backend

Una vez que tengas la URL del frontend, actualiza las variables de entorno del backend:

```
CORS_ORIGINS = http://localhost:5173,https://idp-frontend.onrender.com
```

O edita `backend/main.py` directamente y agrega la URL en `allow_origins`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://idp-frontend.onrender.com",  # Tu URL de frontend
        "*"  # Quitar esto en producción
    ],
    ...
)
```

Luego haz commit y push para que se redespliegue.

---

## 🔧 SCRIPTS DISPONIBLES

### Frontend

```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Build para producción
npm run preview  # Preview del build local
npm run lint     # Linter
```

### Backend

```bash
python main.py                           # Ejecutar servidor
uvicorn main:app --reload               # Con hot-reload
uvicorn main:app --host 0.0.0.0         # Exponer en red
```

---

## 📊 ENDPOINTS DE LA API

### Obras

```
GET    /api/obras              # Listar todas
GET    /api/obras/{code}       # Obtener por código
POST   /api/obras              # Crear
PUT    /api/obras/{code}       # Actualizar
DELETE /api/obras/{code}       # Eliminar
```

### Proveedores

```
GET    /api/proveedores        # Listar todos
GET    /api/proveedores/{id}   # Obtener por ID
POST   /api/proveedores        # Crear
PUT    /api/proveedores/{id}   # Actualizar
DELETE /api/proveedores/{id}   # Eliminar
```

### Requisiciones

```
GET    /api/requisiciones                  # Listar todas
GET    /api/requisiciones/obra/{code}      # Por obra
GET    /api/requisiciones/{id}             # Por ID
POST   /api/requisiciones                  # Crear
PUT    /api/requisiciones/{id}             # Actualizar
DELETE /api/requisiciones/{id}             # Eliminar
```

### Órdenes de Compra

```
GET    /api/ordenes-compra                 # Listar todas
GET    /api/ordenes-compra/obra/{code}     # Por obra
GET    /api/ordenes-compra/{id}            # Por ID
POST   /api/ordenes-compra                 # Crear
PUT    /api/ordenes-compra/{id}            # Actualizar
DELETE /api/ordenes-compra/{id}            # Eliminar
```

### Pagos

```
GET    /api/pagos                          # Listar todos
GET    /api/pagos/orden-compra/{id}        # Por OC
GET    /api/pagos/{id}                     # Por ID
POST   /api/pagos                          # Crear (actualiza OC automáticamente)
DELETE /api/pagos/{id}                     # Eliminar (revierte OC)
```

### Destajos

```
GET    /api/destajos                       # Listar todos
GET    /api/destajos/obra/{code}           # Por obra
POST   /api/destajos                       # Crear
DELETE /api/destajos/{id}                  # Eliminar
```

### Dashboard / Estadísticas

```
GET    /api/dashboard/estadisticas         # Estadísticas globales
```

### Utilidades

```
GET    /health                             # Health check
GET    /                                   # Info de la API
GET    /docs                               # Documentación Swagger
```

---

## 🗂️ ESTRUCTURA DEL PROYECTO

```
/
├── backend/
│   ├── main.py              # API FastAPI
│   ├── database.py          # Conexión a PostgreSQL
│   ├── schema.sql           # Esquema de base de datos
│   ├── requirements.txt     # Dependencias Python
│   ├── .env.example         # Template de variables de entorno
│   └── .env                 # Variables de entorno (no versionar)
│
├── src/
│   ├── app/
│   │   ├── Home.tsx
│   │   ├── GlobalDashboard.tsx
│   │   ├── PurchaseOrderManagement.tsx
│   │   ├── MaterialRequisitions.tsx
│   │   ├── PaymentManagement.tsx
│   │   └── ...
│   ├── services/
│   │   ├── apiClient.ts     # Cliente HTTP (axios)
│   │   ├── api.ts           # Endpoints CRUD
│   │   └── database.ts      # Adaptador (API + modo demo)
│   ├── types/
│   │   └── index.ts         # Tipos TypeScript
│   └── data/
│       └── *.json           # Datos de fallback (modo demo)
│
├── public/
│   ├── _redirects           # Para React Router en Render
│   ├── logo-idp.svg
│   └── logo-idp-alt.svg
│
├── .env.example             # Variables frontend
├── .env                     # Variables frontend (no versionar)
├── package.json
├── vite.config.ts
└── README-PRODUCCION.md     # Este archivo
```

---

## 🔐 MODO DEMO vs PRODUCCIÓN

El sistema tiene **2 modos**:

### ✅ Modo PRODUCCIÓN (Default)
- Conecta con la API REST del backend
- Datos guardados en PostgreSQL
- Persistencia real entre sesiones y usuarios
- Consultas con `GET /api/...`
- Creación/edición con `POST/PUT /api/...`

### 🧪 Modo DEMO (Fallback)
- Se activa automáticamente si la API no está disponible
- Datos en `localStorage` del navegador
- Solo para pruebas locales
- Aparece mensaje en consola: `⚠️ API no disponible - usando modo DEMO`

Para forzar modo DEMO:
- No ejecutar el backend
- O cambiar `VITE_API_URL` a una URL inválida

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Frontend no conecta con el backend

**Síntomas:**
- Consola dice: `⚠️ API no disponible - usando modo DEMO`
- Los datos no se guardan al recargar

**Soluciones:**
1. Verifica que el backend esté corriendo:
   ```bash
   curl http://localhost:8000/health
   # Debe responder: {"status":"healthy"}
   ```

2. Verifica CORS en `backend/main.py`:
   ```python
   allow_origins=["http://localhost:5173", ...]
   ```

3. Verifica `.env` del frontend:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. Reinicia ambos servidores:
   ```bash
   # Backend
   Ctrl+C
   python main.py
   
   # Frontend
   Ctrl+C
   npm run dev
   ```

### ❌ Error de base de datos en el backend

**Síntomas:**
- `/health` responde con `"database": "error: ..."`
- Endpoints devuelven error 500

**Soluciones:**
1. Verifica que PostgreSQL esté corriendo:
   ```bash
   psql -U postgres -d idp_construccion -c "SELECT 1"
   ```

2. Verifica credenciales en `backend/.env`

3. Verifica que el schema esté creado:
   ```bash
   psql -U postgres -d idp_construccion -c "\dt"
   # Debe listar: obras, proveedores, requisiciones, ordenes_compra, pagos, destajos
   ```

4. Si no existe, ejecuta:
   ```bash
   psql -U postgres -d idp_construccion -f backend/schema.sql
   ```

### ❌ Error de CORS en producción

**Síntomas:**
- Error en consola: `Access to XMLHttpRequest ... has been blocked by CORS policy`

**Soluciones:**
1. Actualiza `allow_origins` en `backend/main.py` con la URL de tu frontend en Render
2. O agrega variable de entorno `CORS_ORIGINS` en el backend de Render
3. Redeploya el backend

### ❌ Rutas no funcionan en Render (404)

**Síntomas:**
- La home carga bien
- Al refrescar en `/compras` → Error 404

**Solución:**
- Verifica que existe `/public/_redirects` con:
  ```
  /*    /index.html   200
  ```
- Rebuild del frontend en Render

---

## 📝 CHECKLIST PRE-DEPLOY

Antes de desplegar a producción:

### Frontend
- [ ] `npm install` sin errores
- [ ] `npm run build` sin errores
- [ ] `npm run preview` funciona
- [ ] Existe `/public/_redirects`
- [ ] `.env` tiene `VITE_API_URL` correcta
- [ ] No hay imports de `figma:asset`
- [ ] No hay credenciales hardcodeadas

### Backend
- [ ] `pip install -r requirements.txt` sin errores
- [ ] `python main.py` corre sin errores
- [ ] `/health` responde OK
- [ ] `/docs` carga correctamente
- [ ] `.env` tiene todas las variables necesarias
- [ ] CORS configurado para el dominio del frontend
- [ ] No hay credenciales hardcodeadas
- [ ] Schema SQL ejecutado en la base de datos

### Base de Datos
- [ ] PostgreSQL accesible desde el backend
- [ ] Schema aplicado (`schema.sql`)
- [ ] Tablas creadas correctamente
- [ ] Datos de ejemplo insertados (opcional)

### Integración
- [ ] Frontend conecta con backend localmente
- [ ] Consola muestra "✅ API conectada"
- [ ] Datos se guardan y se recuperan correctamente
- [ ] Navegación funciona en todas las rutas
- [ ] PDFs se generan correctamente

---

## 🎯 PRÓXIMOS PASOS

Después del deploy:

1. **Monitoreo**: Configura alertas en Render para caídas del servicio
2. **Backups**: Configura backups automáticos de la base de datos
3. **Dominio**: Conecta un dominio personalizado (ej: `idp-construccion.com`)
4. **SSL**: Render incluye SSL gratis, verifícalo en la configuración
5. **Autenticación**: Implementa login y roles de usuario
6. **Analytics**: Agrega Google Analytics o similar
7. **Logs**: Configura logging centralizado (ej: Sentry)

---

## 📞 SOPORTE

Para dudas o problemas:
1. Revisa esta documentación
2. Verifica logs del backend y frontend
3. Prueba endpoints en `/docs` (Swagger UI)
4. Verifica la consola del navegador

---

**Sistema IDP Construcción v1.0 - PRODUCCIÓN**  
**Stack**: React + TypeScript + Vite + FastAPI + PostgreSQL  
**Deploy**: Render.com  
**Última actualización**: Enero 2025
