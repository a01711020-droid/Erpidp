# 📋 DOCUMENTACIÓN COMPLETA DEL SISTEMA IDP
## Sistema de Gestión Financiera y Seguimiento de Proyectos Constructivos

---

## 🏗️ INFORMACIÓN DE LA EMPRESA

### **IDP - Información Empresarial**
```typescript
{
  nombreEmpresa: "IDP",
  razonSocial: "Ingeniería y Desarrollo de Proyectos S.A. de C.V.",
  sector: "Construcción",
  tipo: "Gestión de Proyectos Constructivos"
}
```

---

## 📦 ARQUITECTURA DEL SISTEMA

### **Estructura Frontend Puro**
```
Sistema 100% Frontend
├── React + TypeScript + Vite
├── TailwindCSS v4 (tema café/amarillo cálido)
├── Datos en Memoria (MockProvider)
└── Sin Backend (Transportable/Fusionable)
```

### **Módulos Principales**
1. **Home** - Portal de entrada con 5 módulos
2. **Dashboard Global** - Vista financiera empresarial
3. **Compras** - Órdenes de compra + Proveedores
4. **Requisiciones** - Solicitudes de material
5. **Pagos** - Gestión de pagos a proveedores
6. **Seguimiento Físico** - Movimientos de contratos

---

## 🎨 DISEÑO Y TEMA VISUAL

### **Paleta de Colores Cálidos (Cafecito/Amarillo)**
```css
/* Colores principales */
--warm-50: #FFFBF0;    /* Crema muy suave */
--warm-100: #FFF3D6;   /* Amarillo muy claro */
--warm-200: #FFE8AD;   /* Amarillo claro */
--warm-300: #FFD88A;   /* Amarillo medio */
--warm-400: #F5C571;   /* Dorado suave */
--warm-500: #E8B45C;   /* Dorado */
--warm-600: #C99A47;   /* Café dorado */
--warm-700: #A87C32;   /* Café medio */
--warm-800: #8B6524;   /* Café oscuro */
--warm-900: #6B4E1A;   /* Café muy oscuro */

/* Backgrounds */
background: linear-gradient(135deg, #FFF8E7 0%, #FFEFD5 100%);
background-pattern: radial-gradient(circle, #F5E6D3 1px, transparent 1px);
background-size: 20px 20px;
```

### **Componentes UI con Estilos Cálidos**
- Tarjetas con bordes suaves beige
- Botones con hover café dorado
- Badges con tonos tierra
- Texturizado sutil de puntos

---

## 📊 MÓDULO 1: HOME (Portal Principal)

### **Archivo:** `/src/app/Home.tsx`

### **Funcionalidad:**
Portal de entrada con 5 módulos principales presentados en tarjetas interactivas.

### **Datos Mostrados:**

#### **Módulos Disponibles:**
```typescript
[
  {
    id: "dashboard",
    title: "Dashboard Global",
    description: "Vista general financiera de todas las obras",
    icon: "LayoutDashboard",
    color: "blue",
    route: "/dashboard"
  },
  {
    id: "compras",
    title: "Compras",
    description: "Órdenes de compra y gestión de proveedores",
    icon: "ShoppingCart",
    color: "green",
    route: "/compras"
  },
  {
    id: "requisiciones",
    title: "Requisiciones de Material",
    description: "Solicitudes de material de obras",
    icon: "ClipboardList",
    color: "purple",
    route: "/requisiciones"
  },
  {
    id: "pagos",
    title: "Pagos",
    description: "Gestión y programación de pagos",
    icon: "DollarSign",
    color: "orange",
    route: "/pagos"
  },
  {
    id: "seguimiento",
    title: "Seguimiento Físico de Contrato",
    description: "Estimaciones, aditivas y deductivas",
    icon: "FileText",
    color: "indigo",
    route: "/seguimiento"
  }
]
```

### **Información Empresarial Mostrada:**
```typescript
{
  logo: "/logo-idp-normal.svg",
  empresa: "IDP",
  tagline: "Gestión Integral de Proyectos Constructivos",
  bienvenida: "Selecciona un módulo para comenzar"
}
```

