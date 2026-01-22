from __future__ import annotations

from typing import Iterable, Tuple


async def ensure_extensions(conn) -> None:
    print("🔧 Ensuring database extensions...")
    await conn.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    await conn.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')


async def ensure_tables(conn) -> None:
    print("🧱 Ensuring core tables...")
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS obras (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          codigo VARCHAR(50) UNIQUE NOT NULL,
          nombre VARCHAR(255) NOT NULL,
          numero_contrato VARCHAR(100) UNIQUE NOT NULL,
          cliente VARCHAR(255) NOT NULL,
          residente VARCHAR(255) NOT NULL,
          direccion TEXT,
          monto_contratado NUMERIC(15, 2) NOT NULL CHECK (monto_contratado >= 0),
          fecha_inicio DATE NOT NULL,
          fecha_fin_programada DATE NOT NULL,
          plazo_ejecucion INTEGER NOT NULL CHECK (plazo_ejecucion >= 0),
          estado VARCHAR(50) NOT NULL CHECK (estado IN ('activa', 'suspendida', 'terminada', 'cancelada')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS proveedores (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          razon_social VARCHAR(255) NOT NULL,
          nombre_comercial VARCHAR(255),
          rfc VARCHAR(13) UNIQUE NOT NULL,
          direccion TEXT,
          ciudad VARCHAR(100),
          codigo_postal VARCHAR(10),
          telefono VARCHAR(20),
          email VARCHAR(255),
          contacto_principal VARCHAR(255),
          banco VARCHAR(100),
          numero_cuenta VARCHAR(50),
          clabe VARCHAR(18),
          tipo_proveedor VARCHAR(50) CHECK (tipo_proveedor IN ('material', 'servicio', 'renta', 'mixto')),
          credito_dias INTEGER DEFAULT 0,
          limite_credito NUMERIC(15, 2) DEFAULT 0,
          activo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS requisiciones (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          numero_requisicion VARCHAR(50) UNIQUE NOT NULL,
          obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
          solicitado_por VARCHAR(255) NOT NULL,
          fecha_solicitud TIMESTAMPTZ DEFAULT NOW(),
          urgencia VARCHAR(50) NOT NULL CHECK (urgencia IN ('normal', 'urgente', 'muy_urgente')),
          estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada')),
          observaciones TEXT,
          aprobado_por VARCHAR(255),
          fecha_aprobacion TIMESTAMPTZ,
          motivo_rechazo TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS requisicion_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          requisicion_id UUID NOT NULL REFERENCES requisiciones(id) ON DELETE CASCADE,
          cantidad NUMERIC(10, 2) NOT NULL CHECK (cantidad >= 0),
          unidad VARCHAR(20) NOT NULL,
          descripcion TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS ordenes_compra (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          numero_orden VARCHAR(50) UNIQUE NOT NULL,
          obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
          proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
          requisicion_id UUID REFERENCES requisiciones(id) ON DELETE SET NULL,
          fecha_emision TIMESTAMPTZ DEFAULT NOW(),
          fecha_entrega DATE NOT NULL,
          estado VARCHAR(50) NOT NULL CHECK (estado IN ('borrador', 'emitida', 'recibida', 'facturada', 'pagada', 'cancelada')),
          tipo_entrega VARCHAR(50) CHECK (tipo_entrega IN ('en_obra', 'bodega', 'recoger')),
          subtotal NUMERIC(15, 2) NOT NULL CHECK (subtotal >= 0),
          descuento NUMERIC(5, 2) DEFAULT 0 CHECK (descuento >= 0),
          descuento_monto NUMERIC(15, 2) DEFAULT 0 CHECK (descuento_monto >= 0),
          iva NUMERIC(15, 2) DEFAULT 0 CHECK (iva >= 0),
          total NUMERIC(15, 2) NOT NULL CHECK (total >= 0),
          observaciones TEXT,
          creado_por VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS orden_compra_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
          cantidad NUMERIC(10, 2) NOT NULL CHECK (cantidad >= 0),
          unidad VARCHAR(20) NOT NULL,
          descripcion TEXT NOT NULL,
          precio_unitario NUMERIC(15, 2) NOT NULL CHECK (precio_unitario >= 0),
          total NUMERIC(15, 2) NOT NULL CHECK (total >= 0),
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS pagos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          numero_pago VARCHAR(50) UNIQUE NOT NULL,
          obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
          proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
          orden_compra_id UUID NOT NULL REFERENCES ordenes_compra(id) ON DELETE RESTRICT,
          monto NUMERIC(15, 2) NOT NULL CHECK (monto >= 0),
          metodo_pago VARCHAR(50) CHECK (metodo_pago IN ('transferencia', 'cheque', 'efectivo')),
          fecha_programada DATE NOT NULL,
          fecha_procesado TIMESTAMPTZ,
          estado VARCHAR(50) NOT NULL CHECK (estado IN ('programado', 'procesando', 'completado', 'cancelado')),
          referencia VARCHAR(100),
          comprobante TEXT,
          observaciones TEXT,
          procesado_por VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS bank_transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          fecha DATE NOT NULL,
          descripcion_banco TEXT NOT NULL,
          descripcion_banco_normalizada TEXT,
          monto NUMERIC(15, 2) NOT NULL,
          referencia_bancaria VARCHAR(100),
          orden_compra_id UUID REFERENCES ordenes_compra(id) ON DELETE SET NULL,
          matched BOOLEAN DEFAULT FALSE,
          origen VARCHAR(50) NOT NULL DEFAULT 'csv',
          match_confidence INTEGER DEFAULT 0,
          match_manual BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
        """
    )

    await _ensure_id_defaults(
        conn,
        [
            "obras",
            "proveedores",
            "requisiciones",
            "requisicion_items",
            "ordenes_compra",
            "orden_compra_items",
            "pagos",
            "bank_transactions",
        ],
    )

    await _ensure_columns(
        conn,
        "bank_transactions",
        [
            ("descripcion_banco_normalizada", "TEXT"),
            ("matched", "BOOLEAN DEFAULT FALSE"),
            ("origen", "VARCHAR(50) NOT NULL DEFAULT 'csv'"),
            ("match_confidence", "INTEGER DEFAULT 0"),
            ("match_manual", "BOOLEAN DEFAULT FALSE"),
            ("updated_at", "TIMESTAMPTZ DEFAULT NOW()"),
        ],
    )
    await _ensure_columns(
        conn,
        "pagos",
        [
            ("referencia", "VARCHAR(100)"),
            ("observaciones", "TEXT"),
            ("comprobante", "TEXT"),
            ("procesado_por", "VARCHAR(255)"),
            ("fecha_procesado", "TIMESTAMPTZ"),
            ("updated_at", "TIMESTAMPTZ DEFAULT NOW()"),
        ],
    )

    await _ensure_columns(
        conn,
        "ordenes_compra",
        [
            ("descuento", "NUMERIC(5, 2) DEFAULT 0"),
            ("descuento_monto", "NUMERIC(15, 2) DEFAULT 0"),
            ("iva", "NUMERIC(15, 2) DEFAULT 0"),
            ("updated_at", "TIMESTAMPTZ DEFAULT NOW()"),
        ],
    )

    await _ensure_columns(
        conn,
        "obras",
        [
            ("direccion", "TEXT"),
            ("updated_at", "TIMESTAMPTZ DEFAULT NOW()"),
        ],
    )


async def ensure_indexes(conn) -> None:
    print("📇 Ensuring indexes...")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_obras_estado ON obras(estado)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo)")
    await conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_obras_numero_contrato ON obras(numero_contrato)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_proveedores_activo ON proveedores(activo)")
    await conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_proveedores_rfc ON proveedores(rfc)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_requisiciones_obra ON requisiciones(obra_id)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_requisicion_items_requisicion ON requisicion_items(requisicion_id)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_ordenes_compra_obra ON ordenes_compra(obra_id)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_ordenes_compra_proveedor ON ordenes_compra(proveedor_id)")
    await conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_ordenes_compra_numero ON ordenes_compra(numero_orden)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_orden_compra_items_oc ON orden_compra_items(orden_compra_id)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_pagos_orden_compra ON pagos(orden_compra_id)")
    await conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_pagos_numero ON pagos(numero_pago)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_bank_transactions_fecha ON bank_transactions(fecha)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_bank_transactions_matched ON bank_transactions(matched)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_bank_transactions_oc ON bank_transactions(orden_compra_id)")


async def ensure_schema(conn) -> None:
    print("🧩 Running schema checks...")
    await ensure_extensions(conn)
    await ensure_tables(conn)
    await ensure_indexes(conn)
    print("✅ Schema ensured.")


async def _ensure_columns(
    conn,
    table: str,
    columns: Iterable[Tuple[str, str]],
) -> None:
    for column_name, column_def in columns:
        await conn.execute(
            f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {column_name} {column_def}"
        )


async def _ensure_id_defaults(conn, tables: Iterable[str]) -> None:
    for table in tables:
        await conn.execute(
            f"ALTER TABLE {table} ALTER COLUMN id SET DEFAULT gen_random_uuid()"
        )
