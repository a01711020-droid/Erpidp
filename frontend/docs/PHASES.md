# ERP IDP - Plan por fases

## Fase 1 (Frontend limpio)
- [x] Auditoría de estructura FE y rutas SPA.
- [x] Eliminación de runtime mock/devmode del grafo principal.
- [x] Migración a conectores por ruta en `src/pages`.
- [x] UI desacoplada en `src/ui` con `viewState` (`loading|empty|error|data`).
- [x] Stubs de `src/core` (ApiClient, DTOs y hooks enchufe).
- [x] Refresh SPA documentado y fallback configurado.

## Fase 2 (Integración API FastAPI)
- [ ] Implementar endpoints reales según `docs/API_CONTRACT.md`.
- [ ] Conectar hooks de `src/core/hooks/useResources.ts` con `apiRequest`.
- [ ] Mapear DTOs↔UI y validar errores de negocio.
- [ ] Pruebas de integración FE/API por módulo.

## Fase 3 (Persistencia + operación)
- [ ] Integración completa backend + base de datos.
- [ ] Hardening de autenticación/autorización.
- [ ] Observabilidad, métricas y trazabilidad.
- [ ] Optimización de performance y pruebas E2E.
