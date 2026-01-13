# 📊 DATOS DE PRUEBA (MOCK DATA)

## 🎯 RESUMEN

La base de datos ahora contiene **datos de prueba realistas** que simulan 1 mes de operación de la empresa constructora. Todo está conectado y los totales son correctos.

---

## 📈 ESTADÍSTICAS GENERALES

### **Obras Activas: 7**
- 227 - CASTELLO E
- 228 - CASTELLO F  
- 229 - CASTELLO G
- 230 - CASTELLO H
- 231 - DOZA A
- 232 - BALVANERA
- 233 - DOZA C (sin actividad aún)

### **Datos Cargados:**
- ✅ **7 Requisiciones** (de 5 obras diferentes)
- ✅ **7 Órdenes de Compra** (totalizando $396,302.40)
- ✅ **4 Pagos** (totalizando $115,656.40)
- ✅ **3 Cargas de Destajos** (3 semanas de enero, totalizando $705,000)
- ✅ **5 Proveedores** (con saldos pendientes)

---

## 🏗️ DETALLE POR OBRA

### **OBRA 227 - CASTELLO E**

**Gastos Totales: $312,584.40**
- Gastos por OCs: $148,584.40
- Gastos por Destajos: $164,000

**Órdenes de Compra (3):**
1. `227-A1JR-CEM` - $41,864.40 → ✅ **PAGADA**
   - Cemento, arena, grava
   - Proveedor: Cementos y Agregados SA
   - Vinculada a: REQ227-1MAT
   
2. `227-A2JR-ACE` - $76,734.00 → ⚠️ **PARCIAL** (pagado $40,000)
   - Varilla 3/8", alambrón
   - Proveedor: Aceros del Norte SA
   - Saldo pendiente: $36,734
   - Vinculada a: REQ227-2MAT
   
3. `227-A3MC-CEM` - $29,986.00 → ⏳ **PENDIENTE**
   - Cemento blanco, yeso
   - Proveedor: Cementos y Agregados SA

**Destajos (3 semanas):**
- Semana 1: $55,000 (4 destajistas)
- Semana 2: $66,000 (5 destajistas)
- Semana 3: $43,000 (3 destajistas)

**Requisiciones (2):**
- REQ227-1MAT → ✅ Completada
- REQ227-2MAT → ✅ Completada

---

### **OBRA 228 - CASTELLO F**

**Gastos Totales: $235,222.00**
- Gastos por OCs: $52,722.00
- Gastos por Destajos: $182,500.00

**Órdenes de Compra (2):**
1. `228-A1MC-MAT` - $33,930.00 → ⏳ **PENDIENTE**
   - Material eléctrico
   - Proveedor: Materiales Eléctricos del Centro
   - Vinculada a: REQ228-2LM
   
2. `228-A2JR-FER` - $18,792.00 → ✅ **PAGADA**
   - Tornillos, clavos, herramienta
   - Proveedor: Ferreterías Industriales SA
   - Pago en efectivo

**Destajos (3 semanas):**
- Semana 1: $52,500 (3 destajistas)
- Semana 2: $57,500 (3 destajistas)
- Semana 3: $72,500 (4 destajistas)

**Requisiciones (2):**
- REQ228-1LM → ✅ Aprobada
- REQ228-2LM → ⚠️ En Proceso

---

### **OBRA 229 - CASTELLO G**

**Gastos Totales: $119,500.00**
- Gastos por OCs: $0
- Gastos por Destajos: $119,500.00

**Destajos (2 semanas):**
- Semana 2: $49,000 (2 destajistas)
- Semana 3: $70,500 (3 destajistas)

**Requisiciones (1):**
- REQ229-1RS → ⏳ Pendiente (concreto para losa - URGENTE)

---

### **OBRA 230 - CASTELLO H**

**Gastos Totales: $292,996.00**
- Gastos por OCs: $194,996.00
- Gastos por Destajos: $98,000.00

**Órdenes de Compra (2):**
1. `230-A1JR-PIN` - $27,086.00 → ⚠️ **PARCIAL** (pagado $15,000)
   - Pintura, sellador, brochas
   - Proveedor: Pinturas y Recubrimientos SA
   - Saldo pendiente: $12,086
   - Vinculada a: REQ230-1PG
   
2. `230-A2MC-ACE` - $167,910.00 → ⏳ **PENDIENTE**
   - Varilla 1/2" y 5/8"
   - Proveedor: Aceros del Norte SA

