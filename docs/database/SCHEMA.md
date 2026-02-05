# 🗄️ Esquema de Base de Datos - ERP Constructora IDP

## 📋 Resumen

Este documento contiene el esquema SQL completo para Supabase.

**Nota:** El esquema completo SQL original se encuentra en `/ESQUEMA_BASE_DATOS_SQL.md`.  
También puedes consultar `/spec/mock-db/schema.sql` para la versión ejecutable.

## Tablas Principales

### 1. **obras**
- Almacena información de proyectos/contratos
- Campos: código, nombre, monto, avance, fechas, residente, status

### 2. **proveedores**
- Catálogo de proveedores con datos fiscales
- Campos: razón social, RFC, contacto, días de crédito

### 3. **ordenes_compra**
- Órdenes de compra del departamento
- Campos: folio, obra, proveedor, montos, status

### 4. **orden_compra_items**
- Partidas de cada orden de compra
- Campos: descripción, cantidad, precio unitario

### 5. **requisiciones_material**
- Solicitudes de residentes de obra
- Campos: folio, obra, residente, prioridad, status

### 6. **requisicion_items**
- Materiales solicitados por requisición

### 7. **facturas**
- Facturas de proveedores
- Campos: folio, orden, monto, fechas, paths

### 8. **pagos**
- Pagos a facturas o directos
- Campos: referencia, monto, fecha, método

### 9. **contratos**
- Información contractual de obras
- Campos: número, monto, anticipo, avances

### 10. **estimaciones**
- Estimaciones progresivas por contrato
- Campos: número, periodo, montos, amortizaciones

### 11. **estimacion_conceptos**
- Conceptos ejecutados en cada estimación

### 12. **mensajes_requisicion**
- Chat entre residentes y compras

## Archivos Relacionados

- `/ESQUEMA_BASE_DATOS_SQL.md` - Esquema completo con ejemplos
- `/spec/mock-db/schema.sql` - SQL ejecutable
- `/spec/mock-db/schema.md` - Documentación técnica
- `/spec/mock-db/seed.ts` - Datos de prueba

## Vistas Útiles

- `reporte_pagos_completo` - Vista consolidada de pagos
- `dashboard_obras` - Métricas por obra

## Row Level Security (RLS)

Todas las tablas tienen RLS habilitado para seguridad multi-tenant.
