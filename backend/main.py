from __future__ import annotations

import os
from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

API_PREFIX = "/api/v1"


def build_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")

    if "sslmode=" not in database_url:
        separator = "&" if "?" in database_url else "?"
        database_url = f"{database_url}{separator}sslmode=require"

    return database_url


def get_engine() -> Engine:
    return create_engine(build_database_url(), pool_pre_ping=True)


def ensure_schema(engine: Engine) -> None:
    schema_statements = [
        """
        CREATE TABLE IF NOT EXISTS obras (
            obra_id UUID PRIMARY KEY,
            codigo_obra VARCHAR(50) UNIQUE NOT NULL,
            nombre_obra VARCHAR(255) NOT NULL,
            cliente VARCHAR(255) NOT NULL,
            residente VARCHAR(255),
            direccion TEXT,
            fecha_inicio DATE,
            fecha_fin_estimada DATE,
            presupuesto_total NUMERIC(15, 2) NOT NULL,
            estatus VARCHAR(20) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS proveedores (
            proveedor_id UUID PRIMARY KEY,
            alias_proveedor VARCHAR(255) NOT NULL,
            razon_social VARCHAR(255) NOT NULL,
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
            tipo_proveedor VARCHAR(20),
            dias_credito INTEGER NOT NULL DEFAULT 0,
            limite_credito NUMERIC(15, 2) NOT NULL DEFAULT 0,
            activo BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS requisiciones (
            requisicion_id UUID PRIMARY KEY,
            numero_requisicion VARCHAR(50) UNIQUE NOT NULL,
            obra_id UUID NOT NULL,
            residente_nombre VARCHAR(255) NOT NULL,
            fecha_creacion DATE NOT NULL,
            fecha_entrega_requerida DATE,
            urgencia VARCHAR(20) NOT NULL,
            estatus VARCHAR(20) NOT NULL,
            observaciones TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS requisicion_items (
            item_id UUID PRIMARY KEY,
            requisicion_id UUID NOT NULL,
            descripcion TEXT NOT NULL,
            cantidad NUMERIC(12, 2) NOT NULL,
            unidad VARCHAR(20) NOT NULL,
            orden_item INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS ordenes_compra (
            oc_id UUID PRIMARY KEY,
            numero_oc VARCHAR(50) UNIQUE NOT NULL,
            obra_id UUID NOT NULL,
            proveedor_id UUID NOT NULL,
            comprador VARCHAR(255) NOT NULL,
            fecha_creacion DATE NOT NULL,
            fecha_entrega DATE NOT NULL,
            tipo_entrega VARCHAR(20) NOT NULL,
            aplica_iva BOOLEAN NOT NULL,
            porcentaje_descuento NUMERIC(5, 2) NOT NULL DEFAULT 0,
            subtotal NUMERIC(15, 2) NOT NULL,
            monto_descuento NUMERIC(15, 2) NOT NULL,
            iva NUMERIC(15, 2) NOT NULL,
            total NUMERIC(15, 2) NOT NULL,
            observaciones TEXT,
            estatus VARCHAR(20) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS orden_compra_items (
            item_id UUID PRIMARY KEY,
            oc_id UUID NOT NULL,
            descripcion TEXT NOT NULL,
            cantidad NUMERIC(12, 2) NOT NULL,
            unidad VARCHAR(20) NOT NULL,
            precio_unitario NUMERIC(15, 2) NOT NULL,
            subtotal_item NUMERIC(15, 2) NOT NULL,
            orden_item INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS pagos (
            pago_id UUID PRIMARY KEY,
            oc_id UUID NOT NULL,
            obra_id UUID NOT NULL,
            proveedor_id UUID NOT NULL,
            numero_pago VARCHAR(50) UNIQUE NOT NULL,
            fecha_pago DATE NOT NULL,
            monto_pagado NUMERIC(15, 2) NOT NULL,
            metodo_pago VARCHAR(20) NOT NULL,
            referencia_pago VARCHAR(255),
            banco VARCHAR(100),
            factura_numero VARCHAR(100),
            factura_xml_url TEXT,
            factura_pdf_url TEXT,
            notas TEXT,
            estatus VARCHAR(20) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
    ]

    with engine.begin() as connection:
        for statement in schema_statements:
            connection.execute(text(statement))


def row_to_dict(row: Any) -> Dict[str, Any]:
    return dict(row._mapping)


def success_response(data: Any) -> Dict[str, Any]:
    return {"status": "success", "data": data, "error": None}


def error_response(message: str) -> Dict[str, Any]:
    return {"status": "error", "data": None, "error": message}


class ObraBase(BaseModel):
    codigo_obra: str
    nombre_obra: str
    cliente: str
    residente: Optional[str] = None
    direccion: Optional[str] = None
    fecha_inicio: Optional[str] = None
    fecha_fin_estimada: Optional[str] = None
    presupuesto_total: float
    estatus: str


class ObraCreate(ObraBase):
    obra_id: Optional[str] = None


class ObraUpdate(BaseModel):
    codigo_obra: Optional[str] = None
    nombre_obra: Optional[str] = None
    cliente: Optional[str] = None
    residente: Optional[str] = None
    direccion: Optional[str] = None
    fecha_inicio: Optional[str] = None
    fecha_fin_estimada: Optional[str] = None
    presupuesto_total: Optional[float] = None
    estatus: Optional[str] = None


class ProveedorBase(BaseModel):
    alias_proveedor: str
    razon_social: str
    rfc: str
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    codigo_postal: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    contacto_principal: Optional[str] = None
    banco: Optional[str] = None
    numero_cuenta: Optional[str] = None
    clabe: Optional[str] = None
    tipo_proveedor: Optional[str] = None
    dias_credito: int = 0
    limite_credito: float = 0
    activo: bool = True


class ProveedorCreate(ProveedorBase):
    proveedor_id: Optional[str] = None


class ProveedorUpdate(BaseModel):
    alias_proveedor: Optional[str] = None
    razon_social: Optional[str] = None
    rfc: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    codigo_postal: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    contacto_principal: Optional[str] = None
    banco: Optional[str] = None
    numero_cuenta: Optional[str] = None
    clabe: Optional[str] = None
    tipo_proveedor: Optional[str] = None
    dias_credito: Optional[int] = None
    limite_credito: Optional[float] = None
    activo: Optional[bool] = None


class RequisicionItemPayload(BaseModel):
    descripcion: str
    cantidad: float
    unidad: str
    orden_item: int


class RequisicionBase(BaseModel):
    numero_requisicion: str
    obra_id: str
    residente_nombre: str
    fecha_creacion: str
    fecha_entrega_requerida: Optional[str] = None
    urgencia: str
    estatus: str
    observaciones: Optional[str] = None
    items: List[RequisicionItemPayload] = Field(default_factory=list)


class RequisicionCreate(RequisicionBase):
    requisicion_id: Optional[str] = None


class RequisicionUpdate(BaseModel):
    numero_requisicion: Optional[str] = None
    obra_id: Optional[str] = None
    residente_nombre: Optional[str] = None
    fecha_creacion: Optional[str] = None
    fecha_entrega_requerida: Optional[str] = None
    urgencia: Optional[str] = None
    estatus: Optional[str] = None
    observaciones: Optional[str] = None


class OrdenCompraItemPayload(BaseModel):
    descripcion: str
    cantidad: float
    unidad: str
    precio_unitario: float
    subtotal_item: float
    orden_item: int


class OrdenCompraBase(BaseModel):
    numero_oc: str
    obra_id: str
    proveedor_id: str
    comprador: str
    fecha_creacion: str
    fecha_entrega: str
    tipo_entrega: str
    aplica_iva: bool
    porcentaje_descuento: float
    subtotal: float
    monto_descuento: float
    iva: float
    total: float
    observaciones: Optional[str] = None
    estatus: str
    items: List[OrdenCompraItemPayload] = Field(default_factory=list)


class OrdenCompraCreate(OrdenCompraBase):
    oc_id: Optional[str] = None


class OrdenCompraUpdate(BaseModel):
    numero_oc: Optional[str] = None
    obra_id: Optional[str] = None
    proveedor_id: Optional[str] = None
    comprador: Optional[str] = None
    fecha_creacion: Optional[str] = None
    fecha_entrega: Optional[str] = None
    tipo_entrega: Optional[str] = None
    aplica_iva: Optional[bool] = None
    porcentaje_descuento: Optional[float] = None
    subtotal: Optional[float] = None
    monto_descuento: Optional[float] = None
    iva: Optional[float] = None
    total: Optional[float] = None
    observaciones: Optional[str] = None
    estatus: Optional[str] = None


class PagoBase(BaseModel):
    oc_id: str
    obra_id: str
    proveedor_id: str
    numero_pago: str
    fecha_pago: str
    monto_pagado: float
    metodo_pago: str
    referencia_pago: Optional[str] = None
    banco: Optional[str] = None
    factura_numero: Optional[str] = None
    factura_xml_url: Optional[str] = None
    factura_pdf_url: Optional[str] = None
    notas: Optional[str] = None
    estatus: str


class PagoCreate(PagoBase):
    pago_id: Optional[str] = None


class PagoUpdate(BaseModel):
    oc_id: Optional[str] = None
    obra_id: Optional[str] = None
    proveedor_id: Optional[str] = None
    numero_pago: Optional[str] = None
    fecha_pago: Optional[str] = None
    monto_pagado: Optional[float] = None
    metodo_pago: Optional[str] = None
    referencia_pago: Optional[str] = None
    banco: Optional[str] = None
    factura_numero: Optional[str] = None
    factura_xml_url: Optional[str] = None
    factura_pdf_url: Optional[str] = None
    notas: Optional[str] = None
    estatus: Optional[str] = None


app = FastAPI(title="IDP API", openapi_url=f"{API_PREFIX}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    engine = get_engine()
    ensure_schema(engine)


@app.get(f"{API_PREFIX}/health")
def health() -> Dict[str, Any]:
    try:
        engine = get_engine()
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return success_response({"database": "connected"})
    except Exception as exc:
        return error_response(str(exc))


@app.get(f"{API_PREFIX}/obras")
def list_obras(estatus: Optional[str] = None) -> Dict[str, Any]:
    engine = get_engine()
    query = "SELECT * FROM obras"
    params: Dict[str, Any] = {}
    if estatus:
        query += " WHERE estatus = :estatus"
        params["estatus"] = estatus
    query += " ORDER BY created_at DESC"

    with engine.connect() as connection:
        rows = connection.execute(text(query), params).fetchall()
    return success_response([row_to_dict(row) for row in rows])


@app.get(f"{API_PREFIX}/obras/{{obra_id}}")
def get_obra(obra_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        row = connection.execute(
            text("SELECT * FROM obras WHERE obra_id = :obra_id"),
            {"obra_id": obra_id},
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    return success_response(row_to_dict(row))


@app.post(f"{API_PREFIX}/obras")
def create_obra(payload: ObraCreate) -> Dict[str, Any]:
    engine = get_engine()
    obra_id = payload.obra_id or str(uuid4())
    now = datetime.utcnow().isoformat()

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO obras (
                    obra_id, codigo_obra, nombre_obra, cliente, residente, direccion,
                    fecha_inicio, fecha_fin_estimada, presupuesto_total, estatus, created_at, updated_at
                ) VALUES (
                    :obra_id, :codigo_obra, :nombre_obra, :cliente, :residente, :direccion,
                    :fecha_inicio, :fecha_fin_estimada, :presupuesto_total, :estatus, :created_at, :updated_at
                )
                """
            ),
            {
                **payload.model_dump(),
                "obra_id": obra_id,
                "created_at": now,
                "updated_at": now,
            },
        )

    return get_obra(obra_id)


