# ⚡ QUICK START - ERP IDP (State-Driven)

## 🚀 **Inicio en 30 segundos**

```bash
# 1. Instalar
npm install

# 2. Ejecutar
npm run dev

# 3. ¡Listo! 
# La app está corriendo en http://localhost:5173
```

---

## 🎯 **Lo que necesitas saber YA**

### ✅ El sistema ahora tiene ESTADOS integrados

Cada pantalla puede mostrar 4 estados diferentes:

```
┌─────────────────────────────────────┐
│  LOADING   →  Skeletons animados    │
│  EMPTY     →  Sin datos + CTA       │
│  ERROR     →  Error + retry         │
│  DATA      →  UI completa           │
└─────────────────────────────────────┘
```

### ✅ NO hay toggle verde/naranja/azul

El sistema antiguo tenía 3 apps duplicadas con un toggle.  
**Eso ya NO existe.** Ahora es 1 app con estados integrados.

### ✅ Para cambiar estados

Edita `/src/app/MainApp.tsx`:

```typescript
// Cambiar Dashboard a estado vacío
<GlobalDashboard 
  initialState="empty"  // ← Cambia aquí
/>

// Cambiar Compras a loading
<PurchaseOrderManagement 
  initialState="loading"  // ← Cambia aquí
/>
```

---

## 📁 **Archivos clave**

```
/src/app/
  ├── MainApp.tsx              ← Navegación principal
  ├── GlobalDashboard.tsx      ← Dashboard de obras
  ├── PurchaseOrderManagement.tsx  ← Compras
  ├── MaterialRequisitions.tsx     ← Requisiciones
  ├── PaymentManagement.tsx        ← Pagos
  ├── ContractTracking.tsx         ← Seguimiento
  └── components/states/       ← Componentes de estado
      ├── LoadingState.tsx
      ├── EmptyState.tsx
      └── ErrorState.tsx
```

---

## 🎨 **Testing rápido de estados**

### Opción 1: Cambiar en código

```typescript
// En MainApp.tsx
<GlobalDashboard initialState="empty" />  // Ver estado vacío
<GlobalDashboard initialState="loading" />  // Ver loading
<GlobalDashboard initialState="error" />  // Ver error
<GlobalDashboard initialState="data" />  // Ver con datos (default)
```

### Opción 2: Ciclar estados con dev tools

Cada módulo tiene un `viewState` que puedes cambiar desde React DevTools.

---

## 🛠️ **Comandos útiles**

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Limpiar cache (si hay problemas)
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 **Docs rápidas**

| Quiero... | Lee... |
|-----------|--------|
| **Usar el sistema** | `/INSTRUCCIONES_USO.md` |
| **Entender la arquitectura** | `/RESTRUCTURACION_COMPLETADA.md` |
| **Ver diagramas** | `/RESUMEN_VISUAL.md` |
| **Resumen ejecutivo** | `/RESUMEN_EJECUTIVO.md` |
| **Esto** | `/QUICK_START.md` |

---

## 🔥 **Módulos principales**

| Módulo | Descripción | Empty State |
|--------|-------------|-------------|
| `GlobalDashboard` | Dashboard de todas las obras | ✅ 4 benefits |
| `PurchaseOrderManagement` | Órdenes de compra | ✅ 4 benefits |
| `MaterialRequisitions` | Requisiciones de obra | ✅ 4 benefits |
| `PaymentManagement` | Gestión de pagos | ✅ 4 benefits |
| `ContractTracking` | Seguimiento de contrato | ✅ 4 benefits |

**Todos tienen 4 estados:** loading, empty, error, data

---

## ⚠️ **Cosas que YA NO existen**

- ❌ `/app-full/` → Eliminada
- ❌ `/app-empty/` → Eliminada
- ❌ `/app-loading/` → Eliminada
- ❌ `AppSwitcher.tsx` → Eliminado
- ❌ Toggle verde/naranja/azul → Eliminado

---

## ✅ **Cosas NUEVAS**

- ✨ `/src/app/components/states/` → Componentes reutilizables
- ✨ `initialState` prop en todos los módulos
- ✨ Estados integrados (no separados)
- ✨ MainApp sin toggle
- ✨ Patrón consistente

---

## 🎯 **Patrón de cada módulo**

```typescript
// Todos los módulos siguen esto:
export default function Module({ initialState = "data" }) {
  const [viewState, setViewState] = useState(initialState);

  if (viewState === "loading") return <LoadingState />;
  if (viewState === "error") return <ErrorState />;
  if (viewState === "empty") return <EmptyState />;
  
  return <div>{/* UI completa */}</div>;
}
```

**Memoriza esto** y entenderás todo el sistema.

---

## 🐛 **Problemas comunes**

### "Veo un toggle verde/naranja/azul"

```typescript
// Solución: En /src/app/App.tsx
const USE_DEMO_MODE = false; // ← Debe ser false
```

### "Los cambios no se reflejan"

1. Guarda el archivo
2. Espera hot reload
3. Si no funciona: F5 (recargar)

### "Error de imports"

```bash
rm -rf node_modules
npm install
npm run dev
```

---

## 💡 **Tips**

### Para ver un estado específico rápido:

```typescript
// Busca en MainApp.tsx y cambia:
initialState="data"  // → "loading" | "empty" | "error"
```

### Para agregar un módulo nuevo:

1. Copia la estructura de `GlobalDashboard.tsx`
2. Implementa los 4 estados
3. Agrega a `MainApp.tsx`

### Para modificar un módulo:

Solo edita la sección `// ESTADO: DATA`

---

## 🎓 **Concepto clave: ViewState**

```typescript
type ViewState = "loading" | "error" | "empty" | "data";
```

Este tipo controla qué muestra cada módulo. **TODO gira en torno a esto.**

---

## 📊 **Estructura mental**

```
App.tsx
  ↓
MainApp.tsx (navegación)
  ↓
Módulos (cada uno con 4 estados)
  ↓
Componentes de estado (reutilizables)
```

---

## 🚀 **Workflow diario**

```bash
# Morning:
npm run dev

# Desarrollo:
1. Editar módulo
2. Guardar
3. Ver hot reload
4. Repeat

# Testing estados:
1. Cambiar initialState en MainApp
2. Guardar
3. Ver cambio

# Night:
git commit -m "feat: ..."
```

---

## ✨ **Atajos de teclado**

```
Ctrl+P         → Buscar archivo
Ctrl+F         → Buscar en archivo
Ctrl+Shift+F   → Buscar en proyecto
F5             → Recargar app
Ctrl+`         → Abrir terminal
```

---

## 🎉 **¡Listo!**

Ya sabes todo lo esencial para trabajar con el sistema refactorizado.

**El resto está en la documentación completa.**

---

**Versión:** 2.0.0  
**Estado:** ✅ Ready  
**Actualizado:** 2026-02-05

---

**¿Dudas?** Lee `/INSTRUCCIONES_USO.md` 📖
