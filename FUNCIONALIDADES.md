# 📘 Documentación de Funcionalidades del Sistema

## Sistema de Gestión Empresarial IDP

**Versión:** 1.0  
**Última actualización:** Enero 2025

---

## 📋 Tabla de Contenido

1. [Descripción General del Sistema](#descripción-general-del-sistema)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Módulos Principales](#módulos-principales)
4. [Flujos de Trabajo](#flujos-de-trabajo)
5. [Gestión de Usuarios y Permisos](#gestión-de-usuarios-y-permisos)
6. [Características Técnicas](#características-técnicas)
7. [Entidades y Modelos de Datos](#entidades-y-modelos-de-datos)

---

## 🎯 Descripción General del Sistema

El **Sistema de Gestión Empresarial IDP** es una plataforma completa para la administración financiera y operativa de proyectos de construcción. Diseñado específicamente para **IDP Construcción, Consultoría y Diseño**.

### Propósito

- **Centralizar** la gestión de obras, proveedores, compras y pagos
- **Automatizar** procesos de requisiciones y aprobaciones
- **Visualizar** el estado financiero en tiempo real
- **Controlar** gastos por obra y categoría
- **Generar** documentación profesional (PDFs de OCs)

### Alcance

El sistema cubre **5 módulos principales**:

1. **Dashboard Global Empresarial**
2. **Requisiciones de Material**
3. **Órdenes de Compra**
4. **Módulo de Pagos**
5. **Seguimiento de Contratos** (con sub-módulo de Detalles de Gastos)

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

```
Frontend:
├── React 18.3.1
├── TypeScript
├── Vite 6.3.5
├── Tailwind CSS v4
├── Recharts (gráficas)
├── Lucide React (iconos)
└── Radix UI (componentes)

Backend (Opcional):
├── Supabase (PostgreSQL)
├── Supabase Edge Functions
├── Hono (Web Framework)
└── KV Store (Key-Value)

Estado:
├── MockProvider (Modo Demo)
└── ApiProvider (Modo Producción)
```

### Arquitectura de Datos

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │  Módulo 1  │  │  Módulo 2  │  │  Módulo 3  │    │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘    │
│         │                │                │          │
│         └────────────────┴────────────────┘          │
│                          │                           │
│                   ┌──────▼──────┐                   │
│                   │ DataProvider │                   │
│                   │  Interface   │                   │
│                   └──────┬───────┘                   │
│                          │                           │
│         ┌────────────────┴────────────────┐          │
│         │                                 │          │
│  ┌──────▼──────┐                  ┌──────▼──────┐  │
│  │MockProvider │                  │ ApiProvider  │  │
│  │(Demo Mode)  │                  │(Production)  │  │
│  └─────────────┘                  └──────┬───────┘  │
└────────────────────────────────────────────┼─────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Supabase API   │
                                    │   (Backend)     │
                                    └─────────────────┘
```

### Flujo de Datos

1. **Componente React** llama a un hook personalizado (ej: `useObras()`)
2. **Hook** utiliza el `dataProvider` global
3. **DataProvider** ejecuta operación CRUD
4. **MockProvider** responde con datos en memoria **O** **ApiProvider** hace petición HTTP
5. **Datos** regresan al componente y actualizan la UI

---

## 📦 Módulos Principales

### 1️⃣ Dashboard Global Empresarial

**Acceso**: Solo Administradores  
**Ruta Producción**: `dashboard.idp-gestion.com`

#### ¿Qué hace?

Proporciona una **vista panorámica** de todas las obras activas de la empresa con métricas consolidadas.

#### Funcionalidades

- ✅ **Lista de obras activas** con tarjetas visuales
- ✅ **Métricas por obra**:
  - Monto contratado
  - Gastos totales
  - Balance actual
  - Progreso estimado
  - Número de proveedores activos
- ✅ **Gráficas financieras**:
  - Balance consolidado empresarial
  - Ingresos vs Gastos mensuales
- ✅ **Acceso rápido** a detalles de cada obra

#### Cómo funciona

1. Usuario accede al Dashboard
2. Sistema carga todas las obras mediante `dataProvider.obras.list()`
3. Para cada obra, obtiene `getFinancialSummary()` con:
   - Total contratado
   - Total gastado
   - Balance disponible
   - Proveedores activos
4. Renderiza tarjetas con `ProjectCard` component
5. Muestra gráficas consolidadas con Recharts

#### Datos que muestra

```typescript
interface ObraFinancialSummary {
  totalContratado: number;      // Monto total del contrato
  totalGastado: number;          // Suma de todas las OCs
  balance: number;               // Disponible = Contratado - Gastado
  estimacionesAprobadas: number; // Número de estimaciones
  proveedoresActivos: number;    // Proveedores con OCs activas
}
```

---

### 2️⃣ Requisiciones de Material

**Acceso**: Administradores, Residentes de Obra, Compras  
**Ruta Producción**: `requisiciones.idp-gestion.com`

#### ¿Qué hace?

Permite a los **residentes de obra** solicitar materiales necesarios con un sistema de aprobación y seguimiento.

#### Funcionalidades

- ✅ **Crear requisiciones** con múltiples items
- ✅ **Sistema de urgencia**: Normal, Urgente, Muy Urgente
- ✅ **Workflow de aprobación**:
  - Pendiente → Aprobada → En Proceso → Completada
  - O: Pendiente → Rechazada
- ✅ **Filtros y búsqueda**:
  - Por obra
  - Por estado
  - Por fecha
  - Por nivel de urgencia
- ✅ **Observaciones y comentarios**
- ✅ **Vinculación** con Órdenes de Compra

#### Cómo funciona

**Flujo de Creación**:
1. Residente abre formulario "Nueva Requisición"
2. Selecciona obra asignada
3. Agrega items con:
   - Cantidad
   - Unidad (PZA, M2, M3, KG, LT, etc.)
   - Descripción del material
4. Establece nivel de urgencia
5. Agrega observaciones (opcional)
6. Envía requisición → Estado: "Pendiente"

**Flujo de Aprobación**:
1. Compras recibe notificación de nueva requisición
2. Revisa items y urgencia
3. Aprueba → Estado: "Aprobada" (puede crear OC)
4. O Rechaza → Estado: "Rechazada" + razón

**Flujo de Procesamiento**:
1. Compras crea OC basada en requisición
2. Estado cambia a "En Proceso"
3. Material es entregado
4. Estado final: "Completada"

#### Datos que maneja

```typescript
interface Requisicion {
  id: string;
  numeroRequisicion: string;       // REQ-XXXX
  obraId: string;                   // ID de la obra
  solicitadoPor: string;            // Nombre del residente
  fechaSolicitud: string;           // ISO Date
  urgencia: "normal" | "urgente" | "muy_urgente";
  estado: "pendiente" | "aprobada" | "rechazada" | "en_proceso" | "completada";
  observaciones?: string;
  items: RequisicionItem[];         // Lista de materiales
  aprobadoPor?: string;
  fechaAprobacion?: string;
  motivoRechazo?: string;
}

interface RequisicionItem {
  id: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
}
```

---

### 3️⃣ Órdenes de Compra

**Acceso**: Administradores, Compras  
**Ruta Producción**: `compras.idp-gestion.com`

#### ¿Qué hace?

Gestiona el proceso completo de compras a proveedores con generación de **PDFs profesionales** con el formato oficial de IDP.

#### Funcionalidades

- ✅ **Crear OCs** con múltiples items
- ✅ **Gestión de proveedores**:
  - 10 proveedores pre-cargados en MOCK
  - Datos completos: RFC, dirección, contacto, banco
- ✅ **Cálculos automáticos**:
  - Subtotal
  - Descuentos (%)
  - IVA (16%)
  - Total
- ✅ **Generar PDF** con formato IDP oficial:
  - Logo amarillo IDP
  - Información del proveedor
  - Datos bancarios
  - Tabla de items
  - Firmas: Elaboró, Autorizó (Giovanni Martínez), Proveedor
- ✅ **Estados de OC**:
  - Borrador → Emitida → Recibida → Facturada → Pagada
- ✅ **Filtros avanzados**:
  - Por obra
  - Por proveedor
  - Por estado
  - Por rango de fechas
- ✅ **Vinculación** con requisiciones

#### Cómo funciona

**Flujo de Creación de OC**:
1. Compras abre "Nueva Orden de Compra"
2. Selecciona:
   - Obra destino
   - Proveedor (de catálogo de 10)
   - Tipo de entrega (En Obra / En Bodega / Recoger)
   - Fecha de entrega
3. Agrega items:
   - Cantidad
   - Descripción del material/servicio
   - Precio unitario
   - Sistema calcula total automáticamente
4. Configura:
   - Descuento (% opcional)
   - IVA (checkbox)
5. Agrega observaciones (opcional)
6. Guarda como "Borrador" o emite directamente

**Flujo de Generación de PDF**:
1. Usuario hace clic en "Ver PDF" de una OC
2. Sistema abre modal con vista previa
3. PDF incluye:
   ```
   ┌─────────────────────────────────────────────┐
   │ [Logo IDP Amarillo] │ ORDEN DE COMPRA       │
   │                     │ IDP CC SC DE RL DE CV │
   │                     │ No. OC: XXX           │
   ├─────────────────────────────────────────────┤
   │ OBRA: CASTELLO E                    227     │
   ├─────────────────────────────────────────────┤
   │ PROVEEDOR: [Nombre]                         │
   │ RFC, Dirección, Teléfono                    │
   │ Banco, Cuenta, CLABE                        │
   ├─────────────────────────────────────────────┤
   │ CANT │ UNIDAD │ DESCRIPCIÓN │ P.U. │ TOTAL │
   │  ... │   ...  │     ...     │  ... │  ...  │
   ├─────────────────────────────────────────────┤
   │                          SUBTOTAL: $X,XXX   │
   │                              IVA: $X,XXX    │
   │                            TOTAL: $X,XXX    │
   ├─────────────────────────────────────────────┤
   │ Firmas: Elaboró │ Autorizó │ Proveedor      │
   └─────────────────────────────────────────────┘
   ```
4. Opciones: Imprimir o Descargar

**Proveedores Pre-cargados (Modo MOCK)**:
1. Cementos Cruz Azul
2. Aceros Levinson
3. CEMEX
4. Ferretería EPA
5. Transportes García
6. Maderas del Norte
7. Vidrios y Aluminios SA
8. Pinturas Comex
9. Instalaciones Eléctricas Omega
10. Plomería y Gas Industrial

#### Datos que maneja

```typescript
interface OrdenCompra {
  id: string;
  numeroOrden: string;              // OC-XXXX
  obraId: string;
  proveedorId: string;
  fechaEmision: string;
  fechaEntrega: string;
  estado: "borrador" | "emitida" | "recibida" | "facturada" | "pagada";
  tipoEntrega: "en_obra" | "bodega" | "recoger";
  subtotal: number;
  descuento: number;                // Porcentaje
  descuentoMonto: number;
  iva: number;
  total: number;
  observaciones?: string;
  items: OrdenCompraItem[];
  requisicionId?: string;           // Si viene de requisición
}

interface Proveedor {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  rfc: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  contactoPrincipal: string;
  banco?: string;
  numeroCuenta?: string;
  clabe?: string;
  tipoProveedor: "material" | "servicio" | "renta" | "mixto";
  creditoDias: number;
  limiteCredito: number;
  activo: boolean;
}
```

---

### 4️⃣ Módulo de Pagos

**Acceso**: Administradores, Pagos  
**Ruta Producción**: `pagos.idp-gestion.com`

#### ¿Qué hace?

Controla el ciclo completo de **pagos a proveedores** vinculados con Órdenes de Compra, permitiendo pagos parciales y seguimiento del estatus.

#### Funcionalidades

- ✅ **Registro de pagos** vinculados a OCs
- ✅ **Pagos parciales**: Una OC puede tener múltiples pagos
- ✅ **Métodos de pago**:
  - Transferencia
  - Cheque
  - Efectivo
- ✅ **Estados de pago**:
  - Programado → Procesando → Completado → Cancelado
- ✅ **Seguimiento financiero**:
  - Total a pagar (OC)
  - Total pagado (suma de pagos)
  - Saldo pendiente
- ✅ **Comprobantes**: Adjuntar referencia de transferencia/cheque
- ✅ **Filtros**:
  - Por obra
  - Por proveedor
  - Por estado
  - Por fecha

#### Cómo funciona

**Flujo de Creación de Pago**:
1. Usuario accede a "Nuevo Pago"
2. Selecciona:
   - Obra
   - Proveedor
   - OC específica (filtra por obra y proveedor)
3. Sistema muestra:
   - Total de la OC
   - Pagos previos (si existen)
   - Saldo pendiente
4. Usuario ingresa:
   - Monto a pagar (≤ saldo pendiente)
   - Método de pago
   - Fecha programada
   - Referencia/Comprobante
5. Guarda → Estado: "Programado"

**Flujo de Procesamiento**:
1. Contador/Pagos revisa pagos programados
2. Ejecuta el pago (transferencia/cheque)
3. Cambia estado a "Procesando"
4. Confirma ejecución → "Completado"
5. Sistema actualiza saldo de la OC
6. Si saldo = 0 → OC cambia a "Pagada"

**Cálculo de Saldos**:
```typescript
const totalOC = 10000;
const pagosPrevios = [3000, 2000]; // 5000
const saldoPendiente = totalOC - pagosPrevios.reduce((sum, p) => sum + p, 0);
// saldoPendiente = 5000
```

#### Datos que maneja

```typescript
interface Pago {
  id: string;
  numeroPago: string;               // PAG-XXXX
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  metodoPago: "transferencia" | "cheque" | "efectivo";
  fechaProgramada: string;
  fechaProcesado?: string;
  estado: "programado" | "procesando" | "completado" | "cancelado";
  referencia?: string;              // No. Cheque o Referencia
  comprobante?: string;             // URL del archivo
  observaciones?: string;
  procesadoPor?: string;
}
```

---

### 5️⃣ Seguimiento de Contratos (con Detalles de Gastos)

**Acceso**: Administradores, Residentes de Obra  
**Ruta Producción**: `contratos.idp-gestion.com`

#### ¿Qué hace?

Proporciona **control financiero detallado** de cada obra con seguimiento de contratos, estimaciones, destajos y análisis de gastos por categoría.

#### Funcionalidades Principales

##### Seguimiento de Contratos (Vista Principal)
- ✅ **Tarjetas de obras** con información de contrato
- ✅ **Métricas de contrato**:
  - Número de contrato
  - Monto contratado
  - Plazo de ejecución
  - Residente asignado
- ✅ **Tabla de Estimaciones**:
  - Número de estimación
  - Periodo
  - Monto
  - Estado (Pendiente, Aprobada, Pagada)
  - Fecha de pago
- ✅ **Tabla de Destajos**:
  - Concepto
  - Destajista
  - Monto contratado
  - Avance (%)
  - Saldo pendiente
- ✅ **Acceso a detalles**: Click en "Ver Detalle de Gastos"

##### Detalles de Gastos (Sub-módulo)
**Ruta**: `contratos.idp-gestion.com/gastos`

- ✅ **Resumen financiero consolidado**:
  - Monto contratado
  - Ingresos por estimaciones
  - Gastos totales
  - Balance actual
- ✅ **Gráfica de balance** (línea de tiempo)
- ✅ **Gráfica de ingresos vs gastos** (barras por mes)
- ✅ **Gastos por categoría** (pie chart):
  - Material
  - Mano de Obra
  - Maquinaria
  - Subcontratos
  - Indirectos
- ✅ **Gastos semanales** (tabla detallada):
  - Semana
  - Categoría
  - Descripción
  - Monto
  - Acumulado
- ✅ **Lista de transacciones**:
  - OCs emitidas
  - Pagos realizados
  - Requisiciones procesadas

#### Cómo funciona

**Vista de Seguimiento de Contratos**:
1. Usuario selecciona una obra
2. Sistema carga:
   - `dataProvider.obras.getById(obraId)`
   - `dataProvider.obras.getFinancialSummary(obraId)`
3. Muestra componente `ContractTracking`:
   - Header con datos del contrato
   - Tabla de estimaciones
   - Tabla de destajos
   - Botón "Ver Detalle de Gastos"

**Vista de Detalles de Gastos**:
1. Usuario hace clic en "Ver Detalle de Gastos"
2. Sistema navega a sub-módulo
3. Carga datos financieros:
   - `getFinancialSummary(obraId)`
   - `getExpensesByCategory(obraId)`
   - `getWeeklyExpenses(obraId)`
4. Renderiza componente `ExpenseDetails`:
   - BalanceOverview (resumen)
   - BalanceChart (gráfica de línea)
   - IncomeExpensesChart (barras)
   - Gráfica de categorías (pie)
   - WeeklyExpenses (tabla semanal)
   - TransactionsList (lista completa)

**Categorías de Gastos**:
```typescript
type ExpenseCategory = 
  | "material"        // Materiales de construcción
  | "mano_obra"       // Salarios y destajos
  | "maquinaria"      // Renta de equipo
  | "subcontratos"    // Servicios subcontratados
  | "indirectos";     // Gastos administrativos
```

#### Datos que maneja

```typescript
interface Obra {
  id: string;
  codigo: string;                   // Código IDP (ej: 227)
  nombre: string;
  numeroContrato: string;
  cliente: string;
  residente: string;
  direccion: string;
  montoContratado: number;
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;           // Días
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
}

interface Destajo {
  id: string;
  obraId: string;
  concepto: string;
  destajista: string;
  montoContratado: number;
  avancePorc: number;
  saldoPendiente: number;
  fechaInicio: string;
  fechaFinEstimada: string;
}

interface ExpenseByCategory {
  category: "material" | "mano_obra" | "maquinaria" | "subcontratos" | "indirectos";
  amount: number;
  percentage: number;
}

interface WeeklyExpense {
  week: string;                     // "2025-W03"
  category: string;
  description: string;
  amount: number;
  accumulated: number;
}
```

---

## 🔄 Flujos de Trabajo

### Flujo Completo: De Requisición a Pago

```
1. REQUISICIÓN
   ├─ Residente solicita material
   ├─ Estado: Pendiente
   └─ Espera aprobación

2. APROBACIÓN
   ├─ Compras revisa requisición
   ├─ Aprueba o Rechaza
   └─ Si aprueba → Estado: Aprobada

3. ORDEN DE COMPRA
   ├─ Compras crea OC basada en requisición
   ├─ Selecciona proveedor del catálogo
   ├─ Agrega items y precios
   ├─ Genera PDF profesional
   ├─ Envía a proveedor
   └─ Estado OC: Emitida

4. RECEPCIÓN
   ├─ Material llega a obra
   ├─ Residente confirma recepción
   ├─ Estado OC: Recibida
   └─ Estado Requisición: Completada

5. FACTURACIÓN
   ├─ Proveedor entrega factura
   ├─ Compras verifica factura vs OC
   └─ Estado OC: Facturada

6. PAGO
   ├─ Pagos programa pago (según crédito)
   ├─ Ejecuta transferencia/cheque
   ├─ Estado Pago: Completado
   └─ Estado OC: Pagada

7. REGISTRO CONTABLE
   ├─ Sistema actualiza gastos de obra
   ├─ Clasifica por categoría
   └─ Actualiza balance
```

### Flujo de Análisis Financiero

```
Usuario → Dashboard Global
   │
   ├─ Ve resumen de todas las obras
   ├─ Identifica obra con balance bajo
   │
   └─ Click en obra específica
         │
         └─ Módulo Seguimiento de Contratos
               │
               ├─ Revisa estimaciones pagadas
               ├─ Revisa destajos en proceso
               │
               └─ Click "Ver Detalle de Gastos"
                     │
                     └─ Detalles de Gastos
                           │
                           ├─ Analiza gráfica de balance
                           ├─ Identifica categoría con más gasto
                           ├─ Revisa gastos semanales
                           └─ Toma decisiones
```

---

## 👥 Gestión de Usuarios y Permisos

### Roles del Sistema

| Rol | Descripción | Módulos Permitidos |
|-----|-------------|-------------------|
| **Admin** | Acceso completo | Todos (Dashboard, Requisiciones, Compras, Pagos, Contratos) |
| **Residente** | Gestión de obra | Requisiciones, Contratos |
| **Compras** | Departamento de compras | Requisiciones, Compras |
| **Pagos** | Departamento de pagos | Pagos |

### Matriz de Permisos

| Acción | Admin | Residente | Compras | Pagos |
|--------|-------|-----------|---------|-------|
| Ver Dashboard Global | ✅ | ❌ | ❌ | ❌ |
| Crear Requisición | ✅ | ✅ | ❌ | ❌ |
| Aprobar Requisición | ✅ | ❌ | ✅ | ❌ |
| Crear OC | ✅ | ❌ | ✅ | ❌ |
| Generar PDF OC | ✅ | ❌ | ✅ | ❌ |
| Ver Seguimiento Contratos | ✅ | ✅ | ❌ | ❌ |
| Crear Pago | ✅ | ❌ | ❌ | ✅ |
| Procesar Pago | ✅ | ❌ | ❌ | ✅ |

### Cómo funciona

El sistema valida permisos en `MainApp.tsx`:

```typescript
const currentUser: User = {
  name: "Juan Pérez",
  role: "residente",
  allowedModules: ["home", "requisitions", "contract-tracking"]
};

// Al intentar acceder a un módulo
const hasAccess = currentUser.allowedModules.includes(module);
if (!hasAccess) {
  // No muestra el módulo en el menú
  // O muestra mensaje de "Acceso denegado"
}
```

---

## ⚙️ Características Técnicas

### DataProvider Pattern

El sistema utiliza un **patrón de abstracción de datos** que permite cambiar entre modo MOCK y modo API sin modificar los componentes.

#### Interface CRUD Genérica

```typescript
interface IDataProvider {
  obras: {
    list: (params?) => Promise<PaginatedResponse<Obra>>;
    getById: (id) => Promise<Obra>;
    create: (data) => Promise<Obra>;
    update: (id, data) => Promise<Obra>;
    delete: (id) => Promise<void>;
    getFinancialSummary: (id) => Promise<ObraFinancialSummary>;
    getExpensesByCategory: (id) => Promise<ExpenseByCategory[]>;
    getWeeklyExpenses: (id) => Promise<WeeklyExpense[]>;
  };
  // ... repetir para: proveedores, requisiciones, ordenesCompra, pagos, destajos
}
```

#### MockProvider (Modo Demo)

- Datos almacenados en memoria
- Simulación de latencia de red (200-500ms)
- Datos realistas de demostración
- Perfecto para desarrollo y demos

#### ApiProvider (Modo Producción)

- Se conecta con Supabase via HTTP
- Autenticación con API Keys
- Manejo de errores
- Paginación real

### Hooks Personalizados

El sistema incluye hooks React para simplificar el acceso a datos:

```typescript
// Hooks de lista
const { data, loading, error, refetch } = useObras();
const { data, loading, error } = useProveedores({ page: 1, pageSize: 10 });

// Hooks de item individual
const { data: obra, loading } = useObra(obraId);
const { data: summary } = useObraFinancialSummary(obraId);

// Hooks de mutación
const { mutate: createOC, loading } = useCreateOrdenCompra();
const { mutate: approveReq } = useApproveRequisicion();

// Uso en componente
const handleCreate = async () => {
  const result = await createOC(newOCData);
  if (result) {
    toast.success("OC creada exitosamente");
    refetch(); // Recargar lista
  }
};
```

### Generación de PDFs

El sistema genera PDFs profesionales con formato IDP:

**Tecnología**: HTML + CSS con vista previa en navegador

**Componente**: `PurchaseOrderPDF.tsx`

**Características**:
- Logo IDP alterno (amarillo)
- Formato exacto de IDP con bordes negros
- Información completa del proveedor
- Datos bancarios
- Tabla de items con cálculos
- Firmas: Elaboró, Autorizó (Giovanni Martínez), Proveedor
- Sección de observaciones

**Opciones**:
- Vista previa en modal
- Imprimir (Ctrl+P)
- Descargar (funcionalidad pendiente con librería jsPDF)

### Esquema de Colores

El sistema utiliza una paleta de colores **cálida y suave** para reducir fatiga visual:

```css
--background: #f5f3f0;        /* Beige suave */
--card: #f9f7f4;              /* Crema cálido */
--foreground: #030213;        /* Negro suave */
--primary: #003B7A;           /* Azul IDP */
--accent: #FDB913;            /* Amarillo IDP */
```

---

## 📊 Entidades y Modelos de Datos

### Obra
```typescript
{
  id: "1",
  codigo: "227",
  nombre: "CASTELLO E",
  numeroContrato: "IDP-2024-227",
  cliente: "Desarrolladora Inmobiliaria XYZ",
  residente: "Ing. Carlos Mendoza",
  montoContratado: 15000000,
  fechaInicio: "2024-01-15",
  plazoEjecucion: 180,
  estado: "activa"
}
```

### Proveedor
```typescript
{
  id: "1",
  razonSocial: "Cementos Cruz Azul SA de CV",
  rfc: "CCR850101ABC",
  telefono: "55-1234-5678",
  banco: "BBVA Bancomer",
  numeroCuenta: "0123456789",
  clabe: "012180001234567890",
  creditoDias: 30,
  limiteCredito: 500000
}
```

### Requisición
```typescript
{
  id: "1",
  numeroRequisicion: "REQ-2025-001",
  obraId: "1",
  solicitadoPor: "Ing. Carlos Mendoza",
  urgencia: "urgente",
  estado: "aprobada",
  items: [
    {
      id: "1",
      cantidad: 50,
      unidad: "TON",
      descripcion: "Cemento gris Portland CPC 30R"
    }
  ]
}
```

### Orden de Compra
```typescript
{
  id: "1",
  numeroOrden: "OC-2025-001",
  obraId: "1",
  proveedorId: "1",
  fechaEmision: "2025-01-15",
  fechaEntrega: "2025-01-20",
  estado: "emitida",
  tipoEntrega: "en_obra",
  subtotal: 25000,
  descuento: 5,          // 5%
  descuentoMonto: 1250,
  iva: 3800,            // 16% sobre (subtotal - descuento)
  total: 27550,
  items: [...]
}
```

### Pago
```typescript
{
  id: "1",
  numeroPago: "PAG-2025-001",
  obraId: "1",
  proveedorId: "1",
  ordenCompraId: "1",
  monto: 15000,
  metodoPago: "transferencia",
  fechaProgramada: "2025-02-15",
  estado: "completado",
  referencia: "TRF-123456"
}
```

---

## 🔐 Seguridad y Validaciones

### Validaciones Implementadas

1. **Requisiciones**:
   - ✅ Cantidad debe ser > 0
   - ✅ Descripción no vacía
   - ✅ Obra debe existir

2. **Órdenes de Compra**:
   - ✅ Items no vacíos
   - ✅ Precio unitario > 0
   - ✅ Fecha entrega >= fecha emisión
   - ✅ Descuento entre 0-100%

3. **Pagos**:
   - ✅ Monto > 0
   - ✅ Monto ≤ saldo pendiente de OC
   - ✅ OC debe existir
   - ✅ OC no debe estar cancelada

### Permisos por Rol

El sistema valida que cada usuario solo acceda a módulos permitidos según su rol (ver sección de Usuarios y Permisos).

---

## 📈 Reportes y Analíticas

### Reportes Disponibles

1. **Dashboard Global**:
   - Balance consolidado de todas las obras
   - Ingresos vs Gastos mensuales (barras)
   - Estado financiero por obra

2. **Detalles de Gastos por Obra**:
   - Balance en el tiempo (línea)
   - Ingresos vs Gastos (barras por mes)
   - Gastos por categoría (pie chart)
   - Gastos semanales (tabla)

3. **Seguimiento de Contratos**:
   - Estimaciones aprobadas vs pendientes
   - Destajos: avance y saldo pendiente

### Métricas Clave (KPIs)

- **Balance de Obra**: Contratado - Gastado
- **Porcentaje de Avance**: (Estimaciones Pagadas / Monto Contratado) × 100
- **Saldo de OC**: Total OC - Pagos Aplicados
- **Días de Crédito Usados**: Fecha Pago - Fecha OC

---

## 🚀 Roadmap Futuro

### Módulo de Entregas (Próximamente)

- Control de entregas de material en obra
- Recepción con firma digital
- Validación de cantidades vs OC
- Fotografías de material recibido
- Alertas de faltantes

### Mejoras Planeadas

- Autenticación con Supabase Auth
- Notificaciones en tiempo real
- App móvil (React Native)
- Exportación de reportes a Excel
- Dashboard de proveedores (portal externo)

---

**Fin de la Documentación de Funcionalidades**
