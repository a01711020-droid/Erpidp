-- Schema ERP IDP (Supabase)

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists obras (
  id uuid primary key default gen_random_uuid(),
  codigo varchar(50) unique not null,
  nombre varchar(255) not null,
  numero_contrato varchar(100) unique not null,
  cliente varchar(255) not null,
  residente varchar(255) not null,
  direccion text,
  monto_contratado numeric(15,2) not null,
  fecha_inicio date not null,
  fecha_fin_programada date not null,
  plazo_ejecucion integer not null,
  estado varchar(50) not null check (estado in ('activa','suspendida','terminada','cancelada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_obras_updated_at
before update on obras
for each row execute function set_updated_at();

create table if not exists proveedores (
  id uuid primary key default gen_random_uuid(),
  razon_social varchar(255) not null,
  nombre_comercial varchar(255),
  rfc varchar(13) unique not null,
  direccion text,
  ciudad varchar(100),
  codigo_postal varchar(10),
  telefono varchar(20),
  email varchar(255),
  contacto_principal varchar(255),
  banco varchar(100),
  numero_cuenta varchar(50),
  clabe varchar(18),
  tipo_proveedor varchar(20) check (tipo_proveedor in ('material','servicio','renta','mixto')),
  credito_dias integer not null default 0,
  limite_credito numeric(15,2) not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_proveedores_updated_at
before update on proveedores
for each row execute function set_updated_at();

create table if not exists requisiciones (
  id uuid primary key default gen_random_uuid(),
  numero_requisicion varchar(50) unique not null,
  obra_id uuid not null references obras(id),
  solicitado_por varchar(255) not null,
  fecha_solicitud timestamptz not null default now(),
  urgencia varchar(20) not null check (urgencia in ('normal','urgente','muy_urgente')),
  estado varchar(20) not null check (estado in ('pendiente','aprobada','rechazada','en_proceso','completada')),
  observaciones text,
  aprobado_por varchar(255),
  fecha_aprobacion timestamptz,
  motivo_rechazo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_requisiciones_obra on requisiciones (obra_id);

create trigger trg_requisiciones_updated_at
before update on requisiciones
for each row execute function set_updated_at();

create table if not exists requisicion_items (
  id uuid primary key default gen_random_uuid(),
  requisicion_id uuid not null references requisiciones(id) on delete cascade,
  cantidad numeric(10,2) not null,
  unidad varchar(20) not null,
  descripcion text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_requisicion_items_requisicion on requisicion_items (requisicion_id);

create table if not exists ordenes_compra (
  id uuid primary key default gen_random_uuid(),
  numero_orden varchar(50) unique not null,
  obra_id uuid not null references obras(id),
  proveedor_id uuid not null references proveedores(id),
  requisicion_id uuid references requisiciones(id),
  fecha_emision timestamptz not null default now(),
  fecha_entrega date not null,
  estado varchar(20) not null check (estado in ('borrador','emitida','recibida','facturada','pagada','cancelada')),
  tipo_entrega varchar(20) check (tipo_entrega in ('en_obra','bodega','recoger')),
  subtotal numeric(15,2) not null,
  descuento numeric(5,2) not null default 0,
  descuento_monto numeric(15,2) not null default 0,
  iva numeric(15,2) not null default 0,
  total numeric(15,2) not null,
  observaciones text,
  creado_por varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_oc_obra on ordenes_compra (obra_id);
create index if not exists idx_oc_proveedor on ordenes_compra (proveedor_id);

create trigger trg_ordenes_compra_updated_at
before update on ordenes_compra
for each row execute function set_updated_at();

create table if not exists orden_compra_items (
  id uuid primary key default gen_random_uuid(),
  orden_compra_id uuid not null references ordenes_compra(id) on delete cascade,
  cantidad numeric(10,2) not null,
  unidad varchar(20) not null,
  descripcion text not null,
  precio_unitario numeric(15,2) not null,
  total numeric(15,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_oc_items_oc on orden_compra_items (orden_compra_id);

create table if not exists pagos (
  id uuid primary key default gen_random_uuid(),
  orden_compra_id uuid references ordenes_compra(id),
  proveedor_id uuid references proveedores(id),
  obra_id uuid references obras(id),
  fecha_pago date,
  fecha_programada date,
  monto numeric(15,2) not null,
  metodo_pago varchar(20) check (metodo_pago in ('transferencia','cheque','efectivo')),
  referencia varchar(255),
  estado varchar(20) not null check (estado in ('programado','procesando','completado','cancelado')),
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pagos_obra on pagos (obra_id);
create index if not exists idx_pagos_proveedor on pagos (proveedor_id);
create index if not exists idx_pagos_oc on pagos (orden_compra_id);

create trigger trg_pagos_updated_at
before update on pagos
for each row execute function set_updated_at();