**Destajos (3 semanas):**
- Semana 1: $32,500 (2 destajistas)
- Semana 2: $32,000 (2 destajistas)
- Semana 3: $33,500 (2 destajistas)

**Requisiciones (1):**
- REQ230-1PG → ✅ Completada

---

### **OBRA 231 - DOZA A**

**Gastos Totales: $36,000.00**
- Gastos por OCs: $0
- Gastos por Destajos: $36,000.00

**Destajos (1 semana):**
- Semana 3: $36,000 (2 destajistas)

---

### **OBRA 232 - BALVANERA**

**Gastos Totales: $105,000.00**
- Gastos por OCs: $0
- Gastos por Destajos: $105,000.00

**Destajos (2 semanas):**
- Semana 2: $43,500 (2 destajistas)
- Semana 3: $61,500 (3 destajistas)

**Requisiciones (1):**
- REQ232-1SV → ✅ Aprobada (loseta cerámica)

---

### **OBRA 233 - DOZA C**

**Gastos Totales: $0**
- Sin actividad registrada (obra muy reciente)

---

## 💰 PROVEEDORES

### **PROV-001 - Aceros del Norte SA**
- Línea de crédito: $500,000
- Días de crédito: 30
- **Saldo pendiente: $204,644** 
  - OC 227-A2JR-ACE: $36,734 (parcial)
  - OC 230-A2MC-ACE: $167,910 (pendiente)
- ⚠️ **75% de línea comprometida**

### **PROV-002 - Cementos y Agregados SA**
- Línea de crédito: $750,000
- Días de crédito: 45
- **Saldo pendiente: $29,986**
  - OC 227-A3MC-CEM: $29,986 (pendiente)
- ✅ **Solo 4% de línea comprometida**

### **PROV-003 - Materiales Eléctricos del Centro**
- Línea de crédito: $300,000
- Días de crédito: 30
- **Saldo pendiente: $33,930**
  - OC 228-A1MC-MAT: $33,930 (pendiente)
- ⚠️ **Vencimiento línea: 2025-06-30** (alerta próxima)

### **PROV-004 - Ferreterías Industriales SA**
- Línea de crédito: $400,000
- Días de crédito: 30
- **Saldo pendiente: $0**
- ✅ **Al corriente en pagos**

### **PROV-005 - Pinturas y Recubrimientos SA**
- Línea de crédito: $200,000
- Días de crédito: 15
- **Saldo pendiente: $12,086**
  - OC 230-A1JR-PIN: $12,086 (parcial)

---

## 📋 REQUISICIONES

### **Estados:**
- ✅ Completadas: 3
- ✅ Aprobadas: 2
- ⚠️ En Proceso: 1
- ⏳ Pendientes: 1

### **Por Residente:**
- MAT (Miguel Ángel Torres - Obra 227): 2 requisiciones
- LM (Laura Martínez - Obra 228): 2 requisiciones
- PG (Patricia Gómez - Obra 230): 1 requisición
- RS (Roberto Sánchez - Obra 229): 1 requisición
- SV (Sofia Vargas - Obra 232): 1 requisición

---

## 💳 ÓRDENES DE COMPRA

### **Resumen:**
- Total OCs generadas: **$396,302.40**
- Total pagado: **$115,656.40** (29.2%)
- Total pendiente: **$280,646.00** (70.8%)

### **Por Estado:**
- ✅ Pagadas: 2 OCs ($60,656.40)
- ⚠️ Parciales: 2 OCs ($103,820.00 total, $55,000 pagado)
- ⏳ Pendientes: 3 OCs ($231,826.00)

### **Por Comprador:**
- JR (Juan Ramírez): 5 OCs
- MC (María Castro): 2 OCs

### **Por Forma de Pago:**
- Crédito: 6 OCs
- Efectivo: 1 OC

---

## 💸 PAGOS

### **Total Pagado: $115,656.40**

1. **$41,864.40** - Transferencia BBVA
   - OC: 227-A1JR-CEM (Cementos)
   - ✅ Liquidó completamente la OC
   
2. **$40,000.00** - Transferencia Santander
   - OC: 227-A2JR-ACE (Aceros)
   - ⚠️ Pago parcial 50%
   
3. **$15,000.00** - Cheque Banamex
   - OC: 230-A1JR-PIN (Pinturas)
   - ⚠️ Pago parcial contra entrega
   
4. **$18,792.00** - Efectivo
   - OC: 228-A2JR-FER (Ferretería)
   - ✅ Pago completo contra entrega

---

## 👷 DESTAJOS

### **Total Destajos: $705,000** (3 semanas)

