# IDP ERP - Frontend Documentation

## 🎯 Arquitectura de Datos

Este frontend está diseñado para **integración futura con backend real** (FastAPI + Supabase) a través de **Codex**.

### Principios de Diseño

1. ✅ **Separación de capas**: UI nunca accede directamente a mock data
2. ✅ **Interfaz unificada**: `IDataAdapter` define el contrato de datos
3. ✅ **Estados UI estándar**: Todos los componentes manejan loading/empty/error/data
4. ✅ **Mock data estructurado**: Organizado como tablas SQL con relaciones consistentes
5. ✅ **Sin lógica de negocio**: El frontend solo renderiza, los cálculos vienen del adapter

---

## 📁 Estructura de Carpetas

```
/src/core/
├── config.ts                 # Configuración global (MOCK_MODE, etc.)
├── data/
│   ├── types.ts             # Types del dominio (Obra, Proveedor, OC, etc.)
│   ├── dataAdapter.ts       # Interfaz IDataAdapter
│   ├── mockAdapter.ts       # Implementación mock
│   └── index.ts             # Export del adapter activo
├── hooks/
│   └── useData.ts           # Hook para consumir datos
└── ui/
    └── StatePanel.tsx       # Componente universal de estados

/spec/mock-db/
├── schema.sql               # Schema SQL completo
├── schema.md                # Documentación del schema
└── seed.ts                  # Datos mock estructurados
```

---

## 🔄 Flujo de Datos

```
┌─────────────┐
│ Componente  │
│   React     │
└──────┬──────┘
       │ useData()
       ▼
┌─────────────┐
│ dataAdapter │ ◄─── Interfaz IDataAdapter
└──────┬──────┘
       │
       ├─── MOCK_MODE = true  ──► mockAdapter ──► seed.ts
       │
       └─── MOCK_MODE = false ──► apiAdapter ──► FastAPI Backend
                                    (pendiente)
```

---

## 🚀 Uso Básico

### 1. Consumir datos en un componente

```tsx
import { useData } from '@/core/hooks/useData';
import { dataAdapter } from '@/core/data';
import { StatePanel, TableSkeleton } from '@/core/ui/StatePanel';
import type { Obra } from '@/core/data';

function ObrasPage() {
  const { data, state, error, isEmpty, reload } = useData<Obra>({
    fetcher: () => dataAdapter.listObras({ estatus: 'activa' }),
    autoLoad: true,
  });

  return (
    <StatePanel
      state={state}
      error={error}
      isEmpty={isEmpty}
      loadingSkeleton={<TableSkeleton rows={8} />}
      emptyTitle="No hay obras registradas"
      emptyMessage="Comienza creando tu primera obra."
      emptyAction={{
        label: "Crear Obra",
        onClick: () => console.log("Abrir modal crear obra")
      }}
      onRetry={reload}
    >
      <div className="grid grid-cols-3 gap-6">
        {(data as Obra[])?.map(obra => (
          <ObraCard key={obra.obra_id} obra={obra} />
        ))}
      </div>
    </StatePanel>
  );
}
```

### 2. Crear nuevos datos

```tsx
import { dataAdapter } from '@/core/data';
import type { CreateObraDTO } from '@/core/data';

async function handleCreateObra(formData: CreateObraDTO) {
  const result = await dataAdapter.createObra(formData);
  
  if (result.status === 'error') {
    alert(`Error: ${result.error}`);
    return;
  }
  
  console.log('Obra creada:', result.data);
  // Recargar lista...
}
```

### 3. Obtener métricas calculadas

```tsx
const { data: metricas } = useData({
  fetcher: () => dataAdapter.getMetricasObra('obra_227'),
});

if (metricas) {
  console.log('Presupuesto:', metricas.presupuesto_total);
  console.log('Comprometido:', metricas.total_comprometido);
  console.log('Pagado:', metricas.total_pagado);
  console.log('Saldo:', metricas.saldo_por_pagar);
}
```

