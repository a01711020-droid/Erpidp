# Data Contract Report (UI ↔ Backend ↔ DB)

## Fuentes revisadas (UI actual)
- `src/ui/obras/WorkForm.tsx`
- `src/ui/proveedores/ProveedorForm.tsx`
- `src/ui/compras/PurchaseOrderForm.tsx`
- `src/ui/pagos/PagoForm.tsx`
- `src/pages/dashboard/*` (métricas por obra)

## Campos por entidad (snake_case → UI)

### Obra
| Campo (snake_case) | Uso en UI | Requerido | Relación |
| --- | --- | --- | --- |
| codigo | `WorkForm` | Sí | - |
| nombre | `WorkForm` | Sí | - |
| numero_contrato | `WorkForm` | Sí | - |
| cliente | `WorkForm` | Sí | - |
| residente | `WorkForm` | Sí | - |
| residente_iniciales | `WorkForm` | Opcional | - |
| direccion | `WorkForm` | Opcional | - |
| monto_contratado | `WorkForm` / dashboard | Sí | - |
| anticipo_porcentaje | `WorkForm` | Opcional | - |
| retencion_porcentaje | `WorkForm` | Opcional | - |
| fecha_inicio | `WorkForm` | Sí | - |
| fecha_fin_programada | `WorkForm` | Sí | - |
| plazo_ejecucion | `WorkForm` | Sí | - |
| estado | `WorkForm` | Sí | - |
| saldo_actual | dashboard | Opcional | - |
| total_estimaciones | dashboard | Opcional | - |
| total_gastos | dashboard | Opcional | - |
| avance_fisico_porcentaje | dashboard | Opcional | - |

### Proveedor
| Campo | Uso en UI | Requerido | Relación |
| --- | --- | --- | --- |
| razon_social | `ProveedorForm` | Sí | - |
| alias_proveedor | `ProveedorForm` | Opcional | - |
| nombre_comercial | `ProveedorForm` | Opcional | - |
| rfc | `ProveedorForm` | Sí | - |
| direccion | `ProveedorForm` | Opcional | - |
| ciudad | `ProveedorForm` | Opcional | - |
| codigo_postal | `ProveedorForm` | Opcional | - |
| telefono | `ProveedorForm` | Opcional | - |
| email | `ProveedorForm` | Opcional | - |
| contacto_principal | `ProveedorForm` | Opcional | - |
| banco | `ProveedorForm` | Opcional | - |
| numero_cuenta | `ProveedorForm` | Opcional | - |
| clabe | `ProveedorForm` | Opcional | - |
| tipo_proveedor | `ProveedorForm` | Opcional | - |
| credito_dias | `ProveedorForm` | Opcional | - |
| limite_credito | `ProveedorForm` | Opcional | - |
| activo | `ProveedorForm` | Opcional | - |

### OrdenCompra
| Campo | Uso en UI | Requerido | Relación |
| --- | --- | --- | --- |
| obra_id | `PurchaseOrderForm` | Sí | FK → obras |
| proveedor_id | `PurchaseOrderForm` | Sí | FK → proveedores |
| comprador_nombre | `PurchaseOrderForm` | Opcional | - |
| fecha_entrega | `PurchaseOrderForm` | Sí | - |
| tipo_entrega | `PurchaseOrderForm` | Opcional | - |
| has_iva | `PurchaseOrderForm` | Opcional | - |
| descuento | `PurchaseOrderForm` (porcentaje) | Opcional | - |
| subtotal / descuento_monto / iva / total | calculado backend | Sí | - |
| observaciones | `PurchaseOrderForm` | Opcional | - |

### OrdenCompraItem
| Campo | Uso en UI | Requerido | Relación |
| --- | --- | --- | --- |
| descripcion | `PurchaseOrderForm` | Sí | - |
| cantidad | `PurchaseOrderForm` | Sí | - |
| unidad | `PurchaseOrderForm` | Sí | - |
| precio_unitario | `PurchaseOrderForm` | Sí | - |
| total | `PurchaseOrderForm` | Sí | - |
| orden_compra_id | backend | Sí | FK → ordenes_compra |

### Pago
| Campo | Uso en UI | Requerido | Relación |
| --- | --- | --- | --- |
| obra_id | `PagoForm` | Sí | FK → obras |
| proveedor_id | `PagoForm` | Sí | FK → proveedores |
| orden_compra_id | `PagoForm` | Sí | FK → ordenes_compra |
| monto | `PagoForm` | Sí | - |
| metodo_pago | `PagoForm` | Sí | - |
| fecha_programada | `PagoForm` | Sí | - |
| referencia | `PagoForm` | Opcional | - |
| folio_factura | `PagoForm` | Opcional | - |
| monto_factura | `PagoForm` | Opcional | - |
| fecha_factura | `PagoForm` | Opcional | - |
| dias_credito | `PagoForm` | Opcional | - |
| fecha_vencimiento | `PagoForm` | Opcional | - |
| observaciones | `PagoForm` | Opcional | - |
| estado | `PagoForm` (edición) | Opcional | - |

### MétricasDashboard (por obra)
| Campo | Uso en UI | Fuente |
| --- | --- | --- |
| comprometido | dashboard obra | sum(ordenes_compra.total) |
| pagado | dashboard obra | sum(pagos.monto) |
| saldo | dashboard obra | comprometido - pagado |
| porcentaje_ejecutado | dashboard obra | pagado / monto_contratado |
| total_estimaciones | dashboard obra | obras.total_estimaciones |
| total_gastos | dashboard obra | obras.total_gastos |
| saldo_actual | dashboard obra | obras.saldo_actual |
| avance_fisico_porcentaje | dashboard obra | obras.avance_fisico_porcentaje |
