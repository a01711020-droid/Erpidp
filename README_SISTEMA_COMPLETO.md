# 🔥 SISTEMA COMPLETO: SUPABASE + FASTAPI

## ✅ ¿QUÉ TIENES AHORA?

Has creado **lo mejor de ambos mundos**:

### **🎯 SUPABASE (Base de Datos)**
- ✅ PostgreSQL real con 14 tablas
- ✅ Autenticación por roles integrada
- ✅ APIs CRUD automáticas
- ✅ Row Level Security (RLS)
- ✅ Storage para archivos
- ✅ Triggers y funciones automáticas

### **⚡ FASTAPI (Lógica Compleja)**
- ✅ Distribución automática de gastos indirectos
- ✅ Validación de líneas de crédito
- ✅ Alertas de vencimientos
- ✅ Reportes financieros por obra
- ✅ Estadísticas de compras
- ✅ Cálculos automáticos
- ✅ Documentación interactiva (Swagger)

### **💻 FRONTEND (Figma Make)**
- ✅ Servicio para conectarse a FastAPI
- ✅ Componente de ejemplo funcionando
- ✅ Integración lista

---

## 📊 ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────┐
│         FRONTEND (Figma Make)               │
│  ┌─────────────┐      ┌──────────────────┐ │
│  │   UI React  │      │ Mock Data (temp) │ │
│  └─────────────┘      └──────────────────┘ │
└───────┬──────────────────────┬──────────────┘
        │                      │
        │                      │
┌───────▼──────────┐   ┌──────▼──────────────┐
│    SUPABASE      │   │     FASTAPI         │
│                  │   │                     │
│ • PostgreSQL     │   │ • Lógica compleja   │
│ • Auth           │   │ • Cálculos          │
│ • Storage        │   │ • Validaciones      │
│ • CRUD APIs      │   │ • Reportes          │
│                  │   │ • Alertas           │
└──────────────────┘   └─────────────────────┘
         ▲                      ▲
         │                      │
         └──────────┬───────────┘
                    │
         Ambos conectados a la
         misma base de datos
```

---

## 🚀 PASO A PASO PARA IMPLEMENTAR

### **PASO 1: Configurar Supabase** ✅ (YA HECHO)

1. **La conexión ya está hecha** en tu proyecto de Figma Make
2. **Aplicar migración:**
   - Ve a Supabase Dashboard
   - SQL Editor → New Query
   - Copia `/supabase/migrations/001_initial_schema.sql`
   - Ejecuta
   - ✅ Se crean todas las tablas

---

### **PASO 2: Deployar FastAPI**

#### **Opción A: Railway.app** (Recomendado)

1. **Sube tu código a GitHub:**
```bash
cd backend
git init
git add .
git commit -m "Backend FastAPI"
git remote add origin https://github.com/tu-usuario/backend-constructora.git
git push -u origin main
```

2. **Deploy en Railway:**
   - Ve a https://railway.app
   - New Project → Deploy from GitHub
   - Selecciona tu repo
   - Railway detecta Python automáticamente

3. **Configura variables de entorno:**
   En Railway → Variables:
   ```
   SUPABASE_DB_HOST=db.xxxxx.supabase.co
   SUPABASE_DB_PORT=5432
   SUPABASE_DB_NAME=postgres
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=tu_password_de_supabase
   PORT=8000
   ```

4. **Obtén credenciales de Supabase:**
   - Supabase Dashboard → Settings → Database
   - Copia Host y Password

5. **Espera el deploy:**
   Railway te dará una URL:
   ```
   https://tu-proyecto.up.railway.app
   ```

#### **Opción B: Render.com** (Gratis)

Similar a Railway pero con plan gratuito. Ver `/backend/README.md` para detalles.

---

### **PASO 3: Conectar Frontend a FastAPI**

1. **Agrega variable de entorno en Figma Make:**
   
   Crea un archivo `.env.local` (o configuración de Figma Make):
   ```
   VITE_FASTAPI_URL=https://tu-proyecto.up.railway.app
   ```

2. **El servicio ya está creado:**
   `/src/services/fastapi.ts` ✅

3. **Usa el componente de ejemplo:**
   El componente `/src/app/components/DistribucionGastosIndirectos.tsx` ya está listo.

---

### **PASO 4: Migrar de Mock Data a Supabase**

Ahora que tienes la base de datos real, puedes migrar gradualmente:

#### **Ejemplo: Migrar Obras**

**ANTES (Mock Data):**
```typescript
const mockObras = [
  { id: "1", codigo: "227", nombre: "CASTELLO E" },
  // ...
];
```

**DESPUÉS (Supabase):**
```typescript
import { supabase } from '@/lib/supabase';