---

## 🗄️ Mock Data Structure

Los datos mock están en `/spec/mock-db/seed.ts` estructurados como tablas SQL:

```typescript
export const mockDatabase = {
  obras: Obra[],
  proveedores: Proveedor[],
  requisiciones_material: RequisicionMaterial[],
  requisiciones_material_items: RequisicionMaterialItem[],
  ordenes_compra: OrdenCompra[],
  ordenes_compra_items: OrdenCompraItem[],
  pagos: Pago[],
  entregas: Entrega[],
  // ...
};
```

### Relaciones (Foreign Keys)

Todas las relaciones son **consistentes y válidas**:

- `ordenes_compra.obra_id` → `obras.obra_id`
- `ordenes_compra.proveedor_id` → `proveedores.proveedor_id`
- `ordenes_compra_items.oc_id` → `ordenes_compra.oc_id`
- `pagos.oc_id` → `ordenes_compra.oc_id`
- `pagos.obra_id` → `obras.obra_id`

### Métricas Calculadas

El `mockAdapter` **calcula en tiempo real**:

- Total comprometido por obra (suma de OCs aprobadas)
- Total pagado por obra (suma de pagos aplicados)
- Saldo por pagar (comprometido - pagado)
- Presupuesto disponible (presupuesto_total - comprometido)

---

## 🧪 Testing de Empty States

Para probar estados vacíos, usa `emptyDatabase` de `seed.ts`:

```typescript
// En /src/core/data/mockAdapter.ts
import { emptyDatabase } from '../../../spec/mock-db/seed';

// Temporalmente reemplazar:
const db = emptyDatabase; // En lugar de mockDatabase
```

O modifica `mockDatabase` directamente:

```typescript
export const mockDatabase = {
  obras: [], // ← Vacío
  proveedores: [], // ← Vacío
  // ...
};
```

La app **no debe crashear** con datos vacíos. Todos los componentes deben mostrar empty states.

---

## 🔌 Integración con Backend Real (Codex)

### Qué debe hacer Codex:

1. **Crear `apiAdapter.ts`** que implemente `IDataAdapter`
2. **Usar FastAPI endpoints** en lugar de mock data
3. **Mantener la misma interfaz** (`IDataAdapter`)
4. **Cambiar config**: `MOCK_MODE = false` en `/src/core/config.ts`

### Ejemplo de apiAdapter (esqueleto):

```typescript
// /src/core/data/apiAdapter.ts
import type { IDataAdapter, ListResponse, DataResponse } from './dataAdapter';
import type { Obra, CreateObraDTO } from './types';
import { API_BASE_URL } from '../config';

class ApiDataAdapter implements IDataAdapter {
  async listObras(filters?: { estatus?: string }): Promise<ListResponse<Obra>> {
    const params = new URLSearchParams();
    if (filters?.estatus) params.set('estatus', filters.estatus);
    
    const response = await fetch(`${API_BASE_URL}/obras?${params}`);
    const data = await response.json();
    
    return {
      status: 'success',
      data: data.obras,
      error: null,
      total: data.total,
    };
  }
  
  // ... implementar los demás métodos
}

export const apiAdapter = new ApiDataAdapter();
```

### Cambio en `/src/core/data/index.ts`:

```typescript
import { apiAdapter } from './apiAdapter'; // ← Nueva importación
import { MOCK_MODE } from '../config';

export const dataAdapter = MOCK_MODE ? mockAdapter : apiAdapter; // ← Usar apiAdapter
```

---

## 📊 Estados UI Estándar

Todos los componentes que dependen de datos **deben manejar 4 estados**:

| Estado | Cuándo | UI |
|--------|--------|-----|
| `loading` | Cargando datos | Skeleton/Spinner |
| `empty` | Sin datos | Mensaje + CTA |
| `error` | Error al cargar | Mensaje + Botón reintentar |
| `success` | Datos cargados | Renderizar data |

### Ejemplo con StatePanel:

```tsx
<StatePanel
  state={state}
  error={error}
  isEmpty={data.length === 0}
  loadingSkeleton={<TableSkeleton />}
  emptyTitle="No hay datos"
  emptyAction={{ label: "Crear", onClick: handleCreate }}
  onRetry={reload}
>
  {/* Tu UI con datos */}
</StatePanel>
```

---

## 🎨 Componentes Visuales

### Skeletons Disponibles

```tsx
import { TableSkeleton, CardSkeleton, GridSkeleton } from '@/core/ui/StatePanel';

<TableSkeleton rows={10} />
<CardSkeleton />
<GridSkeleton cols={3} items={9} />
```

### Empty State Personalizado

```tsx
<StatePanel
  state="empty"
  emptyIcon={<Building className="h-12 w-12 text-blue-500" />}
  emptyTitle="No hay obras registradas"
  emptyMessage="Comienza creando tu primera obra para comenzar a gestionar órdenes de compra."
  emptyAction={{
    label: "Crear Primera Obra",
    onClick: openCreateModal
  }}
>
  {/* ... */}
</StatePanel>
```

---

## ⚙️ Configuración

Archivo: `/src/core/config.ts`

```typescript
// Modo de datos
export const MOCK_MODE = true; // false cuando Codex implemente apiAdapter

// API real (para apiAdapter)
export const API_BASE_URL = 'http://localhost:8000/api/v1';

// Simulación de latencia en mock
export const SIMULATE_NETWORK_DELAY = true;

// UI
export const SHOW_LOADING_INDICATORS = true;
export const MIN_LOADING_DURATION = 300; // ms
```

---

## 📝 Nomenclatura y Convenciones

### IDs

- Formato: `{prefijo}_{numero/timestamp}`
- Ejemplos: `obra_227`, `prov_001`, `oc_001`

### Campos de Timestamp

- `created_at`: ISO string
- `updated_at`: ISO string

### Montos

- Tipo: `number` (no string)
- Formato visual: usar `toLocaleString('es-MX', { ... })`

### Fechas

- Tipo: `string` (ISO date: `YYYY-MM-DD`)
- Formato visual: `new Date(fecha).toLocaleDateString('es-MX')`

### Estatus/Estados

- snake_case: `en_revision`, `convertida_oc`
- No usar espacios ni mayúsculas en valores de DB

---

## 🐛 Debugging

### Ver llamadas al adapter

```typescript
// En /src/core/config.ts
export const LOG_ADAPTER_CALLS = true;
```

### Ver datos mock actuales

```typescript
import { mockDatabase } from '/spec/mock-db/seed';
console.log('Obras:', mockDatabase.obras);
console.log('OCs:', mockDatabase.ordenes_compra);
```

### Simular errores

En `mockAdapter.ts`, puedes forzar errores:

```typescript
async listObras() {
  await simulateDelay();
  return createErrorResponse('Error simulado de prueba');
}
```

---

## ✅ Checklist de Integración (para Codex)

- [ ] Implementar `apiAdapter.ts` con todos los métodos de `IDataAdapter`
- [ ] Conectar endpoints FastAPI a cada método
- [ ] Manejar errores HTTP (401, 404, 500, etc.)
- [ ] Implementar retry logic y timeouts
- [ ] Actualizar `MOCK_MODE = false` en config
- [ ] Probar todos los estados: loading, empty, error, success
- [ ] Validar que métricas calculadas vengan del backend
- [ ] Implementar paginación si es necesario
- [ ] Agregar autenticación/headers si es necesario

---

## 📞 Soporte

Para dudas sobre la arquitectura de datos:

1. Revisar `/spec/mock-db/schema.md`
2. Ver ejemplos en `/src/core/hooks/useData.ts`
3. Inspeccionar `mockAdapter.ts` para entender el comportamiento esperado
4. Los tipos en `types.ts` son la fuente de verdad

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0  
**Estado**: Mock mode activo, listo para integración con backend real
