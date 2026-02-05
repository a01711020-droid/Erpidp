# 📚 Índice de Documentación - ERP IDP

## 📋 Documentación Principal

### 🎯 Inicio Rápido
- `/README.md` - **Guía principal del proyecto**
- `/REESTRUCTURACION_ESTADOS_COMPLETADA.md` - **Arquitectura actual (v3.0)**

---

## 📁 Documentación Técnica

### 🏗️ Arquitectura
- `/docs/architecture/FRONTEND_ARCHITECTURE.md` - Arquitectura del frontend
- `/REESTRUCTURACION_ESTADOS_COMPLETADA.md` - State Components Architecture

### 🗄️ Base de Datos
- `/docs/database/SCHEMA.md` - Resumen del esquema
- `/ESQUEMA_BASE_DATOS_SQL.md` - **Esquema SQL completo**
- `/spec/mock-db/schema.sql` - SQL ejecutable
- `/spec/mock-db/schema.md` - Documentación técnica

### 🚀 Deployment
- `/docs/DEPLOYMENT_GUIDE.md` - Guía de deployment

---

## 📦 Especificaciones de Datos

### /spec/ - Especificaciones JSON
```
/spec/
├── compras/
│   ├── orden_compra.schema.json
│   └── orden_compra.example.json
├── dashboard/
│   ├── metricas_obra.schema.json
│   └── metricas_obra.example.json
├── obras/
│   ├── obra.schema.json
│   └── obra.example.json
├── pagos/
│   ├── pago.schema.json
│   └── pago.example.json
├── proveedores/
│   ├── proveedor.schema.json
│   └── proveedor.example.json
└── mock-db/
    ├── schema.sql
    ├── schema.md
    └── seed.ts
```

---

## 🎨 Componentes y Estados

### Estados Visuales
Cada módulo tiene 4 estados:

1. **Loading** - Skeletons animados
2. **Empty** - Sin datos + CTA + benefits
3. **Error** - Error + retry
4. **Data** - Contenido completo

### Ubicación de Componentes
```
/src/app/components/
├── states/                 # Estados base
├── global-dashboard/       # Estados Dashboard
├── purchase-order/         # Estados Compras
├── material-requisitions/  # Estados Requisiciones
├── payment-management/     # Estados Pagos
└── contract-tracking/      # Estados Contrato
```

---

## 📖 Guías de Desarrollo

### Archivos Protegidos
❌ No modificar:
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`
- `/supabase/functions/server/kv_store.tsx`
- `/utils/supabase/info.tsx`

### Lineamientos
- `/guidelines/Guidelines.md` - Lineamientos generales del sistema

---

## 🗂️ Archivos de Configuración

### Build y desarrollo
- `/package.json` - Dependencias y scripts
- `/vite.config.ts` - Configuración de Vite
- `/postcss.config.mjs` - PostCSS config

### Estilos
```
/src/styles/
├── index.css       # Entry point
├── tailwind.css    # Tailwind imports
├── theme.css       # Tema personalizado
└── fonts.css       # Fuentes
```

---

## 📂 Estructura Completa del Proyecto

```
/
├── README.md                              # 📘 Guía principal
├── REESTRUCTURACION_ESTADOS_COMPLETADA.md # 🎯 Arquitectura v3.0
├── ESQUEMA_BASE_DATOS_SQL.md              # 🗄️ Schema SQL completo
│
├── /docs/                                 # 📚 Documentación
│   ├── INDEX.md                           # Este archivo
│   ├── architecture/
│   │   └── FRONTEND_ARCHITECTURE.md
│   ├── database/
│   │   └── SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
│
├── /spec/                                 # 📋 Especificaciones
│   ├── compras/
│   ├── dashboard/
│   ├── obras/
│   ├── pagos/
│   ├── proveedores/
│   └── mock-db/
│
├── /src/                                  # 💻 Código fuente
│   ├── /app/                              # Aplicación principal
│   │   ├── components/                    # Componentes
│   │   │   ├── states/                    # Estados base
│   │   │   ├── global-dashboard/          # Estados Dashboard
│   │   │   ├── purchase-order/            # Estados Compras
│   │   │   ├── material-requisitions/     # Estados Requisiciones
│   │   │   ├── payment-management/        # Estados Pagos
│   │   │   ├── contract-tracking/         # Estados Contrato
│   │   │   ├── ui/                        # UI base (shadcn)
│   │   │   └── ...                        # Otros componentes
│   │   │
│   │   ├── GlobalDashboard.tsx            # Módulo Dashboard
│   │   ├── PurchaseOrderManagement.tsx    # Módulo Compras
│   │   ├── MaterialRequisitions.tsx       # Módulo Requisiciones
│   │   ├── PaymentManagement.tsx          # Módulo Pagos
│   │   ├── ContractTracking.tsx           # Módulo Contrato
│   │   ├── MainApp.tsx                    # Navegación
│   │   └── App.tsx                        # Entry point
│   │
│   └── /styles/                           # Estilos globales
│
├── /supabase/                             # Backend (futuro)
│   └── /functions/server/
│
└── /public/                               # Archivos estáticos
```

---

## 🎓 Documentos por Tema

### Para entender la arquitectura:
1. `/README.md` - Resumen general
2. `/REESTRUCTURACION_ESTADOS_COMPLETADA.md` - Arquitectura detallada
3. `/docs/architecture/FRONTEND_ARCHITECTURE.md` - Frontend específico

### Para trabajar con datos:
1. `/spec/README_ESPECIFICACION.md` - Intro a especificaciones
2. `/ESQUEMA_BASE_DATOS_SQL.md` - Schema completo
3. `/spec/mock-db/schema.sql` - SQL ejecutable

### Para desplegar:
1. `/docs/DEPLOYMENT_GUIDE.md` - Deployment guide

### Para contribuir:
1. `/guidelines/Guidelines.md` - Lineamientos
2. `/README.md` (sección Contribución)
3. `/REESTRUCTURACION_ESTADOS_COMPLETADA.md` (Patrón de implementación)

---

## 🔍 Búsqueda Rápida

### ¿Necesitas...?

**Ver cómo funciona un módulo?**
→ `/src/app/[NombreModulo].tsx`

**Crear un componente de estado?**
→ `/src/app/components/[modulo]/`

**Entender el esquema de datos?**
→ `/ESQUEMA_BASE_DATOS_SQL.md`

**Ver ejemplos de datos mock?**
→ `/spec/[modulo]/[modulo].example.json`

**Modificar estilos globales?**
→ `/src/styles/theme.css`

**Agregar un nuevo componente UI?**
→ `/src/app/components/ui/`

---

## 📊 Versiones de Documentación

- **v3.0** (Actual) - State Components Architecture
  - Documentada en: `/REESTRUCTURACION_ESTADOS_COMPLETADA.md`
  - Componentes de estado separados por módulo
  - Fecha: 2026-02-05

- **v2.0** - State-Driven Architecture
  - Estados inline dentro de cada módulo
  
- **v1.0** - Initial Implementation

---

## 🆘 Soporte

Para preguntas sobre:
- **Arquitectura**: Ver `/REESTRUCTURACION_ESTADOS_COMPLETADA.md`
- **Datos**: Ver `/ESQUEMA_BASE_DATOS_SQL.md`
- **Componentes**: Ver código fuente en `/src/app/components/`
- **General**: Ver `/README.md`

---

**Última actualización:** 2026-02-05
