# 🗺️ MAPA DE DATOS POR MÓDULO
## Sistema IDP - Referencia Rápida de Información

---

## 📌 ÍNDICE RÁPIDO

1. [Módulo HOME](#modulo-home)
2. [Módulo DASHBOARD GLOBAL](#modulo-dashboard-global)
3. [Módulo COMPRAS](#modulo-compras)
4. [Módulo REQUISICIONES](#modulo-requisiciones)
5. [Módulo PAGOS](#modulo-pagos)
6. [Módulo SEGUIMIENTO FÍSICO](#modulo-seguimiento-fisico)
7. [Datos Compartidos](#datos-compartidos)
8. [Flujos de Información](#flujos-de-informacion)

---

## 🏠 MÓDULO HOME

### **Archivo:** `/src/app/Home.tsx`

### **Datos de Entrada:**
```typescript
NINGUNO
// Este módulo no consume datos externos
// Solo muestra navegación estática
```

### **Datos Mostrados:**

#### **Información Empresarial:**
```typescript
{
  empresa: "IDP",
  razonSocial: "Ingeniería y Desarrollo de Proyectos S.A. de C.V.",
  logo: "/logo-idp-normal.svg",
  tagline: "Gestión Integral de Proyectos Constructivos"
}
```

#### **Módulos del Sistema:**
```typescript
[
  {
    id: "dashboard",
    title: "Dashboard Global",
    description: "Vista general financiera de todas las obras",
    icon: LayoutDashboard,
    color: "blue",
    route: "/dashboard",
    departamento: "Dirección/Finanzas"
  },
  {
    id: "compras",
    title: "Compras",
    description: "Órdenes de compra y gestión de proveedores",
    icon: ShoppingCart,
    color: "green",
    route: "/compras",
    departamento: "Compras"
  },
  {
    id: "requisiciones",
    title: "Requisiciones de Material",
    description: "Solicitudes de material de obras",
    icon: ClipboardList,
    color: "purple",
    route: "/requisiciones",
    departamento: "Residentes de Obra"
  },
  {
    id: "pagos",
    title: "Pagos",
    description: "Gestión y programación de pagos",
    icon: DollarSign,
    color: "orange",
    route: "/pagos",
    departamento: "Tesorería"
  },
  {
    id: "seguimiento",
    title: "Seguimiento Físico de Contrato",
    description: "Estimaciones, aditivas y deductivas",
    icon: FileText,
    color: "indigo",
    route: "/seguimiento",
    departamento: "Control de Obra"
  }
]
```

### **Datos de Salida:**
```typescript
{
  navegacionActiva: string  // Ruta seleccionada
}
```

---

## 📊 MÓDULO DASHBOARD GLOBAL

### **Archivo:** `/src/app/GlobalDashboard.tsx`

### **Datos de Entrada (Consultados):**

#### **1. Todas las Obras:**
```typescript
Source: dataProvider.getObras()

Datos Usados:
{
  id: string,
  codigo: string,              // "227", "228", etc.
  nombre: string,              // "CASTELLO E"
  numeroContrato: string,      // "CON-2024-227"
  cliente: string,             // "Desarrolladora Inmobiliaria"
  residente: string,           // "Ing. Miguel Torres"
  montoContratado: number,     // 15000000
  estado: string,              // "activa", "suspendida", etc.
  fechaInicio: string,
  fechaFinProgramada: string
}
```

#### **2. Órdenes de Compra (para calcular gastos):**
```typescript
Source: dataProvider.getOrdenesCompra()

Datos Usados:
{
  obraId: string,              // Para filtrar por obra
  total: number,               // Para sumar gastos
  estado: string               // Solo contar "emitida", "recibida", "pagada"
}
```

#### **3. Estimaciones (para calcular ingresos):**
```typescript
Source: Módulo de Seguimiento (futuro)

Datos Usados:
{
  obraId: string,
  total: number,
  estado: string               // Solo contar aprobadas
}
```

### **Datos Calculados:**

#### **Resumen General:**
```typescript
{
  totalObras: number,           // COUNT(obras WHERE estado = 'activa')
  totalContratado: number,      // SUM(obras.montoContratado)
  totalEjercido: number,        // SUM(ordenesCompra.total WHERE estado IN ['emitida', 'recibida', 'pagada'])
  saldoDisponible: number,      // totalContratado - totalEjercido
  porcentajeEjercido: number    // (totalEjercido / totalContratado) * 100
}
```

#### **Por Cada Obra:**
```typescript
{
  // Datos directos de Obra
  codigo: string,
  nombre: string,
  cliente: string,
  residente: string,
  montoContratado: number,
  estado: string,
  
  // Calculado desde Órdenes de Compra
  ejercido: number,             // SUM(OC.total WHERE OC.obraId = obra.id)
  
  // Derivados
  saldo: number,                // montoContratado - ejercido
  porcentajeEjercido: number,   // (ejercido / montoContratado) * 100
  
  // Indicador visual
  estadoFinanciero: "saludable" | "advertencia" | "critico"
  // Regla:
  // saludable: porcentajeEjercido < 75
  // advertencia: 75 <= porcentajeEjercido < 90
  // critico: porcentajeEjercido >= 90
}
```

### **Gráficas Generadas:**

#### **1. Gráfica de Barras (Contratado vs Ejercido):**
```typescript
[
  {
    nombre: "CASTELLO E",
    contratado: 15000000,
    ejercido: 8500000
  },
  {
    nombre: "CASTELLO F",
    contratado: 12000000,
    ejercido: 9200000
  }
  // ... una entrada por obra
]
```

#### **2. Gráfica Circular (Distribución):**
```typescript
[
  {
    name: "CASTELLO E",
    value: 15000000,
    percentage: 35.7  // (15M / 42M) * 100
  },
  {
    name: "CASTELLO F",
    value: 12000000,
    percentage: 28.6
  }
  // ... una entrada por obra
]
```

#### **3. Timeline Mensual:**
```typescript
[
  {
    mes: "Enero",
    gastos: 2500000,
    ingresos: 3000000  // De estimaciones
  },
  {
    mes: "Febrero",
    gastos: 3200000,
    ingresos: 3500000
  }
  // ... últimos 6 meses
]
```

### **Filtros Aplicables:**
```typescript
{
  estado: "Todos" | "activa" | "suspendida" | "terminada" | "cancelada",
  ordenarPor: "nombre" | "codigo" | "monto" | "porcentaje",
  busqueda: string  // Filtrar por codigo, nombre o cliente
}
```

---

## 🛒 MÓDULO COMPRAS

### **Archivo:** `/src/app/PurchaseOrderManagement.tsx`

### **Datos de Entrada (Consultados):**

#### **1. Órdenes de Compra:**
```typescript
Source: dataProvider.getOrdenesCompra()

Estructura Completa:
{
  id: string,
  numeroOrden: string,          // "227-A01GM-CEMEX"
  obraId: string,               // UUID de la obra
  proveedorId: string,          // UUID del proveedor
  requisicionId: string | null, // UUID si viene de requisición
  
  fechaEmision: string,         // ISO date
  fechaEntrega: string,         // ISO date
  estado: string,               // "borrador", "emitida", "recibida", "facturada", "pagada", "cancelada"
  tipoEntrega: string,          // "en_obra", "bodega", "recoger"
  
  subtotal: number,
  descuento: number,            // Porcentaje (0-100)
  descuentoMonto: number,       // Monto calculado
  iva: number,                  // 16% si aplica
  total: number,
  
  observaciones: string | null,
  creadoPor: string | null,     // Usuario que creó
  
  items: [
    {
      id: string,
      cantidad: number,
      unidad: string,           // "BULTO", "M3", "PZA", etc.
      descripcion: string,
      precioUnitario: number,
      total: number             // cantidad * precioUnitario
    }
  ],
  
  createdAt: string,
  updatedAt: string
}
```

#### **2. Obras (para dropdown):**
```typescript
Source: dataProvider.getObras()

Datos Usados:
{
  id: string,
  codigo: string,
  nombre: string,
  cliente: string
}
```

#### **3. Proveedores (para dropdown):**
```typescript
Source: dataProvider.getProveedores()

Datos Usados:
{
  id: string,
  nombreComercial: string,      // "CEMEX"
  razonSocial: string,          // "CEMEX México S.A. de C.V."
  rfc: string,
  direccion: string,
  telefono: string,
  email: string,
  contactoPrincipal: string
}
```

#### **4. Requisiciones Aprobadas (opcional):**
```typescript
Source: dataProvider.getRequisiciones({ estado: 'aprobada' })

Para prellenar OC desde requisición:
{
  id: string,
  numeroRequisicion: string,
  obraId: string,
  items: [...]
}
```

### **Datos Calculados en Vista:**

#### **Estadísticas Superiores:**
```typescript
{
  totalOrdenes: number,         // COUNT(ordenes)
  montoTotal: number,           // SUM(ordenes.total)
  ordenesAprobadas: number,     // COUNT WHERE estado = 'emitida'
  descuentosAcumulados: number  // SUM(ordenes.descuentoMonto)
}
```

#### **Por Orden de Compra (tabla):**
```typescript
{
  // Campos directos
  numeroOrden: string,
  fechaEmision: string,
  fechaEntrega: string,
  estado: string,
  total: number,
  
  // Lookup de Obra
  obraCodigo: string,           // obra.codigo
  obraNombre: string,           // obra.nombre
  
  // Lookup de Proveedor
  proveedorNombre: string,      // proveedor.nombreComercial
  proveedorRazon: string,       // proveedor.razonSocial
  
  // Indicadores
  tieneDescuento: boolean,      // descuento > 0
  tieneIVA: boolean,            // iva > 0
  
  // Items
  cantidadItems: number,        // items.length
  totalItems: number            // SUM(items.total)
}
```

### **🔐 Gestión de Proveedores (Secreto):**

#### **Datos de Proveedor (CRUD):**
```typescript
Source: dataProvider.getProveedores() / createProveedor() / updateProveedor()

Estructura:
{
  id: string,
  
  // Campos del formulario
  proveedor: string,            // Nombre corto (input personalizado)
  razonSocial: string,          // Razón social completa
  rfc: string,                  // RFC (13 caracteres, uppercase)
  direccion: string,            // Dirección completa
  vendedor: string,             // Por defecto "mostrador"
  telefono: string,             // Formato libre
  correo: string,               // Email validado
  
  // Campos automáticos
  nombreComercial: string,      // = proveedor
  activo: boolean,              // true por defecto
  createdAt: string,
  updatedAt: string
}
```

### **Operaciones CRUD:**

#### **Crear Orden de Compra:**
```typescript
Input:
{
  obraId: string,               // Selección de dropdown
  proveedorId: string,          // Selección de dropdown
  fechaEntrega: string,
  tipoEntrega: string,
  items: [
    {
      descripcion: string,
      cantidad: number,
      unidad: string,
      precioUnitario: number
    }
  ],
  descuento: number,            // Porcentaje
  aplicaIVA: boolean,
  observaciones: string
}

Cálculos automáticos:
- numeroOrden: generado (formato: XXX-ANNII-PROV)
- subtotal: SUM(items.cantidad * items.precioUnitario)
- descuentoMonto: subtotal * (descuento / 100)
- iva: aplicaIVA ? (subtotal - descuentoMonto) * 0.16 : 0
- total: subtotal - descuentoMonto + iva
```

#### **Editar Orden de Compra:**
```typescript
// Se precargan todos los valores existentes
// Se permite modificar cualquier campo
// Se recalculan totales al cambiar items o descuento
```

#### **Eliminar Orden de Compra:**
```typescript
// Confirmación requerida
// Solo se permite si estado = "borrador"
// Las emitidas/pagadas requieren cancelación formal
```

### **Filtros de Vista:**
```typescript
{
  busqueda: string,             // Buscar en: numeroOrden, proveedor, obra
  obraFiltro: string,           // Filtrar por codigo de obra
  estadoFiltro: string,         // Filtrar por estado
  
  // Aplicados en frontend sobre array completo
  ordenesFiltradasYBuscadas: OrdenCompra[]
}
```

---

## 📋 MÓDULO REQUISICIONES

### **Archivo:** `/src/app/MaterialRequisitions.tsx`

### **Datos de Entrada (Consultados):**

#### **1. Requisiciones:**
```typescript
Source: dataProvider.getRequisiciones()

Estructura Completa:
{
  id: string,
  numeroRequisicion: string,    // "REQ227-001MAT"
  obraId: string,               // UUID de obra
  solicitadoPor: string,        // Nombre del residente
  
  fechaSolicitud: string,       // ISO datetime
  urgencia: string,             // "normal", "urgente", "muy_urgente"
  estado: string,               // "pendiente", "aprobada", "rechazada", "en_proceso", "completada"
  
  observaciones: string | null,
  aprobadoPor: string | null,   // Usuario que aprobó
  fechaAprobacion: string | null,
  motivoRechazo: string | null,
  
  items: [
    {
      id: string,
      cantidad: number,
      unidad: string,           // "BULTO", "M3", "PZA", "KG", etc.
      descripcion: string
    }
  ],
  
  createdAt: string,
  updatedAt: string
}
```

#### **2. Obras (para lookup):**
```typescript
Source: dataProvider.getObras()

Datos Usados:
{
  id: string,
  codigo: string,
  nombre: string,
  residente: string
}
```

### **Datos Calculados en Vista:**

#### **Estadísticas:**
```typescript
{
  totalRequisiciones: number,   // COUNT(requisiciones)
  pendientes: number,           // COUNT WHERE estado = 'pendiente'
  urgentes: number,             // COUNT WHERE urgencia = 'urgente' AND estado != 'completada'
  convertidas: number,          // COUNT WHERE estado = 'completada' (convertidas a OC)
  enRevision: number            // COUNT WHERE estado = 'en_proceso'
}
```

#### **Por Requisición (tabla):**
```typescript
{
  // Datos directos
  numeroRequisicion: string,
  fechaSolicitud: string,
  urgencia: string,
  estado: string,
  solicitadoPor: string,
  
  // Lookup de Obra
  obraCodigo: string,
  obraNombre: string,
  
  // Items
  cantidadItems: number,        // items.length
  itemsResumen: string,         // Primeras 2 descripciones + "..."
  
  // Fechas
  diasDesdeCreacion: number,    // Días desde fechaSolicitud
  estaVencida: boolean          // Si tiene > X días pendiente
}
```

### **Sistema de Comentarios:**

#### **Comentario:**
```typescript
{
  id: string,
  author: string,               // Nombre del usuario
  role: string,                 // "Residente", "Compras", "Dirección"
  message: string,              // Texto del comentario
  timestamp: string,            // ISO datetime
  
  // En vista
  tiempoRelativo: string        // "Hace 2 horas", "Hace 1 día"
}
```

#### **Thread de Comentarios:**
```typescript
// Se agregan a requisicion.comments[]
// Vista cronológica (más reciente arriba)
// Iconos y colores según role
```

### **Operaciones CRUD:**

#### **Crear Requisición:**
```typescript
Input:
{
  obraId: string,               // Selección de obra
  solicitadoPor: string,        // Auto-llenado con usuario actual
  urgencia: string,             // Selector: normal/urgente/muy_urgente
  items: [
    {
      descripcion: string,
      cantidad: number,
      unidad: string
    }
  ],
  observaciones: string
}

Valores automáticos:
- numeroRequisicion: generado (REQ + codigo + secuencia)
- fechaSolicitud: now()
- estado: "pendiente"
```

#### **Aprobar Requisición:**
```typescript
Action:
{
  estado: "aprobada",
  aprobadoPor: "Usuario Compras",
  fechaAprobacion: now()
}

// Habilita botón "Convertir a OC"
```

#### **Rechazar Requisición:**
```typescript
Action:
{
  estado: "rechazada",
  motivoRechazo: string         // Obligatorio
}
```

#### **Convertir a Orden de Compra:**
```typescript
// Abre formulario de OC prellenado con:
{
  obraId: requisicion.obraId,
  requisicionId: requisicion.id,
  items: requisicion.items.map(item => ({
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    unidad: item.unidad,
    precioUnitario: 0  // Por llenar
  }))
}

// Al guardar OC:
requisicion.estado = "completada"
```

### **Filtros:**
```typescript
{
  busqueda: string,             // numeroRequisicion, obra
  estadoFiltro: string,
  urgenciaFiltro: string,
  obraFiltro: string
}
```

---

## 💰 MÓDULO PAGOS

### **Archivo:** `/src/app/PaymentManagement.tsx`

### **Datos de Entrada (Consultados):**

#### **1. Pagos:**
```typescript
Source: dataProvider.getPagos()

Estructura Completa:
{
  id: string,
  numeroPago: string,           // "PAG-227-001"
  obraId: string,
  proveedorId: string,
  ordenCompraId: string,        // Referencia a OC
  
  monto: number,
  metodoPago: string,           // "transferencia", "cheque", "efectivo"
  
  fechaProgramada: string,      // Date (ISO)
  fechaProcesado: string | null, // Datetime (ISO) - cuando se completó
  
  estado: string,               // "programado", "procesando", "completado", "cancelado"
  
  referencia: string | null,    // Número de transferencia/cheque
  comprobante: string | null,   // URL o path del comprobante
  observaciones: string | null,
  procesadoPor: string | null,  // Usuario que procesó
  
  createdAt: string,
  updatedAt: string
}
```

#### **2. Obras (para lookup):**
```typescript
Source: dataProvider.getObras()

Datos Usados:
{
  id: string,
  codigo: string,
  nombre: string,
  montoContratado: number       // Para validar saldo
}
```

#### **3. Proveedores (para lookup):**
```typescript
Source: dataProvider.getProveedores()

Datos Usados:
{
  id: string,
  nombreComercial: string,
  razonSocial: string,
  banco: string,
  numeroCuenta: string,
  clabe: string
}
```

#### **4. Órdenes de Compra (para vincular):**
```typescript
Source: dataProvider.getOrdenesCompra()

Datos Usados:
{
  id: string,
  numeroOrden: string,
  total: number,                // Monto del pago
  proveedorId: string,          // Debe coincidir
  obraId: string                // Debe coincidir
}
```

### **Datos Calculados en Vista:**

#### **Estadísticas:**
```typescript
{
  totalPagos: number,           // COUNT(pagos)
  montoProgramado: number,      // SUM(monto WHERE estado = 'programado')
  montoProcesado: number,       // SUM(monto WHERE estado = 'completado')
  pagosPendientes: number,      // COUNT WHERE estado = 'programado'
  pagosVencidos: number,        // COUNT WHERE estado = 'programado' AND fechaProgramada < today
  pagosProximos: number         // COUNT WHERE fechaProgramada <= today+3 AND estado = 'programado'
}
```

#### **Por Pago (tabla):**
```typescript
{
  // Datos directos
  numeroPago: string,
  monto: number,
  metodoPago: string,
  fechaProgramada: string,
  estado: string,
  
  // Lookups
  obraCodigo: string,
  obraNombre: string,
  proveedorNombre: string,
  ordenNumero: string,          // numeroOrden de la OC
  
  // Indicadores
  diasHastaPago: number,        // Días desde hoy hasta fechaProgramada
  estaVencido: boolean,         // fechaProgramada < today
  esProximo: boolean,           // fechaProgramada <= today+3
  
  // Validaciones
  tieneSaldoObra: boolean       // Obra tiene saldo suficiente
}
```

### **Vista de Calendario:**

#### **Pagos por Semana:**
```typescript
[
  {
    semana: "Semana 1",
    fechaInicio: "2025-01-20",
    fechaFin: "2025-01-26",
    pagos: Pago[],              // Pagos de esa semana
    montoTotal: number,         // SUM(pagos.monto)
    cantidadPagos: number       // COUNT(pagos)
  },
  {
    semana: "Semana 2",
    fechaInicio: "2025-01-27",
    fechaFin: "2025-02-02",
    // ...
  }
  // Próximas 4 semanas
]
```

### **Operaciones CRUD:**

#### **Crear Pago:**
```typescript
Input:
{
  ordenCompraId: string,        // Dropdown de OCs emitidas/facturadas
  // Auto-llenado:
  obraId: OC.obraId,
  proveedorId: OC.proveedorId,
  monto: OC.total,
  
  // Usuario completa:
  metodoPago: string,
  fechaProgramada: string,
  observaciones: string
}

Valores automáticos:
- numeroPago: generado (PAG-{obraCodigo}-{seq})
- estado: "programado"
```

#### **Procesar Pago:**
```typescript
Action:
{
  estado: "completado",
  fechaProcesado: now(),
  procesadoPor: "Usuario actual",
  referencia: string,           // Obligatorio
  comprobante: file | url       // Opcional
}

// Validaciones:
- Saldo de obra suficiente
- OC en estado apropiado
```

#### **Cancelar Pago:**
```typescript
Action:
{
  estado: "cancelado",
  observaciones: "Motivo de cancelación"
}
```

### **Alertas Automáticas:**

#### **Sistema de Notificaciones:**
```typescript
{
  alertasActivas: [
    {
      tipo: "vencido",
      cantidad: number,
      mensaje: "X pagos vencidos requieren atención",
      prioridad: "alta"
    },
    {
      tipo: "proximo",
      cantidad: number,
      mensaje: "X pagos próximos en 3 días",
      prioridad: "media"
    },
    {
      tipo: "saldo",
      obraCodigo: string,
      mensaje: "Obra XXX sin saldo suficiente",
      prioridad: "alta"
    }
  ]
}
```

### **Filtros:**
```typescript
{
  busqueda: string,             // numeroPago, proveedor, OC
  estadoFiltro: string,
  metodoFiltro: string,
  rangoFechas: {
    inicio: string,
    fin: string
  },
  obraFiltro: string
}
```

---

## 📐 MÓDULO SEGUIMIENTO FÍSICO

### **Archivo:** `/src/app/ContractTracking.tsx`

### **Datos de Entrada (Consultados):**

#### **1. Información de Contrato (Obra):**
```typescript
Source: dataProvider.getObraById(id)

Datos Usados:
{
  id: string,
  codigo: string,
  nombre: string,
  numeroContrato: string,
  cliente: string,
  residente: string,
  direccion: string,
  montoContratado: number,      // Monto original
  fechaInicio: string,
  fechaFinProgramada: string,
  plazoEjecucion: number,       // Días
  estado: string
}
```

#### **2. Movimientos del Contrato:**
```typescript
Source: Colección propia (futuro: tabla separada)

Estructura Unificada:
{
  id: string,
  numeroMovimiento: string,     // "EST-001", "ADI-001", "DED-001"
  obraId: string,
  tipo: string,                 // "estimacion", "aditiva", "deductiva"
  
  // Periodo (principalmente para estimaciones)
  periodo: string | null,       // "Estimación 1", "Enero 2025"
  fechaInicio: string | null,
  fechaFin: string | null,
  
  // Conceptos ejecutados
  conceptos: [
    {
      id: string,
      codigo: string,           // "A01", "B02", etc.
      descripcion: string,      // Descripción del trabajo
      unidad: string,           // "M2", "M3", "ML", "PZA", etc.
      
      cantidadContrato: number, // Cantidad en contrato original
      cantidadEjecutada: number, // Cantidad de este movimiento
      cantidadAcumulada: number, // Total acumulado hasta ahora
      
      precioUnitario: number,
      importe: number           // cantidadEjecutada * precioUnitario
    }
  ],
  
  // Totales
  subtotal: number,             // SUM(conceptos.importe)
  iva: number,                  // 16% del subtotal
  retencion: number,            // Retenciones aplicadas
  total: number,                // subtotal + iva - retencion
  
  // Estado y Aprobación
  estado: string,               // "borrador", "emitida", "aprobada", "pagada"
  elaboradoPor: string,
  fechaElaboracion: string,
  aprobadoPor: string | null,
  fechaAprobacion: string | null,
  
  observaciones: string | null,
  
  createdAt: string,
  updatedAt: string
}
```

### **Datos Calculados en Vista:**

#### **Resumen Financiero:**
```typescript
{
  // Base
  montoOriginal: number,        // obra.montoContratado
  
  // Movimientos acumulados
  estimacionesAcumuladas: number, // SUM(movimientos WHERE tipo='estimacion' AND estado='aprobada').total
  aditivasAcumuladas: number,     // SUM(movimientos WHERE tipo='aditiva' AND estado='aprobada').total
  deductivasAcumuladas: number,   // SUM(movimientos WHERE tipo='deductiva' AND estado='aprobada').total
  
  // Cálculos
  montoActualizado: number,     // original + aditivas - deductivas
  porcentajeAvance: number,     // (estimaciones / montoActualizado) * 100
  saldoPorEjercer: number,      // montoActualizado - estimaciones
  
  // Indicadores
  enRiesgo: boolean,            // porcentajeAvance > 90 && saldoPorEjercer < umbral
  requiereAditiva: boolean      // saldoPorEjercer < 10% de montoActualizado
}
```

#### **Tabla de Movimientos:**
```typescript
// Vista unificada con badges de colores
[
  {
    numeroMovimiento: "EST-001",
    tipo: "estimacion",         // Badge azul
    periodo: "Estimación 1",
    fechaFin: "2025-01-31",
    total: 1500000,
    estado: "aprobada",
    cantidadConceptos: 15
  },
  {
    numeroMovimiento: "ADI-001",
    tipo: "aditiva",            // Badge verde
    periodo: null,
    fechaFin: "2025-02-15",
    total: 500000,
    estado: "emitida",
    cantidadConceptos: 3
  },
  {
    numeroMovimiento: "DED-001",
    tipo: "deductiva",          // Badge rojo
    periodo: null,
    fechaFin: "2025-02-20",
    total: -150000,
    estado: "borrador",
    cantidadConceptos: 2
  }
]
```

### **Formulario Único (Dinámico):**

#### **Paso 1: Seleccionar Tipo:**
```typescript
{
  tipo: "estimacion" | "aditiva" | "deductiva"
  
  // El formulario se adapta según tipo seleccionado
}
```

#### **Paso 2: Datos Generales (según tipo):**

##### **Para Estimación:**
```typescript
{
  periodo: string,              // "Estimación 1"
  fechaInicio: string,
  fechaFin: string,
  observaciones: string
}
```

##### **Para Aditiva:**
```typescript
{
  motivo: string,               // "Trabajos adicionales solicitados por cliente"
  fechaAutorizacion: string,
  autorizadoPor: string,
  observaciones: string
}
```

##### **Para Deductiva:**
```typescript
{
  motivo: string,               // "Reducción de alcance por presupuesto"
  fechaAutorizacion: string,
  autorizadoPor: string,
  observaciones: string
}
```

#### **Paso 3: Conceptos:**

##### **Para Estimación (conceptos del contrato):**
```typescript
{
  conceptos: [
    {
      // De catálogo de contrato
      codigo: string,
      descripcion: string,
      unidad: string,
      cantidadContrato: number,  // Del contrato
      precioUnitario: number,    // Del contrato
      
      // Usuario ingresa
      cantidadEjecutada: number, // De este periodo
      
      // Calculado
      importe: cantidadEjecutada * precioUnitario
    }
  ]
}
```

##### **Para Aditiva (nuevos conceptos):**
```typescript
{
  conceptos: [
    {
      // Usuario ingresa TODO
      codigo: string,             // Nuevo código
      descripcion: string,
      unidad: string,
      cantidad: number,
      precioUnitario: number,
      
      // Calculado
      importe: cantidad * precioUnitario
    }
  ]
}
```

##### **Para Deductiva (conceptos a reducir):**
```typescript
{
  conceptos: [
    {
      // Del catálogo
      codigo: string,
      descripcion: string,
      unidad: string,
      precioUnitario: number,
      
      // Usuario ingresa
      cantidadAReducir: number,   // Cantidad a descontar
      
      // Calculado (negativo)
      importe: -(cantidadAReducir * precioUnitario)
    }
  ]
}
```

### **Cálculos Automáticos en Formulario:**

```typescript
// En tiempo real mientras usuario edita
{
  subtotal: number,             // SUM(conceptos.importe)
  iva: number,                  // subtotal * 0.16
  retencion: number,            // Si aplica (campo manual)
  total: number,                // subtotal + iva - retencion
  
  // Preview del impacto
  nuevoMontoContrato: number,   // montoActualizado + total (si aditiva/deductiva)
  nuevoAvance: number           // Si es estimación
}
```

### **Operaciones:**

#### **Crear Movimiento:**
```typescript
// Genera numeroMovimiento automático según tipo
// EST-001, EST-002... para estimaciones
// ADI-001, ADI-002... para aditivas
// DED-001, DED-002... para deductivas
```

#### **Editar Movimiento:**
```typescript
// Solo si estado = "borrador"
// Prellenar todos los campos
// Recalcular al modificar
```

#### **Aprobar Movimiento:**
```typescript
// Cambiar estado a "aprobada"
// Registrar aprobadoPor y fechaAprobacion
// Actualizar resumen financiero
```

#### **Eliminar Movimiento:**
```typescript
// Solo si estado = "borrador"
// Confirmación requerida
```

---

## 🔄 DATOS COMPARTIDOS

### **Entidades Base (Usadas por Múltiples Módulos):**

#### **Obra:**
```typescript
Usada por:
- Dashboard: estadísticas generales
- Compras: asociar OCs
- Requisiciones: asociar solicitudes
- Pagos: validar saldo
- Seguimiento: contrato base

Campos más usados:
- codigo: Identificador corto
- nombre: Nombre del proyecto
- montoContratado: Presupuesto total
- estado: Estado actual
```

#### **Proveedor:**
```typescript
Usada por:
- Compras: crear OCs
- Pagos: datos bancarios
- Dashboard: estadísticas de proveedores (futuro)

Campos más usados:
- nombreComercial: Nombre corto
- razonSocial: Nombre legal
- rfc: Identificación fiscal
- banco, clabe: Para pagos
```

---

## 🌊 FLUJOS DE INFORMACIÓN

### **Flujo 1: Requisición → OC → Pago**

```
1. RESIDENTE crea REQUISICIÓN
   └─ MaterialRequisitions.tsx
      └─ dataProvider.createRequisicion()

2. COMPRAS revisa y APRUEBA
   └─ MaterialRequisitions.tsx
      └─ dataProvider.updateRequisicion({ estado: 'aprobada' })

3. COMPRAS convierte a ORDEN DE COMPRA
   └─ PurchaseOrderManagement.tsx
      └─ dataProvider.createOrdenCompra({ requisicionId: ... })

4. TESORERÍA programa PAGO
   └─ PaymentManagement.tsx
      └─ dataProvider.createPago({ ordenCompraId: ... })

5. TESORERÍA procesa PAGO
   └─ PaymentManagement.tsx
      └─ dataProvider.updatePago({ estado: 'completado' })
```

### **Flujo 2: Estimación → Dashboard**

```
1. CONTROL DE OBRA crea ESTIMACIÓN
   └─ ContractTracking.tsx
      └─ Movimiento tipo "estimacion"

2. DIRECCIÓN aprueba ESTIMACIÓN
   └─ ContractTracking.tsx
      └─ Estado: "aprobada"

3. DASHBOARD actualiza estadísticas
   └─ GlobalDashboard.tsx
      └─ Suma estimaciones aprobadas como "ingresos"
      └─ Calcula % de avance por obra
```

### **Flujo 3: Compras → Dashboard**

```
1. COMPRAS emite ORDEN DE COMPRA
   └─ PurchaseOrderManagement.tsx
      └─ Estado: "emitida"

2. DASHBOARD suma como GASTO EJERCIDO
   └─ GlobalDashboard.tsx
      └─ SUM(OCs WHERE estado IN ['emitida', 'recibida', 'pagada'])
      └─ Resta del saldo disponible
```

### **Flujo 4: Aditiva/Deductiva → Dashboard**

```
1. CONTROL DE OBRA crea ADITIVA
   └─ ContractTracking.tsx
      └─ Movimiento tipo "aditiva", total: +500000

2. DIRECCIÓN aprueba
   └─ Estado: "aprobada"

3. DASHBOARD actualiza MONTO CONTRATADO
   └─ GlobalDashboard.tsx
      └─ montoActualizado = original + aditivas - deductivas
```

---

## 📌 RESUMEN DE FUENTES DE DATOS

### **Por Módulo:**

| Módulo | Consulta Datos De | Modifica Datos De | Cálculos Propios |
|--------|-------------------|-------------------|------------------|
| **Home** | Ninguno | Ninguno | Ninguno |
| **Dashboard** | Obras, OCs, Movimientos | Ninguno | Sí (estadísticas) |
| **Compras** | OCs, Obras, Proveedores, Requisiciones | OCs, Proveedores | Sí (totales OC) |
| **Requisiciones** | Requisiciones, Obras | Requisiciones | Sí (stats) |
| **Pagos** | Pagos, OCs, Obras, Proveedores | Pagos | Sí (calendario) |
| **Seguimiento** | Obras, Movimientos | Movimientos | Sí (resumen financiero) |

---

**FIN DEL MAPA DE DATOS**
