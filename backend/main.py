"""
FastAPI Backend para Sistema IDP Construcción
CRUD Completo para todas las entidades
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

# ==========================================
# CONFIGURACIÓN DE LA BASE DE DATOS
# ==========================================

def get_db_connection():
    """Obtiene conexión a PostgreSQL (Supabase o Render)"""
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

# ==========================================
# MODELOS PYDANTIC
# ==========================================

class MaterialBase(BaseModel):
    concepto: str
    unidad: str
    cantidad: float
    precioUnitario: float
    total: float

class ObraBase(BaseModel):
    code: str
    name: str
    client: str
    contractNumber: str
    contractAmount: float
    advancePercentage: float = 0
    retentionPercentage: float = 0
    startDate: str
    estimatedEndDate: str
    resident: str
    residentInitials: str
    residentPassword: str
    residentPhone: Optional[str] = None
    address: Optional[str] = None
    status: str = "Activa"
    actualBalance: float = 0
    totalEstimates: float = 0
    totalExpenses: float = 0
    totalExpensesFromOCs: float = 0
    totalExpensesFromDestajos: float = 0

class ObraCreate(ObraBase):
    pass

class Obra(ObraBase):
    id: int
    createdAt: str
    updatedAt: str

class ProveedorBase(BaseModel):
    nombre: str
    razonSocial: Optional[str] = None
    rfc: str
    direccion: Optional[str] = None
    contacto: str
    vendedor: Optional[str] = None
    telefono: str
    email: str
    lineaCredito: float = 0
    diasCredito: int = 0
    vencimientoLinea: str
    saldoPendiente: float = 0

class ProveedorCreate(ProveedorBase):
    pass

class Proveedor(ProveedorBase):
    id: int
    createdAt: str
    updatedAt: str

class RequisicionBase(BaseModel):
    codigoRequisicion: str
    obraCode: str
    obraNombre: str
    residente: str
    residenteIniciales: str
    fecha: str
    materiales: List[MaterialBase]
    total: float
    status: str = "Pendiente"
    notas: Optional[str] = None

class RequisicionCreate(RequisicionBase):
    pass

class Requisicion(RequisicionBase):
    id: int
    createdAt: str
    updatedAt: str

class OrdenCompraBase(BaseModel):
    codigoOC: str
    obraCode: str
    obraNombre: str
    proveedor: str
    proveedorId: int
    comprador: str
    compradorIniciales: str
    fecha: str
    fechaEntrega: str
    materiales: List[MaterialBase]
    subtotal: float
    iva: float
    total: float
    formaPago: str = "Crédito"
    diasCredito: int = 0
    status: str = "Pendiente"
    montoPagado: float = 0
    saldoPendiente: float = 0
    requisicionesVinculadas: List[str] = []

class OrdenCompraCreate(OrdenCompraBase):
    pass

class OrdenCompra(OrdenCompraBase):
    id: int
    createdAt: str
    updatedAt: str

class PagoBase(BaseModel):
    fecha: str
    ordenCompraId: int
    codigoOC: str
    proveedor: str
    monto: float
    metodoPago: str
    referencia: str
    banco: Optional[str] = None
    cuentaBancaria: Optional[str] = None
    notas: Optional[str] = None

class PagoCreate(PagoBase):
    pass

class Pago(PagoBase):
    id: int
    createdAt: str

class CargaSemanalBase(BaseModel):
    obraId: str
    obraCode: str
    semana: str
    destajista: str
    concepto: str
    unidad: str
    cantidad: float
    precioUnitario: float
    total: float

class CargaSemanalCreate(CargaSemanalBase):
    pass

class CargaSemanal(CargaSemanalBase):
    id: int
    createdAt: str

# ==========================================
# INICIALIZAR FASTAPI
# ==========================================

app = FastAPI(
    title="API IDP Construcción",
    description="Backend completo para gestión de construcción",
    version="1.0.0"
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
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "database": db_status
    }

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "API IDP Construcción",
        "docs": "/docs",
        "health": "/health"
    }

# ==========================================
# CRUD: OBRAS
# ==========================================

@app.get("/api/obras", response_model=List[Obra])
async def get_obras():
    """Obtener todas las obras"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM obras ORDER BY code")
        obras = cursor.fetchall()
        cursor.close()
        conn.close()
        return obras
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener obras: {str(e)}")