---

## 📈 MÓDULO 2: DASHBOARD GLOBAL

### **Archivo:** `/src/app/GlobalDashboard.tsx`

### **Funcionalidad:**
Vista general financiera de todas las obras activas de la empresa.

### **Datos Mostrados:**

#### **Resumen General (Cards Superiores):**
```typescript
{
  totalObras: number,           // Total de obras activas
  totalContratado: number,      // Suma de montos contratados
  totalEjercido: number,        // Suma de gastos ejecutados
  saldoDisponible: number       // totalContratado - totalEjercido
}
```

#### **Datos por Obra:**
```typescript
interface ObraEnDashboard {
  codigo: string;              // Ej: "227"
  nombre: string;              // Ej: "CASTELLO E"
  numeroContrato: string;      // Ej: "CON-2024-227"
  cliente: string;             // Ej: "Desarrolladora Inmobiliaria"
  residente: string;           // Ej: "Ing. Miguel Torres"
  montoContratado: number;     // Ej: 15000000
  ejercido: number;            // Gastos totales de la obra
  saldo: number;               // montoContratado - ejercido
  porcentajeEjercido: number;  // (ejercido / montoContratado) * 100
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
  
  // Indicadores visuales
  estadoFinanciero: "saludable" | "advertencia" | "critico";
  // saludable: < 75% ejercido
  // advertencia: 75-90% ejercido
  // critico: > 90% ejercido
}
```

#### **Gráficas:**
1. **Gráfica de Barras:** Contratado vs Ejercido por obra
2. **Gráfica Circular:** Distribución de presupuesto por obra
3. **Timeline:** Gastos mensuales consolidados

#### **Filtros Disponibles:**
```typescript
{
  estado: ["Todos", "activa", "suspendida", "terminada", "cancelada"],
  ordenarPor: ["Nombre", "Código", "Monto", "Porcentaje Ejercido"],
  busqueda: string  // Por código, nombre o cliente
}
```

---

## 🛒 MÓDULO 3: COMPRAS (Órdenes de Compra)

### **Archivo:** `/src/app/PurchaseOrderManagement.tsx`

### **Funcionalidad:**
Gestión completa de órdenes de compra y proveedores con función secreta de administración.

### **Datos Mostrados:**

#### **Orden de Compra:**
```typescript
interface PurchaseOrder {
  id: string;
  orderNumber: string;          // Ej: "227-A01GM-CEMEX"
  
  // Información de Obra
  workCode: string;             // Ej: "227"
  workName: string;             // Ej: "CASTELLO E"
  client: string;               // Cliente de la obra
  
  // Información de Proveedor
  supplier: string;             // Código corto: "CEMEX"
  supplierFullName: string;     // "CEMEX México S.A. de C.V."
  supplierContact: string;      // "Ing. Roberto Martínez - (55) 5555-1234"
  
  // Información de Compra
  buyer: string;                // Comprador responsable
  deliveryDate: string;         // Fecha de entrega (ISO)
  deliveryType: "Entrega" | "Recolección";
  
  // Items de la OC
  items: Array<{
    id: string;
    description: string;        // Descripción del material
    quantity: number;           // Cantidad
    unitPrice: number;          // Precio unitario
    total: number;              // quantity * unitPrice
  }>;
  
  // Totales
  subtotal: number;             // Suma de items.total
  hasIVA: boolean;              // ¿Aplica IVA?
  iva: number;                  // 16% del subtotal (si aplica)
  discount: number;             // Porcentaje de descuento (0-100)
  discountAmount: number;       // Monto del descuento
  total: number;                // subtotal + iva - discountAmount
  
  // Metadatos
  createdDate: string;          // Fecha de creación
  status: "Pendiente" | "Aprobada" | "Rechazada" | "Entregada";
  observations: string;         // Observaciones adicionales
}
```

