# 🎨 Demostración de Estados UI

## Cómo ver los 3 estados visuales en la aplicación

El sistema IDP ERP implementa **3 estados visuales obligatorios** en todos los módulos:

1. **Loading** - Skeleton/Spinner mientras cargan datos
2. **Empty** - Sin datos con Call-to-Action
3. **WithData** - Datos reales mostrados

---

## 🔧 Configuración para Testing

### Ver Estado Loading (Carga)

```typescript
// /src/core/config.ts
export const SIMULATE_NETWORK_DELAY = true; // ← Activar
export const TEST_EMPTY_STATE = false;
```

**Resultado:** Verás skeletons animados durante 200-600ms antes de que aparezcan los datos.

---

### Ver Estado Empty (Vacío)

```typescript
// /src/core/config.ts
export const SIMULATE_NETWORK_DELAY = false; // Opcional, para ver más rápido
export const TEST_EMPTY_STATE = true; // ← Activar modo vacío
```

**Resultado:** 
- ❌ Sin obras registradas
- ❌ Sin proveedores
- ❌ Sin órdenes de compra
- ❌ Sin requisiciones
- ❌ Sin pagos

**Verás:**
- Mensaje descriptivo
- Icono representativo
- Botón CTA para crear el primer registro

---

### Ver Estado WithData (Con Datos)

```typescript
// /src/core/config.ts
export const SIMULATE_NETWORK_DELAY = true;
export const TEST_EMPTY_STATE = false; // ← Usar datos mock
```

**Resultado:**
- ✅ 7 obras activas
- ✅ 6 proveedores
- ✅ 6 órdenes de compra
- ✅ 5 requisiciones
- ✅ 3 pagos

---

## 📸 Capturas de Estados por Módulo

### 🏗️ Dashboard Global

#### Loading State
```
┌─────────────────────────────────────┐
│  ╔════════════╗                     │
│  ║ ░░░░░░░░░░ ║ Cargando...         │
│  ╚════════════╝                     │
│  [Skeleton Cards]                   │
└─────────────────────────────────────┘
```

#### Empty State
```
┌─────────────────────────────────────┐
│          🏗️                         │
│  No hay obras registradas            │
│  Comienza creando tu primera obra    │
│                                      │
│  [ + Nueva Obra ]                    │
└─────────────────────────────────────┘
```

#### WithData State
```
┌─────────────────────────────────────┐
│  Obras Activas: 7                    │
│  Presupuesto Total: $53.7M          │
│                                      │
│  ┌─────┐ ┌─────┐ ┌─────┐            │
│  │ 227 │ │ 228 │ │ 229 │ ...        │
│  └─────┘ └─────┘ └─────┘            │
└─────────────────────────────────────┘
```

---

### 📦 Módulo de Compras

#### Empty State
```
┌─────────────────────────────────────┐
│          📦                          │
│  No hay órdenes de compra            │
│  Crea tu primera OC para comenzar    │
│                                      │
│  [ + Nueva Orden de Compra ]         │
└─────────────────────────────────────┘
```

#### WithData State
```
┌─────────────────────────────────────┐
│  Órdenes de Compra (6)               │
│  ┌──────────────────────────────┐   │
│  │ 227-A01GM-CEMEX              │   │
│  │ $40,078.00 • APROBADA        │   │
│  └──────────────────────────────┘   │
│  ...                                 │
└─────────────────────────────────────┘
```

---

### 👥 Gestión de Proveedores

#### Empty State
```
┌─────────────────────────────────────┐
│          👤                          │
│  No hay proveedores registrados      │
│  Agrega tu primer proveedor          │
│                                      │
│  [ + Agregar Proveedor ]             │
└─────────────────────────────────────┘
```

#### WithData State
```
┌─────────────────────────────────────┐
│  Catálogo de Proveedores (6)         │
│  [Búsqueda: ________] [Filtros ▼]   │
│  ┌──────────────────────────────┐   │
│  │ CEMEX                        │   │
│  │ RFC: CMX940815A12 • Activo   │   │
│  │ Crédito: 30 días             │   │
│  └──────────────────────────────┘   │
│  ...                                 │
└─────────────────────────────────────┘
```

---

### 📋 Requisiciones de Material

#### Empty State
```
┌─────────────────────────────────────┐
│          📝                          │
│  No hay requisiciones pendientes     │
│  Los residentes pueden crear         │
│  requisiciones desde su dashboard    │
└─────────────────────────────────────┘
```

#### WithData State
```
┌─────────────────────────────────────┐
│  Requisiciones (5)                   │
│  ┌──────────────────────────────┐   │
│  │ 🔴 REQ227-001MAT • URGENTE   │   │
│  │ Obra 227 • Ing. MAT          │   │
│  │ 2 items • Convertida a OC    │   │
│  └──────────────────────────────┘   │
│  ...                                 │
└─────────────────────────────────────┘
```

---

### 💰 Módulo de Pagos

#### Empty State
```
┌─────────────────────────────────────┐
│          💸                          │
│  No hay pagos registrados            │
│  Los pagos aparecerán aquí una vez   │
│  que se generen órdenes de compra    │
└─────────────────────────────────────┘
```

