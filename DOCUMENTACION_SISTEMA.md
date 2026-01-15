# 📚 Documentación Técnica - Sistema IDP Construcción

## 🎯 ¿Qué es este Sistema?

Sistema integral de gestión empresarial diseñado específicamente para **IDP Construcción, Consultoría y Diseño**. Permite controlar y administrar múltiples obras constructivas desde un punto centralizado, gestionando compras, requisiciones, pagos y destajos.

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
Frontend:
├── React 18.3.1              # Framework UI
├── TypeScript                # Tipado estático
├── React Router DOM 7.12.0   # Navegación SPA
├── Tailwind CSS 4.1.12       # Estilos utility-first
└── Vite 6.3.5                # Build tool

Librerías Principales:
├── jsPDF 4.0.0               # Generación de PDFs
├── jspdf-autotable 5.0.7     # Tablas en PDFs
├── xlsx 0.18.5               # Manejo de Excel
├── Lucide React              # Iconos
├── Motion                    # Animaciones
├── Recharts                  # Gráficas
└── React Hook Form           # Formularios

Almacenamiento:
└── localStorage              # Persistencia local (no requiere backend)
```

### Patrón de Diseño

**Arquitectura de 3 Capas:**

```
┌─────────────────────────────────────┐
│         Capa de Presentación        │
│   (Componentes React + UI)          │
│   - Home.tsx                         │
│   - GlobalDashboard.tsx              │
│   - PurchaseOrderManagement.tsx     │
│   - etc.                             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Capa de Lógica de Negocio      │
│   (Servicios)                        │
│   - database.ts (CRUD)               │
│   - generatePurchaseOrderPDF.ts     │
│   - codeGenerators.ts                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Capa de Datos                   │
│   (localStorage + JSON)              │
│   - obras.json                       │
│   - proveedores.json                 │
│   - ordenesCompra.json               │
│   - pagos.json                       │
│   - destajos.json                    │
└─────────────────────────────────────┘
```

---

## 📦 Módulos del Sistema

### 1. **Home** - Pantalla de Entrada (`/`)

**Función:**  
Punto de entrada principal que muestra 5 módulos (4 funcionales + 1 futuro).

**Características:**
- Grid responsive (2 columnas desktop, 1 móvil)
- Cards con gradientes corporativos
- Animaciones hover
- Control de acceso por roles (preparado para futuro)
- Badge "Próximamente" para módulo de Entregas

**Componente:** `/src/app/Home.tsx`

---

### 2. **Dashboard Global** (`/dashboard`)

**Función:**  
Vista empresarial centralizada de todas las obras activas con métricas y estadísticas.

**Características:**
- Protegido con contraseña (configuración por obra)
- Resumen financiero global
- Cards individuales por obra con:
  - Monto del contrato
  - Balance actual
  - Estimaciones
  - Gastos (OCs + Destajos)
  - Avances y retenciones
- Gráficas de balance
- Filtros y búsqueda
- Acceso a sub-módulos por obra

**Sub-Módulos Anidados:**
```
/dashboard/:obraSlug/contratos  → Seguimiento de Contratos (físico de obra)
/dashboard/:obraSlug/gastos     → Detalle de Gastos por partida
/dashboard/:obraSlug/destajos   → Gestión de destajistas
```

**Componentes:**
- `/src/app/GlobalDashboard.tsx`
- `/src/app/ContractTracking.tsx`
- `/src/app/ExpenseDetails.tsx`
- `/src/app/DestajosModule.tsx`

**Paleta de Color:** Gris oscuro (`slate-800` a `slate-900`)

---

### 3. **Compras** (`/compras`)

**Función:**  
Gestión completa de Órdenes de Compra (OCs) con generación de PDFs profesionales.

**Características:**
- Vista centralizada de todas las OCs
- Filtros por:
  - Obra
  - Proveedor
  - Estado (Pendiente, Parcial, Pagada, Cancelada)
  - Rango de fechas
- Creación de OCs con código automático
- Vinculación con Requisiciones
- Generación de PDF con logo IDP amarillo
- Control de línea de crédito por proveedor
- Alertas de vencimiento

**Código Automático de OC:**
```
Formato: [código obra]-[letra+número][iniciales comprador]-[proveedor]
Ejemplo: 227-A12MG-FER
         └┬┘ └┬┘└┬┘└┬┘
          │   │  │  └── Proveedor (primeras 3 letras)
          │   │  └───── Iniciales del comprador
          │   └────────  Secuencial (A1-A99, B1-B99...)
          └──────────── Código de obra
