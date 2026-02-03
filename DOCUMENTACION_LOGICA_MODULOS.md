# 📋 DOCUMENTACIÓN TÉCNICA - LÓGICA DE MÓDULOS

## 🎯 PRINCIPIOS DEL SISTEMA

**Sistema**: ERP Empresarial para Constructora (IDP)  
**Arquitectura**: Frontend puro, sin backend  
**Filosofía**: Componentes visuales puros que reciben props y muestran información  
**Datos**: Mock data realista como especificación  
**Estados obligatorios**: Loading, Empty, WithData

---

## 📦 MÓDULO 1: DASHBOARD GLOBAL EMPRESARIAL

### **Propósito**
Vista ejecutiva consolidada de todas las obras activas, métricas financieras globales y KPIs empresariales.

### **Lógica de Funcionamiento**

#### 1. Agregación de Obras
```
ENTRADA: Array de obras activas
PROCESO: 
  - Filtrar obras con status = "active"
  - Contar total de obras
  - Sumar contratos totales
  - Calcular avance promedio ponderado por monto de contrato
SALIDA: Métricas globales
```

#### 2. Cálculo de Métricas Financieras
```
Monto Total Contratado = Σ(obra.montoContrato)
Ejecutado Total = Σ(obra.ejecutado)
Pendiente Total = MontoContratado - Ejecutado
% Avance Global = (Ejecutado / MontoContratado) * 100
```

#### 3. Detección de Alertas
```
REGLAS:
  - Alerta Roja: Obra con avance < 50% y fecha > 75% del plazo
  - Alerta Amarilla: Obra con avance entre 50-75% y fecha > 60% del plazo
  - Alerta Verde: Obra dentro de parámetros normales

FÓRMULA DÍAS TRANSCURRIDOS:
  diasTranscurridos = (fechaHoy - fechaInicio)
  diasTotales = (fechaFin - fechaInicio)
  avanceTiempo = (diasTranscurridos / diasTotales) * 100
```

#### 4. Obras Más Activas
```
CRITERIO: Número de requisiciones generadas en últimos 30 días
ORDENAMIENTO: DESC por cantidad de requisiciones
LÍMITE: Top 5
```

### **Estados del Componente**

**Loading**:
- Skeleton cards para métricas principales
- Skeleton table para lista de obras
- Shimmer animation

**Empty**:
- CTA: "Crear Primera Obra"
- Mensaje: Sistema vacío, sin obras registradas
- Benefits cards explicando funcionalidad

**WithData**:
- Cards de métricas (4 principales)
- Tabla de obras con acciones
- Filtros por estado
- Búsqueda por código/nombre

### **Datos Requeridos**

```typescript
interface Obra {
  id: string;              // UUID único
  codigo: string;          // Código de obra (ej: "230")
  nombre: string;          // Nombre descriptivo
  montoContrato: number;   // Monto en pesos MXN
  ejecutado: number;       // Monto ejecutado
  pendiente: number;       // montoContrato - ejecutado
  avance: number;          // Porcentaje 0-100
  fechaInicio: string;     // ISO date
  fechaFin: string;        // ISO date
  status: "active" | "paused" | "completed";
  responsable: string;     // Nombre del residente
  ubicacion: string;       // Dirección física
}
```

---

## 🛒 MÓDULO 2: DEPARTAMENTO DE COMPRAS

### **Propósito**
Gestión de órdenes de compra (OCs) y recepción de requisiciones desde obras.

### **Lógica de Funcionamiento**

#### 1. Sistema de Órdenes de Compra

**Generación de Folio**:
```
FORMATO: {codigoObra}-{consecutivo}{iniciales}-{proveedor}
EJEMPLO: "230-A01JR-CEMEX"

DONDE:
  - codigoObra = código de la obra (ej: 230)
  - consecutivo = número secuencial por obra (A01, A02, A03...)
  - iniciales = iniciales del residente que autorizó
  - proveedor = nombre del proveedor
```

