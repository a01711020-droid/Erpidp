# Sistema DataProvider - Arquitectura de Datos

## Descripción General

El sistema DataProvider proporciona una **abstracción completa** para el acceso a datos en toda la aplicación. Permite cambiar fácilmente entre datos mock (demostración) y el API backend real sin modificar código de los módulos.

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    MÓDULOS                          │
│  (Dashboard, Requisiciones, OC, Pagos, etc.)       │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ import { dataProvider }
                      │
┌─────────────────────▼───────────────────────────────┐
│               DataProvider (index.ts)                │
│         Factory basado en VITE_DATA_MODE            │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼─────────┐        ┌────────▼────────┐
│  MockProvider   │        │   ApiProvider   │
│  (memoria)      │        │  (Supabase)     │
└─────────────────┘        └─────────────────┘
```

## Estructura de Archivos

```
src/app/
├── types/
│   └── entities.ts              # DTOs y tipos compartidos
├── providers/
│   ├── DataProvider.interface.ts  # Contrato CRUD
│   ├── MockProvider.ts           # Implementación Mock
│   ├── ApiProvider.ts            # Implementación API
│   ├── mockData.ts               # Datos de demostración
│   └── index.ts                  # Factory y exportación
```

## Entidades Principales

El sistema maneja las siguientes entidades con **UUIDs** consistentes:

1. **Obra** - Proyectos de construcción
2. **Proveedor** - Proveedores y sus datos
3. **Requisicion** - Solicitudes de material desde obra
4. **OrdenCompra** - Órdenes de compra a proveedores
5. **Pago** - Pagos realizados o programados
6. **Destajo** - Trabajos por destajo
7. **Usuario** - Usuarios del sistema

### Relaciones entre Entidades

```
Obra (227 - CASTELLO E)
  │
  ├── Requisiciones
  │     └── Items
  │
  ├── Órdenes de Compra
  │     ├── Items
  │     └── → Proveedor
  │
  ├── Pagos
  │     ├── → Proveedor
  │     └── → Orden de Compra
  │
  └── Destajos
```

## Uso en los Módulos

### Importación

```typescript
import { dataProvider } from "@/app/providers";
import type { Obra, Requisicion, OrdenCompra, Pago } from "@/app/providers";
```

### Ejemplos de Uso

#### Listar Obras

```typescript
// Obtener todas las obras
const response = await dataProvider.obras.list();
console.log(response.data); // Array de obras
console.log(response.total); // Total de obras

// Con paginación y filtros
const filtered = await dataProvider.obras.list({
  page: 1,
  pageSize: 10,
  filters: { status: "Activa" },
  sortBy: "name",
  sortOrder: "asc",
});
```

#### Obtener una Obra por ID

```typescript
const obra = await dataProvider.obras.getById("550e8400-e29b-41d4-a716-446655440000");
console.log(obra.name); // "CASTELLO E"
```

#### Crear una Requisición

```typescript
const nuevaReq = await dataProvider.requisiciones.create({
  code: "REQ-227-005",
  obraId: "550e8400-e29b-41d4-a716-446655440000",
  requestedBy: "Ing. Miguel Ángel Torres",
  requestedAt: new Date().toISOString(),
  urgency: "Normal",
  status: "Pendiente",
  notes: "Material para instalaciones",
  approvedBy: null,
  approvedAt: null,
  rejectionReason: null,
  items: [],
});
```

#### Agregar Item a Requisición

```typescript
const item = await dataProvider.requisiciones.addItem(requisicionId, {
  description: "Cable THW calibre 10",
  unit: "Metro",
  quantity: 200,
  estimatedPrice: 22,
  notes: "Cable para instalación eléctrica",
});
```

#### Obtener Datos Financieros de una Obra

```typescript
const summary = await dataProvider.obras.getFinancialSummary(obraId);
console.log(summary.actualBalance);
console.log(summary.totalPaid);