@app.put(f"{API_PREFIX}/obras/{{obra_id}}")
def update_obra(obra_id: str, payload: ObraUpdate) -> Dict[str, Any]:
    engine = get_engine()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return get_obra(obra_id)

    updates["updated_at"] = datetime.utcnow().isoformat()
    set_clause = ", ".join([f"{key} = :{key}" for key in updates.keys()])

    with engine.begin() as connection:
        result = connection.execute(
            text(f"UPDATE obras SET {set_clause} WHERE obra_id = :obra_id"),
            {**updates, "obra_id": obra_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Obra no encontrada")

    return get_obra(obra_id)


@app.delete(f"{API_PREFIX}/obras/{{obra_id}}")
def delete_obra(obra_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM obras WHERE obra_id = :obra_id"),
            {"obra_id": obra_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
    return success_response({"deleted": True})


@app.get(f"{API_PREFIX}/proveedores")
def list_proveedores() -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        rows = connection.execute(text("SELECT * FROM proveedores ORDER BY created_at DESC")).fetchall()
    return success_response([row_to_dict(row) for row in rows])


@app.get(f"{API_PREFIX}/proveedores/{{proveedor_id}}")
def get_proveedor(proveedor_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        row = connection.execute(
            text("SELECT * FROM proveedores WHERE proveedor_id = :proveedor_id"),
            {"proveedor_id": proveedor_id},
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return success_response(row_to_dict(row))


@app.post(f"{API_PREFIX}/proveedores")
def create_proveedor(payload: ProveedorCreate) -> Dict[str, Any]:
    engine = get_engine()
    proveedor_id = payload.proveedor_id or str(uuid4())
    now = datetime.utcnow().isoformat()

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO proveedores (
                    proveedor_id, alias_proveedor, razon_social, rfc, direccion, ciudad,
                    codigo_postal, telefono, email, contacto_principal, banco, numero_cuenta,
                    clabe, tipo_proveedor, dias_credito, limite_credito, activo, created_at, updated_at
                ) VALUES (
                    :proveedor_id, :alias_proveedor, :razon_social, :rfc, :direccion, :ciudad,
                    :codigo_postal, :telefono, :email, :contacto_principal, :banco, :numero_cuenta,
                    :clabe, :tipo_proveedor, :dias_credito, :limite_credito, :activo, :created_at, :updated_at
                )
                """
            ),
            {
                **payload.model_dump(),
                "proveedor_id": proveedor_id,
                "created_at": now,
                "updated_at": now,
            },
        )

    return get_proveedor(proveedor_id)


@app.put(f"{API_PREFIX}/proveedores/{{proveedor_id}}")
def update_proveedor(proveedor_id: str, payload: ProveedorUpdate) -> Dict[str, Any]:
    engine = get_engine()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return get_proveedor(proveedor_id)

    updates["updated_at"] = datetime.utcnow().isoformat()
    set_clause = ", ".join([f"{key} = :{key}" for key in updates.keys()])

    with engine.begin() as connection:
        result = connection.execute(
            text(f"UPDATE proveedores SET {set_clause} WHERE proveedor_id = :proveedor_id"),
            {**updates, "proveedor_id": proveedor_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    return get_proveedor(proveedor_id)


@app.delete(f"{API_PREFIX}/proveedores/{{proveedor_id}}")
def delete_proveedor(proveedor_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM proveedores WHERE proveedor_id = :proveedor_id"),
            {"proveedor_id": proveedor_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return success_response({"deleted": True})


@app.get(f"{API_PREFIX}/requisiciones")
def list_requisiciones() -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        rows = connection.execute(text("SELECT * FROM requisiciones ORDER BY created_at DESC")).fetchall()
        requisiciones = [row_to_dict(row) for row in rows]
        for requisicion in requisiciones:
            items = connection.execute(
                text("SELECT * FROM requisicion_items WHERE requisicion_id = :requisicion_id ORDER BY orden_item"),
                {"requisicion_id": requisicion["requisicion_id"]},
            ).fetchall()
            requisicion["items"] = [row_to_dict(item) for item in items]
    return success_response(requisiciones)


@app.get(f"{API_PREFIX}/requisiciones/{{requisicion_id}}")
def get_requisicion(requisicion_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        row = connection.execute(
            text("SELECT * FROM requisiciones WHERE requisicion_id = :requisicion_id"),
            {"requisicion_id": requisicion_id},
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
        requisicion = row_to_dict(row)
        items = connection.execute(
            text("SELECT * FROM requisicion_items WHERE requisicion_id = :requisicion_id ORDER BY orden_item"),
            {"requisicion_id": requisicion_id},
        ).fetchall()
        requisicion["items"] = [row_to_dict(item) for item in items]

    return success_response(requisicion)


@app.post(f"{API_PREFIX}/requisiciones")
def create_requisicion(payload: RequisicionCreate) -> Dict[str, Any]:
    engine = get_engine()
    requisicion_id = payload.requisicion_id or str(uuid4())
    now = datetime.utcnow().isoformat()

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO requisiciones (
                    requisicion_id, numero_requisicion, obra_id, residente_nombre,
                    fecha_creacion, fecha_entrega_requerida, urgencia, estatus, observaciones,
                    created_at, updated_at
                ) VALUES (
                    :requisicion_id, :numero_requisicion, :obra_id, :residente_nombre,
                    :fecha_creacion, :fecha_entrega_requerida, :urgencia, :estatus, :observaciones,
                    :created_at, :updated_at
                )
                """
            ),
            {
                **payload.model_dump(exclude={"items"}),
                "requisicion_id": requisicion_id,
                "created_at": now,
                "updated_at": now,
            },
        )
        for item in payload.items:
            connection.execute(
                text(
                    """
                    INSERT INTO requisicion_items (
                        item_id, requisicion_id, descripcion, cantidad, unidad, orden_item, created_at
                    ) VALUES (
                        :item_id, :requisicion_id, :descripcion, :cantidad, :unidad, :orden_item, :created_at
                    )
                    """
                ),
                {
                    **item.model_dump(),
                    "item_id": str(uuid4()),
                    "requisicion_id": requisicion_id,
                    "created_at": now,
                },
            )

    return get_requisicion(requisicion_id)


@app.put(f"{API_PREFIX}/requisiciones/{{requisicion_id}}")
def update_requisicion(requisicion_id: str, payload: RequisicionUpdate) -> Dict[str, Any]:
    engine = get_engine()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return get_requisicion(requisicion_id)

    updates["updated_at"] = datetime.utcnow().isoformat()
    set_clause = ", ".join([f"{key} = :{key}" for key in updates.keys()])

    with engine.begin() as connection:
        result = connection.execute(
            text(f"UPDATE requisiciones SET {set_clause} WHERE requisicion_id = :requisicion_id"),
            {**updates, "requisicion_id": requisicion_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")

    return get_requisicion(requisicion_id)


@app.delete(f"{API_PREFIX}/requisiciones/{{requisicion_id}}")
def delete_requisicion(requisicion_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.begin() as connection:
        connection.execute(
            text("DELETE FROM requisicion_items WHERE requisicion_id = :requisicion_id"),
            {"requisicion_id": requisicion_id},
        )
        result = connection.execute(
            text("DELETE FROM requisiciones WHERE requisicion_id = :requisicion_id"),
            {"requisicion_id": requisicion_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
    return success_response({"deleted": True})


@app.get(f"{API_PREFIX}/ordenes-compra")
def list_ordenes_compra() -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        rows = connection.execute(text("SELECT * FROM ordenes_compra ORDER BY created_at DESC")).fetchall()
        ordenes = [row_to_dict(row) for row in rows]
        for orden in ordenes:
            items = connection.execute(
                text("SELECT * FROM orden_compra_items WHERE oc_id = :oc_id ORDER BY orden_item"),
                {"oc_id": orden["oc_id"]},
            ).fetchall()
            orden["items"] = [row_to_dict(item) for item in items]
    return success_response(ordenes)


@app.get(f"{API_PREFIX}/ordenes-compra/{{oc_id}}")
def get_orden_compra(oc_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        row = connection.execute(
            text("SELECT * FROM ordenes_compra WHERE oc_id = :oc_id"),
            {"oc_id": oc_id},
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        orden = row_to_dict(row)
        items = connection.execute(
            text("SELECT * FROM orden_compra_items WHERE oc_id = :oc_id ORDER BY orden_item"),
            {"oc_id": oc_id},
        ).fetchall()
        orden["items"] = [row_to_dict(item) for item in items]

    return success_response(orden)


@app.post(f"{API_PREFIX}/ordenes-compra")
def create_orden_compra(payload: OrdenCompraCreate) -> Dict[str, Any]:
    engine = get_engine()
    oc_id = payload.oc_id or str(uuid4())
    now = datetime.utcnow().isoformat()

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO ordenes_compra (
                    oc_id, numero_oc, obra_id, proveedor_id, comprador, fecha_creacion,
                    fecha_entrega, tipo_entrega, aplica_iva, porcentaje_descuento, subtotal,
                    monto_descuento, iva, total, observaciones, estatus, created_at, updated_at
                ) VALUES (
                    :oc_id, :numero_oc, :obra_id, :proveedor_id, :comprador, :fecha_creacion,
                    :fecha_entrega, :tipo_entrega, :aplica_iva, :porcentaje_descuento, :subtotal,
                    :monto_descuento, :iva, :total, :observaciones, :estatus, :created_at, :updated_at
                )
                """
            ),
            {
                **payload.model_dump(exclude={"items"}),
                "oc_id": oc_id,
                "created_at": now,
                "updated_at": now,
            },
        )
        for item in payload.items:
            connection.execute(
                text(
                    """
                    INSERT INTO orden_compra_items (
                        item_id, oc_id, descripcion, cantidad, unidad, precio_unitario,
                        subtotal_item, orden_item, created_at
                    ) VALUES (
                        :item_id, :oc_id, :descripcion, :cantidad, :unidad, :precio_unitario,
                        :subtotal_item, :orden_item, :created_at
                    )
                    """
                ),
                {
                    **item.model_dump(),
                    "item_id": str(uuid4()),
                    "oc_id": oc_id,
                    "created_at": now,
                },
            )

    return get_orden_compra(oc_id)


@app.put(f"{API_PREFIX}/ordenes-compra/{{oc_id}}")
def update_orden_compra(oc_id: str, payload: OrdenCompraUpdate) -> Dict[str, Any]:
    engine = get_engine()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return get_orden_compra(oc_id)

    updates["updated_at"] = datetime.utcnow().isoformat()
    set_clause = ", ".join([f"{key} = :{key}" for key in updates.keys()])

    with engine.begin() as connection:
        result = connection.execute(
            text(f"UPDATE ordenes_compra SET {set_clause} WHERE oc_id = :oc_id"),
            {**updates, "oc_id": oc_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")

    return get_orden_compra(oc_id)


@app.delete(f"{API_PREFIX}/ordenes-compra/{{oc_id}}")
def delete_orden_compra(oc_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.begin() as connection:
        connection.execute(
            text("DELETE FROM orden_compra_items WHERE oc_id = :oc_id"),
            {"oc_id": oc_id},
        )
        result = connection.execute(
            text("DELETE FROM ordenes_compra WHERE oc_id = :oc_id"),
            {"oc_id": oc_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    return success_response({"deleted": True})


@app.get(f"{API_PREFIX}/pagos")
def list_pagos() -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        rows = connection.execute(text("SELECT * FROM pagos ORDER BY created_at DESC")).fetchall()
    return success_response([row_to_dict(row) for row in rows])


@app.get(f"{API_PREFIX}/pagos/{{pago_id}}")
def get_pago(pago_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.connect() as connection:
        row = connection.execute(
            text("SELECT * FROM pagos WHERE pago_id = :pago_id"),
            {"pago_id": pago_id},
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return success_response(row_to_dict(row))


@app.post(f"{API_PREFIX}/pagos")
def create_pago(payload: PagoCreate) -> Dict[str, Any]:
    engine = get_engine()
    pago_id = payload.pago_id or str(uuid4())
    now = datetime.utcnow().isoformat()

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO pagos (
                    pago_id, oc_id, obra_id, proveedor_id, numero_pago, fecha_pago,
                    monto_pagado, metodo_pago, referencia_pago, banco, factura_numero,
                    factura_xml_url, factura_pdf_url, notas, estatus, created_at, updated_at
                ) VALUES (
                    :pago_id, :oc_id, :obra_id, :proveedor_id, :numero_pago, :fecha_pago,
                    :monto_pagado, :metodo_pago, :referencia_pago, :banco, :factura_numero,
                    :factura_xml_url, :factura_pdf_url, :notas, :estatus, :created_at, :updated_at
                )
                """
            ),
            {
                **payload.model_dump(),
                "pago_id": pago_id,
                "created_at": now,
                "updated_at": now,
            },
        )

    return get_pago(pago_id)


@app.put(f"{API_PREFIX}/pagos/{{pago_id}}")
def update_pago(pago_id: str, payload: PagoUpdate) -> Dict[str, Any]:
    engine = get_engine()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return get_pago(pago_id)

    updates["updated_at"] = datetime.utcnow().isoformat()
    set_clause = ", ".join([f"{key} = :{key}" for key in updates.keys()])

    with engine.begin() as connection:
        result = connection.execute(
            text(f"UPDATE pagos SET {set_clause} WHERE pago_id = :pago_id"),
            {**updates, "pago_id": pago_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Pago no encontrado")

    return get_pago(pago_id)


@app.delete(f"{API_PREFIX}/pagos/{{pago_id}}")
def delete_pago(pago_id: str) -> Dict[str, Any]:
    engine = get_engine()
    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM pagos WHERE pago_id = :pago_id"),
            {"pago_id": pago_id},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Pago no encontrado")
    return success_response({"deleted": True})