**Campos de OC**:
```typescript
interface PurchaseOrder {
  id: string;                    // UUID
  orderNumber: string;           // Folio calculado
  workCode: string;              // Código de obra
  workName: string;              // Nombre de obra
  supplier: string;              // Proveedor
  orderDate: string;             // Fecha de emisión
  deliveryDate: string;          // Fecha de entrega pactada
  items: OrderItem[];            // Partidas
  subtotal: number;              // Suma de items
  iva: number;                   // IVA 16%
  descuento: number;             // Descuento aplicado
  total: number;                 // subtotal + iva - descuento
  status: "pending" | "approved" | "delivered";
  createdBy: string;             // Usuario que creó
  notes: string;                 // Observaciones
}

interface OrderItem {
  id: string;
  description: string;           // Descripción del material
  unit: string;                  // Unidad (m³, ton, pza, etc.)
  quantity: number;              // Cantidad
  unitPrice: number;             // Precio unitario
  total: number;                 // quantity * unitPrice
}
```

**Cálculos**:
```
subtotal = Σ(item.total)
iva = subtotal * 0.16
total = subtotal + iva - descuento
```

#### 2. Sistema de Requisiciones

**Flujo**:
```
1. Residente crea requisición en obra
2. Se envía al Depto de Compras
3. Compras revisa y convierte a OC
4. Status cambia: "En Revisión" → "Comprado"
```

**Estados de Requisición**:
```
"pending"     = Enviada, esperando revisión
"in_review"   = En revisión por compras
"purchased"   = Convertida a OC
"rejected"    = Rechazada (falta presupuesto, etc.)
```

#### 3. Gestión de Proveedores

**Base de Proveedores**:
```typescript
interface Supplier {
  id: string;
  proveedor: string;        // Nombre comercial
  razonSocial: string;      // Nombre fiscal
  rfc: string;              // RFC 13 caracteres
  direccion: string;        // Dirección completa
  vendedor: string;         // Contacto directo
  telefono: string;         // Teléfono de contacto
  correo: string;           // Email
}
```

### **Estados del Componente**

**Loading**:
- Skeleton tabs
- Skeleton cards de órdenes
- Loading en tabla

**Empty**:
- Tab "Órdenes": CTA "Crear Primera OC"
- Tab "Requisiciones": Mensaje de espera
- Benefits explicativos

**WithData**:
- Tabs: Órdenes | Requisiciones
- Filtros por estado
- Búsqueda por folio/proveedor
- Acciones: Crear, Editar, PDF

---

## 💰 MÓDULO 3: GESTIÓN DE PAGOS

### **Propósito**
Control de pagos a proveedores, gestión de facturas y seguimiento de cuentas por pagar.

### **Lógica de Funcionamiento**

#### 1. Sistema de Facturación Múltiple

**Complejidad**: Una OC puede tener **múltiples facturas**

```
OC-001 ($120,000)
  ├── Factura A ($50,000) - Pagada
  ├── Factura B ($40,000) - Pago parcial ($20,000)
  └── Factura C ($30,000) - Pendiente
```

**Modelo de Datos**:
```typescript
interface PurchaseOrderPayment {
  id: string;
  orderNumber: string;           // FK a orden de compra
  workCode: string;
  workName: string;
  supplier: string;
  orderDate: string;
  totalAmount: number;           // Monto total de la OC
  
  // Sistema de facturación
  requiresInvoice: boolean;      // Si el proveedor factura
  invoices: Invoice[];           // Array de facturas (0 a N)
  
  // Pagos directos (proveedores que NO facturan)
  directPayments: Payment[];
  
  // Crédito
  hasCredit: boolean;
  creditDays: number;            // Días de crédito del proveedor
  
  // Totales calculados
  totalInvoiced: number;         // Σ(invoices.montoFactura)
  totalPaid: number;             // Σ(todos los pagos)
  pendingAmount: number;         // totalAmount - totalPaid
  
  // Estado consolidado
  status: "paid" | "partial" | "pending" | "overdue" | "not_invoiced";
}

interface Invoice {
  id: string;
  folioFactura: string;          // Folio fiscal
  montoFactura: number;          // Monto de esta factura
  fechaFactura: string;          // Fecha de emisión
  diasCredito: number;           // Días otorgados
  fechaVencimiento: string;      // Calculada
  diasVencidos: number;          // Calculado dinámicamente
  payments: Payment[];           // Pagos a ESTA factura
  paidAmount: number;            // Σ(payments)
}

interface Payment {
  id: string;
  reference: string;             // Referencia bancaria
  amount: number;                // Monto del pago
  date: string;                  // Fecha del pago
  method: "Transferencia" | "Cheque" | "Efectivo";
}
```

