# 🗺️ Mapa de Navegación - ERP IDP

## 🎯 ¿Por dónde empiezo?

Este documento te ayudará a navegar el proyecto según lo que necesites hacer.

---

## 🚀 INICIO RÁPIDO

### Si es tu primera vez aquí:

```
1. Lee → README.md
2. Ejecuta → npm install && npm run dev
3. Explora → src/app/App.tsx
```

---

## 📖 POR ROL

### 👨‍💻 DESARROLLADOR FRONTEND

**Primera vez:**
```
1. README.md                           # Visión general
2. REESTRUCTURACION_ESTADOS_COMPLETADA.md  # Arquitectura
3. src/app/App.tsx                     # Entry point
4. src/app/MainApp.tsx                 # Navegación
```

**Trabajar con estados:**
```
src/app/components/states/             # Estados base
src/app/components/[modulo]/           # Estados por módulo
```

**Crear componente nuevo:**
```
src/app/components/ui/                 # Ver ejemplos
guidelines/Guidelines.md               # Lineamientos
```

---

### 🗄️ DESARROLLADOR BACKEND

**Schema de base de datos:**
```
1. ESQUEMA_BASE_DATOS_SQL.md           # Schema completo
2. spec/mock-db/schema.sql             # SQL ejecutable
3. spec/mock-db/seed.ts                # Datos de prueba
```

**Especificaciones de datos:**
```
spec/compras/orden_compra.schema.json
spec/pagos/pago.schema.json
spec/obras/obra.schema.json
... etc
```

**Integración:**
```
docs/architecture/FRONTEND_ARCHITECTURE.md
```

---

### 🎨 DISEÑADOR UI/UX

**Ver componentes:**
```
src/app/components/ui/                 # Todos los componentes UI
```

**Ver estados visuales:**
```
src/app/components/[modulo]/
  - [Modulo]StateEmpty.tsx             # Estado vacío
  - [Modulo]StateLoading.tsx           # Cargando
  - [Modulo]StateError.tsx             # Error
```

**Testing visual:**
En `src/app/MainApp.tsx` cambiar `initialState`:
```typescript
<GlobalDashboard initialState="empty" />
```

---

### 📊 PRODUCT MANAGER / QA

**Funcionalidades:**
```
README.md                              # Features overview
PROYECTO_FINALIZADO.md                 # Estado del proyecto
```

**Módulos:**
```
src/app/GlobalDashboard.tsx            # Dashboard
src/app/PurchaseOrderManagement.tsx    # Compras
src/app/MaterialRequisitions.tsx       # Requisiciones
src/app/PaymentManagement.tsx          # Pagos
src/app/ContractTracking.tsx           # Contrato
```

**Testing de estados:**
Cambiar `initialState` en `MainApp.tsx`:
- `"data"` - Ver con datos
- `"empty"` - Ver vacío
- `"loading"` - Ver cargando
- `"error"` - Ver error

---

## 🎯 POR TAREA

### "Quiero entender la arquitectura"

```
1. README.md                           # Descripción general
2. REESTRUCTURACION_ESTADOS_COMPLETADA.md  # Arquitectura detallada
3. ESTRUCTURA_PROYECTO.md              # Mapa del proyecto
4. docs/architecture/FRONTEND_ARCHITECTURE.md
```

---

### "Quiero ver el código de un módulo"

```
Módulo → src/app/[Modulo].tsx

Ejemplo:
src/app/GlobalDashboard.tsx            # Ver código
src/app/components/global-dashboard/   # Ver estados
```

---

### "Quiero crear un componente de estado"

**Template:**
```typescript
// src/app/components/[modulo]/[Modulo]StateEmpty.tsx

import { EmptyState } from "@/app/components/states";
import { Icon } from "lucide-react";

interface Props {
  onAction?: () => void;
}

export function ModuloStateEmpty({ onAction }: Props) {
  return (
    <EmptyState
      icon={Icon}
      title="Título"
      description="Descripción"
      ctaLabel="Acción"
      onCta={onAction}
      benefits={[
        { icon: Icon, title: "Beneficio 1", description: "..." },
        { icon: Icon, title: "Beneficio 2", description: "..." },
        { icon: Icon, title: "Beneficio 3", description: "..." },
        { icon: Icon, title: "Beneficio 4", description: "..." },
      ]}
    />
  );
}
```

