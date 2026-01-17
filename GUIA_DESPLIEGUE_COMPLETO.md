# 🚀 Guía de Despliegue Completo - FastAPI + Supabase + React

## Sistema de Gestión Empresarial IDP

---

## 📋 ENTREGABLES COMPLETADOS

✅ **Esquema SQL** completo para Supabase (PostgreSQL)  
✅ **Backend FastAPI** (`/backend/main.py`) con CRUD funcional  
✅ **Frontend React** conectado con ApiProvider  
✅ **Generador de PDF** actualizado con jsPDF  
✅ **Persistencia real** end-to-end  

---

## 🗄️ PASO 1: Configurar la Base de Datos en Supabase

### 1.1 Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Clic en "New Project"
4. Configuración:
   - **Project Name**: `idp-gestion-empresarial`
   - **Database Password**: (guarda esta contraseña de forma segura)
   - **Region**: Selecciona la más cercana a México
5. Espera a que el proyecto se cree (~2 minutos)

### 1.2 Ejecutar el Esquema SQL

1. En el panel de Supabase, ve a **SQL Editor**
2. Clic en "New Query"
3. Copia y pega TODO el contenido del archivo `/database/schema.sql`
4. Clic en "Run" o presiona `Ctrl+Enter`
5. Verifica que se ejecutó correctamente (sin errores rojos)

### 1.3 Verificar las Tablas Creadas

1. Ve a **Table Editor** en el panel izquierdo
2. Deberías ver estas tablas:
   - `obras`
   - `proveedores`
   - `requisiciones`
   - `requisicion_items`
   - `ordenes_compra`
   - `orden_compra_items`
   - `pagos`
   - `destajos`
   - `usuarios`

### 1.4 Verificar los Datos de Prueba (SEED)

1. Abre la tabla `obras`
2. Deberías ver **1 obra**: CASTELLO E (código 227)
3. Abre la tabla `proveedores`
4. Deberías ver **10 proveedores** (Cruz Azul, Levinson, CEMEX, etc.)

### 1.5 Obtener la Connection String

1. Ve a **Settings** → **Database**
2. Busca la sección **Connection string**
3. Selecciona el tab **URI**
4. Copia la cadena completa (algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. Guárdala de forma segura (la necesitarás para el backend)

---

## 🐍 PASO 2: Desplegar el Backend FastAPI

### 2.1 Preparar el Backend Localmente (Prueba)

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variable de entorno
export DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.xxx.supabase.co:5432/postgres"

# Iniciar el servidor
uvicorn main:app --reload --port 8000
```

### 2.2 Probar que Funcione

Abre tu navegador en:

```
http://localhost:8000
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "IDP Gestión Empresarial API"
}
```

Prueba el health check:
```
http://localhost:8000/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

Prueba obtener las obras:
```
http://localhost:8000/api/obras
```

Deberías ver la obra CASTELLO E en JSON.

### 2.3 Desplegar en Render

#### Opción A: Deploy desde GitHub

1. **Sube tu código a GitHub**:
   ```bash
   git add backend/
   git commit -m "Add FastAPI backend"
   git push origin main
   ```