#### **Estadísticas de Compras:**
```typescript
{
  totalOrdenes: number,         // Total de OCs
  montoTotal: number,           // Suma de todos los totales
  ordenesAprobadas: number,     // OCs con status "Aprobada"
  descuentosAcumulados: number  // Suma de discountAmount
}
```

#### **Filtros de Órdenes:**
```typescript
{
  busqueda: string,             // Por número OC, proveedor u obra
  obraFiltro: string,           // Filtrar por código de obra
  estadoFiltro: "Todos" | "Pendiente" | "Aprobada" | "Rechazada" | "Entregada"
}
```

### **🔐 FUNCIONALIDAD SECRETA: GESTIÓN DE PROVEEDORES**

#### **Activación:**
- 5 clicks en el icono azul de FileText del header
- Solicita contraseña: `admin123`
- Abre módulo completo de gestión de proveedores

#### **Datos de Proveedor (Gestión Interna):**
```typescript
interface Supplier {
  id: string;
  proveedor: string;            // Nombre corto: "CEMEX"
  razonSocial: string;          // "CEMEX México S.A. de C.V."
  rfc: string;                  // RFC fiscal (13 caracteres)
  direccion: string;            // Dirección completa
  vendedor: string;             // Por defecto "mostrador"
  telefono: string;             // Teléfono de contacto
  correo: string;               // Email del proveedor
}
```

#### **Operaciones Disponibles:**
- ✅ **Agregar** nuevo proveedor
- ✅ **Editar** proveedor existente (prellenado)
- ✅ **Eliminar** proveedor (con confirmación)
- ✅ **Listar** todos los proveedores en tabla

#### **Validaciones:**
- RFC automático en MAYÚSCULAS
- Email con formato válido
- Todos los campos obligatorios excepto vendedor
- Vendedor por defecto: "mostrador"

---

## 📋 MÓDULO 4: REQUISICIONES DE MATERIAL

### **Archivo:** `/src/app/MaterialRequisitions.tsx`

### **Funcionalidad:**
Gestión de solicitudes de material enviadas por residentes de obra.

### **Datos Mostrados:**

#### **Requisición de Material:**
```typescript
interface MaterialRequisition {
  id: string;
  requisitionNumber: string;    // Ej: "REQ227-001MAT"
  
  // Información de Obra
  workCode: string;             // Código de obra
  workName: string;             // Nombre de obra
  residentName: string;         // Residente que solicita
  
  // Items solicitados
  items: Array<{
    id: string;
    description: string;        // Descripción del material
    quantity: number;           // Cantidad solicitada
    unit: string;               // Unidad (BULTO, M3, PZA, KG, M, etc.)
  }>;
  
  // Estado y urgencia
  status: "Pendiente" | "En Revisión" | "Aprobada" | "Convertida a OC";
  urgency: "Normal" | "Urgente" | "Planeado";
  
  // Fechas
  createdDate: string;          // Fecha de creación
  deliveryNeededBy: string;     // Fecha requerida de entrega
  
  // Comunicación
  comments: Array<{
    id: string;
    author: string;             // Nombre del autor
    role: "Residente" | "Compras";
    message: string;            // Mensaje del comentario
    timestamp: string;          // Fecha/hora del comentario
  }>;
}
```

#### **Estadísticas de Requisiciones:**
```typescript
{
  totalRequisiciones: number,   // Total de requisiciones
  pendientes: number,           // Status "Pendiente"
  urgentes: number,             // Urgency "Urgente" y no convertidas
  convertidas: number           // Status "Convertida a OC"
}
```

#### **Filtros:**
```typescript
{
  busqueda: string,             // Por número de requisición u obra
  estadoFiltro: "Todos" | "Pendiente" | "En Revisión" | "Aprobada" | "Convertida a OC",
  urgenciaFiltro: "Todos" | "Normal" | "Urgente" | "Planeado",
  obraFiltro: string            // Por código de obra
}
```

#### **Flujo de Trabajo:**
1. Residente crea requisición
2. Departamento de Compras revisa
3. Compras aprueba requisición
4. Se convierte a Orden de Compra
5. OC se gestiona en módulo de Compras