```

**Información Capturada:**
- **IDP**: Nombre, RFC, Dirección, Email
- **Obra**: Código, Nombre, Domicilio, Residente, Teléfono
- **Proveedor**: Nombre, Razón Social, RFC, Dirección, Vendedor, Días de Crédito
- **Artículos**: Concepto, Unidad, Cantidad, Precio, Total
- **Fechas**: Creación y Entrega Programada

**Componentes:**
- `/src/app/PurchaseOrderManagement.tsx`
- `/src/app/components/PurchaseOrderForm.tsx`
- `/src/app/utils/generatePurchaseOrderPDF.ts`

**Paleta de Color:** Azul serio (`blue-700` a `blue-800`)

---

### 4. **Requisiciones de Material** (`/requisiciones`)

**Función:**  
Sistema de solicitudes de material desde obra con login individual por residente.

**Características:**
- Login por residente con contraseña de 4 dígitos
- Solo ve requisiciones de su obra
- Creación de requisiciones con urgencia
- Código automático: `REQ[obra]-[número][iniciales]`
- Estados: Pendiente, Aprobada, Rechazada, En Proceso, Completada
- Vinculación con OCs (cuando Compras las aprueba)
- Notificaciones y alertas

**Flujo de Trabajo:**
```
1. Residente crea requisición → Estado: Pendiente
2. Compras revisa → Aprueba/Rechaza
3. Si aprueba → Crea OC vinculada
4. OC se paga → Requisición: Completada
```

**Componente:** `/src/app/MaterialRequisitions.tsx`

**Paleta de Color:** Naranja corporativo (`amber-700` a `amber-800`)

---

### 5. **Pagos** (`/pagos`)

**Función:**  
Control de pagos a proveedores con vinculación automática a OCs y sistema de pagos parciales.

**Características:**
- Vista de todas las OCs pendientes de pago
- Registro de pagos con:
  - Monto (permite parciales)
  - Método (Transferencia, Cheque, Efectivo)
  - Referencia bancaria
  - Comprobante
- Actualización automática de:
  - Saldo pendiente de OC
  - Estado de OC (Pendiente → Parcial → Pagada)
  - Saldo del proveedor
- Historial de pagos por OC
- Carga de CSVs bancarios
- Conciliación automática

**Estados de OC:**
```
Pendiente → $0 pagado
Parcial   → >$0 y <total pagado
Pagada    → total pagado
Cancelada → OC anulada
```

**Componente:** `/src/app/PaymentManagement.tsx`

**Paleta de Color:** Verde esmeralda (`emerald-700` a `emerald-800`)

---

### 6. **Entregas** (Futuro)

**Función:**  
Módulo de tracking de entregas de materiales.

**Estado:** Próximamente (muestra badge, no funcional)

**Características Planeadas:**
- Tracking de entregas por OC
- Escaneo de códigos QR/barras
- Fotos de evidencia
- Firma digital de recepción
- Vinculación con artículos de OC
- Alertas de entregas pendientes

**Paleta de Color:** Púrpura (`purple-700` a `purple-800`)

---

## 🗂️ Sistema de Datos

### Entidades Principales

#### **Obra** (`Obra`)
```typescript
{
  code: string;                 // 227, 228, 229...
  name: string;                 // CASTELLO E, DOZA C...
  client: string;               // Cliente
  contractNumber: string;       // No. de contrato
  contractAmount: number;       // Monto total
  address?: string;             // Domicilio de la obra
  resident: string;             // Nombre del residente
  residentInitials: string;     // JP, MG...
  residentPassword: string;     // Password de 4 dígitos
  residentPhone?: string;       // Teléfono del residente
  status: "Activa" | "Archivada";
  actualBalance: number;        // Balance actual
  totalEstimates: number;       // Estimaciones totales
  totalExpenses: number;        // Gastos totales
  totalExpensesFromOCs: number; // Gastos de OCs
  totalExpensesFromDestajos: number; // Gastos de destajos
  // ... más campos de control
}
```

#### **Proveedor** (`Proveedor`)
```typescript
{
  id: string;                   // PROV-001, PROV-002...
  nombre: string;               // Nombre comercial
  razonSocial?: string;         // Razón social completa
  rfc: string;                  // RFC
  direccion?: string;           // Dirección completa
  contacto: string;             // Nombre del contacto
  vendedor?: string;            // Vendedor asignado
  telefono: string;             // Teléfono
  email: string;                // Email
  lineaCredito: number;         // Límite de crédito
  diasCredito: number;          // 15, 30, 45 días...
  vencimientoLinea: string;     // Fecha de vencimiento
  saldoPendiente: number;       // Calculado automáticamente
  // ... campos de control
}
```

#### **Orden de Compra** (`OrdenCompra`)
```typescript
{
  id: string;                   // Único
  codigoOC: string;             // 227-A12MG-FER
  obraCode: string;             // 227
  obraNombre: string;           // CASTELLO E
  proveedor: string;            // FERRETERÍA LÓPEZ
  proveedorId: string;          // PROV-001
  comprador: string;            // María González
  compradorIniciales: string;   // MG
  fecha: string;                // Fecha de creación
  fechaEntrega: string;         // Fecha programada
  materiales: [{
    concepto: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
  }];
  subtotal: number;
  iva: number;
  total: number;
  formaPago: string;            // Crédito, Contado...
  diasCredito: number;          // Días de crédito otorgados
  status: "Pendiente" | "Parcial" | "Pagada" | "Cancelada";
  montoPagado: number;          // Acumulado de pagos
  saldoPendiente: number;       // total - montoPagado
  requisicionesVinculadas: string[]; // IDs de requisiciones
  // ... más campos
}
```

#### **Requisición** (`Requisicion`)
```typescript
{
  id: string;
  codigoRequisicion: string;    // REQ227-1JP
  obraCode: string;             // 227
  obraNombre: string;           // CASTELLO E
  residente: string;            // Ing. Juan Pérez
  residenteIniciales: string;   // JP
  fecha: string;
  materiales: [...];            // Similar a OC
  total: number;
  status: "Pendiente" | "Aprobada" | "Rechazada" | "En Proceso" | "Completada";
  notas?: string;
  // ... campos de control
}
```

#### **Pago** (`Pago`)
```typescript
{
  id: string;
  fecha: string;
  ordenCompraId: string;        // ID de la OC
  codigoOC: string;             // Código legible
  proveedor: string;
  monto: number;                // Puede ser parcial
  metodoPago: string;           // Transferencia, Cheque...
  referencia: string;           // Referencia bancaria
  banco?: string;
  cuentaBancaria?: string;
  notas?: string;
  createdAt: string;
}
```

---

## 🔄 Flujos de Trabajo

### Flujo 1: Creación de OC desde Requisición

```
┌────────────────┐
│ 1. Residente   │
│ Crea           │
│ Requisición    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 2. Compras     │
│ Revisa y       │
│ Aprueba        │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 3. Compras     │
│ Genera OC      │
│ Vinculada      │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 4. PDF         │
│ Enviado a      │
│ Proveedor      │
└────────────────┘
```

### Flujo 2: Pago de OC

```
┌────────────────┐
│ 1. OC          │
│ Pendiente      │
│ Total: $10,000 │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ 2. Pago        │
│ Parcial        │
│ $5,000         │
└───────┬────────┘
        │ Estado: Parcial
        │ Saldo: $5,000
        ▼
