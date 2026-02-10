# NETWORK SPEC (Red de Datos)

## Entidades principales
- **Obras**: base de todo el sistema (proyecto/contrato).
- **Proveedores**: catálogo único para compras y pagos.
- **Requisiciones**: solicitudes de material vinculadas a una obra.
- **Órdenes de compra (OC)**: generan compromiso de compra para obra + proveedor.
- **Pagos**: salida de dinero asociada a una OC y a su proveedor/obra.

## Dependencias clave
- **Requisiciones** → requieren `obra_id`.
- **Órdenes de compra** → requieren `obra_id` y `proveedor_id` (y opcional `requisicion_id`).
- **Pagos** → referencian `orden_compra_id`, `proveedor_id` y `obra_id`.

## Flujo entre módulos
1. **Obras** alimenta catálogos para crear requisiciones y OC.
2. **Proveedores** alimenta catálogos para crear OC y pagos.
3. **Requisiciones** pueden convertirse en OC (relación opcional).
4. **Órdenes de compra** generan base para **Pagos**.
5. **Pagos** actualizan seguimiento financiero de la obra y del proveedor.

## Reglas de integración en FE
- Al crear una **OC**, se selecciona **obra** y **proveedor** desde catálogos reales.
- Al crear un **pago**, se selecciona la **OC** o **proveedor** relacionado.
- Tableros/seguimiento deben consultar datos agregados desde endpoints reales.