---

## 💰 MÓDULO 5: PAGOS

### **Archivo:** `/src/app/PaymentManagement.tsx`

### **Funcionalidad:**
Gestión y programación de pagos a proveedores vinculados a órdenes de compra.

### **Datos Mostrados:**

#### **Pago:**
```typescript
interface Payment {
  id: string;
  paymentNumber: string;        // Ej: "PAG-227-001"
  
  // Información de Obra y Proveedor
  workCode: string;
  workName: string;
  supplier: string;             // Nombre del proveedor
  
  // Referencia a OC
  orderReference: string;       // Número de OC asociada
  
  // Datos del Pago
  amount: number;               // Monto a pagar
  paymentMethod: "Transferencia" | "Cheque" | "Efectivo";
  
  // Fechas
  scheduledDate: string;        // Fecha programada
  processedDate: string | null; // Fecha de procesamiento (si aplica)
  
  // Estado
  status: "Programado" | "Procesando" | "Completado" | "Cancelado";
  
  // Información Adicional
  reference: string;            // Referencia bancaria/cheque
  receipt: string | null;       // Comprobante de pago
  observations: string;         // Observaciones
  processedBy: string | null;   // Quién procesó el pago
  
  // Metadatos
  createdDate: string;
}
```

#### **Estadísticas de Pagos:**
```typescript
{
  totalPagos: number,           // Total de pagos registrados
  montoProgramado: number,      // Suma de pagos programados
  montoProcesado: number,       // Suma de pagos completados
  pagosPendientes: number       // Cantidad con status "Programado"
}
```

#### **Vista de Calendario:**
```typescript
{
  pagosPorSemana: Array<{
    semana: string,             // "Semana 1", "Semana 2", etc.
    fechaInicio: string,
    fechaFin: string,
    pagos: Payment[],           // Pagos de esa semana
    montoTotal: number          // Suma de pagos de la semana
  }>
}
```

#### **Filtros:**
```typescript
{
  busqueda: string,             // Por número de pago, OC o proveedor
  estadoFiltro: "Todos" | "Programado" | "Procesando" | "Completado" | "Cancelado",
  metodoFiltro: "Todos" | "Transferencia" | "Cheque" | "Efectivo",
  rangoFechas: {
    inicio: string,
    fin: string
  }
}
```

#### **Alertas Automáticas:**
```typescript
{
  pagosVencidos: number,        // Pagos con fecha < hoy
  pagosProximos: number,        // Pagos en próximos 3 días
  validacionSaldo: boolean      // Verifica saldo de obra
}
```

---

## 📐 MÓDULO 6: SEGUIMIENTO FÍSICO DE CONTRATO

### **Archivo:** `/src/app/ContractTracking.tsx`

### **Funcionalidad:**
Control de movimientos del contrato: estimaciones, aditivas y deductivas unificadas.

### **Datos Mostrados:**

#### **Información del Contrato:**
```typescript
interface ContractInfo {
  codigo: string;               // Código de obra
  nombre: string;               // Nombre de obra
  numeroContrato: string;       // Número de contrato
  cliente: string;              // Cliente
  residente: string;            // Residente de obra
  montoContratado: number;      // Monto original del contrato
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;       // Días
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
}
```

