# SQL RUNBOOK (Supabase)

## 1) Aplicar schema.sql
1. Abrir el proyecto en Supabase.
2. Ir a **SQL Editor**.
3. Copiar el contenido de `backend/db/schema.sql`.
4. Ejecutar el script.

## 2) Verificar tablas
En SQL Editor:
```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Debes ver al menos:
- obras
- proveedores
- requisiciones
- requisicion_items
- ordenes_compra
- orden_compra_items
- pagos

## 3) (Opcional) Seed mínimo
Puedes insertar datos mínimos con SQL simple, por ejemplo:
```sql
insert into obras (codigo, nombre, numero_contrato, cliente, residente, monto_contratado, fecha_inicio, fecha_fin_programada, plazo_ejecucion, estado)
values ('227', 'CASTELLO E', 'CONT-2025-045', 'Cliente Demo', 'Residente Demo', 1000000, '2025-01-01', '2025-12-31', 365, 'activa');
```