┌────────────────┐
│ 3. Pago        │
│ Final          │
│ $5,000         │
└───────┬────────┘
        │
        │ Estado: Pagada
        │ Saldo: $0
        ▼
┌────────────────┐
│ 4. Actualiza   │
│ - OC: Pagada   │
│ - Proveedor    │
│ - Obra         │
└────────────────┘
```

### Flujo 3: Actualización de Totales

```
Cuando se crea/actualiza una OC:
  1. Recalcula totalExpensesFromOCs de la obra
  2. Recalcula totalExpenses de la obra
  3. Recalcula saldoPendiente del proveedor
  4. Guarda en localStorage
```

---

## 🎨 Sistema de Diseño

### Componentes Reutilizables

**ModuleHeader** (`/src/app/components/ModuleHeader.tsx`):
- Logo IDP azul
- Título del módulo
- Botón "Volver al Inicio"
- Responsive

**ModuleFooter** (`/src/app/components/ModuleFooter.tsx`):
- Logo IDP azul
- Copyright
- Info de empresa

### Paleta de Colores por Módulo

```css
Dashboard Global:  slate-800 → slate-900   (Gris oscuro)
Compras:           blue-700 → blue-800     (Azul serio)
Requisiciones:     amber-700 → amber-800   (Naranja corporativo)
Pagos:             emerald-700 → emerald-800 (Verde esmeralda)
Destajos:          green-800 → green-900   (Verde oscuro)
Entregas:          purple-700 → purple-800 (Púrpura)
```

### Logos IDP

**Logo Azul** (`/public/logo-idp.svg`):
- Fondo azul marino (#1e3a8a)
- Texto blanco
- Uso: Toda la UI web

**Logo Amarillo** (`/public/logo-idp-alt.svg`):
- Fondo blanco con marco azul
- Centro amarillo (#fbbf24)
- Uso: SOLO PDFs de Órdenes de Compra

---

## 🔌 Servicio de Datos Centralizado

### `database.ts`

Clase Singleton que maneja toda la lógica de datos:

```typescript
class DatabaseService {
  // CRUD de Obras
  getObras(): Obra[]
  getObraByCode(code: string): Obra | undefined
  createObra(obra: Omit<Obra, ...>): Obra
  updateObra(code: string, updates: Partial<Obra>): Obra | null
  deleteObra(code: string): boolean
  