#### 2. Configuración de Proveedores

```typescript
const supplierConfig = {
  "CEMEX": { 
    requiresInvoice: true,      // Proveedor formal que factura
    creditDays: 30               // Otorga 30 días de crédito
  },
  "FERREMAT": { 
    requiresInvoice: true, 
    creditDays: 40 
  },
  "LEVINSON": { 
    requiresInvoice: true, 
    creditDays: 15               // Crédito corto
  },
  "PIPA LUIS GOMEZ": { 
    requiresInvoice: false,      // NO factura (informal)
    creditDays: 0                // Pago inmediato
  },
  "ACARREOS JOSE": { 
    requiresInvoice: false, 
    creditDays: 0 
  },
};
```

#### 3. Cálculos de Vencimiento

**Fecha de Vencimiento**:
```javascript
fechaVencimiento = fechaFactura + diasCredito

Ejemplo:
  fechaFactura = 2026-01-12
  diasCredito = 30
  fechaVencimiento = 2026-02-11
```

**Días Vencidos**:
```javascript
today = fechaActual (tiempo real del dispositivo)
dueDate = fechaVencimiento

diasVencidos = today - dueDate

Si diasVencidos > 0:
  ⚠️ FACTURA VENCIDA
  Mostrar alerta roja con días de retraso
```

#### 4. Estados de Pago

```
"paid"          = Pagado 100% (totalPaid >= totalAmount)
"partial"       = Pago parcial (0 < totalPaid < totalAmount)
"pending"       = Con factura, sin pago (totalPaid = 0, invoice exists)
"overdue"       = Factura vencida y no pagada (diasVencidos > 0)
"not_invoiced"  = OC sin facturar (invoices.length = 0)
```

#### 5. Casos de Uso Complejos

**CASO A: Múltiples facturas, múltiples pagos**
```
OC: $85,000
Factura 1: $50,000
  - Pago A: $20,000 (TRF)
  - Pago B: $15,000 (TRF)
  - Pago C: $15,000 (CHQ)
  Total pagado Fact1: $50,000 ✅

Factura 2: $35,000
  - Pago A: $10,000 (TRF)
  Total pagado Fact2: $10,000 🟡
  
Total OC: $60,000 de $85,000
Estado: "partial"
```

**CASO B: Proveedor sin factura**
```
OC: $12,000 (ACARREOS JOSE)
requiresInvoice: false
invoices: []

directPayments:
  - Pago A: $5,000 (Efectivo)
  - Pago B: $3,000 (Efectivo)

Total: $8,000 de $12,000
Estado: "partial"
```

**CASO C: Factura vencida**
```
Factura: $40,602
Fecha factura: 2025-12-16
Días crédito: 15
Vencimiento: 2025-12-31

Hoy: 2026-02-03
Días vencidos: 34 días

Pagado: $20,000
Pendiente: $20,602

Estado: "overdue" 🔴
Alerta: ⚠️ Vencido hace 34 días
```

### **Estados del Componente**

**Loading**:
- Skeleton para stats cards
- Skeleton para tabla de OCs
- Loading shimmer

