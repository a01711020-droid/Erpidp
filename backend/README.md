# 🚀 Backend FastAPI + Supabase - Guía Completa

## 📋 Descripción

Backend con **FastAPI** que se conecta a **Supabase PostgreSQL** para manejar:

✅ **Distribución automática de gastos indirectos** ($85,000/mes) entre obras  
✅ **Validación de líneas de crédito** de proveedores  
✅ **Alertas de vencimientos** según días de crédito  
✅ **Reportes financieros** por obra  
✅ **Estadísticas de compras** y dashboard  
✅ **Cálculos automáticos** de OCs, descuentos, IVA  
✅ **Lógica de negocio compleja**  

---

## 🏗️ Arquitectura

```
Frontend (Figma Make)
       ↓
   ┌────────────────┐
   │   Supabase     │ → APIs CRUD automáticas
   │  (PostgreSQL)  │ → Auth + Storage
   └────────────────┘
       ↓
   ┌────────────────┐
   │    FastAPI     │ → Lógica compleja
   │   (Backend)    │ → Cálculos + Validaciones
   └────────────────┘
```

---

## 📁 Estructura de Archivos

```
backend/
├── main.py              # Aplicación FastAPI principal
├── schemas.py           # Schemas Pydantic (validación)
├── database.py          # Conexión a Supabase PostgreSQL
├── requirements.txt     # Dependencias Python
├── .env.example         # Ejemplo de variables de entorno
├── .env                 # TU ARCHIVO (no commitear)
└── README.md            # Esta guía
```

---

## 🚀 OPCIÓN 1: Deploy en Render.com (Recomendado - GRATIS)

### **Paso 1: Crear cuenta en Render**
1. Ve a https://render.com
2. Sign up con GitHub
3. ✅ **Plan gratuito** con PostgreSQL incluido

### **Paso 2: Crear PostgreSQL Database**
1. En Render Dashboard → **New** → **PostgreSQL**
2. Name: `constructora-db`
3. Database: `constructora_db`
4. User: `constructora_user`
5. Region: `Oregon (US West)` (más cercano a México)
6. Plan: **Free** ($0/mes)
7. Click **Create Database**
8. **IMPORTANTE:** Guarda las credenciales:
   - Internal Database URL
   - External Database URL
   - PSQL Command

### **Paso 3: Subir código a GitHub**
```bash
cd backend
git init
git add .
git commit -m "Backend FastAPI inicial"
git remote add origin https://github.com/tu-usuario/backend-constructora.git
git push -u origin main
```

### **Paso 4: Deploy FastAPI en Render**
1. Dashboard → **New** → **Web Service**
2. Connect tu repositorio de GitHub
3. Configuración:
   - **Name**: `api-constructora`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend` (si está en subcarpeta) o déjalo vacío
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free** ($0/mes)

### **Paso 5: Configurar variables de entorno**
En Render Web Service → **Environment**:

```bash
# Credenciales de la base de datos (copia desde PostgreSQL Database)
DATABASE_URL=postgresql://constructora_user:PASSWORD@dpg-XXXXX.oregon-postgres.render.com/constructora_db

# O manualmente:
SUPABASE_DB_HOST=dpg-XXXXX.oregon-postgres.render.com
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=constructora_db
SUPABASE_DB_USER=constructora_user
SUPABASE_DB_PASSWORD=tu_password_generado

# FastAPI
PORT=10000
ENVIRONMENT=production
ALLOWED_ORIGINS=https://tu-frontend.com,http://localhost:5173
```

### **Paso 6: Deploy automático**
Render desplegará automáticamente tu API en:
```
https://api-constructora.onrender.com
```

### **Paso 7: Aplicar migración a la base de datos**
```bash
# Opción A: Desde tu máquina local
psql "postgresql://constructora_user:PASSWORD@dpg-XXXXX.oregon-postgres.render.com/constructora_db" < migrations/001_initial_schema.sql