const expenses = await dataProvider.obras.getExpensesByCategory(obraId);
expenses.forEach((cat) => {
  console.log(`${cat.category}: $${cat.amount} (${cat.percentage.toFixed(1)}%)`);
});
```

## Configuración de Modos

### Modo MOCK (Desarrollo/Demostración)

**Archivo `.env`:**
```env
VITE_DATA_MODE=mock
```

- Usa datos en memoria
- 1 obra completa: CASTELLO E (código 227)
- Datos coherentes entre todos los módulos
- No requiere backend

### Modo API (Producción)

**Archivo `.env`:**
```env
VITE_DATA_MODE=api
VITE_API_URL=https://tu-proyecto.supabase.co/functions/v1
```

- Se conecta al backend de Supabase
- Rutas con prefijo `/make-server-4298db9c`
- Requiere que el servidor Hono esté funcionando
- **No tiene fallback a mock en producción**

## Datos Mock - Obra CASTELLO E

La obra de demostración incluye:

### Información General
- **Código**: 227
- **Nombre**: CASTELLO E
- **Cliente**: Desarrolladora Inmobiliaria del Centro
- **Monto Contrato**: $5,250,000 MXN
- **Estado**: Activa

### Datos Coherentes
- 5 **Proveedores** registrados
- 4 **Requisiciones** con 9 items en total
- 3 **Órdenes de Compra** completamente relacionadas con requisiciones
- 4 **Pagos** (3 completados, 1 programado)
- 4 **Destajos** en diferentes estados
- 4 **Usuarios** del sistema

### Flujo Completo de Ejemplo

```
Requisición REQ-227-001 (Urgente)
  └── Material: Cemento, Arena, Grava
       └── OC-227-001 → Proveedor: Agregados del Norte
            └── PAG-227-001 → Pago Completado $150,800
```

## Interface CRUD Completa

Cada entidad tiene las siguientes operaciones:

```typescript
interface EntityOperations<T> {
  list(params?: ListParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### Operaciones Especiales

**Requisiciones:**
- `approve(id, approvedBy)` - Aprobar requisición
- `reject(id, reason)` - Rechazar requisición
- `addItem(requisicionId, item)` - Agregar item
- `updateItem(itemId, data)` - Actualizar item
- `deleteItem(itemId)` - Eliminar item

**Órdenes de Compra:**
- `addItem(ordenCompraId, item)` - Agregar item
- `updateItem(itemId, data)` - Actualizar item
- `deleteItem(itemId)` - Eliminar item

**Pagos:**
- `process(id, processedBy)` - Procesar pago
- `complete(id)` - Completar pago
- `cancel(id)` - Cancelar pago

**Destajos:**
- `updateProgress(id, percentage)` - Actualizar avance

**Obras:**
- `getFinancialSummary(id)` - Resumen financiero
- `getExpensesByCategory(id)` - Gastos por categoría
- `getWeeklyExpenses(id)` - Gastos semanales

## Preparación para Múltiples URLs (Departamentos)

El sistema está preparado para funcionar con **diferentes URLs** en producción, simulando diferentes departamentos:

```
https://dashboard.empresa.com  → Dashboard Global
https://requisiciones.empresa.com  → Módulo Requisiciones
https://compras.empresa.com  → Módulo OC
https://pagos.empresa.com  → Módulo Pagos
```

Todos comparten:
- **La misma base de datos** (Supabase)
- **El mismo contrato de DTOs**
- **El mismo DataProvider**

Solo cambia el `VITE_API_URL` en cada despliegue.

## Migración de Código Existente

Para migrar módulos existentes al nuevo sistema:

### Antes
```typescript
const obras = JSON.parse(localStorage.getItem("obras") || "[]");
```

### Después
```typescript
import { dataProvider } from "@/app/providers";

const response = await dataProvider.obras.list();
const obras = response.data;
```

## Debugging

El DataProvider imprime logs en consola:

```
[DataProvider] Inicializando en modo: mock
[DataProvider] Usando MockProvider con datos de demostración
```

Para habilitar más logs, agregar en cada módulo:

```typescript
console.log("Obras cargadas:", await dataProvider.obras.list());
```

## Notas Importantes

1. **UUIDs Consistentes**: Todos los IDs son UUIDs v4
2. **Fechas en ISO**: Todas las fechas usan formato ISO 8601
3. **Sin localStorage**: Los datos mock están en memoria durante la sesión
4. **Simulación Asíncrona**: El MockProvider simula latencia de red (300ms)
5. **Producción = API**: En producción, NUNCA usar modo mock

## Próximos Pasos

1. ✅ Arquitectura DataProvider completa
2. ✅ MockProvider con datos coherentes
3. ✅ ApiProvider preparado para backend
4. ⏳ Implementar rutas en `/supabase/functions/server/index.tsx`
5. ⏳ Migrar módulos existentes para usar dataProvider
6. ⏳ Testing y validación
