# ⚡ Quick Start - Dev Mode Toggle

## 🎯 ¿Qué acabamos de crear?

Un **botón mágico en el header** que te permite ver TODOS los módulos del ERP en diferentes estados:

```
┌──────────────────────────────────────────────┐
│  [🎨 Con Datos Mock ▼]  ← ESTE BOTÓN         │
│                                              │
│  ┌─────────────────────────────────┐        │
│  │ ✅ Con Datos Mock (7 obras)     │        │
│  │ ❌ Sin Datos (Empty states)     │        │
│  │ ⏳ Cargando... (Skeletons)      │        │
│  │ ⚠️  Error de Red                │        │
│  └─────────────────────────────────┘        │
└──────────────────────────────────────────────┘
```

---

## 🚀 Pruébalo AHORA en 30 segundos

### **Paso 1: Entra a cualquier módulo**
1. Haz clic en "Dashboard Global" desde el inicio
2. O entra a "Gestión de Proveedores"
3. O cualquier otro módulo

### **Paso 2: Busca el botón en el header**
```
Está arriba a la derecha, dice:
[🎨 Con Datos Mock ▼]
```

### **Paso 3: Haz clic y prueba los modos**

#### **Modo 1: Sin Datos (Empty)**
```
Verás:
🏗️ No hay obras registradas
   Comienza creando tu primera obra
   [+ Nueva Obra]
```

#### **Modo 2: Cargando**
```
Verás:
┌─────────────┐
│ ░░░░░░░░░░  │  ← Skeletons animados
│ ░░░░░░░░░░  │
└─────────────┘
```

#### **Modo 3: Error de Red**
```
Verás:
⚠️ Error de Red
   No se pudo conectar con el servidor
   [Reintentar]
```

#### **Modo 4: Con Datos Mock (volver a normal)**
```
Verás:
✅ Todos los datos de ejemplo
   7 obras, 6 proveedores, etc.
```

---

## 📸 Capturas de Pantalla por Módulo

### **1. Dashboard Global**

#### Con Datos:
```
📊 Obras Activas: 7
💰 Presupuesto Total: $53.7M
📦 Comprometido: $165K
💸 Pagado: $65K

[Grid de 7 obras con datos]
```

#### Sin Datos (Empty):
```
🏗️ No hay obras registradas
   Comienza creando tu primera obra
   para gestionar compras y pagos
   
   [+ Nueva Obra]
```

---

### **2. Gestión de Proveedores**

#### Con Datos:
```
Catálogo de Proveedores (6)

┌─────────────────┐ ┌─────────────────┐
│ CEMEX           │ │ LEVANTE         │
│ Materiales      │ │ Acero           │
│ ✅ Activo       │ │ ✅ Activo       │
└─────────────────┘ └─────────────────┘
```

#### Sin Datos (Empty):
```
👤 No hay proveedores registrados
   Agrega tu primer proveedor para
   comenzar a crear órdenes de compra
   
   [+ Agregar Proveedor]
```

---

### **3. Órdenes de Compra**

#### Con Datos:
```
Órdenes de Compra (6)

┌──────────────────────────────┐
│ 227-A01GM-CEMEX              │
│ $40,078.00 • APROBADA        │
│ Cemento CPO - 80 tons        │
└──────────────────────────────┘
```

#### Sin Datos (Empty):
```
📦 No hay órdenes de compra
   Crea tu primera OC a partir de
   una requisición aprobada
   
   [Ver Requisiciones]
```

---

### **4. Requisiciones de Material**

#### Con Datos:
```
Requisiciones Pendientes (5)

┌──────────────────────────────┐
│ 🔴 REQ227-001MAT • URGENTE   │
│ Obra 227 - Tláhuac           │
│ 2 items • Cemento + Varilla  │
└──────────────────────────────┘
```

#### Sin Datos (Empty):
```
📋 No hay requisiciones pendientes
   Los residentes pueden crear
   requisiciones desde su dashboard
   de obra
```

---

### **5. Módulo de Pagos**

#### Con Datos:
```
Pagos Registrados (3)
Total Pagado: $65,349.00

┌──────────────────────────────┐
│ PAG-227-001                  │
│ CEMEX • $20,039.00           │
│ Transferencia • 15/01/2025   │
└──────────────────────────────┘
```

#### Sin Datos (Empty):
```
💸 No hay pagos registrados
   Los pagos aparecerán aquí una vez
   que se generen órdenes de compra
   y se procesen facturas
```

---

## 🎬 Demo: Flujo Completo

### **Escenario: Sistema desde cero**

