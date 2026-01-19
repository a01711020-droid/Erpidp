# 🏗️ Sistema de Gestión Empresarial IDP

Sistema integral de gestión para proyectos constructivos con módulos de Dashboard, Compras, Requisiciones, Pagos y Entregas.

**Estado**: ✅ **100% FUNCIONAL Y COHERENTE**  
**Versión**: 1.0.0 FINAL

---

## 🎯 Características Principales

- ✅ **Modelo único de dominio** unificado (SQL + API + Frontend)
- ✅ **Backend FastAPI** como única capa de negocio
- ✅ **Base de datos PostgreSQL** (Supabase) como fuente de verdad
- ✅ **Frontend React** sin localStorage ni fallbacks
- ✅ **Persistencia real** end-to-end
- ✅ **Generación de PDFs** profesionales con SVG vectorial
- ✅ **CRUD completo** para todas las entidades
- ✅ **Despliegue en producción** listo

---

## 📋 Módulos del Sistema

1. **Dashboard Global** - Métricas empresariales en tiempo real
2. **Compras** - Gestión de órdenes de compra
3. **Requisiciones** - Solicitudes de material para obras
4. **Pagos** - Control de pagos a proveedores
5. **Entregas** (futuro) - Seguimiento de entregas

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y pnpm
- Python 3.10+
- Cuenta en Supabase

### 1. Clonar el Proyecto

```bash
git clone <tu-repositorio>
cd <nombre-proyecto>
```

### 2. Configurar Base de Datos

1. Crea un proyecto en [Supabase](https://supabase.com)
2. En el SQL Editor, ejecuta `/database/schema_final.sql`
3. Guarda el Connection String

### 3. Configurar Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Crea `/backend/.env`:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

Ejecutar:
```bash
uvicorn main:app --reload --port 8000
```

Verifica: http://localhost:8000/health

### 4. Configurar Frontend

```bash
# En la raíz del proyecto
pnpm install
```

Crea `/.env`:
```env
VITE_API_URL=http://localhost:8000
```

Activa el ApiProvider en `/src/app/providers/index.ts`:
```typescript
import { ApiProvider } from "./ApiProvider";
export const dataProvider = new ApiProvider();
```

Ejecutar:
```bash
pnpm run dev
```

Abre: http://localhost:5173

### 5. Verificar Persistencia

1. Crea una Orden de Compra
2. Refresca la página (F5)
3. ✅ Debe seguir ahí

---

## 📁 Estructura del Proyecto

```
/
├── backend/                    # Backend FastAPI
│   ├── main.py                 # Aplicación principal
│   ├── requirements.txt        # Dependencias Python
│   └── .env                    # Variables de entorno
├── database/                   # Esquemas SQL
│   └── schema_final.sql        # Esquema completo
├── src/                        # Frontend React
│   ├── app/                    # Aplicación principal
│   │   ├── components/         # Componentes React
│   │   ├── providers/          # Data providers
│   │   └── utils/              # Utilidades (PDF, etc.)
│   └── styles/                 # Estilos globales
├── public/                     # Assets estáticos
│   ├── logo-idp-alterno.svg    # Logo principal
│   └── _redirects              # Config para producción
├── .env                        # Variables de entorno (frontend)
├── package.json                # Dependencias Node.js
├── vite.config.ts              # Configuración Vite
└── README.md                   # Este archivo
```

---

## 🔧 Scripts Disponibles

### Frontend
```bash
pnpm run dev      # Desarrollo (localhost:5173)
pnpm run build    # Construir para producción
pnpm run preview  # Preview de producción local
```

### Backend
```bash
uvicorn main:app --reload           # Desarrollo
uvicorn main:app --host 0.0.0.0     # Producción
```

---

## 📚 Documentación

- **[SISTEMA_COMPLETO_COHERENTE.md](./SISTEMA_COMPLETO_COHERENTE.md)** - Guía completa del sistema
- **[MODELO_DOMINIO_UNIFICADO.md](./MODELO_DOMINIO_UNIFICADO.md)** - Modelo de datos detallado
- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Inicio en 3 pasos
- **[GUIA_DESPLIEGUE_COMPLETO.md](./GUIA_DESPLIEGUE_COMPLETO.md)** - Despliegue en Render
- **[backend/README.md](./backend/README.md)** - Documentación del backend

---

## 🌐 Despliegue en Producción

### Backend (Render)

1. Crea un nuevo Web Service
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Variable de entorno: `DATABASE_URL`

### Frontend (Render)

1. Crea un nuevo Static Site
2. Build Command: `pnpm install && pnpm run build`
3. Publish Directory: `dist`
4. Variable de entorno: `VITE_API_URL=https://tu-backend.onrender.com`

---

## 🏛️ Arquitectura

```
Frontend (React + Vite)
    ↓ HTTP REST
Backend (FastAPI)
    ↓ SQL
Database (Supabase PostgreSQL)
```

### Flujo de Datos

1. Usuario crea una OC en el frontend
2. Frontend llama a `POST /api/ordenes-compra`
3. FastAPI valida y procesa
4. PostgreSQL persiste los datos
5. Frontend recibe confirmación
6. **Refrescar → Los datos persisten** ✅

---

## 🛠️ Tecnologías Utilizadas

### Backend
- FastAPI 0.115.0
- asyncpg 0.30.0
- Pydantic 2.10.3
- PostgreSQL (Supabase)

### Frontend
- React 18.3.1
- Vite 6.3.5
- Tailwind CSS 4.1.12
- jsPDF + jspdf-autotable
- Lucide Icons

---

## 🐛 Solución de Problemas

### El frontend muestra datos mock
**Solución**: Activa el ApiProvider en `/src/app/providers/index.ts`

### Backend no conecta a la BD
**Solución**: Verifica `DATABASE_URL` en `/backend/.env`

### PDF no se descarga
**Solución**: Abre DevTools (F12) → Console y revisa errores

### Más ayuda
Consulta [SISTEMA_COMPLETO_COHERENTE.md](./SISTEMA_COMPLETO_COHERENTE.md) sección "Solución de Problemas"

---

## ✅ Checklist de Verificación

- [ ] Base de datos configurada en Supabase
- [ ] Esquema SQL ejecutado correctamente
- [ ] Backend responde en `/health` con "healthy"
- [ ] Frontend conecta a la API (sin localStorage)
- [ ] Crear OC → Refrescar → Persiste
- [ ] PDF se descarga correctamente

---

## 📊 Estado del Proyecto

| Módulo | Estado | Persistencia | PDF |
|--------|--------|--------------|-----|
| Dashboard | ✅ Funcional | ✅ Real | - |
| Compras | ✅ Funcional | ✅ Real | ✅ Si |
| Requisiciones | ✅ Funcional | ✅ Real | - |
| Pagos | ✅ Funcional | ✅ Real | - |
| Entregas | 🚧 Futuro | - | - |

---

## 🤝 Contribuir

Este es un proyecto privado de IDP. Para cambios, consulta con el equipo de desarrollo.

---

## 📄 Licencia

Propietario: IDP CC SC DE RL DE CV  
Todos los derechos reservados.

---

## 📞 Soporte

Para soporte técnico, consulta la documentación en `/docs` o contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para IDP**