  // CRUD de Proveedores
  getProveedores(): Proveedor[]
  getProveedorById(id: string): Proveedor | undefined
  createProveedor(proveedor: Omit<Proveedor, ...>): Proveedor
  updateProveedor(id: string, updates: Partial<Proveedor>): Proveedor | null
  
  // CRUD de Requisiciones
  getRequisiciones(): Requisicion[]
  getRequisicionesByObra(obraCode: string): Requisicion[]
  createRequisicion(requisicion: Omit<Requisicion, ...>): Requisicion
  updateRequisicion(id: string, updates: Partial<Requisicion>): Requisicion | null
  
  // CRUD de Órdenes de Compra
  getOrdenesCompra(): OrdenCompra[]
  getOrdenesCompraByObra(obraCode: string): OrdenCompra[]
  createOrdenCompra(ordenCompra: Omit<OrdenCompra, ...>): OrdenCompra
  updateOrdenCompra(id: string, updates: Partial<OrdenCompra>): OrdenCompra | null
  
  // CRUD de Pagos
  getPagos(): Pago[]
  getPagosByOrdenCompra(ordenCompraId: string): Pago[]
  createPago(pago: Omit<Pago, ...>): Pago
  
  // CRUD de Destajos
  getDestajos(): CargaSemanal[]
  createCargaDestajo(carga: CargaSemanal): CargaSemanal
  
