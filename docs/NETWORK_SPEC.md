# NETWORK SPEC (ERP CONSTRUCCIÓN IDP)

## Regla central
La **Obra** es el núcleo del sistema. Todas las entidades financieras y operativas se registran por `obra_id`.

## Flujo real entre módulos
1. **Obras**
   - Crea el contrato base (`monto_contratado`) y habilita operación.
2. **Requisiciones**
   - Nacen desde una obra.
   - No generan gasto; son necesidad operativa.
3. **Órdenes de Compra (Compras)**
   - Se crean con `obra_id` + `proveedor_id`.
   - Pueden referenciar `requisicion_id`.
   - Generan compromiso de gasto.
4. **Pagos**
   - Registran salida real de dinero (`monto`).
   - Referencian `obra_id` y normalmente `orden_compra_id`.
5. **Destajos**
   - Registran gasto directo de mano de obra por obra y semana.
6. **Dashboard**
   - Solo lectura agregada de Obras + OCs + Pagos + Destajos.
   - Refleja saldo por obra y global.

## Dependencias cruzadas
- Crear OC requiere catálogos reales de:
  - Obras
  - Proveedores
  - Requisiciones (opcional)
- Crear Pago requiere catálogos reales de:
  - Obras
  - Proveedores
  - OCs
- Destajos siempre requiere Obra.

## Reglas financieras mínimas
- `monto_contratado` = techo financiero de la obra.
- `total OC` = compromiso (planeado/comprometido).
- `pagos + destajos` = gasto real ejecutado.
- Saldo obra = `monto_contratado - gasto_real`.

## Política anti-demo
- Sin mock runtime.
- Sin arrays hardcodeados como fuente de datos de entidades ERP.
- Si no hay endpoint de un módulo, mostrar estado vacío/deshabilitado.
