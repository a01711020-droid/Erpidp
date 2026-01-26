# Data Contract Report (main → work)

## Archivos con mock/hardcode en main (referencia)
- `src/_legacy/app/GlobalDashboard.tsx` (initialWorks, KPIs globales).  
- `src/_legacy/app/components/WorkForm.tsx` (campos completos de obra).  
- `src/_legacy/app/PurchaseOrderManagement.tsx` (mockOrders, mockRequisitions).  
- `src/_legacy/app/components/PurchaseOrderForm.tsx` (campos ricos de OC + items).  
- `src/_legacy/app/PaymentManagement.tsx` (mockPurchaseOrders, facturas, pagos parciales).  
- `src/_legacy/app/providers/mockData.ts` (fixtures completos).  

## Data Contract (campos → tipo → origen → relaciones)

### Obra
| Campo (snake_case) | Tipo | Requerido | Origen (main) | Relación |
| --- | --- | --- | --- | --- |
| codigo | string | Sí | `GlobalDashboard.tsx` / `WorkForm.tsx` | - |
| nombre | string | Sí | `GlobalDashboard.tsx` / `WorkForm.tsx` | - |
| numero_contrato | string | Sí | `WorkForm.tsx` | - |
| cliente | string | Sí | `GlobalDashboard.tsx` / `WorkForm.tsx` | - |
| residente | string | Sí | `WorkForm.tsx` | - |
| residente_iniciales | string | Opcional | `WorkForm.tsx` | - |
| direccion | string | Opcional | `WorkForm.tsx` | - |
| monto_contratado | number | Sí | `WorkForm.tsx` | - |
| anticipo_porcentaje | number | Opcional | `WorkForm.tsx` | - |
| retencion_porcentaje | number | Opcional | `WorkForm.tsx` | - |
| saldo_actual | number | Opcional | `GlobalDashboard.tsx` | - |
| total_estimaciones | number | Opcional | `GlobalDashboard.tsx` | - |
| total_gastos | number | Opcional | `GlobalDashboard.tsx` | - |
| avance_fisico_porcentaje | number | Opcional | `WorkForm.tsx` | - |
| fecha_inicio | date | Sí | `WorkForm.tsx` | - |
| fecha_fin_programada | date | Sí | `WorkForm.tsx` | - |
| plazo_ejecucion | integer | Sí | `WorkForm.tsx` | - |
| estado | string | Sí | `GlobalDashboard.tsx` | - |

### Proveedor
| Campo | Tipo | Requerido | Origen (main) | Relación |
| --- | --- | --- | --- | --- |
| razon_social | string | Sí | `PurchaseOrderForm.tsx` | - |
| alias_proveedor | string | Opcional | `PurchaseOrderForm.tsx` | - |
| rfc | string | Sí | `PurchaseOrderForm.tsx` | - |
| direccion | string | Opcional | `PurchaseOrderForm.tsx` | - |
| telefono | string | Opcional | `PurchaseOrderForm.tsx` | - |
| contacto_principal | string | Opcional | `PurchaseOrderForm.tsx` | - |
| banco / numero_cuenta / clabe | string | Opcional | `PurchaseOrderForm.tsx` | - |
| credito_dias | integer | Opcional | `PaymentManagement.tsx` | - |

### OrdenCompra
| Campo | Tipo | Requerido | Origen (main) | Relación |
| --- | --- | --- | --- | --- |
| numero_orden | string | Sí | `PurchaseOrderManagement.tsx` | - |
| obra_id | uuid | Sí | `PurchaseOrderManagement.tsx` | FK → obras |
| proveedor_id | uuid | Sí | `PurchaseOrderManagement.tsx` | FK → proveedores |
| comprador_nombre | string | Opcional | `PurchaseOrderForm.tsx` | - |
| fecha_entrega | date | Sí | `PurchaseOrderForm.tsx` | - |
| tipo_entrega | string | Opcional | `PurchaseOrderForm.tsx` | - |
| has_iva | boolean | Opcional | `PurchaseOrderForm.tsx` | - |
| descuento | number | Opcional | `PurchaseOrderForm.tsx` | - |
| subtotal / iva / total | number | Sí | `PurchaseOrderForm.tsx` | - |
| observaciones | string | Opcional | `PurchaseOrderForm.tsx` | - |

### OrdenCompraItem
| Campo | Tipo | Requerido | Origen (main) | Relación |
| --- | --- | --- | --- | --- |
| descripcion | string | Sí | `PurchaseOrderForm.tsx` | - |
| cantidad | number | Sí | `PurchaseOrderForm.tsx` | - |
| unidad | string | Sí | `PurchaseOrderForm.tsx` | - |
| precio_unitario | number | Sí | `PurchaseOrderForm.tsx` | - |
| total | number | Sí | `PurchaseOrderForm.tsx` | - |
| orden_compra_id | uuid | Sí | `PurchaseOrderManagement.tsx` | FK → ordenes_compra |

### Pago
| Campo | Tipo | Requerido | Origen (main) | Relación |
| --- | --- | --- | --- | --- |
| orden_compra_id | uuid | Sí | `PaymentManagement.tsx` | FK → ordenes_compra |
| monto | number | Sí | `PaymentManagement.tsx` | - |
| metodo_pago | string | Sí | `PaymentManagement.tsx` | - |
| fecha_programada | date | Sí | `PaymentManagement.tsx` | - |
| referencia | string | Opcional | `PaymentManagement.tsx` | - |
| folio_factura | string | Opcional | `PaymentManagement.tsx` | - |
| monto_factura | number | Opcional | `PaymentManagement.tsx` | - |
| fecha_factura | date | Opcional | `PaymentManagement.tsx` | - |
| dias_credito | integer | Opcional | `PaymentManagement.tsx` | - |
| fecha_vencimiento | date | Opcional | `PaymentManagement.tsx` | - |

### MétricasDashboard (por obra)
| Campo | Tipo | Requerido | Origen (main) | Relación |
| --- | --- | --- | --- | --- |
| comprometido | number | Sí | `GlobalDashboard.tsx` | sum OC |
| pagado | number | Sí | `PaymentManagement.tsx` | sum pagos |
| saldo | number | Sí | `GlobalDashboard.tsx` | comprometido - pagado |
| porcentaje_ejecutado | number | Sí | `GlobalDashboard.tsx` | pagado / monto_contratado |
| total_estimaciones | number | Opcional | `GlobalDashboard.tsx` | obra |
| total_gastos | number | Opcional | `GlobalDashboard.tsx` | obra |
| saldo_actual | number | Opcional | `GlobalDashboard.tsx` | obra |
| avance_fisico_porcentaje | number | Opcional | `GlobalDashboard.tsx` | obra |