  // Recálculos automáticos
  recalcularTotalesObra(obraCode: string): void
  recalcularSaldoProveedor(proveedorId: string): void
  
  // Utilidades
  generarCodigoRequisicion(obraCode: string): string
  generarCodigoOC(obraCode: string, compradorIniciales: string, proveedor: string): string
  getEstadisticasGlobales(): {...}
}

// Exportar instancia única
export const db = DatabaseService.getInstance();
```

**Uso:**
```typescript
import { db } from '@/services/database';

// Obtener todas las obras
const obras = db.getObras();

// Crear una OC
const nuevaOC = db.createOrdenCompra({
  codigoOC: '227-A12MG-FER',
  obraCode: '227',
  // ... más campos
});

// Los totales se actualizan automáticamente
```

---

## 🚀 Generación de PDFs

### `generatePurchaseOrderPDF.ts`

Genera PDFs profesionales con jsPDF:

**Características:**
- Header con logo amarillo IDP
- Información completa de IDP, obra y proveedor
- Tabla de artículos con precios
- Totales (Subtotal, IVA, Total)
- Footer con firma y sello
- Diseño profesional con colores corporativos

**Uso:**
```typescript
import { generatePurchaseOrderPDF } from '@/app/utils/generatePurchaseOrderPDF';

generatePurchaseOrderPDF(ordenCompra, obra, proveedor);
// Se descarga automáticamente: OC-227-A12MG-FER.pdf
```

---

## 🔐 Sistema de Roles (Preparado)

El sistema está preparado para control de acceso por roles:

```typescript
type UserRole = 'Admin' | 'Residente' | 'Compras' | 'Pagos';

const permisos = {
  Admin: ['dashboard', 'compras', 'requisiciones', 'pagos', 'destajos'],
  Residente: ['requisiciones'], // Solo su obra
  Compras: ['dashboard', 'compras', 'requisiciones'],
  Pagos: ['dashboard', 'pagos']
};
```

Actualmente todos los módulos son accesibles. Para activar control:
1. Implementar sistema de login
2. Guardar rol en contexto/state
3. Filtrar módulos en Home según rol
4. Proteger rutas en AppRouter

---

## 📊 Persistencia de Datos

### localStorage

Los datos se guardan automáticamente en `localStorage`:

```javascript
Keys:
- 'obras'                → Array<Obra>
- 'proveedores'          → Array<Proveedor>
- 'requisiciones'        → Array<Requisicion>
- 'ordenesCompra'        → Array<OrdenCompra>
- 'pagos'                → Array<Pago>
- 'destajosCargas'       → Array<CargaSemanal>
```

**Ventajas:**
- No requiere backend
- Persistencia automática
- Rápido y simple

**Limitaciones:**
- Datos por navegador (no compartidos)
- Límite de ~5-10MB
- Se pierde al limpiar navegador

**Migración Futura a Backend:**
El servicio `database.ts` está diseñado para fácil migración a API REST o GraphQL. Solo cambiar las funciones internas sin afectar los componentes.

---

## 🧪 Datos de Prueba

Los archivos JSON en `/src/data/` contienen datos iniciales:

- `obras.json` - 7 obras de ejemplo (227-CASTELLO E hasta 233-DOZA C)
- `proveedores.json` - Proveedores con líneas de crédito
- `requisiciones.json` - Requisiciones de ejemplo
- `ordenesCompra.json` - OCs con diferentes estados
- `pagos.json` - Historial de pagos
- `destajos.json` - Cargas semanales de destajos

Estos datos se cargan al iniciar y se pueden modificar desde la UI.

---

## 🛠️ Extensión del Sistema

### Agregar un Nuevo Módulo

1. **Crear el componente:**
```typescript
// /src/app/NuevoModulo.tsx
export default function NuevoModulo() {
  return (
    <div>
      <ModuleHeader title="Nuevo Módulo" />
      {/* Contenido */}
      <ModuleFooter />
    </div>
  );
}
```

2. **Agregar la ruta:**
```typescript
// /src/app/AppRouter.tsx
<Route path="/nuevo-modulo" element={<NuevoModulo />} />
```

3. **Agregar al Home:**
```typescript
// /src/app/Home.tsx
const modules = [
  // ... módulos existentes
  {
    id: "nuevo",
    path: "/nuevo-modulo",
    title: "Nuevo Módulo",
    description: "Descripción del módulo",
    icon: IconoComponente,
    color: "from-blue-700 to-blue-800",
    // ... más config
  }
];
```

### Agregar una Nueva Entidad

1. **Definir el tipo:**
```typescript
// /src/services/database.ts
export interface NuevaEntidad {
  id: string;
  nombre: string;
  // ... campos
}
```

2. **Agregar CRUD al servicio:**
```typescript
class DatabaseService {
  private nuevasEntidades: NuevaEntidad[] = [];
  
