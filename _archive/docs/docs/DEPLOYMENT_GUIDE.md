# 🚀 Guía de Deployment - IDP ERP

## 📦 Extracción del Frontend

Este frontend está **100% listo para producción** y es completamente transportable.

### Opción 1: Exportar como Proyecto Independiente

```bash
# 1. Clonar o descargar todo el proyecto
git clone <tu-repo> idp-erp
cd idp-erp

# 2. Instalar dependencias
npm install

# 3. Build de producción
npm run build

# 4. La carpeta /dist contiene tu app lista para deployment
# Puedes subirla a cualquier hosting estático:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Firebase Hosting
# - GitHub Pages
```

**Estructura del build:**
```
/dist/
  ├── index.html
  ├── assets/
  │   ├── index-abc123.js    # Tu código compilado
  │   ├── index-def456.css   # Estilos
  │   └── logos/             # Assets estáticos
  └── spec/mock-db/          # Mock data (opcional en prod)
```

---

## 🔌 Opciones de Backend (Ordenadas por Recomendación)

### 🥇 **Opción 1: FastAPI + Supabase (RECOMENDADO)**

**Por qué es la mejor opción:**
- ✅ FastAPI es Python (rápido de desarrollar)
- ✅ Supabase maneja DB, Auth, Storage automáticamente
- ✅ Compatible con Codex para auto-generar endpoints
- ✅ PostgreSQL robusto y relacional
- ✅ Real-time subscriptions incluido
- ✅ Row Level Security (RLS) para permisos

**Stack completo:**
```
Frontend (React + TypeScript)
    ↓ HTTP/REST
Backend (FastAPI - Python)
    ↓ SQL
Database (Supabase PostgreSQL)
    ↓
Storage (Supabase Storage para PDFs/XMLs)
Auth (Supabase Auth para login)
```

**Pasos de integración:**

#### 1. Crear proyecto Supabase
```bash
# Ir a https://supabase.com
# Crear nuevo proyecto
# Copiar: 
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

#### 2. Migrar el schema SQL
```bash
# Usar /spec/mock-db/schema.sql
# Ir a Supabase Dashboard → SQL Editor
# Pegar y ejecutar schema.sql completo
```

#### 3. Crear backend FastAPI
```python
# /backend/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os

app = FastAPI(title="IDP ERP API")

# CORS para permitir requests del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://tu-dominio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cliente Supabase
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

# Endpoints que coinciden con IDataAdapter
@app.get("/api/v1/obras")
async def list_obras(estatus: str = None):
    query = supabase.table("obras").select("*")
    if estatus:
        query = query.eq("estatus", estatus)
    result = query.execute()
    return {"status": "success", "data": result.data, "error": None}

@app.get("/api/v1/obras/{obra_id}")
async def get_obra(obra_id: str):
    result = supabase.table("obras").select("*").eq("obra_id", obra_id).single().execute()
    return {"status": "success", "data": result.data, "error": None}

@app.post("/api/v1/obras")
async def create_obra(obra: dict):
    result = supabase.table("obras").insert(obra).execute()
    return {"status": "success", "data": result.data[0], "error": None}