#### **Movimiento de Contrato (Unificado):**
```typescript
interface ContractMovement {
  id: string;
  numeroMovimiento: string;     // Ej: "EST-001", "ADI-001", "DED-001"
  
  // Tipo de Movimiento
  tipo: "estimacion" | "aditiva" | "deductiva";
  
  // Datos del Movimiento
  periodo: string;              // Periodo de la estimación
  fechaInicio: string;          // Inicio del periodo
  fechaFin: string;             // Fin del periodo
  
  // Conceptos ejecutados
  conceptos: Array<{
    id: string;
    codigo: string;             // Código del concepto
    descripcion: string;        // Descripción del trabajo
    unidad: string;             // Unidad de medida
    
    // Cantidades
    cantidadContrato: number;   // Cantidad en contrato original
    cantidadEjecutada: number;  // Cantidad ejecutada este periodo
    cantidadAcumulada: number;  // Cantidad total acumulada
    
    // Montos
    precioUnitario: number;     // Precio por unidad
    importe: number;            // cantidadEjecutada * precioUnitario
  }>;
  
  // Totales
  subtotal: number;             // Suma de importes
  iva: number;                  // 16% del subtotal
  retencion: number;            // Retenciones aplicadas
  total: number;                // subtotal + iva - retencion
  
  // Estado
  estado: "borrador" | "emitida" | "aprobada" | "pagada";
  
  // Metadatos
  elaboradoPor: string;
  fechaElaboracion: string;
  aprobadoPor: string | null;
  fechaAprobacion: string | null;
  observaciones: string;
}
```

#### **Resumen Financiero del Contrato:**
```typescript
{
  montoOriginal: number,        // Contrato original
  estimacionesAcumuladas: number,
  aditivasAcumuladas: number,   // Suma de aditivas
  deductivasAcumuladas: number, // Suma de deductivas
  montoActualizado: number,     // original + aditivas - deductivas
  porcentajeAvance: number,     // (estimaciones / montoActualizado) * 100
  saldoPorEjercer: number       // montoActualizado - estimaciones
}
```

#### **Badges de Tipo de Movimiento:**
```typescript
{
  estimacion: {
    color: "blue",
    icono: "FileText",
    label: "Estimación"
  },
  aditiva: {
    color: "green",
    icono: "TrendingUp",
    label: "Aditiva"
  },
  deductiva: {
    color: "red",
    icono: "TrendingDown",
    label: "Deductiva"
  }
}
```

#### **Formulario Único (Selector de Tipo):**
```typescript
{
  tipoMovimiento: "estimacion" | "aditiva" | "deductiva",
  // Campos dinámicos según tipo seleccionado
  // Validaciones específicas por tipo
  // Preview de cálculos en tiempo real
}
```

---

## 🔄 RELACIONES ENTRE MÓDULOS

### **Flujo de Datos:**

```
1. REQUISICIONES → COMPRAS
   - Requisición aprobada → genera Orden de Compra
   - Items de requisición → prellenan items de OC

2. COMPRAS → PAGOS
   - Orden de Compra aprobada → genera Pago programado
   - Total de OC → monto del pago
   - Proveedor de OC → proveedor del pago

3. COMPRAS → DASHBOARD
   - OCs de obra → gastos ejercidos
   - Totales de OC → actualizan saldo de obra

4. SEGUIMIENTO → DASHBOARD
   - Estimaciones → ingresos de obra
   - Aditivas/Deductivas → ajustan monto contratado

5. PAGOS → DASHBOARD
   - Pagos completados → gastos confirmados
   - Pagos programados → compromisos futuros
```

### **Conexión por Obra:**
Todos los módulos comparten el identificador de obra:
```typescript
{
  codigo: string,       // Código único de obra
  // Se usa en:
  // - Dashboard: agrupación
  // - Compras: workCode
  // - Requisiciones: workCode
  // - Pagos: workCode
  // - Seguimiento: codigo
}
```

---

## 💾 MODELO DE DATOS (FRONTEND PURO)

### **Ubicación:** `/src/app/providers/mockData.ts`

### **Almacenamiento:**
- Todos los datos en memoria (sin persistencia)
- MockProvider simula operaciones CRUD
- Datos de ejemplo precargados

### **Entidades Principales:**

#### **1. Obra (Proyecto)**
```typescript
// Definición en: /src/app/types/entities.ts
interface Obra {
  id: string;                   // UUID
  codigo: string;               // Código único
  nombre: string;
  numeroContrato: string;
  cliente: string;
  residente: string;
  direccion: string | null;
  montoContratado: number;
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
  createdAt: string;
  updatedAt: string;
}
```