@app.get("/api/obras/{code}", response_model=Obra)
async def get_obra(code: str):
    """Obtener obra por código"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM obras WHERE code = %s", (code,))
        obra = cursor.fetchone()
        cursor.close()
        conn.close()
        
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
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO obras (
                code, name, client, contract_number, contract_amount,
                advance_percentage, retention_percentage, start_date,
                estimated_end_date, resident, resident_initials,
                resident_password, resident_phone, address, status,
                actual_balance, total_estimates, total_expenses,
                total_expenses_from_ocs, total_expenses_from_destajos
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s
            ) RETURNING *
        """, (
            obra.code, obra.name, obra.client, obra.contractNumber,
            obra.contractAmount, obra.advancePercentage, obra.retentionPercentage,
            obra.startDate, obra.estimatedEndDate, obra.resident,
            obra.residentInitials, obra.residentPassword, obra.residentPhone,
            obra.address, obra.status, obra.actualBalance, obra.totalEstimates,
            obra.totalExpenses, obra.totalExpensesFromOCs, obra.totalExpensesFromDestajos
        ))
        
        nueva_obra = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return nueva_obra
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear obra: {str(e)}")

@app.put("/api/obras/{code}", response_model=Obra)
async def update_obra(code: str, updates: dict):
    """Actualizar obra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Construir query dinámicamente
        set_clauses = []
        values = []
        
        for key, value in updates.items():
            # Convertir camelCase a snake_case
            db_key = ''.join(['_'+c.lower() if c.isupper() else c for c in key]).lstrip('_')
            set_clauses.append(f"{db_key} = %s")
            values.append(value)
        
        values.append(code)
        
        query = f"UPDATE obras SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE code = %s RETURNING *"
        cursor.execute(query, values)
        
        obra_actualizada = cursor.fetchone()
        
        if not obra_actualizada:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return obra_actualizada
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar obra: {str(e)}")

@app.delete("/api/obras/{code}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_obra(code: str):
    """Eliminar obra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM obras WHERE code = %s", (code,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar obra: {str(e)}")

# ==========================================
# CRUD: PROVEEDORES
# ==========================================

@app.get("/api/proveedores", response_model=List[Proveedor])
async def get_proveedores():
    """Obtener todos los proveedores"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM proveedores ORDER BY nombre")
        proveedores = cursor.fetchall()
        cursor.close()
        conn.close()
        return proveedores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener proveedores: {str(e)}")

@app.get("/api/proveedores/{id}", response_model=Proveedor)
async def get_proveedor(id: int):
    """Obtener proveedor por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM proveedores WHERE id = %s", (id,))
        proveedor = cursor.fetchone()
        cursor.close()
        conn.close()
        
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
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO proveedores (
                nombre, razon_social, rfc, direccion, contacto, vendedor,
                telefono, email, linea_credito, dias_credito,
                vencimiento_linea, saldo_pendiente
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            proveedor.nombre, proveedor.razonSocial, proveedor.rfc,
            proveedor.direccion, proveedor.contacto, proveedor.vendedor,
            proveedor.telefono, proveedor.email, proveedor.lineaCredito,
            proveedor.diasCredito, proveedor.vencimientoLinea,
            proveedor.saldoPendiente
        ))
        
        nuevo_proveedor = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return nuevo_proveedor
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear proveedor: {str(e)}")

