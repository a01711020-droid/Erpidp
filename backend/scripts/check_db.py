import asyncio
import os
import sys
from pathlib import Path

import asyncpg
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

REQUIRED_TABLES = {
    "obras": [
        "id",
        "codigo",
        "nombre",
        "numero_contrato",
        "cliente",
        "residente",
        "residente_iniciales",
        "monto_contratado",
        "anticipo_porcentaje",
        "retencion_porcentaje",
        "saldo_actual",
        "total_estimaciones",
        "total_gastos",
        "avance_fisico_porcentaje",
        "fecha_inicio",
        "fecha_fin_programada",
        "plazo_ejecucion",
        "estado",
    ],
    "proveedores": [
        "id",
        "razon_social",
        "alias_proveedor",
        "rfc",
        "credito_dias",
        "limite_credito",
        "activo",
    ],
    "ordenes_compra": [
        "id",
        "numero_orden",
        "obra_id",
        "proveedor_id",
        "comprador_nombre",
        "fecha_entrega",
        "has_iva",
        "estado",
        "subtotal",
        "total",
    ],
    "orden_compra_items": [
        "id",
        "orden_compra_id",
        "cantidad",
        "descripcion",
        "precio_unitario",
        "total",
    ],
    "pagos": [
        "id",
        "numero_pago",
        "obra_id",
        "proveedor_id",
        "orden_compra_id",
        "monto",
        "metodo_pago",
        "fecha_programada",
        "estado",
        "folio_factura",
        "monto_factura",
        "fecha_factura",
        "dias_credito",
        "fecha_vencimiento",
    ],
    "bank_transactions": [
        "id",
        "fecha",
        "descripcion_banco",
        "monto",
        "orden_compra_id",
        "matched",
    ],
}


async def check_database() -> int:
    if not DATABASE_URL:
        print(f"❌ DATABASE_URL no está configurado. Crea {ENV_PATH}")
        return 1

    try:
        conn = await asyncpg.connect(DATABASE_URL)
    except Exception as exc:
        print(f"❌ No se pudo conectar a la base de datos: {exc}")
        return 1

    try:
        extensions = await conn.fetch(
            "SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp')"
        )
        ext_names = {row["extname"] for row in extensions}
        if "pgcrypto" not in ext_names:
            print("❌ Extensión pgcrypto no encontrada.")
            return 1
        print("✅ Extensiones requeridas OK:", ", ".join(sorted(ext_names)))

        for table, columns in REQUIRED_TABLES.items():
            table_exists = await conn.fetchval(
                """
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables
                    WHERE table_schema = 'public' AND table_name = $1
                )
                """,
                table,
            )
            if not table_exists:
                print(f"❌ Falta tabla: {table}")
                return 1

            rows = await conn.fetch(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = $1
                """,
                table,
            )
            existing = {row["column_name"] for row in rows}
            missing = [col for col in columns if col not in existing]
            if missing:
                print(f"❌ Tabla {table} sin columnas: {', '.join(missing)}")
                return 1

        print("✅ Tablas y columnas mínimas OK.")
        return 0
    finally:
        await conn.close()


def main() -> None:
    exit_code = asyncio.run(check_database())
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