**Empty**:
- Sin OCs para gestionar
- CTA para ir a Compras
- Explicación del módulo

**WithData**:
- Stats (6 cards)
- Montos totales (3 cards)
- Filtros y búsqueda
- Tabla expandible con detalles
- Modales para agregar facturas/pagos

---

## 📝 MÓDULO 4: REQUISICIONES DE MATERIAL

### **Propósito**
Residentes de obra solicitan materiales. Sistema muestra requisiciones enviadas y su estado.

### **Lógica de Funcionamiento**

#### 1. Creación de Requisición

**Campos**:
```typescript
interface MaterialRequisition {
  id: string;
  requisitionNumber: string;     // Auto-generado REQ-{timestamp}
  workCode: string;              // Código de obra
  workName: string;              // Nombre de obra
  resident: string;              // Residente que solicita
  requestDate: string;           // Fecha de solicitud
  requiredDate: string;          // Fecha requerida
  priority: "normal" | "urgent"; // Prioridad
  items: RequisitionItem[];      // Materiales solicitados
  notes: string;                 // Observaciones
  status: "pending" | "in_review" | "purchased" | "rejected";
}

interface RequisitionItem {
  id: string;
  material: string;              // Descripción del material
  unit: string;                  // Unidad de medida
  quantity: number;              // Cantidad
  estimatedPrice: number;        // Precio estimado (opcional)
  notes: string;                 // Notas del material
}
```

#### 2. Flujo de Estados

```
1. PENDING
   - Recién creada
   - Enviada a Compras
   - Esperando revisión
   
2. IN_REVIEW
   - Compras está revisando
   - Validando presupuesto
   - Contactando proveedores
   
3. PURCHASED
   - Convertida a OC
   - Material en camino
   - Se vincula con OC-###
   
4. REJECTED
   - Sin presupuesto
   - Material no disponible
   - Necesita aprobación superior
```

#### 3. Lógica de Urgencia

```
URGENTE cuando:
  - priority = "urgent", O
  - requiredDate <= hoy + 3 días

CÁLCULO:
  diasParaEntrega = requiredDate - hoy
  
  Si diasParaEntrega <= 3:
    Badge ROJO "URGENTE"
    Notificación prioritaria
```

#### 4. Comunicación Compras-Residente

**Sistema de Mensajería**:
```typescript
interface Message {
  id: string;
  requisitionId: string;         // FK a requisición
  sender: "resident" | "buyer";  // Quién envía
  message: string;               // Contenido
  timestamp: string;             // Fecha/hora
  read: boolean;                 // Leído o no
}
```

**Casos de Uso**:
```
Residente: "Necesito el cemento para mañana"
Compras: "Ya contacté a CEMEX, llega en 2 días"
Residente: "Perfecto, gracias"
```

### **Estados del Componente**

**Loading**:
- Skeleton de tarjetas de requisiciones
- Loading en contadores

**Empty**:
- CTA "Crear Primera Requisición"
- Explicación de cómo funciona
- Benefits cards

**WithData**:
- Filtros por estado y urgencia
- Cards de requisiciones con timeline
- Vista detallada con materiales
- Sistema de mensajería

---

## 📊 MÓDULO 5: SEGUIMIENTO DE CONTRATOS

### **Propósito**
Tracking detallado del avance financiero de cada contrato/obra con reportes de estimaciones.

### **Lógica de Funcionamiento**

#### 1. Modelo de Estimaciones Progresivas

**Concepto**: 
Cada estimación representa un periodo de trabajo facturado al cliente.