#### **2. Proveedor**
```typescript
interface Proveedor {
  id: string;
  razonSocial: string;
  nombreComercial: string | null;
  rfc: string;
  direccion: string | null;
  ciudad: string | null;
  codigoPostal: string | null;
  telefono: string | null;
  email: string | null;
  contactoPrincipal: string | null;
  banco: string | null;
  numeroCuenta: string | null;
  clabe: string | null;
  tipoProveedor: "material" | "servicio" | "renta" | "mixto" | null;
  creditoDias: number;
  limiteCredito: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### **3. Requisición + Items**
```typescript
interface Requisicion {
  id: string;
  numeroRequisicion: string;
  obraId: string;
  solicitadoPor: string;
  fechaSolicitud: string;
  urgencia: "normal" | "urgente" | "muy_urgente";
  estado: "pendiente" | "aprobada" | "rechazada" | "en_proceso" | "completada";
  observaciones: string | null;
  aprobadoPor: string | null;
  fechaAprobacion: string | null;
  motivoRechazo: string | null;
  items: RequisicionItem[];
  createdAt: string;
  updatedAt: string;
}

interface RequisicionItem {
  id: string;
  requisicionId: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  createdAt: string;
}
```

#### **4. Orden de Compra + Items**
```typescript
interface OrdenCompra {
  id: string;
  numeroOrden: string;
  obraId: string;
  proveedorId: string;
  requisicionId: string | null;
  fechaEmision: string;
  fechaEntrega: string;
  estado: "borrador" | "emitida" | "recibida" | "facturada" | "pagada" | "cancelada";
  tipoEntrega: "en_obra" | "bodega" | "recoger" | null;
  subtotal: number;
  descuento: number;
  descuentoMonto: number;
  iva: number;
  total: number;
  observaciones: string | null;
  creadoPor: string | null;
  items: OrdenCompraItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrdenCompraItem {
  id: string;
  ordenCompraId: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  precioUnitario: number;
  total: number;
  createdAt: string;
}
```

#### **5. Pago**
```typescript
interface Pago {
  id: string;
  numeroPago: string;
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  metodoPago: "transferencia" | "cheque" | "efectivo" | null;
  fechaProgramada: string;
  fechaProcesado: string | null;
  estado: "programado" | "procesando" | "completado" | "cancelado";
  referencia: string | null;
  comprobante: string | null;
  observaciones: string | null;
  procesadoPor: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎯 CÓDIGOS Y NOMENCLATURAS

### **Código de Obra:**
```
Formato: XXX (3 dígitos)
Ejemplos: 227, 228, 229, 231, 232
```

### **Número de Contrato:**
```
Formato: CON-YYYY-XXX
Ejemplo: CON-2024-227
```

### **Número de Orden de Compra:**
```
Formato: XXX-ANNII-PROVEEDOR
XXX = Código de obra
A = Tipo (A=Materiales, B=Servicios)
NN = Número consecutivo
II = Iniciales del comprador
PROVEEDOR = Nombre corto del proveedor

Ejemplo: 227-A01GM-CEMEX
```

### **Número de Requisición:**
```
Formato: REQXXX-NNNII
XXX = Código de obra
NNN = Número consecutivo (3 dígitos)
II = Iniciales del residente

Ejemplo: REQ227-001MAT
```

### **Número de Pago:**
```
Formato: PAG-XXX-NNN
XXX = Código de obra
NNN = Número consecutivo

Ejemplo: PAG-227-001
```

### **Número de Estimación:**
```
Formato: EST-NNN
NNN = Número consecutivo

Ejemplo: EST-001
```

### **Número de Aditiva:**
```
Formato: ADI-NNN
NNN = Número consecutivo

Ejemplo: ADI-001
```

### **Número de Deductiva:**
```
Formato: DED-NNN
NNN = Número consecutivo

Ejemplo: DED-001
```

---

## 🔐 CARACTERÍSTICAS DE SEGURIDAD

### **Gestión de Proveedores (Módulo Secreto):**
```typescript
{
  activacion: "5 clicks en icono de header",
  contraseña: "admin123",
  acceso: "Solo administradores",
  funcionalidad: "CRUD completo de proveedores"
}
```

### **Validaciones de Permisos:**
```typescript
{
  // Por implementar en versión con backend
  roles: ["admin", "comprador", "residente", "contador"],
  permisos: {
    admin: ["all"],
    comprador: ["compras", "requisiciones"],
    residente: ["requisiciones"],
    contador: ["dashboard", "pagos"]
  }
}
```

---

## 📱 RESPONSIVIDAD

### **Breakpoints:**
```css
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### **Adaptaciones Móviles:**
- Tablas con scroll horizontal
- Cards apiladas verticalmente
- Menús colapsables
- Formularios de una columna
- Botones táctiles más grandes

---

## 🚀 CARACTERÍSTICAS TÉCNICAS

### **Stack Tecnológico:**
```json
{
  "framework": "React 18",
  "lenguaje": "TypeScript",
  "bundler": "Vite",
  "estilos": "TailwindCSS v4",
  "componentes": "shadcn/ui",
  "iconos": "lucide-react",
  "gráficas": "recharts",
  "pdf": "jspdf + jspdf-autotable",
  "notificaciones": "sonner",
  "datos": "MockProvider (en memoria)"
}
```

### **Estructura de Archivos:**
```
/src/app/
├── App.tsx                     # Entrada principal
├── Home.tsx                    # Portal de módulos
├── GlobalDashboard.tsx         # Dashboard financiero
├── PurchaseOrderManagement.tsx # Compras + Proveedores
├── MaterialRequisitions.tsx    # Requisiciones
├── PaymentManagement.tsx       # Pagos
├── ContractTracking.tsx        # Seguimiento físico
├── components/                 # Componentes reutilizables
│   ├── ui/                     # Componentes base UI
│   ├── SupplierManagement.tsx  # Gestión de proveedores
│   ├── PasswordDialog.tsx      # Diálogo de contraseña
│   ├── PurchaseOrderForm.tsx   # Formulario de OC
│   └── ...
├── providers/                  # Proveedores de datos
│   ├── MockProvider.ts         # Datos en memoria
│   ├── mockData.ts             # Datos de ejemplo
│   └── index.ts                # Exportaciones
├── types/
│   └── entities.ts             # Tipos TypeScript
└── utils/
    ├── codeGenerators.ts       # Generadores de códigos
    └── generatePurchaseOrderPDF.ts
```

---

## 📊 DATOS DE EJEMPLO INCLUIDOS

### **Obras Precargadas:**
```typescript
[
  { codigo: "227", nombre: "CASTELLO E", cliente: "Desarrolladora Inmobiliaria" },
  { codigo: "228", nombre: "CASTELLO F", cliente: "Grupo Constructor Metropolitano" },
  { codigo: "229", nombre: "CASTELLO G", cliente: "Gobierno del Estado de México" },
  { codigo: "231", nombre: "DOZA A", cliente: "Constructora Doza SA" },
  { codigo: "232", nombre: "BALVANERA", cliente: "Desarrollos Balvanera" }
]
```

### **Proveedores Precargados:**
```typescript
[
  { codigo: "CEMEX", razonSocial: "CEMEX México S.A. de C.V." },
  { codigo: "LEVINSON", razonSocial: "Aceros Levinson S.A. de C.V." },
  { codigo: "HOME DEPOT", razonSocial: "Homer TLC, Inc." },
  { codigo: "INTERCERAMIC", razonSocial: "Interceramic" },
  { codigo: "BEREL", razonSocial: "Pinturas Berel" },
  { codigo: "HIERROS", razonSocial: "Hierros y Materiales SA" }
]
```

---

## 🔄 MIGRACIÓN A BACKEND (FUTURO)

### **Preparación:**
El sistema está diseñado para fácil migración a backend:

1. **DataProvider Interface:**
   - Interfaz común para Mock y API
   - Métodos CRUD estandarizados
   - Fácil swap de MockProvider a ApiProvider

2. **Tipos TypeScript:**
   - Alineados con modelo de base de datos
   - Coinciden con esquema SQL PostgreSQL
   - Listos para serialización JSON

3. **Estructura Modular:**
   - Componentes independientes
   - Sin lógica de negocio en UI
   - Providers centralizan datos

4. **URLs Futuras (Render):**
   ```
   - https://idp-dashboard.onrender.com
   - https://idp-compras.onrender.com
   - https://idp-requisiciones.onrender.com
   - https://idp-pagos.onrender.com
   - https://idp-seguimiento.onrender.com
   