# Opción B: Desde Render Dashboard
# PostgreSQL Database → Connect → PSQL Command
# Copia y pega el contenido de 001_initial_schema.sql
```

### **Paso 8: Verificar**
```bash
curl https://api-constructora.onrender.com/health
```

**✅ VENTAJAS DE RENDER:**
- 💰 Completamente GRATIS (750 horas/mes)
- 🔄 Auto-deploy desde GitHub
- 🗄️ PostgreSQL incluido gratis
- 🌎 SSL/HTTPS automático
- 📊 Logs en tiempo real
- 🚫 NO requiere tarjeta de crédito

**⚠️ LIMITACIONES DEL PLAN GRATUITO:**
- La app se "duerme" después de 15 minutos sin uso
- Primera petición después de dormir tarda ~30 segundos
- 512 MB RAM
- Shared CPU
- **Suficiente para desarrollo y demos**

---

## 🚀 OPCIÓN 2: Deploy en Railway.app (Alternativa - $5/mes)

### **Paso 1: Crear cuenta en Railway**
1. Ve a https://railway.app
2. Sign up con GitHub
3. ✅ Tienes $5 de crédito al mes

### **Paso 2: Deploy**
1. Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Selecciona tu repositorio
4. Railway detecta Python automáticamente

### **Paso 3: Agregar PostgreSQL**
1. En tu proyecto → **New** → **Database** → **PostgreSQL**
2. Railway automáticamente conecta la base de datos

### **Paso 4: Variables de entorno**
```bash
SUPABASE_DB_HOST=${{Postgres.PGHOST}}
SUPABASE_DB_PORT=${{Postgres.PGPORT}}
SUPABASE_DB_NAME=${{Postgres.PGDATABASE}}
SUPABASE_DB_USER=${{Postgres.PGUSER}}
SUPABASE_DB_PASSWORD=${{Postgres.PGPASSWORD}}
PORT=8000
```

Railway te dará una URL:
```
https://tu-proyecto.up.railway.app
```

**✅ VENTAJAS DE RAILWAY:**
- ⚡ Más rápido (no se duerme)
- 🎯 Mejor para producción
- 💪 Más recursos (8 GB RAM, 8 vCPU compartidos)

**💰 COSTO:**
- $5/mes incluidos en el plan
- Uso adicional se cobra del crédito

---

## 🚀 OPCIÓN 3: Desarrollo Local

### **Paso 1: Instalar dependencias**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### **Paso 2: Configurar .env**
```bash
cp .env.example .env
nano .env  # Editar con tus credenciales
```

### **Paso 3: Ejecutar**
```bash
uvicorn main:app --reload --port 8000
```

### **Paso 4: Ver documentación**
Abre en tu navegador:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📊 Endpoints Disponibles

### **1. Distribución de Gastos Indirectos**
```http
POST /api/gastos-indirectos/calcular-distribucion?mes=2025-01
```
**Calcula** y **guarda** la distribución proporcional de $85,000 entre obras.

```http
GET /api/gastos-indirectos/distribucion/2025-01
```
**Obtiene** la distribución ya calculada.

---

### **2. Reportes Financieros**
```http
GET /api/reportes/obra-financiero/{obra_id}?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
```
Genera reporte completo de una obra:
- Total OCs
- Total destajos
- Total pagado
- Pendiente de pago
- Gastos directos
- Gastos indirectos asignados

---

### **3. Validación de Línea de Crédito**
```http
POST /api/proveedores/validar-linea-credito
{
  "proveedor_id": "uuid-del-proveedor",
  "monto_nuevo": 50000.00
}
```
Valida si el proveedor tiene línea de crédito disponible.

---

### **4. Alertas de Vencimientos**
```http
GET /api/alertas/vencimientos-credito
```
Retorna órdenes próximas a vencer según días de crédito del proveedor.

**Niveles de urgencia:**
- 🔴 **vencido**: Ya pasó la fecha
- 🟠 **critico**: ≤ 7 días
- 🟠 **urgente**: ≤ 15 días
- 🟢 **normal**: > 15 días

---

### **5. Estadísticas de Compras**
```http
GET /api/estadisticas/compras?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
```
Dashboard completo con:
- Total órdenes y montos
- Órdenes por estado
- Top 5 proveedores
- Top 5 obras
- Total ahorrado en descuentos

---

## 🔧 Integración con Frontend

### **Archivo de servicio para el frontend:**

Crea `/src/services/fastapi.ts`:

```typescript
const FASTAPI_URL = "https://tu-api.railway.app";

