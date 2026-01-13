# 🗄️ Servicio de Base de Datos Centralizado

## 📋 Descripción

Este servicio maneja **TODA** la lógica de datos de la aplicación de manera centralizada. Ningún módulo debe usar `localStorage` directamente ni manejar sus propios datos.

## 🎯 Objetivo

- ✅ **Integridad referencial**: Cuando se crea una OC, se suma automáticamente a los gastos de la obra
- ✅ **Datos centralizados**: Un solo lugar para toda la información
- ✅ **Actualización automática**: Los totales se recalculan automáticamente
- ✅ **Sincronización**: Todos los módulos ven los mismos datos

## 📁 Estructura

```
/src/data/              → Archivos JSON iniciales
  - obras.json
  - requisiciones.json
  - ordenesCompra.json
  - pagos.json
  - destajos.json
  - proveedores.json

/src/services/
  - database.ts         → Servicio centralizado (Singleton)
  - README.md          → Este archivo
```

## 🚀 Uso Básico

### Importar el servicio

```typescript
import { db } from '@/services/database';
```

### Ejemplos de uso

#### 1️⃣ **OBRAS**

```typescript
// Obtener todas las obras
const obras = db.getObras();

// Obtener una obra específica
const obra = db.getObraByCode('227');

// Crear una nueva obra
const nuevaObra = db.createObra({
  code: '234',
  name: 'NUEVA OBRA',
  client: 'Cliente SA',
  contractNumber: 'CONT-2025-999',
  contractAmount: 5000000,
  advancePercentage: 30,
  retentionPercentage: 5,
  startDate: '2025-01-15',
  estimatedEndDate: '2025-12-31',
  resident: 'Ing. Juan Pérez',
  residentInitials: 'JP',
  residentPassword: 'jp2025',
  status: 'Activa',
  actualBalance: 0,
  totalEstimates: 0,
  totalExpenses: 0,
});

// Actualizar una obra
db.updateObra('227', {
  actualBalance: 2000000,
});

// Archivar una obra
db.updateObra('227', {
  status: 'Archivada',
});
```

#### 2️⃣ **REQUISICIONES**

```typescript
// Crear una requisición
const requisicion = db.createRequisicion({
  codigoRequisicion: db.generarCodigoRequisicion('227'),
  obraCode: '227',
  obraNombre: 'CASTELLO E',
  residente: 'Ing. Miguel Ángel Torres',
  residenteIniciales: 'MAT',
  fecha: new Date().toISOString(),
  materiales: [
    {
      concepto: 'Cemento gris 50kg',
      unidad: 'bulto',
      cantidad: 100,
      precioUnitario: 185,
      total: 18500,
    }
  ],
  total: 18500,
  status: 'Pendiente',
});

// Obtener requisiciones de una obra
const reqsObra = db.getRequisicionesByObra('227');

// Actualizar estado
db.updateRequisicion(requisicion.id, {
  status: 'Aprobada',
});
```

#### 3️⃣ **ÓRDENES DE COMPRA** ⚠️ IMPORTANTE

```typescript
// Crear una OC (SE SUMA AUTOMÁTICAMENTE A LA OBRA)
const oc = db.createOrdenCompra({
  codigoOC: db.generarCodigoOC('227', 'JR', 'Aceros del Norte'),
  obraCode: '227',
  obraNombre: 'CASTELLO E',
  proveedor: 'Aceros del Norte SA',
  proveedorId: 'PROV-001',
  comprador: 'Juan Ramírez',
  compradorIniciales: 'JR',
  fecha: new Date().toISOString(),
  fechaEntrega: '2025-02-01',
  materiales: [
    {
      concepto: 'Varilla 3/8"',
      unidad: 'ton',
      cantidad: 5,
      precioUnitario: 18000,
      total: 90000,
    }
  ],
  subtotal: 90000,
  iva: 14400,
  total: 104400,
  formaPago: 'Crédito',
  diasCredito: 30,
  status: 'Pendiente',
  montoPagado: 0,
  saldoPendiente: 104400,
  requisicionesVinculadas: [requisicion.id],
});

// ✅ LA OBRA SE ACTUALIZA AUTOMÁTICAMENTE:
// obra.totalExpensesFromOCs += 104400
// obra.totalExpenses += 104400
```

#### 4️⃣ **PAGOS** ⚠️ IMPORTANTE

