"""
BACKEND UNIFICADO - Sistema IDP Construcción
Versión: 2.0 - Con modelo unificado (UUIDs + tablas normalizadas)
Base de datos: PostgreSQL con schema_unificado.sql
"""

from fastapi import FastAPI, HTTPException, status, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from uuid import UUID
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from contextlib import contextmanager

# Importar modelos unificados
from models import (
    # Obras
    Obra, ObraCreate, ObraUpdate,
    # Proveedores
    Proveedor, ProveedorCreate, ProveedorUpdate,
    # Requisiciones
    Requisicion, RequisicionCreate, RequisicionUpdate,
    RequisicionItem, RequisicionItemCreate,
    # Órdenes de compra
    OrdenCompra, OrdenCompraCreate, OrdenCompraUpdate,
    OrdenCompraItem, OrdenCompraItemCreate,
    # Pagos
    Pago, PagoCreate, PagoUpdate,
    # Destajos
    Destajo, DestajoCreate, DestajoUpdate,
    # Respuestas
    MessageResponse, ErrorResponse,
)

load_dotenv()

# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================

def get_db_connection():
    """Obtiene conexión a PostgreSQL"""
    try:
        conn = psycopg2.connect(
            host=os.getenv("DATABASE_HOST", "localhost"),
            port=os.getenv("DATABASE_PORT", "5432"),
            dbname=os.getenv("DATABASE_NAME", "idp_construccion"),
            user=os.getenv("DATABASE_USER", "postgres"),
            password=os.getenv("DATABASE_PASSWORD"),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        raise

@contextmanager
def get_db():
    """Context manager para conexión a BD"""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# ==========================================
# INICIALIZAR FASTAPI
# ==========================================

app = FastAPI(
    title="API IDP Construcción - Unificada",
    description="Backend con modelo unificado (UUIDs + tablas normalizadas)",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "https://*.onrender.com",
        "*"  # En producción, especificar dominios exactos
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
async def health_check():
    """Verificar que la API está funcionando"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "database": db_status,
        "model": "unified",
        "id_type": "UUID"
    }

@app.get("/")
async def root():
    return {
        "message": "API IDP Construcción - Modelo Unificado",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# ==========================================
# CRUD: OBRAS
# ==========================================

@app.get("/api/obras", response_model=List[Obra])
async def get_obras(
    estado: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Obtener todas las obras"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM obras"
            params = []
            
            if estado:
                query += " WHERE estado = %s"
                params.append(estado)
            
            query += " ORDER BY codigo LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            obras = cursor.fetchall()
            cursor.close()
            
            return obras
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener obras: {str(e)}")

@app.get("/api/obras/{codigo}", response_model=Obra)
async def get_obra(codigo: str):
    """Obtener obra por código"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM obras WHERE codigo = %s", (codigo,))
            obra = cursor.fetchone()
            cursor.close()
            
            if not obra:
                raise HTTPException(status_code=404, detail="Obra no encontrada")
            
            return obra
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener obra: {str(e)}")

@app.post("/api/obras", response_model=Obra, status_code=status.HTTP_201_CREATED)
async def create_obra(obra: ObraCreate):
    """Crear nueva obra"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO obras (
                    codigo, nombre, cliente, numero_contrato, monto_contrato,
                    direccion, fecha_inicio, fecha_fin_estimada,
                    residente, residente_iniciales, residente_password,
                    residente_telefono, residente_email,
                    porcentaje_anticipo, porcentaje_retencion,
                    balance_actual, total_estimaciones,
                    estado, observaciones, metadata
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                ) RETURNING *
            """, (
                obra.codigo, obra.nombre, obra.cliente, obra.numero_contrato, obra.monto_contrato,
                obra.direccion, obra.fecha_inicio, obra.fecha_fin_estimada,
                obra.residente, obra.residente_iniciales, obra.residente_password,
                obra.residente_telefono, obra.residente_email,
                obra.porcentaje_anticipo, obra.porcentaje_retencion,
                obra.balance_actual, obra.total_estimaciones,
                obra.estado, obra.observaciones, Json(obra.metadata)
            ))
            
            nueva_obra = cursor.fetchone()
            cursor.close()
            
            return nueva_obra
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear obra: {str(e)}")

