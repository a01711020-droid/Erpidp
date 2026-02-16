# Auditoría FE Fase 1

## Árbol relevante
- `src/app` (router/layouts/páginas legacy)
- `src/core` (infraestructura de datos/hooks)
- `src/spec` (solo referencia, no runtime)
- `src/ui` (nueva UI pura por props)
- `src/pages` (nuevos conectores por ruta)

## Router (src/app/routes.ts)
- `/` → `HomePage`
- `/dashboard` → `DashboardLayout` + `GlobalDashboardPage`
- `/dashboard/obras` → `DashboardObras`
- `/dashboard/obras/:codigoObra` → `DashboardObraDetalle`
- `/compras` y `/compras/ordenes` → `OrdenesCompraListPage`
- `/compras/proveedores` → `ProveedoresListPage`
- `/pagos` y `/pagos/programacion` → `PagosProgramacionPage`
- `/destajos/captura` → `CapturaAvancesPage`
- `/requisiciones` → `RequisicionesListPage`

## Contaminación detectada
### COPIAR TAL CUAL (UI usable)
- `src/app/components/states/*`
- `src/app/components/*StateLoading.tsx`
- `src/app/components/*StateEmpty.tsx`
- `src/app/components/*StateError.tsx`

### REFACTOR A PROPS
- `src/app/components/global-dashboard/DashboardStateData.tsx` (import de `/spec`)
- `src/app/App.tsx` (DevMode + MainApp)
- rutas listas en `src/app/routes.ts` (conectores nuevos)

### ELIMINAR / NO MIGRAR
- `src/core/data/mockAdapter.ts`
- `src/core/data/mockAdapterWithDevMode.ts`
- `src/core/data/index.ts`
- `src/core/contexts/DevModeContext.tsx`
- `src/core/ui/DevModeToggle.tsx`
- `src/core/hooks/useDevModeSync.ts`
- `src/app/providers/MockProvider.ts`