  getNuevasEntidades(): NuevaEntidad[] {
    return [...this.nuevasEntidades];
  }
  
  createNuevaEntidad(entidad: Omit<NuevaEntidad, 'id'>): NuevaEntidad {
    const nueva = {
      ...entidad,
      id: Date.now().toString()
    };
    this.nuevasEntidades.push(nueva);
    this.saveToLocalStorage('nuevasEntidades', this.nuevasEntidades);
    return nueva;
  }
  
  // ... más métodos
}
```

3. **Crear JSON de datos iniciales:**
```json
// /src/data/nuevasEntidades.json
[
  {
    "id": "1",
    "nombre": "Ejemplo"
  }
]
```

---

## 🔍 Debugging

### Consola del Navegador

El servicio `database.ts` expone la instancia globalmente:

```javascript
// En la consola del navegador:
window.db = db;

// Ver todas las obras:
window.db.getObras();

// Ver estadísticas:
window.db.getEstadisticasGlobales();
```

### Logs

Para activar logs detallados:
```typescript
// En database.ts
private saveToLocalStorage<T>(key: string, data: T) {
  console.log(`💾 Guardando ${key}:`, data); // Agregar logs
  localStorage.setItem(key, JSON.stringify(data));
}
```

---

## ⚡ Performance

### Optimizaciones Actuales

1. **Memoización de componentes:**
```typescript
const MemoizedComponent = memo(Component);
```

2. **Lazy Loading de rutas:**
```typescript
const LazyComponent = lazy(() => import('./Component'));
```

3. **Debouncing en búsquedas:**
```typescript
const debouncedSearch = debounce(handleSearch, 300);
```

4. **Virtualización de listas largas** (pendiente para futuro)

---

## 📱 Responsive Breakpoints

```css
/* Tailwind v4 */
sm: 640px   /* Móvil landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

---

## 🎯 Roadmap Futuro

### Corto Plazo
- [ ] Sistema de autenticación
- [ ] Control de acceso por roles
- [ ] Módulo de Entregas completo
- [ ] Notificaciones push
- [ ] Exportar reportes a Excel

### Mediano Plazo
- [ ] Backend con API REST
- [ ] Base de datos PostgreSQL
- [ ] Sincronización multi-dispositivo
- [ ] App móvil (React Native)
- [ ] Dashboard de analíticas avanzadas

### Largo Plazo
- [ ] Integración con bancos (API)
- [ ] OCR para escaneo de facturas
- [ ] IA para predicción de costos
- [ ] Sistema de inventarios
- [ ] Integración con ERP

---

**Sistema IDP Construcción v1.0**  
**Desarrollado con ❤️ para IDP CC SC DE RL DE CV**  
**Última actualización**: Enero 2025
