# API Contract esperado (Fase futura)

Base URL: `VITE_API_URL` (default `/api`)

## Obras
- `GET /obras` → `ObraDto[]`
- `POST /obras` → `ObraDto`
- `PATCH /obras/:id` → `ObraDto`

## Proveedores
- `GET /proveedores` → `ProveedorDto[]`
- `POST /proveedores` → `ProveedorDto`
- `PATCH /proveedores/:id` → `ProveedorDto`

## Requisiciones
- `GET /requisiciones` → `RequisicionDto[]`
- `POST /requisiciones` → `RequisicionDto`
- `PATCH /requisiciones/:id` → `RequisicionDto`

## Órdenes de compra
- `GET /ordenes-compra` → `OrdenCompraDto[]`
- `POST /ordenes-compra` → `OrdenCompraDto`
- `PATCH /ordenes-compra/:id` → `OrdenCompraDto`

## Pagos
- `GET /pagos` → `PagoDto[]`
- `POST /pagos` → `PagoDto`
- `PATCH /pagos/:id` → `PagoDto`

## Destajos
- `GET /destajos` → `DestajoSemanaDto[]`
- `POST /destajos` → `DestajoSemanaDto`
- `PATCH /destajos/:id` → `DestajoSemanaDto`