@app.put("/api/proveedores/{id}", response_model=Proveedor)
async def update_proveedor(id: int, updates: dict):
    """Actualizar proveedor"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        set_clauses = []
        values = []
        
        for key, value in updates.items():
            db_key = ''.join(['_'+c.lower() if c.isupper() else c for c in key]).lstrip('_')
            set_clauses.append(f"{db_key} = %s")
            values.append(value)
        
        values.append(id)
        
        query = f"UPDATE proveedores SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
        cursor.execute(query, values)
        
        proveedor_actualizado = cursor.fetchone()
        
        if not proveedor_actualizado:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return proveedor_actualizado
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar proveedor: {str(e)}")

@app.delete("/api/proveedores/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_proveedor(id: int):
    """Eliminar proveedor"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM proveedores WHERE id = %s", (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar proveedor: {str(e)}")

# ==========================================
# CRUD: REQUISICIONES
# ==========================================

@app.get("/api/requisiciones", response_model=List[Requisicion])
async def get_requisiciones():
    """Obtener todas las requisiciones"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requisiciones ORDER BY created_at DESC")
        requisiciones = cursor.fetchall()
        cursor.close()
        conn.close()
        return requisiciones
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener requisiciones: {str(e)}")

@app.get("/api/requisiciones/obra/{obra_code}", response_model=List[Requisicion])
async def get_requisiciones_by_obra(obra_code: str):
    """Obtener requisiciones por obra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requisiciones WHERE obra_code = %s ORDER BY created_at DESC", (obra_code,))
        requisiciones = cursor.fetchall()
        cursor.close()
        conn.close()
        return requisiciones
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener requisiciones: {str(e)}")

@app.get("/api/requisiciones/{id}", response_model=Requisicion)
async def get_requisicion(id: int):
    """Obtener requisición por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requisiciones WHERE id = %s", (id,))
        requisicion = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not requisicion:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
        
        return requisicion
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener requisición: {str(e)}")

@app.post("/api/requisiciones", response_model=Requisicion, status_code=status.HTTP_201_CREATED)
async def create_requisicion(requisicion: RequisicionCreate):
    """Crear nueva requisición"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Convertir materiales a JSON
        import json
        materiales_json = json.dumps([m.dict() for m in requisicion.materiales])
        
        cursor.execute("""
            INSERT INTO requisiciones (
                codigo_requisicion, obra_code, obra_nombre, residente,
                residente_iniciales, fecha, materiales, total, status, notas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            requisicion.codigoRequisicion, requisicion.obraCode,
            requisicion.obraNombre, requisicion.residente,
            requisicion.residenteIniciales, requisicion.fecha,
            materiales_json, requisicion.total, requisicion.status,
            requisicion.notas
        ))
        
        nueva_requisicion = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return nueva_requisicion
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear requisición: {str(e)}")

@app.put("/api/requisiciones/{id}", response_model=Requisicion)
async def update_requisicion(id: int, updates: dict):
    """Actualizar requisición"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        set_clauses = []
        values = []
        
        for key, value in updates.items():
            db_key = ''.join(['_'+c.lower() if c.isupper() else c for c in key]).lstrip('_')
            set_clauses.append(f"{db_key} = %s")
            values.append(value)
        
        values.append(id)
        
        query = f"UPDATE requisiciones SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
        cursor.execute(query, values)
        
        requisicion_actualizada = cursor.fetchone()
        
        if not requisicion_actualizada:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return requisicion_actualizada
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar requisición: {str(e)}")

@app.delete("/api/requisiciones/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requisicion(id: int):
    """Eliminar requisición"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM requisiciones WHERE id = %s", (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Requisición no encontrada")
        
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar requisición: {str(e)}")

# ==========================================
# CRUD: ÓRDENES DE COMPRA
# ==========================================

@app.get("/api/ordenes-compra", response_model=List[OrdenCompra])
async def get_ordenes_compra():
    """Obtener todas las órdenes de compra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ordenes_compra ORDER BY created_at DESC")
        ordenes = cursor.fetchall()
        cursor.close()
        conn.close()
        return ordenes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener órdenes de compra: {str(e)}")

@app.get("/api/ordenes-compra/obra/{obra_code}", response_model=List[OrdenCompra])
async def get_ordenes_compra_by_obra(obra_code: str):
    """Obtener órdenes de compra por obra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ordenes_compra WHERE obra_code = %s ORDER BY created_at DESC", (obra_code,))
        ordenes = cursor.fetchall()
        cursor.close()
        conn.close()
        return ordenes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener órdenes de compra: {str(e)}")

@app.get("/api/ordenes-compra/{id}", response_model=OrdenCompra)
async def get_orden_compra(id: int):
    """Obtener orden de compra por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ordenes_compra WHERE id = %s", (id,))
        orden = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not orden:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        
        return orden
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener orden de compra: {str(e)}")

@app.post("/api/ordenes-compra", response_model=OrdenCompra, status_code=status.HTTP_201_CREATED)
async def create_orden_compra(orden: OrdenCompraCreate):
    """Crear nueva orden de compra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        import json
        materiales_json = json.dumps([m.dict() for m in orden.materiales])
        requisiciones_json = json.dumps(orden.requisicionesVinculadas)
        
        cursor.execute("""
            INSERT INTO ordenes_compra (
                codigo_oc, obra_code, obra_nombre, proveedor, proveedor_id,
                comprador, comprador_iniciales, fecha, fecha_entrega,
                materiales, subtotal, iva, total, forma_pago, dias_credito,
                status, monto_pagado, saldo_pendiente, requisiciones_vinculadas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            orden.codigoOC, orden.obraCode, orden.obraNombre, orden.proveedor,
            orden.proveedorId, orden.comprador, orden.compradorIniciales,
            orden.fecha, orden.fechaEntrega, materiales_json, orden.subtotal,
            orden.iva, orden.total, orden.formaPago, orden.diasCredito,
            orden.status, orden.montoPagado, orden.saldoPendiente, requisiciones_json
        ))
        
        nueva_orden = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return nueva_orden
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear orden de compra: {str(e)}")

@app.put("/api/ordenes-compra/{id}", response_model=OrdenCompra)
async def update_orden_compra(id: int, updates: dict):
    """Actualizar orden de compra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        set_clauses = []
        values = []
        
        for key, value in updates.items():
            db_key = ''.join(['_'+c.lower() if c.isupper() else c for c in key]).lstrip('_')
            set_clauses.append(f"{db_key} = %s")
            values.append(value)
        
        values.append(id)
        
        query = f"UPDATE ordenes_compra SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
        cursor.execute(query, values)
        
        orden_actualizada = cursor.fetchone()
        
        if not orden_actualizada:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return orden_actualizada
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar orden de compra: {str(e)}")

@app.delete("/api/ordenes-compra/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_orden_compra(id: int):
    """Eliminar orden de compra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ordenes_compra WHERE id = %s", (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
        
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar orden de compra: {str(e)}")

# ==========================================
# CRUD: PAGOS
# ==========================================

@app.get("/api/pagos", response_model=List[Pago])
async def get_pagos():
    """Obtener todos los pagos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pagos ORDER BY created_at DESC")
        pagos = cursor.fetchall()
        cursor.close()
        conn.close()
        return pagos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pagos: {str(e)}")

@app.get("/api/pagos/orden-compra/{orden_compra_id}", response_model=List[Pago])
async def get_pagos_by_orden_compra(orden_compra_id: int):
    """Obtener pagos por orden de compra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pagos WHERE orden_compra_id = %s ORDER BY created_at DESC", (orden_compra_id,))
        pagos = cursor.fetchall()
        cursor.close()
        conn.close()
        return pagos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pagos: {str(e)}")

@app.get("/api/pagos/{id}", response_model=Pago)
async def get_pago(id: int):
    """Obtener pago por ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pagos WHERE id = %s", (id,))
        pago = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not pago:
            raise HTTPException(status_code=404, detail="Pago no encontrado")
        
        return pago
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pago: {str(e)}")

@app.post("/api/pagos", response_model=Pago, status_code=status.HTTP_201_CREATED)
async def create_pago(pago: PagoCreate):
    """Crear nuevo pago"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO pagos (
                fecha, orden_compra_id, codigo_oc, proveedor, monto,
                metodo_pago, referencia, banco, cuenta_bancaria, notas
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            pago.fecha, pago.ordenCompraId, pago.codigoOC, pago.proveedor,
            pago.monto, pago.metodoPago, pago.referencia, pago.banco,
            pago.cuentaBancaria, pago.notas
        ))
        
        nuevo_pago = cursor.fetchone()
        
        # Actualizar monto pagado y saldo en la OC
        cursor.execute("""
            UPDATE ordenes_compra 
            SET monto_pagado = monto_pagado + %s,
                saldo_pendiente = total - (monto_pagado + %s),
                status = CASE 
                    WHEN (monto_pagado + %s) >= total THEN 'Pagada'
                    WHEN (monto_pagado + %s) > 0 THEN 'Parcial'
                    ELSE 'Pendiente'
                END
            WHERE id = %s
        """, (pago.monto, pago.monto, pago.monto, pago.monto, pago.ordenCompraId))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return nuevo_pago
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear pago: {str(e)}")