# ... más endpoints siguiendo IDataAdapter
```

#### 4. Crear apiAdapter.ts en el frontend
```typescript
// /src/core/data/apiAdapter.ts
import type { IDataAdapter, ListResponse, DataResponse } from './dataAdapter';
import type { Obra, CreateObraDTO } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiDataAdapter implements IDataAdapter {
  async listObras(filters?: { estatus?: string }): Promise<ListResponse<Obra>> {
    const params = new URLSearchParams();
    if (filters?.estatus) params.set('estatus', filters.estatus);
    
    const response = await fetch(`${API_BASE_URL}/obras?${params}`);
    const json = await response.json();
    
    return {
      status: json.status,
      data: json.data || [],
      error: json.error,
      total: json.total,
    };
  }
  
  async getObra(obraId: string): Promise<DataResponse<Obra>> {
    const response = await fetch(`${API_BASE_URL}/obras/${obraId}`);
    const json = await response.json();
    return json;
  }
  
  async createObra(data: CreateObraDTO): Promise<DataResponse<Obra>> {
    const response = await fetch(`${API_BASE_URL}/obras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  }
  
  // ... implementar todos los métodos de IDataAdapter
}

export const apiAdapter = new ApiDataAdapter();
```

#### 5. Activar el apiAdapter
```typescript
// /src/core/data/index.ts
import { mockAdapter } from './mockAdapter';
import { apiAdapter } from './apiAdapter';
import { MOCK_MODE } from '../config';

export const dataAdapter = MOCK_MODE ? mockAdapter : apiAdapter;
```

```typescript
// /src/core/config.ts
export const MOCK_MODE = false; // ← Cambiar a false
export const API_BASE_URL = 'https://tu-backend.herokuapp.com/api/v1';
```

#### 6. Variables de entorno
```bash
# Frontend: .env
VITE_API_BASE_URL=https://tu-backend.herokuapp.com/api/v1

# Backend: .env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 🥈 **Opción 2: Node.js + Express + PostgreSQL**

**Stack:**
```
Frontend → Express API → PostgreSQL (Railway/Render)
```

**Ventajas:**
- Todo en JavaScript/TypeScript
- Ecosystem enorme (npm)
- Fácil de deployar

**Ejemplo:**
```typescript
// /backend/src/server.ts
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

app.get('/api/v1/obras', async (req, res) => {
  const { estatus } = req.query;
  let query = 'SELECT * FROM obras';
  const params = [];
  
  if (estatus) {
    query += ' WHERE estatus = $1';
    params.push(estatus);
  }
  
  const result = await pool.query(query, params);
  res.json({ status: 'success', data: result.rows, error: null });
});

// ... más endpoints
```

---

### 🥉 **Opción 3: Firebase (Backend as a Service)**

**Stack:**
```
Frontend → Cloud Functions → Firestore
```

**Ventajas:**
- Cero configuración de servidor
- Hosting + DB + Functions todo integrado
- Escalado automático

**Desventaja:**
- Firestore es NoSQL (tu schema es relacional)
- Tendrías que adaptar el modelo de datos

---

### 🏆 **Opción 4: Backend Auto-Generado con Codex**

**Flujo ideal:**

1. **Darle a Codex el schema SQL:**
```
"Genera un backend FastAPI completo que implemente estos endpoints 
basándote en /spec/mock-db/schema.sql y la interfaz IDataAdapter 
de /src/core/data/dataAdapter.ts"
```

2. **Codex generará:**
- `main.py` con todos los endpoints
- Modelos Pydantic para validación
- Conexión a Supabase
- Documentación automática (Swagger)

3. **Resultado:**
```
/backend/
  ├── main.py              # API completa
  ├── models.py            # Pydantic models
  ├── database.py          # Supabase client
  ├── routers/
  │   ├── obras.py
  │   ├── proveedores.py
  │   ├── ordenes_compra.py
  │   └── pagos.py
  └── requirements.txt
```

---

## 🌐 Opciones de Hosting

### Frontend (React Build)

| Servicio | Precio | Ventajas |
|----------|--------|----------|
| **Vercel** | Gratis | Deploy automático con Git, CDN global |
| **Netlify** | Gratis | CI/CD integrado, previews |
| **Cloudflare Pages** | Gratis | CDN ultra rápido |
| **AWS S3 + CloudFront** | ~$5/mes | Control total, escalable |
| **Firebase Hosting** | Gratis | Integración con Firebase |

### Backend (API)

| Servicio | Precio | Ventajas |
|----------|--------|----------|
| **Railway** | $5/mes | Postgres incluido, fácil deploy |
| **Render** | Gratis | Auto-deploy, Postgres gratis (limitado) |
| **Fly.io** | Gratis (pequeño) | Buen free tier |
| **Heroku** | $7/mes | Clásico, confiable |
| **AWS EC2** | Variable | Máximo control |
| **Digital Ocean App Platform** | $5/mes | Simple y predecible |

### Database

| Servicio | Precio | Ventajas |
|----------|--------|----------|
| **Supabase** | Gratis hasta 500MB | Postgres + Auth + Storage |
| **Railway Postgres** | Incluido en plan | Fácil integración |
| **Neon** | Gratis | Serverless Postgres |
| **PlanetScale** | Gratis | MySQL serverless |

---

## 🎯 Configuración Recomendada para Producción

### Setup Profesional:

```
┌─────────────────────────────────────────┐
│  FRONTEND (Vercel)                      │
│  https://idp-erp.vercel.app             │
│  - React app en /dist                   │
│  - CDN global                           │
│  - SSL automático                       │
└──────────────┬──────────────────────────┘
               │ HTTPS/REST
               ▼
┌─────────────────────────────────────────┐
│  BACKEND (Railway)                      │
│  https://api-idp.railway.app            │
│  - FastAPI app                          │
│  - Auto-deploy desde Git                │
│  - Environment variables                │
└──────────────┬──────────────────────────┘
               │ PostgreSQL
               ▼
┌─────────────────────────────────────────┐
│  DATABASE (Supabase)                    │
│  - PostgreSQL 15                        │
│  - Backups automáticos                  │
│  - Row Level Security                   │
└─────────────────────────────────────────┘
```

**Costo total:** ~$5-10/mes (o gratis con free tiers)

---

## 📋 Checklist de Deployment

### Pre-deployment

- [ ] Ejecutar `npm run build` sin errores
- [ ] Probar en modo producción local (`npm run preview`)
- [ ] Verificar que todas las rutas funcionan
- [ ] Revisar console errors en navegador
- [ ] Configurar variables de entorno correctas

### Backend Setup

- [ ] Crear proyecto en Supabase
- [ ] Ejecutar `schema.sql` en Supabase SQL Editor
- [ ] Crear backend con FastAPI o Express
- [ ] Implementar todos los endpoints de `IDataAdapter`
- [ ] Probar endpoints con Postman/Thunder Client
- [ ] Configurar CORS correctamente
- [ ] Deploy del backend (Railway/Render)
- [ ] Verificar que la API esté accesible

### Frontend Setup

- [ ] Crear `apiAdapter.ts`
- [ ] Cambiar `MOCK_MODE = false`
- [ ] Configurar `VITE_API_BASE_URL` con URL del backend
- [ ] Build final (`npm run build`)
- [ ] Deploy del frontend (Vercel/Netlify)
- [ ] Probar en producción

### Post-deployment

- [ ] Configurar dominio personalizado (opcional)
- [ ] Setup SSL/HTTPS (automático en Vercel/Netlify)
- [ ] Configurar monitoring (Sentry, LogRocket)
- [ ] Setup analytics (Google Analytics, Plausible)
- [ ] Configurar backups de base de datos
- [ ] Documentar credenciales de acceso

---

## 🔥 Quick Start: Deployment en 30 minutos

### Opción Express (Más Rápida)

1. **Backend:**
```bash
# Crear carpeta backend
mkdir backend && cd backend
npm init -y
npm install express cors pg dotenv

# Copiar schema.sql a Supabase Dashboard

# Crear index.js con endpoints básicos
# Deploy a Railway: conectar GitHub repo
```

2. **Frontend:**
```bash
# Crear apiAdapter.ts (copiar mockAdapter y cambiar fetchers)
# Cambiar MOCK_MODE = false
npm run build
# Deploy a Vercel: vercel --prod
```

3. **Listo!** Tu app está en producción.

---

## 💡 Migración Gradual (Recomendado)

No tienes que migrar todo de golpe. Puedes hacer migración incremental:

### Fase 1: Solo lectura
```typescript
// Usar API para GET, mock para POST/PUT/DELETE
async listObras() {
  return await apiAdapter.listObras(); // API real
}

async createObra(data) {
  return await mockAdapter.createObra(data); // Aún mock
}
```

### Fase 2: CRUD completo
```typescript
// Toda la lógica en API
export const dataAdapter = apiAdapter;
```

### Fase 3: Optimizaciones
- Agregar caché
- Implementar paginación real
- WebSockets para real-time
- Optimistic UI updates

---

## 🛠️ Herramientas Útiles

### Testing de API
- **Postman** - GUI para probar endpoints
- **Thunder Client** - Extension de VS Code
- **Insomnia** - Alternativa a Postman

### Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - APM completo

### DevOps
- **GitHub Actions** - CI/CD automático
- **Docker** - Containerización
- **Railway** - Deploy con un click

---

## 📞 Soporte para Integración con Codex

Cuando uses Codex para generar el backend, dale estos archivos:

1. `/spec/mock-db/schema.sql` - Para crear las tablas
2. `/src/core/data/dataAdapter.ts` - Para conocer la interfaz
3. `/src/core/data/types.ts` - Para los tipos de datos
4. Esta guía - Para entender la arquitectura

**Prompt para Codex:**
```
Genera un backend FastAPI completo que:
1. Use Supabase PostgreSQL con el schema de schema.sql
2. Implemente todos los métodos de IDataAdapter
3. Retorne objetos con formato: { status, data, error }
4. Maneje CORS para frontend en Vercel
5. Incluya validación con Pydantic
6. Tenga documentación Swagger automática

Estructura de carpetas:
/backend/
  ├── main.py
  ├── models/
  ├── routers/
  └── database.py
```

---

**Última actualización:** 2025-01-28  
**Autor:** Equipo IDP  
**Versión:** 1.0.0