```typescript
interface ContractTracking {
  id: string;
  contratoNumero: string;        // Número de contrato
  obra: string;                  // Nombre de la obra
  cliente: string;               // Cliente/contratante
  montoContrato: number;         // Monto total contratado
  fechaInicio: string;           // Inicio del contrato
  fechaFin: string;              // Fin programado
  estimaciones: Estimacion[];    // Array de estimaciones
  
  // Totales calculados
  totalEstimado: number;         // Σ(estimaciones.monto)
  anticipo: number;              // Anticipo recibido
  amortizacionAnticipo: number;  // Amortización del anticipo
  totalCobrado: number;          // Total facturado al cliente
  saldoPorCobrar: number;        // montoContrato - totalCobrado
  avanceFisico: number;          // % de avance físico
  avanceFinanciero: number;      // (totalEstimado / montoContrato) * 100
  
  status: "active" | "paused" | "completed";
}

interface Estimacion {
  id: string;
  numero: number;                // Número consecutivo (1, 2, 3...)
  periodo: string;               // "Enero 2026", "Semana 1-2 Feb"
  fechaInicio: string;           // Inicio del periodo
  fechaFin: string;              // Fin del periodo
  monto: number;                 // Monto de esta estimación
  anticipo: number;              // Amortización de anticipo (10%)
  retencion: number;             // Retención (5%)
  neto: number;                  // Monto neto a cobrar
  fechaPago: string | null;      // Fecha de pago (null si pendiente)
  status: "pending" | "paid";
  conceptos: ConceptoEstimacion[];
}

interface ConceptoEstimacion {
  id: string;
  concepto: string;              // Descripción del trabajo
  unidad: string;                // Unidad de medida
  cantidadContratada: number;    // Cantidad total en contrato
  cantidadEjecutada: number;     // Cantidad en esta estimación
  precioUnitario: number;        // Precio por unidad
  importe: number;               // cantidadEjecutada * precioUnitario
}
```

#### 2. Cálculo de Estimaciones

**Fórmula básica**:
```
MONTO BRUTO = Σ(conceptos.importe)

ANTICIPO AMORTIZADO = MONTO_BRUTO * 10%
  (Se descuenta el anticipo proporcionalmente)

RETENCIÓN = MONTO_BRUTO * 5%
  (Retención de garantía)

NETO A COBRAR = MONTO_BRUTO - ANTICIPO_AMORTIZADO - RETENCIÓN

Ejemplo:
  Monto bruto: $100,000
  Anticipo (10%): -$10,000
  Retención (5%): -$5,000
  Neto: $85,000
```

#### 3. Tracking Acumulado

```
totalEstimado = Σ(estimaciones.monto)
totalCobrado = Σ(estimaciones donde status = "paid").neto
saldoPorCobrar = montoContrato - totalEstimado

avanceFinanciero = (totalEstimado / montoContrato) * 100

ALERTAS:
  Si avanceFinanciero < avanceFisico:
    ⚠️ "Atraso en facturación"
  
  Si avanceFinanciero > avanceFisico:
    ⚠️ "Sobreestimación - revisar"
```

#### 4. Estados de Estimación

```
"pending" = Generada, enviada al cliente, esperando pago
"paid"    = Pagada por el cliente, cerrada

TIEMPO DE PAGO TÍPICO: 30-45 días
```

#### 5. Reporte de Avance

```typescript
interface ReporteAvance {
  contratoNumero: string;
  montoTotal: number;
  ejecutado: number;             // totalEstimado
  porEjecutar: number;           // montoContrato - totalEstimado
  avance: number;                // % financiero
  estimacionesGeneradas: number; // count(estimaciones)
  estimacionesPagadas: number;   // count where status = "paid"
  estimacionesPendientes: number;
  ultimaEstimacion: Estimacion | null;
  proyeccionTermino: string;     // Fecha proyectada de término
}
```

### **Estados del Componente**

**Loading**:
- Skeleton para cards de resumen
- Skeleton para tabla de estimaciones
- Loading shimmer

**Empty**:
- Sin contratos registrados
- CTA "Registrar Primer Contrato"
- Explicación de módulo

**WithData**:
- Selector de contrato
- Cards de métricas
- Tabla de estimaciones
- Gráfica de avance
- Detalle de conceptos por estimación

---