export const fastApiService = {
  // Distribución de gastos indirectos
  async calcularDistribucionGastosIndirectos(mes: string) {
    const response = await fetch(
      `${FASTAPI_URL}/api/gastos-indirectos/calcular-distribucion?mes=${mes}`,
      { method: "POST" }
    );
    return response.json();
  },

  async obtenerDistribucionMes(mes: string) {
    const response = await fetch(
      `${FASTAPI_URL}/api/gastos-indirectos/distribucion/${mes}`
    );
    return response.json();
  },

  // Reportes financieros
  async obtenerReporteObraFinanciero(
    obraId: string,
    fechaInicio: string,
    fechaFin: string
  ) {
    const response = await fetch(
      `${FASTAPI_URL}/api/reportes/obra-financiero/${obraId}?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
    );
    return response.json();
  },

  // Validación línea de crédito
  async validarLineaCredito(proveedorId: string, montoNuevo: number) {
    const response = await fetch(
      `${FASTAPI_URL}/api/proveedores/validar-linea-credito`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedor_id: proveedorId,
          monto_nuevo: montoNuevo,
        }),
      }
    );
    return response.json();
  },

  // Alertas de vencimientos
  async obtenerAlertasVencimiento() {
    const response = await fetch(
      `${FASTAPI_URL}/api/alertas/vencimientos-credito`
    );
    return response.json();
  },

  // Estadísticas
  async obtenerEstadisticasCompras(fechaInicio: string, fechaFin: string) {
    const response = await fetch(
      `${FASTAPI_URL}/api/estadisticas/compras?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
    );
    return response.json();
  },
};
```

---

## 🔐 Seguridad y Autenticación

### **Para agregar autenticación JWT:**

1. Instala dependencia adicional (ya en requirements.txt):
```bash
pip install python-jose[cryptography] passlib[bcrypt]
```

2. Agrega endpoints de auth en `main.py`:
```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

# Ver ejemplos completos en la documentación de FastAPI
```

---

## 📝 Migraciones de Base de Datos

### **Aplicar la migración inicial:**

1. Ve a tu dashboard de Supabase
2. SQL Editor → New Query
3. Copia y pega el contenido de `/supabase/migrations/001_initial_schema.sql`
4. Ejecuta

Esto creará todas las tablas:
- ✅ obras
- ✅ proveedores
- ✅ usuarios
- ✅ requisiciones
- ✅ ordenes_compra
- ✅ pagos
- ✅ destajos
- ✅ gastos_directos
- ✅ gastos_indirectos
- ✅ distribucion_gastos_indirectos
- ✅ balance_dinero

---

## 🧪 Testing

### **Probar endpoints con curl:**

```bash
# Health check
curl http://localhost:8000/health

# Calcular distribución
curl -X POST "http://localhost:8000/api/gastos-indirectos/calcular-distribucion?mes=2025-01"

# Obtener distribución
curl "http://localhost:8000/api/gastos-indirectos/distribucion/2025-01"

# Alertas
curl "http://localhost:8000/api/alertas/vencimientos-credito"
```

### **O usar la documentación interactiva:**
http://localhost:8000/docs

---

## 📊 Monitoreo

### **Logs en Railway:**
```
Dashboard → Deployment → Logs
```

### **Logs en Render:**
```
Dashboard → Logs (en tiempo real)
```

### **Logs locales:**
```bash
uvicorn main:app --reload --log-level debug
```

---

## 🔥 Próximas Funcionalidades

Endpoints que puedes agregar fácilmente:

- [ ] Generación automática de códigos de OC
- [ ] Generación automática de códigos de requisiciones
- [ ] Cálculo automático de subtotales/IVA
- [ ] Importación masiva de destajos desde Excel
- [ ] Conciliación bancaria automática
- [ ] Análisis de destajos por obra/destajista
- [ ] Predicción de gastos con ML
- [ ] Exportación de reportes a PDF/Excel

---

## 🆘 Troubleshooting

### **Error: Connection refused**
- Verifica que las credenciales de Supabase sean correctas
- Verifica que el firewall permita conexiones desde tu IP/servidor

### **Error: Module not found**
```bash
pip install -r requirements.txt
```

### **Error: CORS**
Agrega tu dominio de frontend en `main.py`:
```python
allow_origins=["https://tu-frontend.com"]
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Prueba los endpoints en `/docs`
4. Revisa la conexión a Supabase

---

## ✅ Checklist de Deploy

- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway/Render
- [ ] Variables de entorno configuradas
- [ ] Migración de BD aplicada en Supabase
- [ ] API desplegada y funcionando
- [ ] `/health` responde OK
- [ ] Frontend conectado a la API
- [ ] CORS configurado correctamente

---

**¡Listo! Tu backend FastAPI + Supabase está funcionando** 🚀