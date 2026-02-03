# 🎯 QUICK START - Sistema Integrado

## ✅ Lo que está FUNCIONANDO

### 🏠 Navegación Principal
```
HOME
 ├─→ Dashboard Global ✅
 │    └─→ Click obra → Contract Tracking ✅
 │             └─→ Ver Desglose → Expense Details ✅
 │
 ├─→ Requisiciones (3 estados) ✅
 ├─→ Órdenes de Compra (3 estados) ✅
 ├─→ Pagos (3 estados) ✅
 └─→ Proveedores (implícito en compras) ✅
```

---

## 🚀 Inicio Rápido

```bash
# 1. Asegúrate de que USE_DEMO_MODE = true en /src/app/App.tsx
# 2. Inicia
npm run dev

# 3. Navega
```

---

## 🎮 Guía de Prueba

### Test 1: Flujo Completo de Obra
```
1. HOME → Click "Dashboard Global"
2. Ver 7 obras en grid
3. Click "Abrir Dashboard" en obra 227
4. Ver "Seguimiento Físico de Contrato"
   - Info del contrato
   - Tabla de 5 estimaciones
   - Gastos semanales (8 semanas)
   - Indirectos proporcionales
5. Click "Ver Desglose Detallado"
6. Ver "Desglose Detallado de Gastos"
   - Selector de semanas
   - OCs pagadas por semana
   - Destajos por semana
7. Click "Volver" → Regresa a Contract Tracking
8. Click "Volver al Dashboard" → Regresa a Dashboard Global
```

### Test 2: Módulos con Toggle
```
1. HOME → Click "Requisiciones de Material"
2. Ver requisiciones con datos FULL
3. Click botón naranja "Sin Datos (Empty)"
4. Ver empty state
5. Click botón azul "Cargando..."
6. Ver skeletons animados
7. Click botón verde "Con Datos Mock"
8. Volver a ver datos FULL
9. Click "← Volver al Inicio"
10. Repetir con "Órdenes de Compra" y "Módulo de Pagos"
```

---

## 📋 Checklist de Funcionalidades

### ✅ Dashboard Global
- [x] Ver 7 obras en grid
- [x] Métricas globales (contratos, saldo, estimaciones)
- [x] Botón "Abrir Dashboard" funciona
- [x] Navega a Contract Tracking

### ✅ Contract Tracking
- [x] Header con info del contrato
- [x] Tabla de 5 estimaciones con montos
- [x] Gastos semanales (8 semanas)
- [x] Indirectos proporcionales calculados
- [x] Botón "Ver Desglose Detallado" funciona
- [x] Botón "Volver al Dashboard" funciona

### ✅ Expense Details
- [x] Selector de semanas (checkboxes)
- [x] Tabla de OCs pagadas por semana
- [x] Tabla de Destajos por semana
- [x] Totales calculados
- [x] Botón "Volver" funciona

### ✅ Módulos con Toggle
- [x] Requisiciones (FULL/EMPTY/LOADING)
- [x] Órdenes de Compra (FULL/EMPTY/LOADING)
- [x] Pagos (FULL/EMPTY/LOADING)
- [x] Proveedores (FULL/EMPTY/LOADING)
- [x] Botón "Volver al Inicio" funciona
- [x] Toggle verde/naranja/azul funciona

---

## 🎨 Módulos y sus Estados

| Módulo | FULL | EMPTY | LOADING | Toggle |
|--------|------|-------|---------|--------|
| Home | ✅ | - | - | ❌ |
| Dashboard Global | ✅ | - | - | ❌ |
| Contract Tracking | ✅ | - | - | ❌ |
| Expense Details | ✅ | - | - | ❌ |
| Requisiciones | ✅ | ✅ | ✅ | ✅ |
| Órdenes de Compra | ✅ | ✅ | ✅ | ✅ |
| Pagos | ✅ | ✅ | ✅ | ✅ |
| Proveedores | ✅ | ✅ | ✅ | ✅ |

---

## 📸 Capturas de Pantalla Esperadas