## 🎨 ESTADOS OBLIGATORIOS (TODOS LOS MÓDULOS)

### **1. LOADING**
```
CUÁNDO: Cargando datos desde API (simulado)
QUÉ MOSTRAR:
  - Skeleton loaders (shimmer effect)
  - Estructura completa con placeholders
  - No mostrar datos reales
  - Animación suave de carga
```

### **2. EMPTY**
```
CUÁNDO: Sin datos registrados
QUÉ MOSTRAR:
  - Ícono grande (illustration)
  - Título descriptivo
  - Mensaje explicativo
  - CTA principal (botón de acción)
  - Benefits cards (qué puede hacer)
  - Info boxes con features
```

### **3. WITH DATA**
```
CUÁNDO: Con datos cargados
QUÉ MOSTRAR:
  - Datos completos y realistas
  - Filtros funcionales
  - Búsquedas operativas
  - Acciones completas (CRUD)
  - Métricas calculadas
  - Visualizaciones (gráficas, tablas)
```

---

## 🔧 REGLAS GENERALES DEL SISTEMA

### **1. Montos y Monedas**
```
MONEDA: Pesos Mexicanos (MXN)
FORMATO: $1,234,567.89
DECIMALES: Siempre 2
SEPARADOR MILES: Coma
SEPARADOR DECIMALES: Punto
```

### **2. Fechas**
```
FORMATO INTERNO: ISO 8601 (YYYY-MM-DD)
FORMATO DISPLAY: DD/MM/YYYY o "12 Ene 2026"
ZONA HORARIA: América/México (GMT-6)
```

### **3. IDs**
```
TIPO: UUID v4
GENERACIÓN: crypto.randomUUID() o nanoid()
EJEMPLO: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### **4. Códigos de Obra**
```
FORMATO: Número de 3 dígitos
RANGO: 100-999
EJEMPLOS: "230", "227", "345"
ÚNICO: No se repite
```

### **5. Folios de Documentos**

**Órdenes de Compra**:
```
FORMATO: {codigoObra}-{consecutivo}{iniciales}-{proveedor}
EJEMPLO: "230-A01JR-CEMEX"
```

**Requisiciones**:
```
FORMATO: REQ-{timestamp}
EJEMPLO: "REQ-1706895234567"
```

**Facturas**:
```
FORMATO: FACT-{año}-{consecutivo}
EJEMPLO: "FACT-2026-001"
```

**Referencias de Pago**:
```
TRANSFERENCIA: TRF-{año}-{consecutivo}
CHEQUE: CHQ-{numero}
EFECTIVO: EFE-{consecutivo}
```

### **6. Validaciones**

**RFC**:
```
LONGITUD: 12 o 13 caracteres
FORMATO: AAA123456XXX o AAAA123456XXX
```

**Teléfono**:
```
FORMATO: (55) 5555-1234
LONGITUD: 10 dígitos
```

**Email**:
```
FORMATO: nombre@dominio.com
VALIDACIÓN: Regex estándar
```

### **7. Estados y Badges**

```
Estados positivos (verde):
  - paid, completed, approved, delivered

Estados en proceso (amarillo/naranja):
  - pending, in_review, partial, active

Estados negativos (rojo):
  - overdue, rejected, cancelled, error

Estados informativos (azul/púrpura):
  - not_invoiced, paused, draft
```

---

## 📌 NOTAS IMPORTANTES

1. **No hay backend real**: Todo es mock data, localStorage simulado
2. **No hay fetch/axios**: No se hacen llamadas HTTP reales
3. **No hay lógica de negocio compleja**: Solo cálculos visuales simples
4. **Datos hardcoded**: Los datos son estáticos y predefinidos
5. **3 versiones independientes**: `/app-full/`, `/app-empty/`, `/app-loading/`
6. **Consistencia visual**: Los 3 estados deben verse coherentes
7. **Mock data realista**: Usar datos que reflejen casos reales de construcción

---

**Última actualización**: 2026-02-03
