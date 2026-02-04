# AUDIT_REPORT (Phase 0)

## Endpoints detectados
- `/api/v1/obras`
- `/api/v1/proveedores`
- `/api/v1/ordenes-compra`
- `/api/v1/pagos`
- `/api/v1/requisiciones`
- `/api/v1/auth/verify`
- `/api/v1/obras/{id}/summary`
- `/api/v1/dashboard/resumen`

## Hallazgos (archivo → problema → impacto)
- `backend/app/schemas.py` → IDs UUID tipados vs frontend string → riesgo de ResponseValidationError si no hay serialización consistente.
- `frontend/src/ui/components/DashboardEmpresarial.tsx` → KPI “mock calculations” → números no confiables en dashboard.
- `frontend/src/ui/GlobalDashboard.tsx` → KPIs calculados con reducciones locales → totales no reflejan DB.
- `frontend/src/ui/components/PurchaseOrderForm.tsx` → sin empty state para catálogos vacíos → bloqueo silencioso al crear OC si faltan Obras/Proveedores.
- `frontend/src/core/hooks/*` → si no hay refetch tras create/update/delete → red universal rota (listas no sincronizadas).

## Nota
Las correcciones correspondientes se implementan en este branch siguiendo las fases del plan (sin rediseño).