2. **En Render**:
   - Ve a [https://render.com](https://render.com)
   - Clic en "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: `idp-backend-api`
     - **Region**: Oregon (US West) o el más cercano
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Python 3`
     - **Build Command**:
       ```
       pip install -r requirements.txt
       ```
     - **Start Command**:
       ```
       uvicorn main:app --host 0.0.0.0 --port $PORT
       ```

3. **Variables de Entorno en Render**:
   - Clic en "Environment"
   - Agregar variable:
     - **Key**: `DATABASE_URL`
     - **Value**: (pega tu connection string de Supabase)
   
4. Clic en "Create Web Service"

5. Espera a que se complete el deploy (~3-5 minutos)

6. Una vez completado, obtendrás una URL como:
   ```
   https://idp-backend-api.onrender.com
   ```

7. Prueba que funcione:
   ```
   https://idp-backend-api.onrender.com/health
   ```

---

## ⚛️ PASO 3: Configurar el Frontend React

### 3.1 Activar el ApiProvider

Edita el archivo `/src/app/providers/index.ts`:

```typescript
// MODO MOCK (Desarrollo Local - SIN backend)
// export const dataProvider = MockProvider;

// MODO API (Producción - CON backend FastAPI)
import { ApiProvider } from "./ApiProvider";
export const dataProvider = new ApiProvider();
```

### 3.2 Configurar la Variable de Entorno

Crea un archivo `.env` en la **raíz del proyecto** (NO en `/backend`):

```env
# URL del backend FastAPI
VITE_API_URL=https://idp-backend-api.onrender.com
```

**Para desarrollo local** (si el backend está en localhost):
```env
VITE_API_URL=http://localhost:8000
```

### 3.3 Probar Localmente

```bash
# En la raíz del proyecto (NO en /backend)
pnpm run dev
```

Abre el navegador en `http://localhost:5173`

**Verifica que se conecte al backend**:
1. Abre las DevTools (F12)
2. Ve a la pestaña **Network**
3. Navega por los módulos
4. Deberías ver peticiones HTTP a:
   ```
   http://localhost:8000/api/obras
   http://localhost:8000/api/proveedores
   ```

---

## 🌐 PASO 4: Desplegar el Frontend en Render

### 4.1 Configurar el Deploy

1. En Render, clic en "New" → "Static Site"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `idp-frontend`
   - **Branch**: `main`
   - **Build Command**:
     ```
     pnpm install && pnpm run build
     ```
   - **Publish Directory**: `dist`

4. **Variables de Entorno**:
   - Agregar variable:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://idp-backend-api.onrender.com`

5. Clic en "Create Static Site"

6. Espera a que se complete el deploy (~5 minutos)

7. Obtendrás una URL como:
   ```
   https://idp-frontend.onrender.com
   ```

---

## ✅ PASO 5: Verificar la Integración End-to-End

### 5.1 Prueba de Creación (CREATE)

1. Abre el frontend en producción
2. Ve al módulo de **Compras** (Órdenes de Compra)
3. Clic en "Nueva Orden de Compra"
4. Llena el formulario:
   - Obra: CASTELLO E (227)
   - Proveedor: Cementos Cruz Azul
   - Items: Agrega al menos 1 item
5. Clic en "Crear"
6. **Verificación**:
   - Debería aparecer en la tabla de OCs
   - Abre Supabase → Table Editor → `ordenes_compra`
   - Deberías ver la nueva OC en la base de datos

### 5.2 Prueba de Lectura (READ)

1. Refresca la página (F5)
2. La OC que acabas de crear **debe seguir ahí**
3. Esto confirma que la persistencia funciona

### 5.3 Prueba de Actualización (UPDATE)

1. Edita la OC que creaste
2. Cambia el estado a "Recibida"
3. Verifica en Supabase que el estado se actualizó

### 5.4 Prueba de Eliminación (DELETE)

1. Elimina una OC de prueba
2. Verifica que desapareció de la tabla
3. Confirma en Supabase que se eliminó

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Network request failed"

**Causa**: El frontend no puede conectarse al backend.

**Solución**:
1. Verifica que `VITE_API_URL` esté configurado correctamente
2. Asegúrate de que el backend esté desplegado y funcionando
3. Prueba el health check del backend directamente

### Error: "CORS policy"

**Causa**: El backend no permite peticiones desde el frontend.

**Solución**: El backend FastAPI ya tiene CORS habilitado con `allow_origins=["*"]`. Si el error persiste:
1. Verifica que el backend se haya desplegado correctamente
2. Revisa los logs del backend en Render

### Error: "Database connection failed"

**Causa**: El backend no puede conectarse a Supabase.

**Solución**:
1. Verifica que `DATABASE_URL` esté configurado en Render
2. Confirma que la contraseña es correcta
3. Asegúrate de que la IP de Render no esté bloqueada en Supabase (por defecto, Supabase permite todas las IPs)

### La página se queda en blanco

**Causa**: Error en el código frontend.

**Solución**:
1. Abre DevTools (F12) → Console
2. Busca errores en rojo
3. Si dice "dataProvider is not defined", asegúrate de haber activado ApiProvider en `/src/app/providers/index.ts`

---

## 📊 ARQUITECTURA FINAL

```
┌─────────────────────────────────────────────┐
│        FRONTEND (React + Vite)              │
│   https://idp-frontend.onrender.com         │
│                                             │
│   ┌─────────────────────────────────┐      │
│   │  ApiProvider                     │      │
│   │  • Hace peticiones HTTP         │      │
│   │  • CRUD completo                │      │
│   └─────────────┬───────────────────┘      │
└─────────────────┼───────────────────────────┘
                  │ HTTP (Fetch API)
                  │
                  ▼
┌─────────────────────────────────────────────┐
│      BACKEND (FastAPI + Python)             │
│  https://idp-backend-api.onrender.com       │
│                                             │
│   ┌─────────────────────────────────┐      │
│   │  main.py                         │      │
│   │  • Endpoints REST                │      │
│   │  • Pydantic validación          │      │
│   │  • asyncpg (DB driver)          │      │
│   └─────────────┬───────────────────┘      │
└─────────────────┼───────────────────────────┘
                  │ SQL (asyncpg)
                  │
                  ▼
┌─────────────────────────────────────────────┐
│     DATABASE (Supabase PostgreSQL)          │
│   db.xxx.supabase.co:5432                   │
│                                             │
│   • 9 tablas con relaciones                │
│   • Triggers automáticos                   │
│   • Datos iniciales (SEED)                 │
└─────────────────────────────────────────────┘
```

---

## 🎯 CHECKLIST DE ENTREGABLES

- [x] **Esquema SQL** en `/database/schema.sql`
  - 9 tablas
  - Relaciones (FK, CASCADE)
  - Triggers para updated_at
  - Datos de prueba (1 obra, 10 proveedores)

- [x] **Backend FastAPI** en `/backend/main.py`
  - 1 solo archivo (main.py)
  - CRUD completo para:
    - Obras
    - Proveedores
    - Requisiciones
    - Órdenes de Compra
    - Pagos
    - Destajos
    - Usuarios
  - Generación automática de números (REQ-XXX, OC-XXX, PAG-XXX)
  - Conexión a PostgreSQL con asyncpg
  - Documentación automática en `/docs`

- [x] **Frontend React** actualizado
  - ApiProvider conectado a FastAPI
  - Rutas con prefijo `/api`
  - Variable de entorno `VITE_API_URL`

- [x] **Generador de PDF** actualizado
  - Usa jsPDF + autoTable
  - Logo alterno de IDP
  - Formato profesional completo

- [x] **Persistencia real**
  - UI → FastAPI → Supabase → FastAPI → UI
  - Crear → Refrescar → Sigue ahí ✅

---

## 📞 SOPORTE Y AYUDA

Si tienes problemas con el despliegue:

1. **Logs del Backend**:
   - En Render, ve a tu servicio → Logs
   - Busca mensajes de error

2. **Logs del Frontend**:
   - Abre DevTools (F12) → Console
   - Busca errores en rojo

3. **Base de Datos**:
   - En Supabase, ve a SQL Editor
   - Ejecuta:
     ```sql
     SELECT * FROM obras;
     SELECT * FROM proveedores;
     ```
   - Verifica que los datos existan

---

## 🎉 ¡LISTO!

Tu sistema está completamente funcional con:

✅ Base de datos SQL en Supabase  
✅ Backend FastAPI desplegado  
✅ Frontend React desplegado  
✅ Persistencia real end-to-end  
✅ PDFs generados dinámicamente  

---

**Fin de la Guía de Despliegue Completo**
