# 📘 Guía de Instalación y Ejecución

## Sistema de Gestión Empresarial IDP

**Versión:** 1.0  
**Última actualización:** Enero 2025

---

## 📋 Tabla de Contenido

1. [Requisitos Previos](#requisitos-previos)
2. [Ejecución en Desarrollo Local](#ejecución-en-desarrollo-local)
3. [Despliegue en Render](#despliegue-en-render)
4. [Rutas y URLs del Sistema](#rutas-y-urls-del-sistema)
5. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
6. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

---

## 🔧 Requisitos Previos

### Software Necesario

- **Node.js**: v18.0.0 o superior
- **pnpm**: v8.0.0 o superior (gestor de paquetes)
- **Git**: Para clonar el repositorio

### Verificar Instalaciones

```bash
node --version   # Debe ser >= 18.0.0
pnpm --version   # Debe ser >= 8.0.0
git --version
```

---

## 💻 Ejecución en Desarrollo Local

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd idp-gestion-empresarial
```

### 2. Instalar Dependencias

```bash
pnpm install
```

Este comando instalará todas las dependencias del proyecto definidas en `package.json`.

### 3. Configurar Variables de Entorno (Opcional para MOCK)

El sistema funciona en **modo MOCK por defecto** sin necesidad de configuración adicional.

Para conectar con un backend real (Supabase), crea un archivo `.env` en la raíz:

```env
# Backend API (Supabase Edge Functions)
VITE_API_URL=https://tu-proyecto.supabase.co/functions/v1

# Supabase Keys (si se requiere autenticación)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 4. Iniciar el Servidor de Desarrollo

```bash
pnpm run dev
```

La aplicación se abrirá automáticamente en:

```
http://localhost:5173
```

### 5. Navegación Local

Una vez iniciado el servidor, puedes acceder a:

- **Home/Dashboard**: `http://localhost:5173/`
- **Todos los módulos**: Se navegan mediante la interfaz (SPA - Single Page Application)

**Nota**: El sistema es una SPA, por lo que **no hay rutas URL separadas para cada módulo en desarrollo local**. La navegación se maneja internamente con estados de React.

---

## 🚀 Despliegue en Render

### Arquitectura de Despliegue

El sistema está diseñado para funcionar como **módulos independientes** en diferentes URLs en producción:

```
Render Deploy Strategy:
├── Dashboard Global         → https://dashboard.idp.com
├── Requisiciones           → https://requisiciones.idp.com
├── Compras                 → https://compras.idp.com
├── Pagos                   → https://pagos.idp.com
└── Seguimiento Contratos   → https://contratos.idp.com
    └── Detalles Gastos     → https://contratos.idp.com/gastos
```

### Pasos para Desplegar en Render

#### 1. Crear Cuenta en Render

Visita [https://render.com](https://render.com) y crea una cuenta.

#### 2. Conectar Repositorio

1. Ve a **Dashboard** → **New** → **Static Site**
2. Conecta tu repositorio de GitHub/GitLab
3. Configura el servicio:

```yaml
Build Command: pnpm install && pnpm run build
Publish Directory: dist
```

#### 3. Configurar Variables de Entorno en Render

En la configuración del servicio en Render, agrega:

```env
VITE_API_URL=https://tu-proyecto.supabase.co/functions/v1
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

#### 4. Desplegar Múltiples Instancias (Módulos Separados)

Para tener URLs separadas por departamento:

**Opción A: Un deploy por módulo**
- Crea 5 servicios diferentes en Render
- Cada uno apunta al mismo repositorio
- Modifica `MainApp.tsx` para mostrar solo el módulo específico

**Opción B: Subdominios con routing (Recomendado)**
- Despliega una sola aplicación
- Configura subdominios en Render:
  - `dashboard.idp.com`
  - `requisiciones.idp.com`
  - `compras.idp.com`
  - `pagos.idp.com`
  - `contratos.idp.com`
- Usa la URL para determinar qué módulo mostrar

#### 5. Configuración de Rutas en Render

En **Redirects/Rewrites** de Render:

```
/*  →  /index.html  (200)
```

Esto asegura que la SPA funcione correctamente con routing del lado del cliente.

---

## 🌐 Rutas y URLs del Sistema

### Desarrollo Local (SPA Interna)

| Módulo | Acceso | Descripción |
|--------|--------|-------------|
| **Home** | Estado inicial | Pantalla de selección de módulos |
| **Dashboard Global** | Click en card "Dashboard Global" | Vista empresarial completa |
| **Requisiciones** | Click en card "Requisiciones de Material" | Gestión de requisiciones |
| **Compras** | Click en card "Órdenes de Compra" | Gestión de OCs y proveedores |
| **Pagos** | Click en card "Módulo de Pagos" | Control de pagos |
| **Entregas** | Próximamente | Módulo futuro |

**Navegación**: Se realiza mediante estado de React (`useState`) en `MainApp.tsx`.

### Producción en Render (URLs Separadas)

#### Configuración Recomendada

```
Base Domain: idp-gestion.com

Subdominios por Departamento:
├── dashboard.idp-gestion.com       → Dashboard Global
├── requisiciones.idp-gestion.com   → Requisiciones de Material
├── compras.idp-gestion.com         → Órdenes de Compra
├── pagos.idp-gestion.com           → Módulo de Pagos
└── contratos.idp-gestion.com       → Seguimiento de Contratos
    └── /gastos                     → Detalle de Gastos (sub-ruta)
```

#### Seguimiento de Contratos y Detalle de Gastos

Este módulo tiene 2 niveles:

1. **Vista Principal**: `contratos.idp-gestion.com/`
   - Muestra tarjetas de obras y seguimiento general
   
2. **Detalle de Gastos**: `contratos.idp-gestion.com/gastos`
   - Se accede al hacer clic en "Ver Detalle de Gastos" desde una obra
   - Muestra análisis financiero detallado de la obra seleccionada

**Implementación**:
```tsx
// En producción, detectar la ruta
const isGastosRoute = window.location.pathname === '/gastos';
if (isGastosRoute && selectedProjectId) {
  return <ExpenseDetails projectId={selectedProjectId} />;
}
```

---

## ⚙️ Configuración de Variables de Entorno

### Variables Disponibles

| Variable | Descripción | Requerido | Ejemplo |
|----------|-------------|-----------|---------|
| `VITE_API_URL` | URL base del backend Supabase | No (MOCK default) | `https://abc123.supabase.co/functions/v1` |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | No | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase | No | `eyJhbGc...` |

### Modo de Operación

#### Modo MOCK (Por Defecto)

Si **NO** se configuran variables de entorno, el sistema funciona con:
- **MockProvider**: Datos de demostración en memoria
- **10 proveedores** completamente documentados
- **1 obra activa**: CASTELLO E (código 227)
- **Datos realistas**: Requisiciones, OCs, Pagos simulados

#### Modo API (Producción)

Si se configuran las variables de entorno:
- **ApiProvider**: Conecta con Supabase
- **Backend real**: Almacenamiento persistente
- **Autenticación**: Sistema de usuarios real

### Cambiar entre Modos

Editar `/src/app/providers/index.ts`:

```typescript
// Modo MOCK (Default)
export const dataProvider = MockProvider;

// Modo API (Producción - descomentar)
// export const dataProvider = ApiProvider;
```

---

## 🔍 Solución de Problemas Comunes

### Problema: Puerto 5173 ya en uso

```bash
# Matar el proceso en el puerto
lsof -ti:5173 | xargs kill -9

# O iniciar en otro puerto
pnpm run dev --port 3000
```

### Problema: Error al instalar dependencias

```bash
# Limpiar caché de pnpm
pnpm store prune

# Reinstalar todo
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problema: Imágenes/Logos no se muestran en Render

**Causa**: Uso de `figma:asset` en lugar de rutas estáticas.

**Solución**: Verificar que todos los logos usen rutas `/logo-*.svg`:

```tsx
// ❌ Incorrecto
import logo from "figma:asset/abc123.png";

// ✅ Correcto
<img src="/logo-idp-normal.svg" alt="IDP" />
```

### Problema: Backend no responde

**Verificar**:
1. Variables de entorno configuradas correctamente
2. Supabase Edge Functions desplegadas
3. CORS habilitado en el servidor

**Debug**:
```bash
# Ver logs en consola del navegador
# Debe mostrar: "Using MockProvider" o "Using ApiProvider"
```

### Problema: Módulos no se muestran según el rol

**Verificar** en `MainApp.tsx`:

```typescript
const currentUser: User = {
  name: "Sistema de Gestión",
  role: "admin", // Cambiar según necesidad
  allowedModules: [...], // Verificar permisos
};
```

---

## 📞 Soporte

Para problemas técnicos o dudas:
- **Email**: soporte@idpcc.com.mx
- **Documentación técnica**: Ver `FUNCIONALIDADES.md`

---

## 🔄 Actualización del Sistema

```bash
# Obtener últimos cambios
git pull origin main

# Actualizar dependencias
pnpm install

# Reconstruir
pnpm run build
```

---

**Fin de la Guía de Instalación y Ejecución**