```typescript
// Registrar un pago (ACTUALIZA LA OC AUTOMÁTICAMENTE)
const pago = db.createPago({
  fecha: new Date().toISOString(),
  ordenCompraId: oc.id,
  codigoOC: oc.codigoOC,
  proveedor: oc.proveedor,
  monto: 50000,
  metodoPago: 'Transferencia',
  referencia: 'TRANSF-12345',
  banco: 'BBVA',
  cuentaBancaria: '012345678901234567',
});

// ✅ LA OC SE ACTUALIZA AUTOMÁTICAMENTE:
// oc.montoPagado = 50000
// oc.saldoPendiente = 54400
// oc.status = 'Parcial'

// Si pagas el total:
const pago2 = db.createPago({
  fecha: new Date().toISOString(),
  ordenCompraId: oc.id,
  codigoOC: oc.codigoOC,
  proveedor: oc.proveedor,
  monto: 54400,
  metodoPago: 'Transferencia',
  referencia: 'TRANSF-12346',
});

// ✅ AHORA:
// oc.montoPagado = 104400
// oc.saldoPendiente = 0
// oc.status = 'Pagada'
```

#### 5️⃣ **DESTAJOS** ⚠️ IMPORTANTE

```typescript
// Crear carga semanal de destajos
const carga = db.createCargaDestajo({
  id: Date.now().toString(),
  fecha: new Date().toISOString(),
  semana: 'Semana 2 - Enero 2025',
  obras: [
    {
      codigoObra: '227',
      nombreObra: 'CASTELLO E',
      destajistas: [
        { inicial: 'AC', nombre: 'Arturo Carmona', importe: 15000 },
        { inicial: 'JR', nombre: 'Juan Rodríguez', importe: 8500 },
      ],
      totalObra: 23500,
    }
  ],
  totalGeneral: 23500,
  archivoNombre: 'destajos-semana2.xlsx',
});

// ✅ LA OBRA SE ACTUALIZA AUTOMÁTICAMENTE:
// obra.totalExpensesFromDestajos += 23500
// obra.totalExpenses += 23500
```

#### 6️⃣ **PROVEEDORES**

```typescript
// Crear proveedor
const proveedor = db.createProveedor({
  nombre: 'Nuevo Proveedor SA',
  rfc: 'NPR123456AB7',
  contacto: 'Lic. María López',
  telefono: '555-1234-5678',
  email: 'ventas@nuevoproveedor.com',
  lineaCredito: 500000,
  diasCredito: 30,
  vencimientoLinea: '2025-12-31',
  saldoPendiente: 0,
});

// Obtener todos
const proveedores = db.getProveedores();
```

#### 7️⃣ **ESTADÍSTICAS GLOBALES**

```typescript
const stats = db.getEstadisticasGlobales();
console.log(stats);
// {
//   totalObrasActivas: 7,
//   totalContratos: 39550000,
//   totalSaldo: 11015000,
//   totalEstimaciones: 13480000,
//   totalGastos: 2465000,
//   totalGastosOCs: 104400,
//   totalGastosDestajos: 23500,
//   totalRequisiciones: 1,
//   totalOrdenesCompra: 1,
//   totalProveedores: 5
// }
```

## ⚠️ REGLAS IMPORTANTES

### ❌ **NO HACER:**

```typescript
// ❌ NO usar localStorage directamente
localStorage.setItem('obras', JSON.stringify(obras));

// ❌ NO manejar datos localmente en componentes
const [obras, setObras] = useState([]);
```

### ✅ **SÍ HACER:**

```typescript
// ✅ Usar el servicio centralizado
import { db } from '@/services/database';

const obras = db.getObras();
```

## 🔄 Actualización Automática de Totales

El servicio **recalcula automáticamente** los totales cuando:

1. Se crea una **Orden de Compra** → Se suma a `totalExpensesFromOCs` de la obra
2. Se crea un **Pago** → Se actualiza el estado de la OC
3. Se carga **Destajos** → Se suma a `totalExpensesFromDestajos` de la obra
4. Se actualiza una **OC** → Se recalculan totales de obra y proveedor

## 🧪 Testing

```typescript
// Verificar que los totales se calculan correctamente
const obraAntes = db.getObraByCode('227');
console.log('Gastos antes:', obraAntes?.totalExpenses); // 525000

// Crear OC
db.createOrdenCompra({...});

const obraDespues = db.getObraByCode('227');
console.log('Gastos después:', obraDespues?.totalExpenses); // 629400 ✅
```

## 📊 Diagrama de Relaciones

```
OBRAS
  ├── REQUISICIONES (muchas)
  ├── ÓRDENES DE COMPRA (muchas) → Actualiza totalExpensesFromOCs
  └── DESTAJOS (muchas) → Actualiza totalExpensesFromDestajos

ÓRDENES DE COMPRA
  ├── OBRA (una)
  ├── PROVEEDOR (uno)
  ├── REQUISICIONES (muchas)
  └── PAGOS (muchos) → Actualiza montoPagado y status

PROVEEDORES
  └── ÓRDENES DE COMPRA (muchas) → Actualiza saldoPendiente
```

## 🚀 Próximos Pasos

1. Migrar todos los componentes para usar `db` en lugar de `localStorage`
2. Agregar validaciones y manejo de errores
3. Implementar backup automático
4. Agregar sistema de logs/auditoría