@app.delete("/api/pagos/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pago(id: int):
    """Eliminar pago"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener info del pago antes de eliminarlo
        cursor.execute("SELECT orden_compra_id, monto FROM pagos WHERE id = %s", (id,))
        pago = cursor.fetchone()
        
        if not pago:
            raise HTTPException(status_code=404, detail="Pago no encontrado")
        
        # Eliminar pago
        cursor.execute("DELETE FROM pagos WHERE id = %s", (id,))
        
        # Actualizar monto pagado de la OC
        cursor.execute("""
            UPDATE ordenes_compra 
            SET monto_pagado = monto_pagado - %s,
                saldo_pendiente = total - (monto_pagado - %s),
                status = CASE 
                    WHEN (monto_pagado - %s) >= total THEN 'Pagada'
                    WHEN (monto_pagado - %s) > 0 THEN 'Parcial'
                    ELSE 'Pendiente'
                END
            WHERE id = %s
        """, (pago['monto'], pago['monto'], pago['monto'], pago['monto'], pago['orden_compra_id']))
        
        conn.commit()
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar pago: {str(e)}")

# ==========================================
# CRUD: DESTAJOS
# ==========================================

@app.get("/api/destajos", response_model=List[CargaSemanal])
async def get_destajos():
    """Obtener todos los destajos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM destajos ORDER BY created_at DESC")
        destajos = cursor.fetchall()
        cursor.close()
        conn.close()
        return destajos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener destajos: {str(e)}")

@app.get("/api/destajos/obra/{obra_code}", response_model=List[CargaSemanal])
async def get_destajos_by_obra(obra_code: str):
    """Obtener destajos por obra"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM destajos WHERE obra_code = %s ORDER BY created_at DESC", (obra_code,))
        destajos = cursor.fetchall()
        cursor.close()
        conn.close()
        return destajos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener destajos: {str(e)}")

@app.post("/api/destajos", response_model=CargaSemanal, status_code=status.HTTP_201_CREATED)
async def create_destajo(carga: CargaSemanalCreate):
    """Crear nuevo destajo"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO destajos (
                obra_id, obra_code, semana, destajista, concepto,
                unidad, cantidad, precio_unitario, total
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            carga.obraId, carga.obraCode, carga.semana, carga.destajista,
            carga.concepto, carga.unidad, carga.cantidad, carga.precioUnitario,
            carga.total
        ))
        
        nuevo_destajo = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return nuevo_destajo
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear destajo: {str(e)}")

