# ENDPOINTS (FastAPI)

Base URL: `http://localhost:8000/api/v1`

## Obras
### GET /obras
Respuesta:
```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

### POST /obras
Request:
```json
{
  "codigo": "227",
  "nombre": "CASTELLO E",
  "numeroContrato": "CONT-2025-045",
  "cliente": "Cliente Demo",
  "residente": "Residente Demo",
  "direccion": "Calle 123",
  "montoContratado": 1000000,
  "fechaInicio": "2025-01-01",
  "fechaFinProgramada": "2025-12-31",
  "plazoEjecucion": 365,
  "estado": "activa"
}
```

## Proveedores
### GET /proveedores
### POST /proveedores
```json
{
  "razonSocial": "CEMEX México S.A. de C.V.",
  "nombreComercial": "CEMEX",
  "rfc": "CME850320ABC",
  "telefono": "5555551234",
  "email": "contacto@cemex.com",
  "tipoProveedor": "material"
}
```

## Requisiciones
### GET /requisiciones
### POST /requisiciones
```json
{
  "numeroRequisicion": "REQ227-001MAT",
  "obraId": "<uuid>",
  "solicitadoPor": "Ing. Miguel Ángel Torres",
  "urgencia": "urgente",
  "estado": "pendiente",
  "items": [
    { "cantidad": 10, "unidad": "pza", "descripcion": "Cemento" }
  ]
}
```

## Órdenes de compra
### GET /ordenes-compra
### POST /ordenes-compra
```json
{
  "numeroOrden": "227-A01GM-CEMEX",
  "obraId": "<uuid>",
  "proveedorId": "<uuid>",
  "requisicionId": null,
  "fechaEntrega": "2025-01-20",
  "estado": "emitida",
  "tipoEntrega": "en_obra",
  "subtotal": 1000,
  "descuento": 0,
  "descuentoMonto": 0,
  "iva": 160,
  "total": 1160,
  "items": [
    { "cantidad": 10, "unidad": "pza", "descripcion": "Cemento", "precioUnitario": 100, "total": 1000 }
  ]
}
```

## Pagos
### GET /pagos
### POST /pagos
```json
{
  "ordenCompraId": "<uuid>",
  "proveedorId": "<uuid>",
  "obraId": "<uuid>",
  "fechaProgramada": "2025-01-30",
  "monto": 1160,
  "metodoPago": "transferencia",
  "estado": "programado"
}
```