**Semana 1 - Enero 2025: $140,000**
- 3 obras activas
- 9 destajistas únicos

**Semana 2 - Enero 2025: $248,000**
- 5 obras activas
- 12 destajistas únicos

**Semana 3 - Enero 2025: $317,000**
- 6 obras activas
- 16 destajistas únicos

### **Destajistas Más Activos:**
1. **Pedro Ramírez (PR)** - $72,000 en 3 semanas
2. **Gustavo Mendoza (GM)** - $58,000 en 2 semanas
3. **Luis García (LG)** - $54,500 en 3 semanas
4. **Eduardo Castro (EC)** - $52,000 en 2 semanas
5. **Carlos Flores (CF)** - $54,000 en 3 semanas

---

## 🔄 FLUJOS DE DATOS DEMOSTRADOS

### **1. Requisición → OC → Pago (Flujo completo)**
```
REQ227-1MAT (Cemento)
  ↓
227-A1JR-CEM ($41,864.40)
  ↓
Pago transferencia $41,864.40
  ↓
OC marcada como PAGADA ✅
Obra 227 gastos += $41,864.40
```

### **2. OC → Pago Parcial**
```
227-A2JR-ACE ($76,734)
  ↓
Pago parcial $40,000
  ↓
OC marcada como PARCIAL ⚠️
Saldo pendiente: $36,734
```

### **3. Destajos → Gastos de Obra**
```
Carga Semana 1
  ↓
Obra 227: $55,000
Obra 228: $52,500
Obra 230: $32,500
  ↓
Se suman automáticamente a totalExpensesFromDestajos
```

---

## 🧪 CASOS DE PRUEBA INTERESANTES

### **1. Obra con Múltiples Fuentes de Gasto**
- **Obra 227**: Tiene OCs ($148K) + Destajos ($164K)
- Demuestra cómo se suman automáticamente

### **2. OC con Pago Parcial**
- **OC 227-A2JR-ACE**: Pago de $40K de $76K
- Demuestra status "Parcial"

### **3. Proveedor con Línea Comprometida**
- **Aceros del Norte**: $204K de $500K usados (40%)
- Demuestra alerta de crédito

### **4. Requisición Sin OC**
- **REQ229-1RS**: Pendiente, no ha generado OC
- Demuestra flujo incompleto

### **5. Obra Nueva Sin Actividad**
- **Obra 233**: Creada pero sin requisiciones/gastos
- Estado inicial limpio

### **6. Progresión Semanal de Destajos**
- 3 semanas consecutivas con crecimiento
- Destajistas recurrentes y nuevos

---

## 🎯 QUÉ PUEDES PROBAR

1. **Dashboard Global**
   - Ver totales consolidados
   - Distribución de gastos indirectos
   - Comparar gastos OCs vs Destajos

2. **Módulo de Requisiciones**
   - Ver requisiciones por estado
   - Filtrar por obra
   - Ver cuáles tienen OC generada

3. **Módulo de Órdenes de Compra**
   - Ver OCs pendientes de pago
   - Filtrar por proveedor
   - Ver vinculación con requisiciones

4. **Módulo de Pagos**
   - Ver histórico de pagos
   - Ver OCs con saldo pendiente
   - Registrar nuevo pago y ver cómo actualiza la OC

5. **Módulo de Destajos**
   - Ver 3 semanas de destajos
   - Análisis por obra
   - Análisis por destajista
   - Ver cómo se suma a gastos de obra

---

## 📊 TOTALES FINALES VERIFICADOS

### **Global Empresarial:**
- Total Gastos Directos: **$1,101,302.40**
  - De OCs: $396,302.40
  - De Destajos: $705,000.00
- Total Contratos: $39,550,000
- Total Estimaciones: $13,480,000

### **Saldos Pendientes:**
- Proveedores: $280,646.00
- OCs por pagar: $280,646.00 ✅ (coincide)

### **Integridad Verificada:**
✅ Suma de gastos por obra = Total gastos empresa
✅ Suma de saldos proveedores = Total OCs pendientes
✅ Total pagos = Total OCs pagadas + parciales
✅ Destajos por obra = Total destajos empresa

---

## 🚀 PRÓXIMO PASO

Usa estos datos para:
1. Probar el servicio de base de datos centralizado
2. Ver cómo se actualizan los totales automáticamente
3. Simular crear nuevas OCs y ver el efecto en las obras
4. Simular pagos y ver cómo cambia el estado
5. Migrar componentes actuales para usar `db` en lugar de localStorage

**¡Todo está listo para pruebas reales!** 🎉