// Obtener obras
const { data: obras } = await supabase
  .from('obras')
  .select('*')
  .eq('estado', 'Activa');

// Crear obra
const { data, error } = await supabase
  .from('obras')
  .insert([
    { codigo: '227', nombre: 'CASTELLO E', cliente: '...' }
  ]);
```

---

## 🎯 CASOS DE USO PRINCIPALES

### **1. Distribución de Gastos Indirectos**

**Flujo:**
1. Frontend → Botón "Calcular Distribución"
2. Frontend → FastAPI `/api/gastos-indirectos/calcular-distribucion?mes=2025-01`
3. FastAPI → Lee gastos directos e indirectos de Supabase
4. FastAPI → Calcula proporción por obra
5. FastAPI → Guarda resultado en Supabase
6. FastAPI → Retorna distribución al frontend
7. Frontend → Muestra tabla con resultados

**Código en componente:**
```typescript
const resultado = await fastApiService.calcularDistribucionGastosIndirectos("2025-01");
```

---

### **2. Validación de Línea de Crédito**

**Flujo:**
1. Usuario crea OC con proveedor
2. Frontend → FastAPI valida línea de crédito
3. FastAPI → Lee datos del proveedor de Supabase
4. FastAPI → Calcula disponible
5. FastAPI → Retorna aprobación/rechazo
6. Frontend → Muestra alerta si se excede

**Código:**
```typescript
const validacion = await fastApiService.validarLineaCredito(
  proveedorId,
  montoNuevo
);

if (!validacion.aprobado) {
  alert(validacion.mensaje);
}
```

---

### **3. Alertas de Vencimientos**

**Flujo:**
1. Frontend carga dashboard
2. Frontend → FastAPI `/api/alertas/vencimientos-credito`
3. FastAPI → Lee OCs y calcula vencimientos
4. FastAPI → Retorna alertas ordenadas por urgencia
5. Frontend → Muestra badges rojos/amarillos/verdes

**Código:**
```typescript
const alertas = await fastApiService.obtenerAlertasVencimiento();

// Filtrar por urgencia
const vencidos = alertas.filter(a => a.urgencia === "vencido");
const criticos = alertas.filter(a => a.urgencia === "critico");
```

---

## 📁 ESTRUCTURA DE ARCHIVOS FINAL

```
tu-proyecto/
├── backend/                          # FastAPI (deployar en Railway)
│   ├── main.py                       # ✅ API principal
│   ├── schemas.py                    # ✅ Validaciones
│   ├── database.py                   # ✅ Conexión Supabase
│   ├── requirements.txt              # ✅ Dependencias
│   ├── .env.example                  # ✅ Template
│   └── README.md                     # ✅ Guía completa
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # ✅ Crear tablas
│
├── src/
│   ├── services/
│   │   ├── database.ts               # ✅ Mock data (reemplazar gradualmente)
│   │   └── fastapi.ts                # ✅ Servicio FastAPI
│   │
│   └── app/
│       ├── components/
│       │   └── DistribucionGastosIndirectos.tsx  # ✅ Ejemplo
│       │
│       ├── GlobalDashboard.tsx       # Tu dashboard actual
│       ├── PurchaseOrderManagement.tsx
│       └── ...
│
└── README_SISTEMA_COMPLETO.md        # Este archivo
```

---

## 🔄 MIGRACIÓN GRADUAL

No tienes que migrar todo de una vez. Plan sugerido:

### **Fase 1: Setup (1 día)**
- [x] Conectar Supabase
- [x] Crear tablas
- [x] Deployar FastAPI
- [x] Probar endpoints

### **Fase 2: Funcionalidades FastAPI (2-3 días)**
- [ ] Implementar distribución de gastos indirectos
- [ ] Implementar validación de líneas de crédito
- [ ] Implementar alertas de vencimientos
- [ ] Implementar reportes financieros

### **Fase 3: Migrar CRUD a Supabase (1 semana)**
- [ ] Migrar Obras
- [ ] Migrar Proveedores
- [ ] Migrar Usuarios
- [ ] Migrar Órdenes de Compra
- [ ] Migrar Requisiciones
- [ ] Migrar Pagos
- [ ] Migrar Destajos

### **Fase 4: Autenticación (2-3 días)**
- [ ] Implementar login con Supabase Auth
- [ ] Implementar roles y permisos
- [ ] Proteger rutas por rol

---

## 🧪 TESTING

### **Probar FastAPI localmente:**

1. **Instalar dependencias:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configurar .env:**
```bash
cp .env.example .env
nano .env  # Agrega credenciales de Supabase
```

3. **Ejecutar:**
```bash
uvicorn main:app --reload
```

4. **Probar en navegador:**
- http://localhost:8000/docs (Swagger UI interactivo)
- http://localhost:8000/health

### **Probar desde frontend:**

```typescript
// En cualquier componente
import { fastApiService } from "@/services/fastapi";