@app.put("/api/obras/{codigo}", response_model=Obra)
async def update_obra(codigo: str, updates: ObraUpdate):
    """Actualizar obra"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Construir query dinámicamente
            update_fields = []
            values = []
            
            for field, value in updates.model_dump(exclude_unset=True).items():
                if value is not None:
                    update_fields.append(f"{field} = %s")
                    values.append(Json(value) if isinstance(value, dict) else value)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No hay campos para actualizar")
            
            values.append(codigo)
            
            query = f"UPDATE obras SET {', '.join(update_fields)} WHERE codigo = %s RETURNING *"
            cursor.execute(query, values)
            
            obra_actualizada = cursor.fetchone()
            cursor.close()
            
            if not obra_actualizada:
                raise HTTPException(status_code=404, detail="Obra no encontrada")
            
            return obra_actualizada
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar obra: {str(e)}")

@app.delete("/api/obras/{codigo}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_obra(codigo: str):
    """Eliminar obra (CASCADE a requisiciones, OCs, etc.)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM obras WHERE codigo = %s", (codigo,))
            
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Obra no encontrada")
            
            cursor.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar obra: {str(e)}")

# ==========================================
# CRUD: PROVEEDORES
# ==========================================

@app.get("/api/proveedores", response_model=List[Proveedor])
async def get_proveedores(
    activo: Optional[bool] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Obtener todos los proveedores"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM proveedores"
            params = []
            
            if activo is not None:
                query += " WHERE activo = %s"
                params.append(activo)
            
            query += " ORDER BY nombre LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            proveedores = cursor.fetchall()
            cursor.close()
            
            return proveedores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener proveedores: {str(e)}")

@app.get("/api/proveedores/{proveedor_id}", response_model=Proveedor)
async def get_proveedor(proveedor_id: UUID):
    """Obtener proveedor por ID"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM proveedores WHERE id = %s", (str(proveedor_id),))
            proveedor = cursor.fetchone()
            cursor.close()
            
            if not proveedor:
                raise HTTPException(status_code=404, detail="Proveedor no encontrado")
            
            return proveedor
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener proveedor: {str(e)}")

@app.post("/api/proveedores", response_model=Proveedor, status_code=status.HTTP_201_CREATED)
async def create_proveedor(proveedor: ProveedorCreate):
    """Crear nuevo proveedor"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO proveedores (
                    codigo, nombre, razon_social, nombre_corto, rfc, direccion,
                    contacto, vendedor, telefono, email,
                    linea_credito, linea_credito_usada, dias_credito, vencimiento_linea,
                    activo, observaciones, metadata
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                proveedor.codigo, proveedor.nombre, proveedor.razon_social, proveedor.nombre_corto,
                proveedor.rfc, proveedor.direccion,
                proveedor.contacto, proveedor.vendedor, proveedor.telefono, proveedor.email,
                proveedor.linea_credito, proveedor.linea_credito_usada, proveedor.dias_credito,
                proveedor.vencimiento_linea, proveedor.activo, proveedor.observaciones,
                Json(proveedor.metadata)
            ))
            
            nuevo_proveedor = cursor.fetchone()
            cursor.close()
            
            return nuevo_proveedor
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear proveedor: {str(e)}")

# ==========================================
# CRUD: REQUISICIONES (con items normalizados)
# ==========================================

