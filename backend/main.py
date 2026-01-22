"""
FastAPI Backend - Sistema de Gestión Empresarial IDP
Main application con CRUD completo alineado al modelo único de dominio
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime, date
from decimal import Decimal
import os
import asyncpg
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

from db.schema import ensure_schema

# =====================================================
# CONFIGURACIÓN DE BASE DE DATOS
# =====================================================

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")
def format_database_error(message: str) -> str:
    return (
        f"{message}\n"
        f"Revisa tu archivo {ENV_PATH} y agrega:\n"
        "DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
    )

def validate_database_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"postgresql", "postgres"}:
        raise RuntimeError(format_database_error("DATABASE_URL inválida: esquema no soportado."))
    if not parsed.hostname or not parsed.path or parsed.path == "/":
        raise RuntimeError(format_database_error("DATABASE_URL inválida: falta host o base de datos."))

if not DATABASE_URL:
    raise RuntimeError(format_database_error("DATABASE_URL no está configurado."))

validate_database_url(DATABASE_URL)

print("✅ DATABASE_URL cargado desde variables de entorno (.env u OS).")

def ensure_sslmode(url: str) -> str:
    if "sslmode=" in url:
        return url
    if "supabase" in url.lower() or os.getenv("DB_SSLMODE", "").lower() == "require":
        separator = "&" if "?" in url else "?"
        return f"{url}{separator}sslmode=require"
    return url

DATABASE_URL = ensure_sslmode(DATABASE_URL)

# Pool de conexiones global
db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    except Exception as exc:
        raise RuntimeError(format_database_error(f"Error conectando a la base de datos: {exc}")) from exc
    async with db_pool.acquire() as conn:
        try:
            await ensure_schema(conn)
        except Exception as exc:
            raise RuntimeError(format_database_error(f"Error asegurando esquema: {exc}")) from exc
    print("✅ Database pool created")
    yield
    # Shutdown
    await db_pool.close()
    print("👋 Database pool closed")

# =====================================================
# APLICACIÓN FASTAPI
# =====================================================

app = FastAPI(
    title="IDP Gestión Empresarial API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS - Configuración correcta para producción
# No usar "*" cuando allow_credentials=True
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
]

# Agregar origen de producción desde variable de entorno
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# MODELOS PYDANTIC (100% alineados al SQL)
# =====================================================

# ===== OBRA =====
class ObraBase(BaseModel):
    codigo: str
    nombre: str
    numero_contrato: str
    cliente: str
    residente: str
    direccion: Optional[str] = None
    monto_contratado: Decimal
    fecha_inicio: date
    fecha_fin_programada: date
    plazo_ejecucion: int
    estado: str  # 'activa', 'suspendida', 'terminada', 'cancelada'

class ObraCreate(ObraBase):
    pass

class Obra(ObraBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ===== PROVEEDOR =====
class ProveedorBase(BaseModel):
    razon_social: str
    nombre_comercial: Optional[str] = None
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
    tipo_proveedor: str  # 'material', 'servicio', 'renta', 'mixto'
    credito_dias: int = 0
    limite_credito: Decimal = 0
    activo: bool = True

class ProveedorCreate(ProveedorBase):
    pass

class Proveedor(ProveedorBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ===== REQUISICIÓN ITEM =====
class RequisicionItemBase(BaseModel):
    cantidad: Decimal
    unidad: str
    descripcion: str

class RequisicionItemCreate(RequisicionItemBase):
    pass

class RequisicionItem(RequisicionItemBase):
    id: str
    requisicion_id: str
    created_at: datetime

# ===== REQUISICIÓN =====
class RequisicionBase(BaseModel):
    numero_requisicion: str
    obra_id: str
    solicitado_por: str
    urgencia: str  # 'normal', 'urgente', 'muy_urgente'
    estado: str  # 'pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada'
    observaciones: Optional[str] = None
    aprobado_por: Optional[str] = None
    fecha_aprobacion: Optional[datetime] = None
    motivo_rechazo: Optional[str] = None

class RequisicionCreate(BaseModel):
    obra_id: str
    solicitado_por: str
    urgencia: str
    observaciones: Optional[str] = None
    items: List[RequisicionItemCreate]

class Requisicion(RequisicionBase):
    id: str
    fecha_solicitud: datetime
    created_at: datetime
    updated_at: datetime
    items: List[RequisicionItem] = []

    class Config:
        from_attributes = True

# ===== ORDEN DE COMPRA ITEM =====
class OrdenCompraItemBase(BaseModel):
    cantidad: Decimal
    unidad: str
    descripcion: str
    precio_unitario: Decimal
    total: Decimal

class OrdenCompraItemCreate(OrdenCompraItemBase):
    pass

class OrdenCompraItem(OrdenCompraItemBase):
    id: str
    orden_compra_id: str
    created_at: datetime

# ===== ORDEN DE COMPRA =====
class OrdenCompraBase(BaseModel):
    numero_orden: str
    obra_id: str
    proveedor_id: str
    requisicion_id: Optional[str] = None
    fecha_entrega: date
    estado: str  # 'borrador', 'emitida', 'recibida', 'facturada', 'pagada', 'cancelada'
    tipo_entrega: str  # 'en_obra', 'bodega', 'recoger'
    subtotal: Decimal
    descuento: Decimal = 0
    descuento_monto: Decimal = 0
    iva: Decimal = 0
    total: Decimal
    observaciones: Optional[str] = None
    creado_por: Optional[str] = None

class OrdenCompraCreate(BaseModel):
    obra_id: str
    proveedor_id: str
    requisicion_id: Optional[str] = None
    fecha_entrega: date
    tipo_entrega: str
    observaciones: Optional[str] = None
    creado_por: Optional[str] = None
    items: List[OrdenCompraItemCreate]

class OrdenCompra(OrdenCompraBase):
    id: str
    fecha_emision: datetime
    created_at: datetime
    updated_at: datetime
    items: List[OrdenCompraItem] = []

    class Config:
        from_attributes = True

# ===== PAGO =====
class PagoBase(BaseModel):
    numero_pago: str
    obra_id: str
    proveedor_id: str
    orden_compra_id: str
    monto: Decimal
    metodo_pago: str  # 'transferencia', 'cheque', 'efectivo'
    fecha_programada: date
    estado: str  # 'programado', 'procesando', 'completado', 'cancelado'
    referencia: Optional[str] = None
    comprobante: Optional[str] = None
    observaciones: Optional[str] = None
    procesado_por: Optional[str] = None

class PagoCreate(BaseModel):
    obra_id: str
    proveedor_id: str
    orden_compra_id: str
    monto: Decimal
    metodo_pago: str
    fecha_programada: date
    referencia: Optional[str] = None
    observaciones: Optional[str] = None

class Pago(PagoBase):
    id: str
    fecha_procesado: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ===== BANK TRANSACTIONS (CONCILIACIÓN) =====
class BankTransactionBase(BaseModel):
    fecha: date
    descripcion_banco: str
    monto: Decimal
    referencia_bancaria: Optional[str] = None
    origen: str = "csv"  # 'csv' | 'manual'
    match_confidence: int = 0
    match_manual: bool = False
    orden_compra_id: Optional[str] = None
    matched: bool = False

class BankTransactionCreate(BankTransactionBase):
    pass

class BankTransactionMatch(BaseModel):
    orden_compra_id: str
    match_confidence: int = 0
    match_manual: bool = True

class BankTransaction(BankTransactionBase):
    id: str
    descripcion_banco_normalizada: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ===== PAGINACIÓN =====
class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

# =====================================================
# HELPER: GENERAR NÚMEROS AUTOMÁTICOS
# =====================================================

async def generate_numero_requisicion(conn) -> str:
    """Genera número de requisición: REQ-YYYY-XXX"""
    year = datetime.now().year
    query = """
        SELECT numero_requisicion FROM requisiciones 
        WHERE numero_requisicion LIKE $1 
        ORDER BY numero_requisicion DESC LIMIT 1
    """
    result = await conn.fetchval(query, f"REQ-{year}-%")
    if result:
        last_num = int(result.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    return f"REQ-{year}-{new_num:03d}"

async def generate_numero_orden(conn) -> str:
    """Genera número de OC: OC-YYYY-XXX"""
    year = datetime.now().year
    query = """
        SELECT numero_orden FROM ordenes_compra 
        WHERE numero_orden LIKE $1 
        ORDER BY numero_orden DESC LIMIT 1
    """
    result = await conn.fetchval(query, f"OC-{year}-%")
    if result:
        last_num = int(result.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    return f"OC-{year}-{new_num:03d}"

async def generate_numero_pago(conn) -> str:
    """Genera número de pago: PAG-YYYY-XXX"""
    year = datetime.now().year
    query = """
        SELECT numero_pago FROM pagos 
        WHERE numero_pago LIKE $1 
        ORDER BY numero_pago DESC LIMIT 1
    """
    result = await conn.fetchval(query, f"PAG-{year}-%")
    if result:
        last_num = int(result.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    return f"PAG-{year}-{new_num:03d}"

# =====================================================
# ENDPOINTS: HEALTH CHECK
# =====================================================

@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "IDP Gestión Empresarial API v1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    if db_pool is None:
        raise HTTPException(status_code=503, detail="Database pool no inicializado.")
    try:
        async with db_pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database disconnected: {e}")

# =====================================================
# ENDPOINTS: OBRAS
# =====================================================

@app.get("/api/obras")
async def list_obras(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    estado: Optional[str] = None
):
    async with db_pool.acquire() as conn:
        # Contar total
        count_query = "SELECT COUNT(*) FROM obras"
        where_clause = ""
        params = []
        
        if estado:
            where_clause = " WHERE estado = $1"
            params.append(estado)
        
        total = await conn.fetchval(count_query + where_clause, *params)
        
        # Obtener datos
        offset = (page - 1) * page_size
        query = f"""
            SELECT * FROM obras
            {where_clause}
            ORDER BY created_at DESC
            LIMIT ${len(params)+1} OFFSET ${len(params)+2}
        """
        params.extend([page_size, offset])
        
        rows = await conn.fetch(query, *params)
        data = [dict(row) for row in rows]
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

@app.get("/api/obras/{obra_id}")
async def get_obra(obra_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM obras WHERE id = $1", obra_id)
        if not row:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        return dict(row)

@app.post("/api/obras")
async def create_obra(obra: ObraCreate):
    async with db_pool.acquire() as conn:
        query = """
            INSERT INTO obras (codigo, nombre, numero_contrato, cliente, residente, direccion, 
                             monto_contratado, fecha_inicio, fecha_fin_programada, plazo_ejecucion, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        """
        try:
            row = await conn.fetchrow(
                query,
                obra.codigo, obra.nombre, obra.numero_contrato, obra.cliente, obra.residente,
                obra.direccion, obra.monto_contratado, obra.fecha_inicio, obra.fecha_fin_programada,
                obra.plazo_ejecucion, obra.estado
            )
            return dict(row)
        except asyncpg.UniqueViolationError:
            raise HTTPException(status_code=400, detail="Código o número de contrato ya existe")

@app.put("/api/obras/{obra_id}")
async def update_obra(obra_id: str, updates: dict):
    async with db_pool.acquire() as conn:
        # Verificar que existe
        exists = await conn.fetchval("SELECT id FROM obras WHERE id = $1", obra_id)
        if not exists:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        # Construir query dinámicamente
        fields = []
        values = []
        idx = 1
        for key, value in updates.items():
            if key not in ['id', 'created_at', 'updated_at']:
                fields.append(f"{key} = ${idx}")
                values.append(value)
                idx += 1
        
        if not fields:
            raise HTTPException(status_code=400, detail="No hay campos para actualizar")
        
        values.append(obra_id)
        query = f"UPDATE obras SET {', '.join(fields)} WHERE id = ${idx} RETURNING *"
        
        row = await conn.fetchrow(query, *values)
        return dict(row)

@app.delete("/api/obras/{obra_id}")
async def delete_obra(obra_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute("DELETE FROM obras WHERE id = $1", obra_id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        return {"message": "Obra eliminada exitosamente"}

# =====================================================
# ENDPOINTS: PROVEEDORES
# =====================================================

@app.get("/api/proveedores")
async def list_proveedores(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = None
):
    async with db_pool.acquire() as conn:
        where_clause = ""
        params = []
        
        if activo is not None:
            where_clause = " WHERE activo = $1"
            params.append(activo)
        
        total = await conn.fetchval(f"SELECT COUNT(*) FROM proveedores{where_clause}", *params)
        
        offset = (page - 1) * page_size
        query = f"""
            SELECT * FROM proveedores
            {where_clause}
            ORDER BY razon_social ASC
            LIMIT ${len(params)+1} OFFSET ${len(params)+2}
        """
        params.extend([page_size, offset])
        
        rows = await conn.fetch(query, *params)
        data = [dict(row) for row in rows]
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

@app.get("/api/proveedores/{proveedor_id}")
async def get_proveedor(proveedor_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM proveedores WHERE id = $1", proveedor_id)
        if not row:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        return dict(row)

@app.post("/api/proveedores")
async def create_proveedor(proveedor: ProveedorCreate):
    async with db_pool.acquire() as conn:
        query = """
            INSERT INTO proveedores (razon_social, nombre_comercial, rfc, direccion, ciudad, codigo_postal,
                                   telefono, email, contacto_principal, banco, numero_cuenta, clabe,
                                   tipo_proveedor, credito_dias, limite_credito, activo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        """
        try:
            row = await conn.fetchrow(
                query,
                proveedor.razon_social, proveedor.nombre_comercial, proveedor.rfc, proveedor.direccion,
                proveedor.ciudad, proveedor.codigo_postal, proveedor.telefono, proveedor.email,
                proveedor.contacto_principal, proveedor.banco, proveedor.numero_cuenta, proveedor.clabe,
                proveedor.tipo_proveedor, proveedor.credito_dias, proveedor.limite_credito, proveedor.activo
            )
            return dict(row)
        except asyncpg.UniqueViolationError:
            raise HTTPException(status_code=400, detail="RFC ya existe")

@app.put("/api/proveedores/{proveedor_id}")
async def update_proveedor(proveedor_id: str, updates: dict):
    async with db_pool.acquire() as conn:
        exists = await conn.fetchval("SELECT id FROM proveedores WHERE id = $1", proveedor_id)
        if not exists:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        
        fields = []
        values = []
        idx = 1
        for key, value in updates.items():
            if key not in ['id', 'created_at', 'updated_at']:
                fields.append(f"{key} = ${idx}")
                values.append(value)
                idx += 1
        
        if not fields:
            raise HTTPException(status_code=400, detail="No hay campos para actualizar")
        
        values.append(proveedor_id)
        query = f"UPDATE proveedores SET {', '.join(fields)} WHERE id = ${idx} RETURNING *"
        
        row = await conn.fetchrow(query, *values)
        return dict(row)

@app.delete("/api/proveedores/{proveedor_id}")
async def delete_proveedor(proveedor_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute("DELETE FROM proveedores WHERE id = $1", proveedor_id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        return {"message": "Proveedor eliminado exitosamente"}

# =====================================================
# ENDPOINTS: REQUISICIONES
# =====================================================

@app.get("/api/requisiciones")
async def list_requisiciones(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    obra_id: Optional[str] = None,
    estado: Optional[str] = None
):
    async with db_pool.acquire() as conn:
        where_clauses = []
        params = []
        idx = 1
        
        if obra_id:
            where_clauses.append(f"obra_id = ${idx}")
            params.append(obra_id)
            idx += 1
        
        if estado:
            where_clauses.append(f"estado = ${idx}")
            params.append(estado)
            idx += 1
        
        where_clause = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
        
        total = await conn.fetchval(f"SELECT COUNT(*) FROM requisiciones{where_clause}", *params)
        
        offset = (page - 1) * page_size
        query = f"""
            SELECT * FROM requisiciones
            {where_clause}
            ORDER BY fecha_solicitud DESC
            LIMIT ${idx} OFFSET ${idx+1}
        """
        params.extend([page_size, offset])
        
        rows = await conn.fetch(query, *params)
        
        # Cargar items para cada requisición
        data = []
        for row in rows:
            req = dict(row)
            items_rows = await conn.fetch(
                "SELECT * FROM requisicion_items WHERE requisicion_id = $1",
                req['id']
            )
            req['items'] = [dict(item) for item in items_rows]
            data.append(req)
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

@app.get("/api/requisiciones/{requisicion_id}")
async def get_requisicion(requisicion_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM requisiciones WHERE id = $1", requisicion_id)
        if not row:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
        
        req = dict(row)
        items_rows = await conn.fetch(
            "SELECT * FROM requisicion_items WHERE requisicion_id = $1",
            requisicion_id
        )
        req['items'] = [dict(item) for item in items_rows]
        
        return req

@app.post("/api/requisiciones")
async def create_requisicion(req: RequisicionCreate):
    async with db_pool.acquire() as conn:
        async with conn.transaction():
            # Generar número
            numero = await generate_numero_requisicion(conn)
            
            # Insertar requisición
            query = """
                INSERT INTO requisiciones (numero_requisicion, obra_id, solicitado_por, urgencia, estado, observaciones)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            """
            row = await conn.fetchrow(
                query,
                numero, req.obra_id, req.solicitado_por, req.urgencia, 'pendiente', req.observaciones
            )
            requisicion = dict(row)
            
            # Insertar items
            items = []
            for item in req.items:
                item_row = await conn.fetchrow(
                    """
                    INSERT INTO requisicion_items (requisicion_id, cantidad, unidad, descripcion)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                    """,
                    requisicion['id'], item.cantidad, item.unidad, item.descripcion
                )
                items.append(dict(item_row))
            
            requisicion['items'] = items
            return requisicion

@app.put("/api/requisiciones/{requisicion_id}/aprobar")
async def aprobar_requisicion(requisicion_id: str, data: dict):
    async with db_pool.acquire() as conn:
        aprobado_por = data.get("aprobado_por", "Sistema")
        row = await conn.fetchrow(
            """
            UPDATE requisiciones 
            SET estado = 'aprobada', aprobado_por = $1, fecha_aprobacion = NOW()
            WHERE id = $2
            RETURNING *
            """,
            aprobado_por, requisicion_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
        return dict(row)

# =====================================================
# ENDPOINTS: ÓRDENES DE COMPRA
# =====================================================

@app.get("/api/ordenes-compra")
async def list_ordenes_compra(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    obra_id: Optional[str] = None,
    proveedor_id: Optional[str] = None,
    estado: Optional[str] = None
):
    async with db_pool.acquire() as conn:
        where_clauses = []
        params = []
        idx = 1
        
        if obra_id:
            where_clauses.append(f"obra_id = ${idx}")
            params.append(obra_id)
            idx += 1
        
        if proveedor_id:
            where_clauses.append(f"proveedor_id = ${idx}")
            params.append(proveedor_id)
            idx += 1
        
        if estado:
            where_clauses.append(f"estado = ${idx}")
            params.append(estado)
            idx += 1
        
        where_clause = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
        
        total = await conn.fetchval(f"SELECT COUNT(*) FROM ordenes_compra{where_clause}", *params)
        
        offset = (page - 1) * page_size
        query = f"""
            SELECT * FROM ordenes_compra
            {where_clause}
            ORDER BY fecha_emision DESC
            LIMIT ${idx} OFFSET ${idx+1}
        """
        params.extend([page_size, offset])
        
        rows = await conn.fetch(query, *params)
        
        # Cargar items
        data = []
        for row in rows:
            oc = dict(row)
            items_rows = await conn.fetch(
                "SELECT * FROM orden_compra_items WHERE orden_compra_id = $1",
                oc['id']
            )
            oc['items'] = [dict(item) for item in items_rows]
            data.append(oc)
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

@app.get("/api/ordenes-compra/{orden_id}")
async def get_orden_compra(orden_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM ordenes_compra WHERE id = $1", orden_id)
        if not row:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        
        oc = dict(row)
        items_rows = await conn.fetch(
            "SELECT * FROM orden_compra_items WHERE orden_compra_id = $1",
            orden_id
        )
        oc['items'] = [dict(item) for item in items_rows]
        
        return oc

@app.post("/api/ordenes-compra")
async def create_orden_compra(oc: OrdenCompraCreate):
    async with db_pool.acquire() as conn:
        async with conn.transaction():
            # Generar número
            numero = await generate_numero_orden(conn)
            
            # Calcular totales
            subtotal = sum(item.total for item in oc.items)
            descuento_monto = Decimal("0")
            iva = subtotal * Decimal("0.16")
            total = subtotal + iva
            
            # Insertar OC
            query = """
                INSERT INTO ordenes_compra (
                    numero_orden, obra_id, proveedor_id, requisicion_id, fecha_entrega,
                    estado, tipo_entrega, subtotal, descuento, descuento_monto, iva, total,
                    observaciones, creado_por
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING *
            """
            row = await conn.fetchrow(
                query,
                numero, oc.obra_id, oc.proveedor_id, oc.requisicion_id, oc.fecha_entrega,
                'emitida', oc.tipo_entrega, subtotal, 0, descuento_monto, iva, total,
                oc.observaciones, oc.creado_por
            )
            orden = dict(row)
            
            # Insertar items
            items = []
            for item in oc.items:
                item_row = await conn.fetchrow(
                    """
                    INSERT INTO orden_compra_items (
                        orden_compra_id, cantidad, unidad, descripcion, precio_unitario, total
                    )
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                    """,
                    orden['id'], item.cantidad, item.unidad, item.descripcion,
                    item.precio_unitario, item.total
                )
                items.append(dict(item_row))
            
            orden['items'] = items
            return orden

@app.put("/api/ordenes-compra/{orden_id}")
async def update_orden_compra(orden_id: str, updates: dict):
    async with db_pool.acquire() as conn:
        exists = await conn.fetchval("SELECT id FROM ordenes_compra WHERE id = $1", orden_id)
        if not exists:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        
        fields = []
        values = []
        idx = 1
        for key, value in updates.items():
            if key not in ['id', 'created_at', 'updated_at', 'fecha_emision', 'numero_orden']:
                fields.append(f"{key} = ${idx}")
                values.append(value)
                idx += 1
        
        if not fields:
            raise HTTPException(status_code=400, detail="No hay campos para actualizar")
        
        values.append(orden_id)
        query = f"UPDATE ordenes_compra SET {', '.join(fields)} WHERE id = ${idx} RETURNING *"
        
        row = await conn.fetchrow(query, *values)
        return dict(row)

@app.delete("/api/ordenes-compra/{orden_id}")
async def delete_orden_compra(orden_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute("DELETE FROM ordenes_compra WHERE id = $1", orden_id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        return {"message": "Orden de compra eliminada exitosamente"}

# =====================================================
# ENDPOINTS: PAGOS
# =====================================================

@app.get("/api/pagos")
async def list_pagos(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    obra_id: Optional[str] = None,
    proveedor_id: Optional[str] = None,
    orden_compra_id: Optional[str] = None,
    estado: Optional[str] = None
):
    async with db_pool.acquire() as conn:
        where_clauses = []
        params = []
        idx = 1
        
        if obra_id:
            where_clauses.append(f"obra_id = ${idx}")
            params.append(obra_id)
            idx += 1

        if proveedor_id:
            where_clauses.append(f"proveedor_id = ${idx}")
            params.append(proveedor_id)
            idx += 1

        if orden_compra_id:
            where_clauses.append(f"orden_compra_id = ${idx}")
            params.append(orden_compra_id)
            idx += 1
        
        if estado:
            where_clauses.append(f"estado = ${idx}")
            params.append(estado)
            idx += 1
        
        where_clause = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
        
        total = await conn.fetchval(f"SELECT COUNT(*) FROM pagos{where_clause}", *params)
        
        offset = (page - 1) * page_size
        query = f"""
            SELECT * FROM pagos
            {where_clause}
            ORDER BY fecha_programada DESC
            LIMIT ${idx} OFFSET ${idx+1}
        """
        params.extend([page_size, offset])
        
        rows = await conn.fetch(query, *params)
        data = [dict(row) for row in rows]
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }

@app.get("/api/pagos/{pago_id}")
async def get_pago(pago_id: str):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM pagos WHERE id = $1", pago_id)
        if not row:
            raise HTTPException(status_code=404, detail="Pago no encontrado")
        return dict(row)

@app.post("/api/pagos")
async def create_pago(pago: PagoCreate):
    async with db_pool.acquire() as conn:
        numero = await generate_numero_pago(conn)
        
        query = """
            INSERT INTO pagos (
                numero_pago, obra_id, proveedor_id, orden_compra_id, monto,
                metodo_pago, fecha_programada, estado, referencia, observaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        """
        row = await conn.fetchrow(
            query,
            numero, pago.obra_id, pago.proveedor_id, pago.orden_compra_id, pago.monto,
            pago.metodo_pago, pago.fecha_programada, 'programado', pago.referencia, pago.observaciones
        )
        return dict(row)

@app.put("/api/pagos/{pago_id}/procesar")
async def procesar_pago(pago_id: str, data: dict):
    async with db_pool.acquire() as conn:
        procesado_por = data.get("procesado_por", "Sistema")
        row = await conn.fetchrow(
            """
            UPDATE pagos 
            SET estado = 'completado', procesado_por = $1, fecha_procesado = NOW()
            WHERE id = $2
            RETURNING *
            """,
            procesado_por, pago_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Pago no encontrado")
        return dict(row)

@app.put("/api/pagos/{pago_id}")
async def update_pago(pago_id: str, updates: dict):
    async with db_pool.acquire() as conn:
        exists = await conn.fetchval("SELECT id FROM pagos WHERE id = $1", pago_id)
        if not exists:
            raise HTTPException(status_code=404, detail="Pago no encontrado")
        
        fields = []
        values = []
        idx = 1
        for key, value in updates.items():
            if key not in ['id', 'created_at', 'updated_at', 'numero_pago']:
                fields.append(f"{key} = ${idx}")
                values.append(value)
                idx += 1
        
        if not fields:
            raise HTTPException(status_code=400, detail="No hay campos para actualizar")
        
        values.append(pago_id)
        query = f"UPDATE pagos SET {', '.join(fields)} WHERE id = ${idx} RETURNING *"
        
        row = await conn.fetchrow(query, *values)
        return dict(row)

@app.delete("/api/pagos/{pago_id}")
async def delete_pago(pago_id: str):
    async with db_pool.acquire() as conn:
        result = await conn.execute("DELETE FROM pagos WHERE id = $1", pago_id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Pago no encontrado")
        return {"message": "Pago eliminado exitosamente"}

# =====================================================
# ENDPOINTS: BANK TRANSACTIONS (CONCILIACIÓN)
# =====================================================

@app.get("/api/bank-transactions")
async def list_bank_transactions(matched: Optional[bool] = None):
    async with db_pool.acquire() as conn:
        where_clause = ""
        params = []
        if matched is not None:
            where_clause = " WHERE matched = $1"
            params.append(matched)
        rows = await conn.fetch(
            f"SELECT * FROM bank_transactions{where_clause} ORDER BY fecha DESC, created_at DESC",
            *params
        )
        return [dict(row) for row in rows]

@app.post("/api/bank-transactions/import")
async def import_bank_transactions(items: List[BankTransactionCreate]):
    async with db_pool.acquire() as conn:
        async with conn.transaction():
            inserted = []
            for item in items:
                normalized = " ".join(item.descripcion_banco.lower().split())
                row = await conn.fetchrow(
                    """
                    INSERT INTO bank_transactions (
                        fecha, descripcion_banco, descripcion_banco_normalizada, monto,
                        referencia_bancaria, origen, match_confidence, match_manual, orden_compra_id, matched
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING *
                    """,
                    item.fecha,
                    item.descripcion_banco,
                    normalized,
                    item.monto,
                    item.referencia_bancaria,
                    item.origen,
                    item.match_confidence,
                    item.match_manual,
                    item.orden_compra_id,
                    item.matched,
                )
                inserted.append(dict(row))
            return inserted

@app.put("/api/bank-transactions/{transaction_id}/match")
async def match_bank_transaction(transaction_id: str, data: BankTransactionMatch):
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE bank_transactions
            SET orden_compra_id = $1,
                matched = TRUE,
                match_confidence = $2,
                match_manual = $3,
                updated_at = NOW()
            WHERE id = $4
            RETURNING *
            """,
            data.orden_compra_id,
            data.match_confidence,
            data.match_manual,
            transaction_id,
        )
        if not row:
            raise HTTPException(status_code=404, detail="Transacción no encontrada")
        return dict(row)

# =====================================================
# FIN DEL BACKEND
# =====================================================