   // Todos conectan a:
   - Database: PostgreSQL (Supabase compartida)
   ```

---

## 🎨 GUÍA DE ESTILOS

### **Componentes Estándar:**

#### **Card (Tarjeta):**
```tsx
<Card className="bg-white/90 backdrop-blur border-warm-200">
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>
```

#### **Badge (Etiqueta):**
```tsx
// Estados
<Badge variant="default">Activo</Badge>
<Badge variant="secondary">Pendiente</Badge>
<Badge variant="destructive">Cancelado</Badge>
<Badge className="bg-green-500">Aprobado</Badge>
```

#### **Button (Botón):**
```tsx
<Button className="bg-blue-600 hover:bg-blue-700">
  <Plus className="h-4 w-4 mr-2" />
  Nuevo
</Button>
```

### **Iconos Lucide:**
```tsx
import { 
  FileText,      // Documentos
  ShoppingCart,  // Compras
  DollarSign,    // Pagos
  ClipboardList, // Requisiciones
  LayoutDashboard, // Dashboard
  TrendingUp,    // Aditivas
  TrendingDown,  // Deductivas
  Users,         // Proveedores
  Building2,     // Obras
  Package        // Materiales
} from "lucide-react";
```

---

## 📝 NOTAS IMPORTANTES

### **Persistencia de Datos:**
⚠️ **El sistema actual NO persiste datos.** Al recargar la página, todos los cambios se pierden. Los datos vuelven al estado inicial del MockProvider.

### **Departamentos Aislados:**
Los 5 módulos representan departamentos diferentes:
- **Dashboard:** Dirección/Finanzas
- **Compras:** Departamento de Compras
- **Requisiciones:** Residentes de Obra
- **Pagos:** Departamento de Tesorería
- **Seguimiento:** Departamento de Control de Obra

En producción con URLs separadas, solo comparten la base de datos.

### **Gestión de Proveedores:**
La función de agregar/editar proveedores está OCULTA intencionalmente porque es una función administrativa que no todos los usuarios del departamento de compras deberían tener.

### **Códigos Únicos:**
Todos los números de OC, requisiciones, pagos y movimientos deben ser ÚNICOS en el sistema. El MockProvider incluye validación básica.

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **Problema: Los datos no se guardan**
✅ **Solución:** Normal en MockProvider. Los datos están en memoria. Para persistencia real, se requiere backend.

### **Problema: No puedo acceder a gestión de proveedores**
✅ **Solución:** Hacer 5 clicks en el icono azul del header en módulo de Compras. Contraseña: `admin123`

### **Problema: Los totales no cuadran**
✅ **Solución:** Revisar cálculos en formularios:
- `subtotal = suma de items`
- `iva = subtotal * 0.16` (si aplica)
- `descuentoMonto = subtotal * (descuento / 100)`
- `total = subtotal + iva - descuentoMonto`

### **Problema: Error al generar PDF**
✅ **Solución:** Verificar que todos los campos obligatorios estén completos en la orden de compra.

---

## 📞 CONTACTO Y SOPORTE

**Desarrollador:** Sistema IDP
**Versión:** 2.0 (Frontend Puro)
**Última actualización:** Enero 2025

---

## 📄 LICENCIA

Sistema propietario de IDP - Ingeniería y Desarrollo de Proyectos S.A. de C.V.
Todos los derechos reservados.

---

**FIN DE LA DOCUMENTACIÓN**