@app.get("/api/requisiciones", response_model=List[Requisicion])
async def get_requisiciones(
    obra_id: Optional[UUID] = None,
    estado: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Obtener todas las requisiciones"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Query base para requisiciones
            query = "SELECT * FROM requisiciones"
            params = []
            conditions = []
            
            if obra_id:
                conditions.append("obra_id = %s")
                params.append(str(obra_id))
            
            if estado:
                conditions.append("estado = %s")
                params.append(estado)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            requisiciones = cursor.fetchall()
            
            # Obtener items de cada requisición
            for req in requisiciones:
                cursor.execute(
                    "SELECT * FROM requisicion_items WHERE requisicion_id = %s ORDER BY orden",
                    (req['id'],)
                )
                req['items'] = cursor.fetchall()
            
            cursor.close()
            return requisiciones
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener requisiciones: {str(e)}")

@app.get("/api/requisiciones/{requisicion_id}", response_model=Requisicion)
async def get_requisicion(requisicion_id: UUID):
    """Obtener requisición por ID con sus items"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Obtener requisición
            cursor.execute("SELECT * FROM requisiciones WHERE id = %s", (str(requisicion_id),))
            requisicion = cursor.fetchone()
            
            if not requisicion:
                raise HTTPException(status_code=404, detail="Requisición no encontrada")
            
            # Obtener items
            cursor.execute(
                "SELECT * FROM requisicion_items WHERE requisicion_id = %s ORDER BY orden",
                (str(requisicion_id),)
            )
            requisicion['items'] = cursor.fetchall()
            
            cursor.close()
            return requisicion
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener requisición: {str(e)}")

@app.post("/api/requisiciones", response_model=Requisicion, status_code=status.HTTP_201_CREATED)
async def create_requisicion(requisicion: RequisicionCreate):
    """Crear nueva requisición con items"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Insertar requisición
            cursor.execute("""
                INSERT INTO requisiciones (
                    numero_requisicion, obra_id, residente_id, residente, residente_iniciales,
                    fecha_solicitud, fecha_necesaria, urgencia, prioridad, estado,
                    observaciones, metadata
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                requisicion.numero_requisicion, str(requisicion.obra_id),
                str(requisicion.residente_id) if requisicion.residente_id else None,
                requisicion.residente, requisicion.residente_iniciales,
                requisicion.fecha_solicitud, requisicion.fecha_necesaria,
                requisicion.urgencia, requisicion.prioridad, requisicion.estado,
                requisicion.observaciones, Json(requisicion.metadata)
            ))
            
            nueva_requisicion = cursor.fetchone()
            requisicion_id = nueva_requisicion['id']
            
            # Insertar items
            items = []
            for idx, item in enumerate(requisicion.items):
                cursor.execute("""
                    INSERT INTO requisicion_items (
                        requisicion_id, descripcion, especificaciones, cantidad, unidad,
                        precio_unitario_estimado, total_estimado, orden, metadata
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    requisicion_id, item.descripcion, item.especificaciones,
                    item.cantidad, item.unidad,
                    item.precio_unitario_estimado, item.total_estimado,
                    item.orden if item.orden is not None else idx,
                    Json(item.metadata or {})
                ))
                items.append(cursor.fetchone())
            
            nueva_requisicion['items'] = items
            cursor.close()
            
            return nueva_requisicion
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear requisición: {str(e)}")

@app.put("/api/requisiciones/{requisicion_id}", response_model=Requisicion)
async def update_requisicion(requisicion_id: UUID, updates: RequisicionUpdate):
    """Actualizar requisición"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Construir query dinámicamente
            update_fields = []
            values = []
            
            for field, value in updates.model_dump(exclude_unset=True).items():
                if value is not None:
                    update_fields.append(f"{field} = %s")
                    values.append(Json(value) if isinstance(value, dict) else value)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No hay campos para actualizar")
            
            values.append(str(requisicion_id))
            
            query = f"UPDATE requisiciones SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            cursor.execute(query, values)
            
            requisicion_actualizada = cursor.fetchone()
            
            if not requisicion_actualizada:
                raise HTTPException(status_code=404, detail="Requisición no encontrada")
            
            # Obtener items
            cursor.execute(
                "SELECT * FROM requisicion_items WHERE requisicion_id = %s ORDER BY orden",
                (str(requisicion_id),)
            )
            requisicion_actualizada['items'] = cursor.fetchall()
            
            cursor.close()
            return requisicion_actualizada
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar requisición: {str(e)}")

# ==========================================
# CRUD: ÓRDENES DE COMPRA (con items normalizados)
# ==========================================

@app.get("/api/ordenes-compra", response_model=List[OrdenCompra])
async def get_ordenes_compra(
    obra_id: Optional[UUID] = None,
    proveedor_id: Optional[UUID] = None,
    estado: Optional[str] = None,
    estado_pago: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Obtener todas las órdenes de compra"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM ordenes_compra"
            params = []
            conditions = []
            
            if obra_id:
                conditions.append("obra_id = %s")
                params.append(str(obra_id))
            
            if proveedor_id:
                conditions.append("proveedor_id = %s")
                params.append(str(proveedor_id))
            
            if estado:
                conditions.append("estado = %s")
                params.append(estado)
            
            if estado_pago:
                conditions.append("estado_pago = %s")
                params.append(estado_pago)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            ordenes = cursor.fetchall()
            
            # Obtener items de cada orden
            for orden in ordenes:
                cursor.execute(
                    "SELECT * FROM orden_compra_items WHERE orden_compra_id = %s ORDER BY orden",
                    (orden['id'],)
                )
                orden['items'] = cursor.fetchall()
            
            cursor.close()
            return ordenes
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener órdenes de compra: {str(e)}")

@app.post("/api/ordenes-compra", response_model=OrdenCompra, status_code=status.HTTP_201_CREATED)
async def create_orden_compra(orden: OrdenCompraCreate):
    """Crear nueva orden de compra con items"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Insertar orden de compra
            cursor.execute("""
                INSERT INTO ordenes_compra (
                    numero_orden, obra_id, proveedor_id, comprador_id, requisicion_id,
                    comprador, comprador_iniciales, fecha_orden, fecha_entrega_programada,
                    tipo_entrega, subtotal, descuento_porcentaje, descuento_monto,
                    tiene_iva, iva, total, forma_pago, dias_credito, fecha_vencimiento_pago,
                    estado, estado_pago, observaciones, metadata
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                orden.numero_orden, str(orden.obra_id), str(orden.proveedor_id),
                str(orden.comprador_id) if orden.comprador_id else None,
                str(orden.requisicion_id) if orden.requisicion_id else None,
                orden.comprador, orden.comprador_iniciales, orden.fecha_orden,
                orden.fecha_entrega_programada, orden.tipo_entrega,
                orden.subtotal, orden.descuento_porcentaje, orden.descuento_monto,
                orden.tiene_iva, orden.iva, orden.total,
                orden.forma_pago, orden.dias_credito, orden.fecha_vencimiento_pago,
                orden.estado, orden.estado_pago, orden.observaciones,
                Json(orden.metadata)
            ))
            
            nueva_orden = cursor.fetchone()
            orden_id = nueva_orden['id']
            
            # Insertar items
            items = []
            for idx, item in enumerate(orden.items):
                cursor.execute("""
                    INSERT INTO orden_compra_items (
                        orden_compra_id, descripcion, especificaciones, cantidad, unidad,
                        precio_unitario, subtotal, descuento, total, orden, metadata
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    orden_id, item.descripcion, item.especificaciones,
                    item.cantidad, item.unidad, item.precio_unitario,
                    item.subtotal, item.descuento, item.total,
                    item.orden if item.orden is not None else idx,
                    Json(item.metadata or {})
                ))
                items.append(cursor.fetchone())
            
            nueva_orden['items'] = items
            
            # El trigger automáticamente recalcula totales
            
            cursor.close()
            return nueva_orden
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear orden de compra: {str(e)}")

# ==========================================
# CRUD: PAGOS (actualiza automáticamente OC via trigger)
# ==========================================

@app.get("/api/pagos", response_model=List[Pago])
async def get_pagos(
    orden_compra_id: Optional[UUID] = None,
    proveedor_id: Optional[UUID] = None,
    estado: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Obtener todos los pagos"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM pagos"
            params = []
            conditions = []
            
            if orden_compra_id:
                conditions.append("orden_compra_id = %s")
                params.append(str(orden_compra_id))
            
            if proveedor_id:
                conditions.append("proveedor_id = %s")
                params.append(str(proveedor_id))
            
            if estado:
                conditions.append("estado = %s")
                params.append(estado)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " ORDER BY fecha_pago DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            pagos = cursor.fetchall()
            cursor.close()
            
            return pagos
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pagos: {str(e)}")

@app.post("/api/pagos", response_model=Pago, status_code=status.HTTP_201_CREATED)
async def create_pago(pago: PagoCreate):
    """
    Crear nuevo pago
    
    IMPORTANTE: El trigger 'trigger_actualizar_estado_pago' automáticamente:
    - Recalcula monto_pagado en ordenes_compra
    - Actualiza saldo_pendiente
    - Cambia estado_pago según corresponda
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO pagos (
                    numero_pago, orden_compra_id, proveedor_id, obra_id,
                    monto, tipo_pago, referencia_bancaria, banco, cuenta_bancaria,
                    fecha_pago, fecha_aplicacion, estado, observaciones, metadata
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                pago.numero_pago, str(pago.orden_compra_id),
                str(pago.proveedor_id), str(pago.obra_id),
                pago.monto, pago.tipo_pago, pago.referencia_bancaria,
                pago.banco, pago.cuenta_bancaria,
                pago.fecha_pago, pago.fecha_aplicacion, pago.estado,
                pago.observaciones, Json(pago.metadata)
            ))
            
            nuevo_pago = cursor.fetchone()
            cursor.close()
            
            # El trigger automáticamente actualiza la OC
            
            return nuevo_pago
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear pago: {str(e)}")

# ==========================================
# CRUD: DESTAJOS
# ==========================================

@app.get("/api/destajos", response_model=List[Destajo])
async def get_destajos(
    obra_id: Optional[UUID] = None,
    estado: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Obtener todos los destajos"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM destajos"
            params = []
            conditions = []
            
            if obra_id:
                conditions.append("obra_id = %s")
                params.append(str(obra_id))
            
            if estado:
                conditions.append("estado = %s")
                params.append(estado)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            destajos = cursor.fetchall()
            cursor.close()
            
            return destajos
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener destajos: {str(e)}")

@app.post("/api/destajos", response_model=Destajo, status_code=status.HTTP_201_CREATED)
async def create_destajo(destajo: DestajoCreate):
    """Crear nuevo destajo"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO destajos (
                    obra_id, destajista, destajista_rfc, destajista_telefono,
                    concepto, categoria, semana, fecha_inicio, fecha_fin,
                    cantidad, unidad, precio_unitario, total, estado,
                    observaciones, metadata
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                str(destajo.obra_id), destajo.destajista, destajo.destajista_rfc,
                destajo.destajista_telefono, destajo.concepto, destajo.categoria,
                destajo.semana, destajo.fecha_inicio, destajo.fecha_fin,
                destajo.cantidad, destajo.unidad, destajo.precio_unitario,
                destajo.total, destajo.estado, destajo.observaciones,
                Json(destajo.metadata)
            ))
            
            nuevo_destajo = cursor.fetchone()
            cursor.close()
            
            return nuevo_destajo
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear destajo: {str(e)}")

