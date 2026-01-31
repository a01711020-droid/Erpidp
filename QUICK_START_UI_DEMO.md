# ⚡ QUICK START - UI Demo System

## 🚀 En 3 pasos

### 1. Inicia la app
```bash
npm run dev
```

### 2. Explora
- Verás la **Homepage** con módulos disponibles
- Haz click en **"Dashboard Global"** o **"Gestión de Proveedores"**

### 3. Cambia de modo
Usa los botones del header para ver los 3 estados:

```
[Con Datos Mock]  [Sin Datos (Empty)]  [Cargando...]
    Verde              Naranja              Azul
```

---

## 📸 Lo que verás

### Dashboard Global

#### 🟢 Con Datos Mock
```
Obras Activas: 7
Presupuesto Total: $69.6M

┌─────────┐ ┌─────────┐ ┌─────────┐
│ 227     │ │ 228     │ │ 229     │
│ TLÁHUAC │ │ ECATEPEC│ │XOCHIMILCO│
└─────────┘ └─────────┘ └─────────┘
... 4 más
```

#### 🟠 Sin Datos (Empty)
```
        🏗️
  No hay obras registradas
  Comienza creando tu primera obra
  
     [+ Nueva Obra]
```

#### 🔵 Cargando
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │
│ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │
└─────────┘ └─────────┘ └─────────┘
   ⏳ Cargando obras...
```

---

### Gestión de Proveedores

#### 🟢 Con Datos Mock
```
Proveedores Activos: 6

┌────────────┐ ┌────────────┐ ┌────────────┐
│ CEMEX      │ │ LEVANTE    │ │ ANIXTER    │
│ Materiales │ │ Acero      │ │ Eléctrico  │
└────────────┘ └────────────┘ └────────────┘
... 3 más
```

#### 🟠 Sin Datos (Empty)
```
        👥
 No hay proveedores registrados
 Agrega tu primer proveedor para
 comenzar a crear órdenes de compra
 
  [+ Agregar Proveedor]
```

#### 🔵 Cargando
```
┌────────────┐ ┌────────────┐ ┌────────────┐
│ ░░░░░░░░░░ │ │ ░░░░░░░░░░ │ │ ░░░░░░░░░░ │
│ ░░░░░░░░░░ │ │ ░░░░░░░░░░ │ │ ░░░░░░░░░░ │
└────────────┘ └────────────┘ └────────────┘
  ⏳ Cargando proveedores...
```

---

## 🎯 Casos de Uso

### Para Demos a Clientes
```bash
1. Selecciona módulo
2. Modo: [Con Datos Mock] (Verde)
3. Muestra el sistema completo funcionando
```

### Para Validar Empty States
```bash
1. Selecciona módulo
2. Modo: [Sin Datos (Empty)] (Naranja)
3. Verifica mensajes y CTAs
```

### Para Revisar Skeletons
```bash
1. Selecciona módulo
2. Modo: [Cargando...] (Azul)
3. Valida animaciones y estructura
```

---

## 🏗️ Estructura de Carpetas

```
/src/
  ├── app-full/              ← Datos completos
  │   ├── GlobalDashboard.tsx
  │   └── PurchaseOrderManagement.tsx
  │
  ├── app-empty/             ← Empty states
  │   ├── GlobalDashboard.tsx
  │   └── PurchaseOrderManagement.tsx
  │
  ├── app-loading/           ← Skeletons
  │   ├── GlobalDashboard.tsx
  │   └── PurchaseOrderManagement.tsx
  │
  └── AppSwitcher.tsx        ← Control central
```

---

## ⚙️ Activar/Desactivar Demo Mode

En `/src/app/App.tsx` línea 9:

```typescript
const USE_DEMO_MODE = true;  // ← Demo activo
const USE_DEMO_MODE = false; // ← App normal
```

---

## 📊 Módulos Disponibles

| Módulo | FULL | EMPTY | LOADING |
|--------|------|-------|---------|
| Dashboard Global | ✅ | ✅ | ✅ |
| Gestión Proveedores | ✅ | ✅ | ✅ |
| Órdenes de Compra | ⏳ | ⏳ | ⏳ |
| Requisiciones | ⏳ | ⏳ | ⏳ |
| Pagos | ⏳ | ⏳ | ⏳ |

---

## 💡 Tips Rápidos

1. **Compara visualmente:** Cambia rápido entre modos para ver diferencias
2. **Sin delays:** Todo es instantáneo, no hay simulación de latencia
3. **Vuelve al inicio:** Click en "← Volver al Inicio" para cambiar de módulo
4. **Enfoque simple:** Son 3 versiones estáticas, no hay magia

---

## 🎬 Video Mental del Flow

```
[INICIO]
   ↓
Seleccionas "Dashboard Global"
   ↓
Ves versión FULL (7 obras)
   ↓
Click en botón [Sin Datos (Empty)]
   ↓
Ves empty state con CTA
   ↓
Click en botón [Cargando...]
   ↓
Ves 6 skeletons animados
   ↓
Click en botón [Con Datos Mock]
   ↓
Vuelves a ver 7 obras
   ↓
Click en "← Volver al Inicio"
   ↓
Seleccionas "Gestión de Proveedores"
   ↓
Repites el ciclo...
```

---

## ✅ Checklist de Testing

Para cada módulo nuevo:

```
□ Versión FULL creada con datos mock
□ Versión EMPTY creada con CTA claro
□ Versión LOADING creada con skeletons
□ Agregado a AppSwitcher.tsx
□ Agregado a HomePage modules array
□ Probado cambio entre los 3 modos
□ Skeletons coinciden con estructura FULL
```

---

## 🚨 Troubleshooting

### No veo el switcher
**CHECK:** `USE_DEMO_MODE = true` en App.tsx

### Imports fallan
**CHECK:** Rutas correctas `@/app-full/`, `@/app-empty/`, `@/app-loading/`

### Botones no funcionan
**CHECK:** Módulo agregado en `renderModule()` del AppSwitcher

---

## 🎉 ¡Eso es todo!

**Simple. Visual. Efectivo.**

No hay complejidad innecesaria. Solo 3 carpetas con versiones estáticas que cambias con 1 click.

---

**Última actualización:** 2025-01-30  
**Tiempo de setup:** 0 minutos (ya está listo)  
**Complejidad:** ⭐☆☆☆☆ (Muy simple)