@app.delete("/api/destajos/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_destajo(id: int):
    """Eliminar destajo"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM destajos WHERE id = %s", (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Destajo no encontrado")
        
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar destajo: {str(e)}")

# ==========================================
# DASHBOARD / ESTADÍSTICAS
# ==========================================

@app.get("/api/dashboard/estadisticas")
async def get_estadisticas_globales():
    """Obtener estadísticas globales del sistema"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total obras
        cursor.execute("SELECT COUNT(*) as total FROM obras")
        total_obras = cursor.fetchone()['total']
        
        # Obras activas
        cursor.execute("SELECT COUNT(*) as total FROM obras WHERE status = 'Activa'")
        obras_activas = cursor.fetchone()['total']
        
        # Total órdenes
        cursor.execute("SELECT COUNT(*) as total FROM ordenes_compra")
        total_ordenes = cursor.fetchone()['total']
        
        # Total requisiciones
        cursor.execute("SELECT COUNT(*) as total FROM requisiciones")
        total_requisiciones = cursor.fetchone()['total']
        
        # Total pagos
        cursor.execute("SELECT COUNT(*) as total FROM pagos")
        total_pagos = cursor.fetchone()['total']
        
        # Monto total órdenes
        cursor.execute("SELECT COALESCE(SUM(total), 0) as monto FROM ordenes_compra WHERE status != 'Cancelada'")
        monto_total_ordenes = float(cursor.fetchone()['monto'])
        
        # Monto total pagado
        cursor.execute("SELECT COALESCE(SUM(monto), 0) as monto FROM pagos")
        monto_total_pagado = float(cursor.fetchone()['monto'])
        
        cursor.close()
        conn.close()
        
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
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