#### WithData State
```
┌─────────────────────────────────────┐
│  Pagos Registrados (3)               │
│  Total Pagado: $65,349.00            │
│  ┌──────────────────────────────┐   │
│  │ PAG-227-001                  │   │
│  │ CEMEX • $20,039.00           │   │
│  │ Transferencia • 15/01/2025   │   │
│  └──────────────────────────────┘   │
│  ...                                 │
└─────────────────────────────────────┘
```

---

## ⚡ Testing Rápido - Checklist

### Paso 1: Ver Todo con Datos
```bash
# En /src/core/config.ts
TEST_EMPTY_STATE = false
npm run dev
```

✅ Verificar:
- [ ] Dashboard global muestra 7 obras
- [ ] Módulo Compras muestra 6 OCs
- [ ] Gestión Proveedores muestra 6 proveedores
- [ ] Requisiciones muestra 5 requisiciones
- [ ] Pagos muestra 3 pagos

### Paso 2: Ver Todo Vacío
```bash
# En /src/core/config.ts
TEST_EMPTY_STATE = true
npm run dev
```

✅ Verificar:
- [ ] Dashboard global muestra "No hay obras"
- [ ] Módulo Compras muestra "No hay órdenes"
- [ ] Gestión Proveedores muestra "No hay proveedores"
- [ ] Requisiciones muestra "No hay requisiciones"
- [ ] Pagos muestra "No hay pagos"
- [ ] TODOS tienen botón CTA visible
- [ ] NINGUNO crashea con datos vacíos

### Paso 3: Ver Loading States
```bash
# En /src/core/config.ts
TEST_EMPTY_STATE = false
SIMULATE_NETWORK_DELAY = true
npm run dev
```

✅ Verificar:
- [ ] Se ven skeletons antes de cargar datos
- [ ] El loading dura entre 200-600ms
- [ ] No hay "flashes" visuales
- [ ] Transición suave a datos

---

## 🐛 Problemas Comunes

### "Todo aparece vacío incluso con TEST_EMPTY_STATE = false"

**Solución:** Verifica que el import del seed sea correcto en mockAdapter.ts:
```typescript
import { mockDatabase, emptyDatabase } from '/spec/mock-db/seed';
const db = TEST_EMPTY_STATE ? emptyDatabase : mockDatabase;
```

### "No veo el loading state"

**Solución:** Aumenta el delay:
```typescript
// En mockAdapter.ts
const MIN_DELAY = 1000; // 1 segundo
const MAX_DELAY = 2000; // 2 segundos
```

### "La página crashea con datos vacíos"

**Solución:** Componente NO está usando StatePanel correctamente. Debe manejar:
```typescript
const { data, state, isEmpty } = useData(...);

<StatePanel state={state} isEmpty={isEmpty}>
  {/* Tu UI con datos */}
</StatePanel>
```

---

## 📊 Componentes que SÍ implementan los 3 estados

### ✅ Implementados Correctamente

- **GestionProveedores.tsx** 
  - Loading: Skeleton grid
  - Empty: "No hay proveedores" + CTA
  - WithData: Grid de tarjetas

### ⚠️ Pendientes de Refactor

- **GlobalDashboard.tsx** - Usar useData + StatePanel
- **PurchaseManagement.tsx** - Usar useData + StatePanel
- **RequisicionesMaterial.tsx** - Usar useData + StatePanel
- **PaymentsManagement.tsx** - Usar useData + StatePanel

---

## 🎯 Próximos Pasos

1. **Refactorizar componentes principales** para usar:
   - `useData` hook
   - `StatePanel` component
   - `GridSkeleton` / `TableSkeleton`

2. **Documentar ejemplos visuales** con capturas de pantalla

3. **Crear Storybook** (opcional) para demostrar estados

4. **Testing automatizado** de estados vacíos

---

## 📝 Ejemplo Completo de Implementación

```typescript
// ✅ CORRECTO - Implementación con 3 estados

import { useData } from '@/core/hooks/useData';
import { dataAdapter } from '@/core/data';
import { StatePanel, GridSkeleton } from '@/core/ui/StatePanel';
import { Building2 } from 'lucide-react';

function ObrasPage() {
  const { data, state, error, isEmpty, reload } = useData({
    fetcher: () => dataAdapter.listObras({ estatus: 'activa' }),
    autoLoad: true,
  });

  return (
    <StatePanel
      state={state}
      error={error}
      isEmpty={isEmpty}
      
      // Loading State
      loadingSkeleton={<GridSkeleton cols={3} items={9} />}
      
      // Empty State
      emptyIcon={<Building2 className="h-12 w-12 text-blue-500" />}
      emptyTitle="No hay obras registradas"
      emptyMessage="Comienza creando tu primera obra para gestionar órdenes de compra y pagos."
      emptyAction={{
        label: "Crear Primera Obra",
        onClick: () => setShowModal(true)
      }}
      
      // Error State (automático)
      onRetry={reload}
    >
      {/* WithData State */}
      <div className="grid grid-cols-3 gap-6">
        {(data as Obra[])?.map(obra => (
          <ObraCard key={obra.obra_id} obra={obra} />
        ))}
      </div>
    </StatePanel>
  );
}
```

---

**Última actualización:** 2025-01-30  
**Versión:** 1.0.0  
**Modo actual:** `TEST_EMPTY_STATE = ${TEST_EMPTY_STATE ? 'true (VACÍO)' : 'false (CON DATOS)'}`