# ==========================================
# ESTADÍSTICAS Y DASHBOARD
# ==========================================

@app.get("/api/dashboard/estadisticas")
async def get_estadisticas_globales():
    """Obtener estadísticas globales del sistema"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Total obras
            cursor.execute("SELECT COUNT(*) as total FROM obras")
            total_obras = cursor.fetchone()['total']
            
            # Obras activas
            cursor.execute("SELECT COUNT(*) as total FROM obras WHERE estado = 'Activa'")
            obras_activas = cursor.fetchone()['total']
            
            # Total órdenes
            cursor.execute("SELECT COUNT(*) as total FROM ordenes_compra WHERE estado != 'Cancelada'")
            total_ordenes = cursor.fetchone()['total']
            
            # Total requisiciones
            cursor.execute("SELECT COUNT(*) as total FROM requisiciones WHERE estado != 'Cancelada'")
            total_requisiciones = cursor.fetchone()['total']
            
            # Total pagos procesados
            cursor.execute("SELECT COUNT(*) as total FROM pagos WHERE estado IN ('Procesado', 'Aplicado')")
            total_pagos = cursor.fetchone()['total']
            
            # Monto total órdenes
            cursor.execute("SELECT COALESCE(SUM(total), 0) as monto FROM ordenes_compra WHERE estado != 'Cancelada'")
            monto_total_ordenes = float(cursor.fetchone()['monto'])
            
            # Monto total pagado
            cursor.execute("SELECT COALESCE(SUM(monto), 0) as monto FROM pagos WHERE estado IN ('Procesado', 'Aplicado')")
            monto_total_pagado = float(cursor.fetchone()['monto'])
            
            cursor.close()
            
            return {
                "totalObras": total_obras,
                "obrasActivas": obras_activas,
                "totalOrdenes": total_ordenes,
                "totalRequisiciones": total_requisiciones,
                "totalPagos": total_pagos,
                "montoTotalOrdenes": monto_total_ordenes,
                "montoTotalPagado": monto_total_pagado,
                "montoPendientePago": monto_total_ordenes - monto_total_pagado
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")

# ==========================================
# VISTAS ÚTILES
# ==========================================

@app.get("/api/vistas/ordenes-completas")
async def get_ordenes_completas(limit: int = Query(100, ge=1, le=1000)):
    """Obtener órdenes con toda su información (vista completa)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM v_ordenes_compra_completas LIMIT %s", (limit,))
            ordenes = cursor.fetchall()
            cursor.close()
            return ordenes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener vista: {str(e)}")

@app.get("/api/vistas/resumen-obras")
async def get_resumen_obras():
    """Obtener resumen financiero de obras (vista agregada)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM v_resumen_obras")
            resumen = cursor.fetchall()
            cursor.close()
            return resumen
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener resumen: {str(e)}")

# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