**Índice de exportación:**
```typescript
// src/app/components/[modulo]/index.ts

export { ModuloStateEmpty } from "./ModuloStateEmpty";
export { ModuloStateLoading } from "./ModuloStateLoading";
export { ModuloStateError } from "./ModuloStateError";
```

---

### "Quiero agregar un nuevo módulo"

**Checklist:**
```
1. Crear archivo principal:
   src/app/NuevoModulo.tsx

2. Crear carpeta de estados:
   src/app/components/nuevo-modulo/
   ├── NuevoModuloStateLoading.tsx
   ├── NuevoModuloStateError.tsx
   ├── NuevoModuloStateEmpty.tsx
   └── index.ts

3. Implementar patrón:
   - Usar ViewState type
   - Implementar 4 estados
   - Props con initialState

4. Agregar a navegación:
   src/app/MainApp.tsx
```

**Template del módulo:**
```typescript
import { useState } from "react";
import { ViewState } from "@/app/components/states";
import {
  NuevoModuloStateLoading,
  NuevoModuloStateError,
  NuevoModuloStateEmpty,
} from "@/app/components/nuevo-modulo";

interface Props {
  initialState?: ViewState;
}

export default function NuevoModulo({ initialState = "data" }: Props) {
  const [viewState, setViewState] = useState<ViewState>(initialState);

  if (viewState === "loading") return <NuevoModuloStateLoading />;
  if (viewState === "error") return <NuevoModuloStateError />;
  if (viewState === "empty") return <NuevoModuloStateEmpty />;

  return <div>{/* Estado DATA */}</div>;
}
```

---

### "Quiero entender los datos"

**Schema SQL:**
```
ESQUEMA_BASE_DATOS_SQL.md              # Completo
docs/database/SCHEMA.md                # Resumen
spec/mock-db/schema.sql                # Ejecutable
```

**Ejemplos JSON:**
```
spec/compras/orden_compra.example.json
spec/pagos/pago.example.json
spec/obras/obra.example.json
... etc
```

**Mock data en código:**
```
src/app/providers/mockData.ts
```

---

### "Quiero deployar el proyecto"

```
docs/DEPLOYMENT_GUIDE.md
```

---

### "Quiero ver toda la documentación"

```
docs/INDEX.md                          # Índice completo
```

---

## 📁 ESTRUCTURA POR MÓDULO

### GlobalDashboard 🏢

**Archivo principal:**
```
src/app/GlobalDashboard.tsx
```

**Estados:**
```
src/app/components/global-dashboard/
├── DashboardStateData.tsx             # Con 7 obras
├── DashboardStateEmpty.tsx            # Sin obras + benefits
├── DashboardStateLoading.tsx          # Skeletons
└── DashboardStateError.tsx            # Error + retry
```

**Componentes relacionados:**
```
src/app/components/ProjectCard.tsx
src/app/components/DashboardEmpresarial.tsx
```

---

### PurchaseOrderManagement 🛒

**Archivo principal:**
```
src/app/PurchaseOrderManagement.tsx
```

**Estados:**
```
src/app/components/purchase-order/
├── PurchaseOrderStateEmpty.tsx        # Sin OCs + benefits
├── PurchaseOrderStateLoading.tsx      # Skeletons
└── PurchaseOrderStateError.tsx        # Error + retry
```

**Componentes relacionados:**
```
src/app/components/PurchaseOrderForm.tsx
src/app/components/PurchaseOrdersTable.tsx
src/app/components/PurchaseOrderPDF.tsx
```

---

### MaterialRequisitions 📋