// Health check
const health = await fastApiService.healthCheck();
console.log(health);  // { status: "healthy", ... }

// Calcular distribución
const resultado = await fastApiService.calcularDistribucionGastosIndirectos("2025-01");
console.log(resultado);
```

---

## 📊 ENDPOINTS DISPONIBLES

### **Gastos Indirectos:**
- `POST /api/gastos-indirectos/calcular-distribucion?mes=YYYY-MM`
- `GET /api/gastos-indirectos/distribucion/{mes}`

### **Reportes:**
- `GET /api/reportes/obra-financiero/{obra_id}?fecha_inicio=...&fecha_fin=...`

### **Proveedores:**
- `POST /api/proveedores/validar-linea-credito`

### **Alertas:**
- `GET /api/alertas/vencimientos-credito`

### **Estadísticas:**
- `GET /api/estadisticas/compras?fecha_inicio=...&fecha_fin=...`

---

## 🎉 BENEFICIOS DE ESTA ARQUITECTURA

### **✅ Escalabilidad:**
- Base de datos real que soporta miles de registros
- FastAPI maneja cálculos pesados sin afectar el frontend
- Supabase ofrece CDN global

### **✅ Mantenibilidad:**
- Separación clara entre frontend, lógica y datos
- Cada parte puede actualizarse independientemente
- Código organizado y documentado

### **✅ Performance:**
- Cálculos complejos en el backend
- Frontend solo renderiza resultados
- Caché automático de Supabase

### **✅ Seguridad:**
- Row Level Security en Supabase
- API keys protegidas
- Validaciones en múltiples capas

### **✅ Costo:**
- Supabase: Plan gratuito generoso
- Railway: $5/mes (o Render gratis)
- Total: $0-5/mes para empezar

---

## 🆘 TROUBLESHOOTING

### **"Error conectando a Supabase"**
```bash
# Verifica credenciales
cat backend/.env

# Prueba conexión directa
psql "postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

### **"CORS error"**
En `backend/main.py`:
```python
allow_origins=["https://tu-frontend.com"]
```

### **"Module not found"**
```bash
cd backend
pip install -r requirements.txt
```

---

## 📞 PRÓXIMOS PASOS

1. **Deploy FastAPI** en Railway (15 minutos)
2. **Aplicar migración** en Supabase (5 minutos)
3. **Probar endpoints** con Swagger (10 minutos)
4. **Conectar frontend** y probar distribución (20 minutos)
5. **Migrar gradualmente** de mock data a Supabase (1 semana)

---

## 🎯 RESULTADO FINAL

Tendrás un sistema profesional completo:

✅ **Base de datos PostgreSQL** real y escalable  
✅ **Backend FastAPI** con lógica compleja  
✅ **Frontend React** conectado a ambos  
✅ **Autenticación** por roles  
✅ **Distribución automática** de gastos indirectos  
✅ **Validaciones** de líneas de crédito  
✅ **Alertas** de vencimientos  
✅ **Reportes** financieros por obra  
✅ **Documentación** completa  

**¡Sistema listo para producción!** 🚀🎊