### Dashboard Global
```
┌─────────────────────────────────────────┐
│ Dashboard Empresarial                    │
│ [7 obras] [$69.6M] [$20.8M] [$27.8M]   │
├─────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐             │
│ │ 227  │ │ 228  │ │ 229  │  [7 obras] │
│ │$5.2M │ │$8.9M │ │$12.5M│             │
│ │[Abrir│ │[Abrir│ │[Abrir│             │
│ └──────┘ └──────┘ └──────┘             │
└─────────────────────────────────────────┘
```

### Contract Tracking
```
┌─────────────────────────────────────────┐
│ [← Volver] [Ver Desglose Detallado]     │
├─────────────────────────────────────────┤
│ Seguimiento Físico de Contrato          │
│                                          │
│ CONT-2025-078  |  $5.8M  |  242 días    │
├─────────────────────────────────────────┤
│ MOVIMIENTOS DEL CONTRATO                │
│ #  | Tipo | Fecha | Descripción | Monto│
│ 1  | Est. |15 Oct | Preliminares| $580K│
│ 2  | Est. |15 Nov | Estructura  | $820K│
│ 3  | Est. |15 Dic | Hidráulica  | $650K│
│ 4  | Est. |15 Ene | Eléctrica   | $720K│
│ 5  | Est. |09 Ene | Acabados    | $890K│
├─────────────────────────────────────────┤
│ GASTOS SEMANALES CON INDIRECTOS         │
│ Semana | OCs  | Nómina | Indirect| Total│
│ Sem 1  | $125K| $85K   | $7.2K   | $217K│
│ Sem 2  | $180K| $85K   | $7.2K   | $272K│
│ ... 6 semanas más                       │
└─────────────────────────────────────────┘
```

### Expense Details
```
┌─────────────────────────────────────────┐
│ [← Volver]  |  3 semanas seleccionadas  │
├─────────────────────────────────────────┤
│ Seleccionar Semanas                      │
│ [✓] Semana 1  [ ] Semana 2  [✓] Semana 3│
│ [✓] Semana 4  [ ] Semana 5  [ ] Semana 6│
├─────────────────────────────────────────┤
│ ÓRDENES DE COMPRA PAGADAS                │
│ OC    | Proveedor | Sem1  | Sem3 | Sem4 │
│ 227.. | CEMEX     | $42K  | -    | $38K │
│ 227.. | FERRET    | $28K  | $32K | -    │
├─────────────────────────────────────────┤
│ DESTAJOS PAGADOS                         │
│ Ini | Nombre    | Sem1  | Sem3  | Sem4  │
│ JM  | Juan M.   | $28K  | $30K  | $28K  │
│ CR  | Carlos R. | $32K  | $28K  | $30K  │
└─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### No veo el sistema integrado
**CHECK:** `USE_DEMO_MODE = true` en `/src/app/App.tsx` línea 9

### El botón "Abrir Dashboard" no funciona
**CHECK:** El Dashboard Global debe tener `onSelectProject` prop funcionando

### El toggle no aparece
**NORMAL:** Solo aparece en Requisiciones, Órdenes, Pagos y Proveedores

### Contract Tracking no se ve
**CHECK:** Debes hacer click en "Abrir Dashboard" de una obra primero

---

## 💡 Tips

1. **Home siempre está disponible** - Es el punto de partida
2. **Dashboard Global muestra todas las obras** - Click para ver detalle
3. **Contract Tracking es para UNA obra específica** - Usa botones para navegar
4. **Expense Details es hijo de Contract Tracking** - Siempre regresa ahí
5. **Los 4 módulos con toggle son independientes** - Prueba cada modo

---

## 🎯 Próximos Pasos (Opcional)

Si quieres mejorar:

1. ✅ **Ya funciona:** Navegación completa entre módulos
2. ✅ **Ya funciona:** Toggle de 3 estados en 4 módulos
3. ⏳ **Futuro:** Crear versiones EMPTY/LOADING de Contract Tracking
4. ⏳ **Futuro:** Crear versiones EMPTY/LOADING de Expense Details
5. ⏳ **Futuro:** Hacer funcionales los formularios (Agregar Movimiento, Nueva Obra)

---

**Estado:** ✅ SISTEMA INTEGRADO FUNCIONANDO  
**Última prueba:** 2025-01-30  
**Recomendación:** Prueba el flujo completo ahora mismo!