**Archivo principal:**
```
src/app/MaterialRequisitions.tsx
```

**Estados:**
```
src/app/components/material-requisitions/
├── MaterialRequisitionsStateEmpty.tsx
├── MaterialRequisitionsStateLoading.tsx
└── MaterialRequisitionsStateError.tsx
```

**Componentes relacionados:**
```
src/app/components/MaterialRequisitionForm.tsx
src/app/components/RequisitionsSection.tsx
src/app/components/PasswordDialog.tsx
```

---

### PaymentManagement 💰

**Archivo principal:**
```
src/app/PaymentManagement.tsx
```

**Estados:**
```
src/app/components/payment-management/
├── PaymentManagementStateEmpty.tsx
├── PaymentManagementStateLoading.tsx
└── PaymentManagementStateError.tsx
```

---

### ContractTracking 📊

**Archivo principal:**
```
src/app/ContractTracking.tsx
```

**Estados:**
```
src/app/components/contract-tracking/
├── ContractTrackingStateEmpty.tsx
├── ContractTrackingStateLoading.tsx
└── ContractTrackingStateError.tsx
```

**Componentes relacionados:**
```
src/app/components/ContractHeader.tsx
src/app/components/EstimationsTable.tsx
src/app/components/EstimationForm.tsx
src/app/components/WeeklyExpenses.tsx
```

---

## 🎨 COMPONENTES UI BASE

**Ubicación:**
```
src/app/components/ui/
```

**Más usados:**
```
button.tsx                             # Botones
card.tsx                               # Cards
badge.tsx                              # Badges
input.tsx                              # Inputs
select.tsx                             # Selects
dialog.tsx                             # Diálogos
table.tsx                              # Tablas
```

---

## 🔍 BÚSQUEDA RÁPIDA

### "¿Dónde está...?"

**...el entry point?**
```
src/app/App.tsx
```

**...la navegación principal?**
```
src/app/MainApp.tsx
```

**...los componentes de estado base?**
```
src/app/components/states/
```

**...los estados de un módulo?**
```
src/app/components/[modulo]/
```

**...los componentes UI?**
```
src/app/components/ui/
```

**...el schema de base de datos?**
```
ESQUEMA_BASE_DATOS_SQL.md
```

**...los ejemplos de datos?**
```
spec/[modulo]/[modulo].example.json
```

**...la documentación completa?**
```
docs/INDEX.md
```

---

## 📚 DOCUMENTOS POR PRIORIDAD

### 🔴 CRÍTICOS (leer primero):
1. `/README.md`
2. `/REESTRUCTURACION_ESTADOS_COMPLETADA.md`
3. `/src/app/App.tsx`

### 🟡 IMPORTANTES:
1. `/ESTRUCTURA_PROYECTO.md`
2. `/ESQUEMA_BASE_DATOS_SQL.md`
3. `/docs/INDEX.md`

### 🟢 COMPLEMENTARIOS:
1. `/PROYECTO_FINALIZADO.md`
2. `/ORGANIZACION_COMPLETADA.md`
3. `/docs/architecture/FRONTEND_ARCHITECTURE.md`

---

## 🎓 RUTAS DE APRENDIZAJE

### Ruta 1: "Quiero usar el proyecto"
```
README.md
  ↓
QUICK_START.md
  ↓
npm run dev
  ↓
Explorar en navegador
```

### Ruta 2: "Quiero entender el código"
```
README.md
  ↓
REESTRUCTURACION_ESTADOS_COMPLETADA.md
  ↓
src/app/App.tsx
  ↓
src/app/MainApp.tsx
  ↓
src/app/[Modulo].tsx
```

### Ruta 3: "Quiero modificar/extender"
```
REESTRUCTURACION_ESTADOS_COMPLETADA.md
  ↓
ESTRUCTURA_PROYECTO.md
  ↓
guidelines/Guidelines.md
  ↓
Ver ejemplos en src/app/components/
```

