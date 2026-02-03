# 🎨 Guía de Uso: Dev Mode Toggle

## ¿Qué es el Dev Mode Toggle?

Es un botón en el header de la aplicación que te permite **cambiar entre diferentes estados de visualización en tiempo real**, sin necesidad de editar código.

```
┌─────────────────────────────────────────────┐
│  🏗️ IDP  │  Dashboard Global              │
│           │                                 │
│  [🎨 Con Datos Mock ▼] [Volver al Inicio]  │
└─────────────────────────────────────────────┘
```

---

## 🔍 ¿Dónde está?

- **Ubicación:** Header principal (barra superior gris oscura)
- **Posición:** Lado derecho, antes del botón "Volver al Inicio"
- **Visible:** Solo cuando entras a un módulo (Dashboard, Compras, Pagos, etc.)

---

## 🎯 Modos Disponibles

### 1. **Con Datos Mock** (Verde)
- **Estado:** Base de datos llena con datos de ejemplo
- **Datos:** 7 obras, 6 proveedores, 6 OCs, 5 requisiciones, 3 pagos
- **Uso:** Ver cómo se ve el sistema con datos reales
- **Ideal para:** Demos, presentaciones, diseño completo

```
Dashboard Global:
✅ Obra 227 - Tláhuac
✅ Obra 228 - Ecatepec  
✅ Obra 229 - Xochimilco
...
```

---

### 2. **Sin Datos (Empty)** (Naranja)
- **Estado:** Base de datos completamente vacía
- **Datos:** 0 registros en todas las tablas
- **Uso:** Ver estados vacíos con mensajes y CTAs
- **Ideal para:** Testing onboarding, validar empty states

```
Dashboard Global:
🏗️ No hay obras registradas
   Comienza creando tu primera obra
   [+ Nueva Obra]
```

**Lo verás en todos los módulos:**
- ❌ Sin obras registradas
- ❌ Sin proveedores
- ❌ Sin órdenes de compra
- ❌ Sin requisiciones
- ❌ Sin pagos

---

### 3. **Cargando...** (Azul)
- **Estado:** Loading permanente (nunca termina de cargar)
- **Datos:** No se muestran, solo skeletons
- **Uso:** Ver estados de carga prolongados
- **Ideal para:** Validar que los skeletons se vean bien

```
Dashboard Global:
┌─────────────┐
│ ░░░░░░░░░░  │  Cargando...
│ ░░░░░░░░░░  │
└─────────────┘
```

---

### 4. **Error de Red** (Rojo)
- **Estado:** Simula error de conexión
- **Datos:** Mensaje de error con retry
- **Uso:** Ver manejo de errores
- **Ideal para:** Testing de resiliencia

```
⚠️ Error de Red
   No se pudo conectar con el servidor.
   Verifica tu conexión a internet.
   
   [Reintentar]
```

---

## ⚡ Toggle de Latencia de Red

Además de los modos, puedes activar/desactivar **simulación de latencia**:

- **ON (Activo):** Simula delay de 200-600ms (UX realista)
- **OFF (Desactivado):** Respuestas instantáneas (testing rápido)

```
🔋 Simular latencia de red
   [Toggle ON/OFF]
   
   ✅ Delay activo (200-600ms)
   ❌ Respuestas instantáneas
```

---

## 📋 Cómo Usar: Paso a Paso

### **Caso 1: Ver sistema desde cero (vacío)**

1. Entra a cualquier módulo (ej: Dashboard Global)
2. Haz clic en **[🎨 Con Datos Mock ▼]**
3. Selecciona **"Sin Datos (Empty)"**
4. ✨ Verás todos los empty states con mensajes y botones CTA

**Resultado esperado:**
- Mensaje descriptivo
- Icono representativo
- Botón para crear primer registro
- Sin errores en consola

---

### **Caso 2: Ver loading states**

1. Entra a cualquier módulo
2. Haz clic en **[🎨 Con Datos Mock ▼]**
3. Selecciona **"Cargando..."**
4. ✨ Verás skeletons animados permanentes

**Resultado esperado:**
- Skeletons con animación shimmer
- No se muestran datos
- Loading nunca termina (hasta que cambies de modo)

---

### **Caso 3: Ver manejo de errores**

1. Entra a cualquier módulo
2. Haz clic en **[🎨 Con Datos Mock ▼]**
3. Selecciona **"Error de Red"**
4. ✨ Verás mensaje de error con botón de retry

**Resultado esperado:**
- Mensaje de error descriptivo
- Botón "Reintentar"
- El retry también fallará (hasta que cambies de modo)

---

### **Caso 4: Comparar con datos vs sin datos**

1. Entra a **Dashboard Global** con modo **"Con Datos Mock"**
2. Observa: 7 obras, métricas, gráficas
3. Cambia a **"Sin Datos (Empty)"**
4. ✨ Compara cómo se ve el mismo componente vacío

**Útil para:**
- Validar que empty states tengan sentido
- Verificar que el diseño escale bien
- Testing de primera carga

---

## 🔄 Workflow de Testing Completo

### **Testing de Estados UI - Checklist**

Para cada módulo (Dashboard, Compras, Pagos, etc.):

```bash
✅ Paso 1: Con Datos Mock
   - Ver que los datos se muestran correctamente
   - Verificar tablas/cards/gráficas completas
   
✅ Paso 2: Sin Datos (Empty)
   - Ver que aparece mensaje descriptivo
   - Verificar que hay CTA (botón)
   - Validar que no crashea
   
✅ Paso 3: Cargando
   - Ver que skeletons aparecen
   - Verificar que animación funciona
   - Validar que layout se mantiene
   
✅ Paso 4: Error de Red
   - Ver que aparece mensaje de error
   - Verificar que hay botón de retry
   - Validar que el mensaje es claro
```

