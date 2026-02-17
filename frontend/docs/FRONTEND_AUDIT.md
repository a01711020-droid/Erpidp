# Auditoría FE Fase 1 (actualizada)

## Árbol relevante
- `frontend/src/app` (router/layouts/páginas visuales)
- `frontend/src/core` (infraestructura FE)
- `frontend/src/ui` (UI pura por props)
- `frontend/src/pages` (conectores por ruta)
- `frontend/src/_legacy` (código histórico fuera de runtime)
- `frontend/docs/spec` y `frontend/spec` (documentación de referencia)

## Router runtime
- `/` → `HomePage`
- `/dashboard` → `DashboardLayout` + `GlobalDashboardPage`
- `/compras` → `OrdenesCompraListPage`
- `/compras/proveedores` → `ProveedoresListPage`
- `/pagos` → `PagosProgramacionPage`
- `/destajos/captura` → `CapturaAvancesPage`
- `/requisiciones` → `RequisicionesListPage`

## Limpieza aplicada
### COPIAR TAL CUAL
- Componentes visuales de estado en `frontend/src/app/components/*`

### REFACTOR A PROPS
- `frontend/src/app/components/global-dashboard/DashboardStateData.tsx`
- `frontend/src/ui/*`
- `frontend/src/pages/*`

### ELIMINAR / NO RUNTIME
- `frontend/src/_legacy/*.legacy.tsx` (sin imports ni exports)
- Eliminado `frontend/src/spec` (movido fuera de `src`)
- Eliminados runtime mock/devmode de `frontend/src/core/*` y providers legacy

## Evidencia de cumplimiento
Comandos ejecutados:

```bash
rg -n "@/spec" frontend/src
rg -n "MOCK_MODE|TEST_EMPTY_STATE|SIMULATE_NETWORK_DELAY|mockAdapter|DevMode" frontend/src
rg -n "WORKS_DATA|SUPPLIERS_DATA|BUYERS_DATA|destajistasMock|obrasMock|resumenObrasMock|purchaseOrdersPaymentMock" frontend/src
```

Resultado esperado: sin coincidencias.