### Ruta 4: "Quiero integrar con backend"
```
ESQUEMA_BASE_DATOS_SQL.md
  ↓
spec/README_ESPECIFICACION.md
  ↓
spec/[modulo]/*.json
  ↓
docs/architecture/FRONTEND_ARCHITECTURE.md
```

---

## ⚡ ATAJOS

### Testing rápido de estados:

**En `src/app/MainApp.tsx`:**
```typescript
// Ver GlobalDashboard vacío:
<GlobalDashboard initialState="empty" onSelectProject={handleSelectProject} />

// Ver PurchaseOrders cargando:
<PurchaseOrderManagement initialState="loading" {...props} />

// Ver MaterialRequisitions con error:
<MaterialRequisitions initialState="error" {...props} />

// Ver datos normales:
<PaymentManagement initialState="data" {...props} />
```

---

## 🎯 CASOS DE USO COMUNES

### Caso 1: "Quiero cambiar el diseño del Empty State de Compras"

```
1. Ir a: src/app/components/purchase-order/PurchaseOrderStateEmpty.tsx
2. Modificar JSX
3. Ver cambios en navegador con initialState="empty"
```

### Caso 2: "Quiero agregar un nuevo beneficio al Dashboard vacío"

```
1. Ir a: src/app/components/global-dashboard/DashboardStateEmpty.tsx
2. Agregar objeto en array benefits
3. Ver con initialState="empty"
```

### Caso 3: "Quiero entender cómo funciona el módulo de Pagos"

```
1. Leer: src/app/PaymentManagement.tsx
2. Ver estados en: src/app/components/payment-management/
3. Ver schema: ESQUEMA_BASE_DATOS_SQL.md (tabla pagos)
4. Ver ejemplo: spec/pagos/pago.example.json
```

---

## 🗺️ MAPA MENTAL

```
ERP IDP
│
├── 📘 Documentación
│   ├── README.md (START)
│   ├── REESTRUCTURACION_ESTADOS_COMPLETADA.md (ARQUITECTURA)
│   ├── ESQUEMA_BASE_DATOS_SQL.md (DATOS)
│   └── docs/INDEX.md (ÍNDICE COMPLETO)
│
├── 💻 Código
│   ├── src/app/App.tsx (ENTRY POINT)
│   ├── src/app/MainApp.tsx (NAVEGACIÓN)
│   ├── src/app/[Modulos].tsx (5 MÓDULOS)
│   └── src/app/components/ (COMPONENTES)
│       ├── states/ (ESTADOS BASE)
│       ├── [modulo]/ (ESTADOS POR MÓDULO)
│       └── ui/ (UI BASE)
│
└── 📋 Specs
    ├── spec/[modulo]/*.json (EJEMPLOS)
    └── spec/mock-db/schema.sql (SCHEMA)
```

---

## ✨ TIPS

### 💡 Para navegar más rápido:

1. **Usa el buscador de tu IDE** (Cmd+P / Ctrl+P)
2. **Busca por nombre de componente** exacto
3. **Sigue los imports** para encontrar dependencias
4. **Lee los índices** (`index.ts`) para ver exportaciones

### 💡 Para entender el código:

1. **Empieza por los tipos** (`types/entities.ts`)
2. **Lee los estados** antes que el estado data
3. **Compara componentes** de diferentes módulos
4. **Usa los comentarios** en el código

### 💡 Para contribuir:

1. **Sigue el patrón** existente
2. **Usa los componentes base** de `/ui`
3. **Mantén los 4 estados** en cada módulo
4. **Documenta** mientras desarrollas

---

## 🎉 CONCLUSIÓN

**Este mapa te ayudará a:**
- ✅ Navegar el proyecto sin perderte
- ✅ Encontrar rápidamente lo que necesitas
- ✅ Entender la estructura
- ✅ Contribuir efectivamente

**¿Perdido?**
→ Vuelve a `/README.md`

**¿Más detalles?**
→ Consulta `/docs/INDEX.md`

---

**¡Happy Coding! 🚀**