---

## 🎬 Ejemplo: Testing del Módulo de Proveedores

### **1. Con Datos Mock**
```
Gestión de Proveedores (6)
┌─────────────────┐ ┌─────────────────┐
│ CEMEX           │ │ LEVANTE         │
│ RFC: CMX...     │ │ RFC: LEV...     │
│ ✅ Activo       │ │ ✅ Activo       │
└─────────────────┘ └─────────────────┘
```

### **2. Sin Datos (Empty)**
```
👤 No hay proveedores registrados
   Agrega tu primer proveedor para 
   comenzar a crear órdenes de compra
   
   [+ Agregar Proveedor]
```

### **3. Cargando**
```
┌─────────────────┐ ┌─────────────────┐
│ ░░░░░░░░░░░░░░  │ │ ░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░  │ │ ░░░░░░░░░░░░░░  │
└─────────────────┘ └─────────────────┘
```

### **4. Error de Red**
```
⚠️ Error de Red
   No se pudo conectar con el servidor.
   Verifica tu conexión a internet.
   
   [Reintentar]
```

---

## 💡 Tips y Trucos

### **Tip 1: Desactiva latencia para testing rápido**
```
Si estás probando muchos cambios:
1. Abre el toggle
2. Desactiva "Simular latencia de red"
3. Los datos cargarán instantáneamente
```

### **Tip 2: Usa Empty para validar flujo de onboarding**
```
Pregúntate: 
- ¿El mensaje tiene sentido para un usuario nuevo?
- ¿El CTA es claro?
- ¿Sé qué hacer a continuación?
```

### **Tip 3: Usa Error para validar resiliencia**
```
Pregúntate:
- ¿El mensaje de error es útil?
- ¿Puedo recuperarme del error?
- ¿El botón de retry funciona?
```

### **Tip 4: Alterna entre modos en diferentes módulos**
```
Dashboard: Con Datos Mock
Proveedores: Sin Datos (Empty)
Compras: Error de Red

Esto te permite ver múltiples estados a la vez
```

---

## 🐛 Troubleshooting

### **Problema: No veo el toggle**
**Solución:** El toggle solo aparece cuando estás dentro de un módulo, NO en la página de inicio.

1. ✅ Dashboard Global → SÍ hay toggle
2. ✅ Módulo de Compras → SÍ hay toggle
3. ❌ Página de Inicio → NO hay toggle

---

### **Problema: Cambio de modo no tiene efecto**
**Solución:** Recarga la página o cambia de módulo y vuelve.

```bash
1. Cambia de "Con Datos" a "Empty"
2. Si no cambia, haz clic en "Volver al Inicio"
3. Vuelve a entrar al módulo
```

---

### **Problema: Console muestra errores**
**Solución:** Esto es normal en modo "Error de Red". Si ocurre en otros modos:

```bash
1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores en rojo
4. Reporta el error con screenshot
```

---

### **Problema: Loading no termina nunca**
**Solución:** Esto es **intencional** en modo "Cargando...". Para salir:

```bash
1. Abre el toggle nuevamente
2. Selecciona "Con Datos Mock" o "Sin Datos"
```

---

## 🎯 Casos de Uso Reales

### **Caso 1: Presentación a Cliente**
```
Modo: Con Datos Mock
Latencia: Activada (para realismo)

Mostrar sistema completamente poblado con 
datos de ejemplo realistas.
```

### **Caso 2: Testing de UX con Usuario Nuevo**
```
Modo: Sin Datos (Empty)
Latencia: Desactivada (para rapidez)

Validar que los mensajes y CTAs tengan 
sentido para alguien que empieza desde cero.
```

### **Caso 3: QA de Manejo de Errores**
```
Modo: Error de Red
Latencia: Activada

Verificar que todos los módulos manejen 
errores gracefully.
```

### **Caso 4: Validación de Skeletons**
```
Modo: Cargando
Latencia: Activada

Revisar que los skeletons tengan el tamaño 
correcto y animación suave.
```

---

## 📊 Matriz de Testing

| Módulo | Con Datos | Empty | Loading | Error |
|--------|-----------|-------|---------|-------|
| Dashboard Global | ✅ | ✅ | ✅ | ✅ |
| Gestión Proveedores | ✅ | ✅ | ✅ | ✅ |
| Órdenes de Compra | ✅ | ⚠️ | ✅ | ✅ |
| Requisiciones | ✅ | ⚠️ | ✅ | ✅ |
| Módulo de Pagos | ✅ | ⚠️ | ✅ | ✅ |

**Leyenda:**
- ✅ Implementado y funcionando
- ⚠️ Pendiente de implementar StatePanel
- ❌ No implementado

---

## 🚀 Próximos Pasos

1. **Refactorizar módulos pendientes** para usar StatePanel
2. **Agregar más datos mock** para casos edge
3. **Crear modo "Error Parcial"** (algunos datos cargan, otros fallan)
4. **Agregar modo "Slow Network"** (3G simulado)

---

## 📝 Notas Técnicas

### **Arquitectura:**
```
DevModeContext (React Context)
    ↓
mockAdapterWithDevMode
    ↓
Todos los componentes vía useData hook
```

### **Estado global:**
- `mode: 'withData' | 'empty' | 'loading' | 'error'`
- `networkDelay: boolean`

### **Persistencia:**
- El estado NO persiste entre recargas
- Al recargar, siempre inicia en "Con Datos Mock"

---

**Última actualización:** 2025-01-30  
**Versión:** 1.0.0  
**Autor:** Equipo IDP
