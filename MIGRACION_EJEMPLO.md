# 🔄 Guía de Migración al Sistema Centralizado

## ❌ ANTES (usando localStorage directamente)

```typescript
// ❌ Componente antiguo
import { useState, useEffect } from 'react';

export default function MaterialRequisitions() {
  const [requisiciones, setRequisiciones] = useState([]);
  
  useEffect(() => {
    // ❌ Leer directamente de localStorage
    const saved = localStorage.getItem('requisiciones');
    if (saved) {
      setRequisiciones(JSON.parse(saved));
    }
  }, []);

  const handleCreate = (data) => {
    const newReq = {
      id: Date.now(),
      ...data,
    };
    
    const updated = [...requisiciones, newReq];
    setRequisiciones(updated);
    
    // ❌ Guardar directamente en localStorage
    localStorage.setItem('requisiciones', JSON.stringify(updated));
  };

  return (
    <div>
      {requisiciones.map(req => (
        <div key={req.id}>{req.codigoRequisicion}</div>
      ))}
    </div>
  );
}
```

## ✅ DESPUÉS (usando servicio centralizado)

```typescript
// ✅ Componente nuevo
import { useState, useEffect } from 'react';
import { db } from '@/services/database';
import type { Requisicion } from '@/types';

export default function MaterialRequisitions() {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  
  useEffect(() => {
    // ✅ Cargar desde el servicio centralizado
    loadRequisiciones();
  }, []);

  const loadRequisiciones = () => {
    const data = db.getRequisiciones();
    setRequisiciones(data);
  };

  const handleCreate = (data: Omit<Requisicion, 'id' | 'createdAt' | 'updatedAt'>) => {
    // ✅ Crear usando el servicio
    db.createRequisicion(data);
    
    // ✅ Recargar datos
    loadRequisiciones();
  };

  return (
    <div>
      {requisiciones.map(req => (
        <div key={req.id}>{req.codigoRequisicion}</div>
      ))}
    </div>
  );
}
```

## 📝 Ejemplo: Crear Orden de Compra

```typescript
import { db } from '@/services/database';

// 1. Obtener datos de obra
const obra = db.getObraByCode('227');

// 2. Obtener proveedor
const proveedor = db.getProveedorById('PROV-001');

// 3. Crear OC
const oc = db.createOrdenCompra({
  codigoOC: db.generarCodigoOC('227', 'JR', proveedor.nombre),
  obraCode: obra.code,
  obraNombre: obra.name,
  proveedor: proveedor.nombre,
  proveedorId: proveedor.id,
  comprador: 'Juan Ramírez',
  compradorIniciales: 'JR',
  fecha: new Date().toISOString(),
  fechaEntrega: '2025-02-15',
  materiales: [
    {
      concepto: 'Cemento gris 50kg',
      unidad: 'bulto',
      cantidad: 100,
      precioUnitario: 185,
      total: 18500,
    }
  ],
  subtotal: 18500,
  iva: 2960,
  total: 21460,
  formaPago: 'Crédito',
  diasCredito: proveedor.diasCredito,
  status: 'Pendiente',
  montoPagado: 0,
  saldoPendiente: 21460,
  requisicionesVinculadas: [],
});

// ✅ AUTOMÁTICAMENTE:
// - Se suma $21,460 a obra.totalExpensesFromOCs
// - Se suma $21,460 a obra.totalExpenses
// - Se suma $21,460 a proveedor.saldoPendiente

console.log('OC creada:', oc.codigoOC);

// 4. Verificar que se actualizó la obra
const obraActualizada = db.getObraByCode('227');
console.log('Gastos de la obra:', obraActualizada.totalExpenses); // ✅ Incluye los $21,460
```

## 📝 Ejemplo: Registrar Pago

```typescript
import { db } from '@/services/database';

// 1. Obtener la OC
const ocs = db.getOrdenesCompra();
const oc = ocs.find(o => o.codigoOC === '227-A1JR-ACE');

// 2. Registrar pago parcial
const pago1 = db.createPago({
  fecha: new Date().toISOString(),
  ordenCompraId: oc.id,
  codigoOC: oc.codigoOC,
  proveedor: oc.proveedor,
  monto: 10000,
  metodoPago: 'Transferencia',
  referencia: 'TRANSF-001',
  banco: 'BBVA',
  cuentaBancaria: '012345678901234567',
});

// ✅ AUTOMÁTICAMENTE:
// - oc.montoPagado = 10000
// - oc.saldoPendiente = 11460
// - oc.status = 'Parcial'

// 3. Completar el pago
const pago2 = db.createPago({
  fecha: new Date().toISOString(),
  ordenCompraId: oc.id,
  codigoOC: oc.codigoOC,
  proveedor: oc.proveedor,
  monto: 11460,
  metodoPago: 'Transferencia',
  referencia: 'TRANSF-002',
});

// ✅ AUTOMÁTICAMENTE:
// - oc.montoPagado = 21460
// - oc.saldoPendiente = 0
// - oc.status = 'Pagada'
```

## 📊 Ejemplo: Dashboard Global

```typescript
import { db } from '@/services/database';

export default function GlobalDashboard() {
  // ✅ Obtener estadísticas globales
  const stats = db.getEstadisticasGlobales();

  // ✅ Obtener todas las obras
  const obras = db.getObras();
  const obrasActivas = obras.filter(o => o.status === 'Activa');

  return (
    <div>
      <h1>Dashboard Global</h1>
      
      {/* Stats */}
      <div>
        <div>Obras Activas: {stats.totalObrasActivas}</div>
        <div>Total Contratos: ${stats.totalContratos.toLocaleString()}</div>
        <div>Total Gastos OCs: ${stats.totalGastosOCs.toLocaleString()}</div>
        <div>Total Gastos Destajos: ${stats.totalGastosDestajos.toLocaleString()}</div>
      </div>

      {/* Obras */}
      {obrasActivas.map(obra => (
        <div key={obra.code}>
          <h3>{obra.name}</h3>
          <p>Gastos OCs: ${obra.totalExpensesFromOCs.toLocaleString()}</p>
          <p>Gastos Destajos: ${obra.totalExpensesFromDestajos.toLocaleString()}</p>
          <p>Total Gastos: ${obra.totalExpenses.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Checklist de Migración

Para cada componente que uses localStorage:

- [ ] Importar `db` desde `@/services/database`
- [ ] Importar tipos desde `@/types`
- [ ] Reemplazar `localStorage.getItem()` con `db.getXXX()`
- [ ] Reemplazar `localStorage.setItem()` con `db.createXXX()` o `db.updateXXX()`
- [ ] Eliminar lógica manual de actualización de totales
- [ ] Probar que los datos se persisten correctamente
- [ ] Verificar que los totales se actualizan automáticamente

## 🚀 Próximos Componentes a Migrar

1. ✅ GlobalDashboard → Ya usa obras desde JSON, migrar a `db`
2. ✅ MaterialRequisitions → Migrar a `db.createRequisicion()`
3. ✅ PurchaseOrders → Migrar a `db.createOrdenCompra()`
4. ✅ PaymentsModule → Migrar a `db.createPago()`
5. ✅ DestajosManagement → Migrar a `db.createCargaDestajo()`