```bash
# 1. Cambiar a modo Empty
[🎨 Con Datos Mock ▼] → "Sin Datos (Empty)"

# 2. Ver Dashboard Global
→ No hay obras registradas

# 3. Ver Gestión de Proveedores  
→ No hay proveedores registrados

# 4. Ver Órdenes de Compra
→ No hay órdenes de compra

# 5. Ver Requisiciones
→ No hay requisiciones pendientes

# 6. Ver Pagos
→ No hay pagos registrados

✨ TODOS muestran empty states con CTAs
```

### **Escenario: Sistema con datos**

```bash
# 1. Cambiar a modo Con Datos Mock
[🎨 Sin Datos ▼] → "Con Datos Mock"

# 2. Ver Dashboard Global
→ 7 obras activas, métricas, gráficas

# 3. Ver Gestión de Proveedores
→ 6 proveedores con datos completos

# 4. Ver Órdenes de Compra
→ 6 OCs con diferentes estados

# 5. Ver Requisiciones
→ 5 requisiciones (2 urgentes)

# 6. Ver Pagos
→ 3 pagos aplicados

✨ TODOS muestran datos realistas
```

---

## ⚡ Atajos de Teclado (Futuro)

```
Cmd/Ctrl + D → Alternar Con Datos / Sin Datos
Cmd/Ctrl + L → Modo Loading
Cmd/Ctrl + E → Modo Error
Cmd/Ctrl + R → Reset (Con Datos Mock)
```

---

## 🎯 Testing Checklist Rápido

Para cada módulo nuevo que crees:

```
□ Con Datos Mock → ¿Se ven bien los datos?
□ Sin Datos → ¿Hay empty state + CTA?
□ Cargando → ¿Hay skeletons animados?
□ Error → ¿Hay mensaje + retry?
```

---

## 💡 Casos de Uso

### **1. Presentación a Cliente**
```
Modo: Con Datos Mock
Toggle Latencia: ON (realismo)

"Mira cómo se ve el sistema completo con datos reales"
```

### **2. Testing de UX**
```
Modo: Sin Datos (Empty)
Toggle Latencia: OFF (rapidez)

"¿Qué pasa si el usuario no tiene nada creado?"
```

### **3. QA de Errores**
```
Modo: Error de Red
Toggle Latencia: ON

"¿Cómo manejamos fallos de conexión?"
```

### **4. Validación de Loading**
```
Modo: Cargando
Toggle Latencia: ON

"¿Los skeletons se ven profesionales?"
```

---

## 🔥 Próximas Funcionalidades

- [ ] **Modo "Pocos Datos"** (1-2 registros solamente)
- [ ] **Modo "Muchos Datos"** (100+ registros para scroll)
- [ ] **Modo "Datos Corruptos"** (testing de validación)
- [ ] **Persistir modo** entre recargas (localStorage)
- [ ] **Atajos de teclado** para cambiar rápido
- [ ] **Modo "Demo"** con tour guiado

---

## 📊 Comparación: Antes vs Después

### **❌ ANTES (sin Dev Mode Toggle)**
```
- Editar /src/core/config.ts manualmente
- Cambiar TEST_EMPTY_STATE = true
- Guardar archivo
- Esperar hot reload
- Repetir para cada cambio
- No ver loading states fácilmente
- No simular errores sin código
```

### **✅ DESPUÉS (con Dev Mode Toggle)**
```
- Hacer clic en botón
- Seleccionar modo
- Cambio instantáneo
- Ver todos los estados en segundos
- Sin editar código
- Sin esperar reloads
- Flujo de testing 10x más rápido
```

---

## 🎨 UI del Toggle

```
┌──────────────────────────────────────┐
│ 🎨 Modo de Visualización             │
│ Cambia entre estados para testing    │
├──────────────────────────────────────┤
│                                      │
│ [●] Con Datos Mock                   │
│     7 obras, 6 OCs, 3 pagos         │
│                                      │
│ [ ] Sin Datos (Empty)                │
│     Ver empty states + CTAs          │
│                                      │
│ [ ] Cargando...                      │
│     Loading state permanente         │
│                                      │
│ [ ] Error de Red                     │
│     Simular fallo de conexión        │
│                                      │
├──────────────────────────────────────┤
│ ⚡ Simular latencia de red     [ON]  │
│    Delay activo (200-600ms)          │
├──────────────────────────────────────┤
│ 💡 Usa Empty para ver cómo se ve     │
│    el sistema desde cero             │
└──────────────────────────────────────┘
```

---

## 🚀 ¡Empieza Ahora!

1. Abre la aplicación
2. Entra a cualquier módulo
3. Busca el botón `[🎨 Con Datos Mock ▼]`
4. Haz clic y prueba todos los modos
5. Observa cómo cambia la UI instantáneamente

**No necesitas editar ningún archivo de código nunca más para testing de estados UI** 🎉

---

**Creado:** 2025-01-30  
**Versión:** 1.0.0  
**Tiempo de setup:** 0 minutos (ya está listo)
