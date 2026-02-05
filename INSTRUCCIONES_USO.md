# 📖 INSTRUCCIONES DE USO - ERP IDP

## 🚀 **Inicio Rápido**

### 1. **Activar el Sistema Refactorizado**

El sistema ahora usa **MainApp** (sin toggle). Para usarlo:

```typescript
// En /src/app/App.tsx
const USE_DEMO_MODE = false; // ✅ Ya está configurado
```

### 2. **Ejecutar la Aplicación**

```bash
npm run dev
```

La aplicación arrancará en modo **data** (con datos completos) por defecto.

---

## 🎛️ **Cambiar Estados de Módulos**

### Para Testing de Estados Visuales:

Edita `/src/app/MainApp.tsx` y cambia el `initialState` de cualquier módulo:

```typescript
// Ejemplo 1: Ver Dashboard en estado vacío
<GlobalDashboard 
  onSelectProject={handleSelectProject}
  initialState="empty"  // Cambia aquí ✨
/>

// Ejemplo 2: Ver Compras en estado loading
<PurchaseOrderManagement
  onNavigateToSuppliers={...}
  initialState="loading"  // Cambia aquí ✨
/>

// Ejemplo 3: Ver Pagos en estado error
<PaymentManagement 
  initialState="error"  // Cambia aquí ✨
/>
```

### Estados Disponibles:
- `"loading"` - Muestra skeletons animados
- `"empty"` - Muestra estado vacío con CTA
- `"error"` - Muestra error con botón retry
- `"data"` - Muestra contenido completo (default)

---

## 📁 **Módulos y Sus Ubicaciones**

| Módulo | Archivo | Estados |
|--------|---------|---------|
| Dashboard Global | `/src/app/GlobalDashboard.tsx` | ✅ Todos |
| Compras | `/src/app/PurchaseOrderManagement.tsx` | ✅ Todos |
| Requisiciones | `/src/app/MaterialRequisitions.tsx` | ✅ Todos |
| Pagos | `/src/app/PaymentManagement.tsx` | ✅ Todos |
| Seguimiento Contrato | `/src/app/ContractTracking.tsx` | ✅ Todos |

---

## 🎨 **Visualizar Diferentes Estados**

### Ejemplo Completo: GlobalDashboard

```typescript
// En /src/app/MainApp.tsx, línea ~96

// ESTADO LOADING
<GlobalDashboard 
  onSelectProject={handleSelectProject}
  initialState="loading"
/>
// Verás: Skeletons animados

// ESTADO EMPTY  
<GlobalDashboard 
  onSelectProject={handleSelectProject}
  initialState="empty"
/>
// Verás: Mensaje "No hay obras" + 4 benefits + CTA

// ESTADO ERROR
<GlobalDashboard 
  onSelectProject={handleSelectProject}
  initialState="error"
/>
// Verás: Mensaje de error + botón "Reintentar"

// ESTADO DATA (default)
<GlobalDashboard 
  onSelectProject={handleSelectProject}
  initialState="data"
/>
// Verás: Dashboard completo con 7 obras
```

---

## 🔄 **Navegación del Sistema**

### Flujo Normal:

```
HOME (pantalla inicial)
  ↓
  [Click en "Dashboard"] → DASHBOARD GLOBAL
                              ↓
                              [Click en obra] → SEGUIMIENTO DE CONTRATO
                                                  
  [Click en "Compras"] → PURCHASE ORDER MANAGEMENT
                           ↓
                           [Click "Gestionar Proveedores"] → SUPPLIER MANAGEMENT

  [Click en "Requisiciones"] → MATERIAL REQUISITIONS
  
  [Click en "Pagos"] → PAYMENT MANAGEMENT
```

### Botones de Regreso:
- Cada módulo tiene su botón `← Volver` contextual
- Dashboard → Volver al Inicio
- Contrato → Volver al Dashboard
- Compras/Requisiciones/Pagos → Volver al Inicio

---

## 🛠️ **Modificar Mock Data**

### Para Cambiar Datos de Prueba:

Los datos mock están **dentro de cada módulo**:

```typescript
// En GlobalDashboard.tsx
const mockWorks = [
  {
    code: "227",
    name: "CASTELLO E - Tláhuac",
    // ... edita aquí
  },
  // Agrega más obras aquí
];

// En PurchaseOrderManagement.tsx
const mockOrders: PurchaseOrder[] = [
  {
    id: "1",
    orderNumber: "227-A01GM-CEMEX",
    // ... edita aquí
  },
];
```

---

## 🎯 **Testing Workflow Sugerido**

### 1. Test de Estados por Módulo:

```bash
# Para cada módulo, testea estos 4 estados:

1. GlobalDashboard
   ✅ initialState="loading"
   ✅ initialState="empty"
   ✅ initialState="error"
   ✅ initialState="data"

2. PurchaseOrderManagement
   ✅ initialState="loading"
   ✅ initialState="empty"
   ✅ initialState="error"
   ✅ initialState="data"

3. MaterialRequisitions
   ✅ initialState="loading"
   ✅ initialState="empty"
   ✅ initialState="error"
   ✅ initialState="data"

4. PaymentManagement
   ✅ initialState="loading"
   ✅ initialState="empty"
   ✅ initialState="error"
   ✅ initialState="data"

5. ContractTracking
   ✅ initialState="loading"
   ✅ initialState="empty"
   ✅ initialState="error"
   ✅ initialState="data"
```

### 2. Test de Navegación:

```bash
✅ Home → Dashboard → Obra → Volver
✅ Home → Compras → Proveedores → Volver
✅ Home → Requisiciones
✅ Home → Pagos
```

---

## 📊 **Componentes de Estado**

Los componentes reutilizables están en: `/src/app/components/states/`

### LoadingState

```typescript
import { LoadingState } from "@/app/components/states";

<LoadingState 
  type="dashboard"  // "dashboard" | "table" | "cards" | "form"
  rows={5}          // número de filas/elementos
/>
```

### EmptyState

```typescript
import { EmptyState } from "@/app/components/states";
import { ShoppingCart, Plus } from "lucide-react";

<EmptyState
  icon={ShoppingCart}
  title="No hay órdenes de compra"
  description="Comienza generando tu primera orden..."
  ctaLabel="Crear Primera OC"
  ctaIcon={Plus}
  onCta={() => console.log("Crear")}
  benefits={[
    {
      icon: FileText,
      title: "Órdenes Profesionales",
      description: "Genera OCs con folio automático...",
      color: "bg-blue-100 text-blue-600",
    },
  ]}
/>
```

### ErrorState

```typescript
import { ErrorState } from "@/app/components/states";

<ErrorState
  title="Ocurrió un error"  // opcional
  message="No se pudieron cargar los datos..."
  onRetry={() => console.log("Retry")}
  showRetry={true}  // opcional
/>
```

---

## 🐛 **Troubleshooting**

### Problema: No veo cambios al modificar initialState

**Solución:**
1. Guarda el archivo MainApp.tsx
2. El hot reload debería refrescar automáticamente
3. Si no funciona, recarga la página (F5)

### Problema: Veo un toggle verde/naranja/azul

**Solución:**
- Ese es el sistema antiguo (AppSwitcher)
- Verifica que `USE_DEMO_MODE = false` en App.tsx
- El nuevo sistema NO tiene toggle visible

### Problema: Errores de import

**Solución:**
```bash
# Reinstalar dependencias
npm install

# Limpiar cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 **Documentación Adicional**

- `/README.md` - Documentación principal
- `/RESTRUCTURACION_COMPLETADA.md` - Detalles técnicos completos
- `/RESUMEN_VISUAL.md` - Diagramas visuales
- `/DOCUMENTACION_LOGICA_MODULOS.md` - Lógica de negocio
- `/ESQUEMA_BASE_DATOS_SQL.md` - Esquema de BD

---

## 🎓 **Tips para Desarrollo**

### 1. Crear un Nuevo Módulo

```typescript
// 1. Crear archivo /src/app/NuevoModulo.tsx
import { useState } from "react";
import { LoadingState, EmptyState, ErrorState, ViewState } from "@/app/components/states";

interface NuevoModuloProps {
  initialState?: ViewState;
}

export default function NuevoModulo({ initialState = "data" }: NuevoModuloProps) {
  const [viewState, setViewState] = useState<ViewState>(initialState);

  // Estados
  if (viewState === "loading") return <LoadingState type="table" />;
  if (viewState === "error") return <ErrorState message="..." onRetry={() => {}} />;
  if (viewState === "empty") return <EmptyState icon={...} title="..." />;

  // Data state
  return <div>Tu UI aquí</div>;
}

// 2. Agregar a MainApp.tsx
import NuevoModulo from "@/app/NuevoModulo";

// 3. Agregar a navegación
if (activeModule === "nuevo") {
  return <NuevoModulo initialState="data" />;
}
```

### 2. Modificar un Módulo Existente

```typescript
// Solo edita la sección DATA STATE:

// ESTADO: DATA (contenido completo original)
return (
  <div>
    {/* Modifica aquí tu UI */}
  </div>
);

// NO modifiques los estados: loading, empty, error
```

---

## ⚡ **Shortcuts**

```bash
# Ver estados rápidamente
Ctrl+F en MainApp.tsx → buscar "initialState"

# Cambiar todos los módulos a loading
Buscar/Reemplazar: initialState="data" → initialState="loading"

# Volver todos a data
Buscar/Reemplazar: initialState="loading" → initialState="data"
```

---

## 🎉 **¡Listo para Usar!**

El sistema está completamente refactorizado y funcionando. Todos los módulos tienen sus 4 estados integrados y listos para testing.

**Estado:** ✅ Producción-ready  
**Versión:** 2.0.0  
**Última actualización:** 2026-02-05

---

**¿Preguntas?** Consulta `/RESTRUCTURACION_COMPLETADA.md` para detalles técnicos completos.
