"""
MODELOS PYDANTIC UNIFICADOS
Versión: 2.0 - Unificación de modelos
Alineados con schema_unificado.sql
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from uuid import UUID

# ==========================================
# ENUMS
# ==========================================

class EstadoObra(str, Enum):
    ACTIVA = "Activa"
    PAUSADA = "Pausada"
    FINALIZADA = "Finalizada"
    CANCELADA = "Cancelada"
    ARCHIVADA = "Archivada"

class UrgenciaRequisicion(str, Enum):
    URGENTE = "Urgente"
    NORMAL = "Normal"
    PLANEADO = "Planeado"

class EstadoRequisicion(str, Enum):
    PENDIENTE = "Pendiente"
    EN_REVISION = "En Revisión"
    APROBADA = "Aprobada"
    RECHAZADA = "Rechazada"
    EN_PROCESO = "En Proceso"
    CONVERTIDA_A_OC = "Convertida a OC"
    COMPLETADA = "Completada"
    CANCELADA = "Cancelada"

class TipoEntrega(str, Enum):
    ENTREGA = "Entrega"
    RECOLECCION = "Recolección"

class EstadoOrdenCompra(str, Enum):
    BORRADOR = "Borrador"
    PENDIENTE = "Pendiente"
    APROBADA = "Aprobada"
    RECHAZADA = "Rechazada"
    EN_TRANSITO = "En Tránsito"
    ENTREGADA = "Entregada"
    PARCIALMENTE_PAGADA = "Parcialmente Pagada"
    PAGADA = "Pagada"
    CANCELADA = "Cancelada"

class EstadoPago(str, Enum):
    PENDIENTE = "Pendiente"
    PARCIAL = "Parcial"
    PAGADA = "Pagada"
    VENCIDA = "Vencida"

class TipoPago(str, Enum):
    TRANSFERENCIA = "Transferencia"
    CHEQUE = "Cheque"
    EFECTIVO = "Efectivo"
    TARJETA = "Tarjeta"

class EstadoPagoRegistro(str, Enum):
    PENDIENTE = "Pendiente"
    PROCESADO = "Procesado"
    APLICADO = "Aplicado"
    RECHAZADO = "Rechazado"
    CANCELADO = "Cancelado"

class EstadoDestajo(str, Enum):
    PENDIENTE = "Pendiente"
    APROBADO = "Aprobado"
    RECHAZADO = "Rechazado"
    PAGADO = "Pagado"
    CANCELADO = "Cancelado"

class RolUsuario(str, Enum):
    ADMIN = "Admin"
    RESIDENTE = "Residente"
    COMPRAS = "Compras"
    PAGOS = "Pagos"
    VISUALIZADOR = "Visualizador"

# ==========================================
# MODELOS BASE
# ==========================================

# --- OBRAS ---

class ObraBase(BaseModel):
    """Modelo base para obras"""
    codigo: str = Field(..., max_length=50, description="Código único de la obra")
    nombre: str = Field(..., max_length=255, description="Nombre de la obra")
    cliente: Optional[str] = Field(None, max_length=255)
    numero_contrato: Optional[str] = Field(None, max_length=100)
    monto_contrato: Decimal = Field(default=Decimal(0), ge=0)
    direccion: Optional[str] = None
    fecha_inicio: Optional[date] = None
    fecha_fin_estimada: Optional[date] = None
    fecha_fin_real: Optional[date] = None
    residente: Optional[str] = Field(None, max_length=255)
    residente_iniciales: Optional[str] = Field(None, max_length=10)
    residente_password: Optional[str] = Field(None, max_length=50)
    residente_telefono: Optional[str] = Field(None, max_length=20)
    residente_email: Optional[str] = Field(None, max_length=255)
    porcentaje_anticipo: Decimal = Field(default=Decimal(0), ge=0, le=100)
    porcentaje_retencion: Decimal = Field(default=Decimal(0), ge=0, le=100)
    balance_actual: Decimal = Field(default=Decimal(0))
    total_estimaciones: Decimal = Field(default=Decimal(0), ge=0)
    total_gastos: Decimal = Field(default=Decimal(0), ge=0)
    total_gastos_oc: Decimal = Field(default=Decimal(0), ge=0)
    total_gastos_destajos: Decimal = Field(default=Decimal(0), ge=0)
    estado: EstadoObra = EstadoObra.ACTIVA
    observaciones: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class ObraCreate(ObraBase):
    """Modelo para crear una obra"""
    pass

class ObraUpdate(BaseModel):
    """Modelo para actualizar una obra"""
    codigo: Optional[str] = Field(None, max_length=50)
    nombre: Optional[str] = Field(None, max_length=255)
    cliente: Optional[str] = None
    numero_contrato: Optional[str] = None
    monto_contrato: Optional[Decimal] = None
    direccion: Optional[str] = None
    fecha_inicio: Optional[date] = None
    fecha_fin_estimada: Optional[date] = None
    fecha_fin_real: Optional[date] = None
    residente: Optional[str] = None
    residente_iniciales: Optional[str] = None
    residente_telefono: Optional[str] = None
    residente_email: Optional[str] = None
    porcentaje_anticipo: Optional[Decimal] = None
    porcentaje_retencion: Optional[Decimal] = None
    balance_actual: Optional[Decimal] = None
    total_estimaciones: Optional[Decimal] = None
    estado: Optional[EstadoObra] = None
    observaciones: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class Obra(ObraBase):
    """Modelo completo de obra con ID y timestamps"""
    id: UUID
    created_at: datetime
    updated_at: datetime

# --- PROVEEDORES ---

class ProveedorBase(BaseModel):
    """Modelo base para proveedores"""
    codigo: Optional[str] = Field(None, max_length=50)
    nombre: str = Field(..., max_length=255, description="Nombre comercial")
    razon_social: Optional[str] = Field(None, max_length=255)
    nombre_corto: Optional[str] = Field(None, max_length=100)
    rfc: Optional[str] = Field(None, max_length=20)
    direccion: Optional[str] = None
    contacto: Optional[str] = Field(None, max_length=255)
    vendedor: Optional[str] = Field(None, max_length=255)
    telefono: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    linea_credito: Decimal = Field(default=Decimal(0), ge=0)
    linea_credito_usada: Decimal = Field(default=Decimal(0), ge=0)
    dias_credito: int = Field(default=0, ge=0)
    vencimiento_linea: Optional[date] = None
    activo: bool = True
    observaciones: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class ProveedorCreate(ProveedorBase):
    """Modelo para crear un proveedor"""
    pass

class ProveedorUpdate(BaseModel):
    """Modelo para actualizar un proveedor"""
    nombre: Optional[str] = None
    razon_social: Optional[str] = None
    rfc: Optional[str] = None
    direccion: Optional[str] = None
    contacto: Optional[str] = None
    vendedor: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    linea_credito: Optional[Decimal] = None
    dias_credito: Optional[int] = None
    vencimiento_linea: Optional[date] = None
    activo: Optional[bool] = None
    observaciones: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class Proveedor(ProveedorBase):
    """Modelo completo de proveedor con ID y timestamps"""
    id: UUID
    created_at: datetime
    updated_at: datetime

# --- REQUISICION ITEMS ---

class RequisicionItemBase(BaseModel):
    """Modelo base para items de requisición"""
    descripcion: str = Field(..., description="Descripción del material")
    especificaciones: Optional[str] = None
    cantidad: Decimal = Field(..., gt=0)
    unidad: str = Field(..., max_length=50)
    precio_unitario_estimado: Optional[Decimal] = Field(None, ge=0)
    total_estimado: Optional[Decimal] = Field(None, ge=0)
    orden: int = Field(default=0, ge=0)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class RequisicionItemCreate(RequisicionItemBase):
    """Modelo para crear un item de requisición"""
    pass

class RequisicionItem(RequisicionItemBase):
    """Modelo completo de item con ID"""
    id: UUID
    requisicion_id: UUID
    created_at: datetime

# --- REQUISICIONES ---

class RequisicionBase(BaseModel):
    """Modelo base para requisiciones"""
    numero_requisicion: str = Field(..., max_length=100)
    obra_id: UUID
    residente_id: Optional[UUID] = None
    residente: Optional[str] = Field(None, max_length=255)
    residente_iniciales: Optional[str] = Field(None, max_length=10)
    fecha_solicitud: date = Field(default_factory=date.today)
    fecha_necesaria: Optional[date] = None
    urgencia: UrgenciaRequisicion = UrgenciaRequisicion.NORMAL
    prioridad: int = Field(default=5, ge=1, le=10)
    estado: EstadoRequisicion = EstadoRequisicion.PENDIENTE
    total: Decimal = Field(default=Decimal(0), ge=0)
    observaciones: Optional[str] = None
    observaciones_rechazo: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class RequisicionCreate(RequisicionBase):
    """Modelo para crear una requisición"""
    items: List[RequisicionItemCreate] = Field(default_factory=list)

class RequisicionUpdate(BaseModel):
    """Modelo para actualizar una requisición"""
    urgencia: Optional[UrgenciaRequisicion] = None
    fecha_necesaria: Optional[date] = None
    prioridad: Optional[int] = None
    estado: Optional[EstadoRequisicion] = None
    observaciones: Optional[str] = None
    observaciones_rechazo: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class Requisicion(RequisicionBase):
    """Modelo completo de requisición con ID, timestamps e items"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    items: List[RequisicionItem] = Field(default_factory=list)

# --- ORDEN COMPRA ITEMS ---

class OrdenCompraItemBase(BaseModel):
    """Modelo base para items de orden de compra"""
    descripcion: str = Field(..., description="Descripción del material")
    especificaciones: Optional[str] = None
    cantidad: Decimal = Field(..., gt=0)
    unidad: str = Field(..., max_length=50)
    precio_unitario: Decimal = Field(..., ge=0)
    subtotal: Decimal = Field(..., ge=0)
    descuento: Decimal = Field(default=Decimal(0), ge=0)
    total: Decimal = Field(..., ge=0)
    cantidad_entregada: Decimal = Field(default=Decimal(0), ge=0)
    orden: int = Field(default=0, ge=0)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class OrdenCompraItemCreate(OrdenCompraItemBase):
    """Modelo para crear un item de orden de compra"""
    pass

class OrdenCompraItem(OrdenCompraItemBase):
    """Modelo completo de item con ID"""
    id: UUID
    orden_compra_id: UUID
    created_at: datetime

# --- ÓRDENES DE COMPRA ---

class OrdenCompraBase(BaseModel):
    """Modelo base para órdenes de compra"""
    numero_orden: str = Field(..., max_length=100)
    obra_id: UUID
    proveedor_id: UUID
    comprador_id: Optional[UUID] = None
    requisicion_id: Optional[UUID] = None
    comprador: Optional[str] = Field(None, max_length=255)
    comprador_iniciales: Optional[str] = Field(None, max_length=10)
    fecha_orden: date = Field(default_factory=date.today)
    fecha_entrega_programada: Optional[date] = None
    fecha_entrega_real: Optional[date] = None
    tipo_entrega: TipoEntrega = TipoEntrega.ENTREGA
    subtotal: Decimal = Field(default=Decimal(0), ge=0)
    descuento_porcentaje: Decimal = Field(default=Decimal(0), ge=0, le=100)
    descuento_monto: Decimal = Field(default=Decimal(0), ge=0)
    tiene_iva: bool = True
    iva: Decimal = Field(default=Decimal(0), ge=0)
    total: Decimal = Field(default=Decimal(0), ge=0)
    forma_pago: str = Field(default="Crédito", max_length=100)
    dias_credito: int = Field(default=0, ge=0)
    fecha_vencimiento_pago: Optional[date] = None
    monto_pagado: Decimal = Field(default=Decimal(0), ge=0)
    saldo_pendiente: Decimal = Field(default=Decimal(0), ge=0)
    estado: EstadoOrdenCompra = EstadoOrdenCompra.PENDIENTE
    estado_pago: EstadoPago = EstadoPago.PENDIENTE
    observaciones: Optional[str] = None
    observaciones_entrega: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class OrdenCompraCreate(OrdenCompraBase):
    """Modelo para crear una orden de compra"""
    items: List[OrdenCompraItemCreate] = Field(default_factory=list)

class OrdenCompraUpdate(BaseModel):
    """Modelo para actualizar una orden de compra"""
    fecha_entrega_programada: Optional[date] = None
    fecha_entrega_real: Optional[date] = None
    tipo_entrega: Optional[TipoEntrega] = None
    descuento_porcentaje: Optional[Decimal] = None
    descuento_monto: Optional[Decimal] = None
    tiene_iva: Optional[bool] = None
    dias_credito: Optional[int] = None
    estado: Optional[EstadoOrdenCompra] = None
    observaciones: Optional[str] = None
    observaciones_entrega: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class OrdenCompra(OrdenCompraBase):
    """Modelo completo de orden de compra con ID, timestamps e items"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    items: List[OrdenCompraItem] = Field(default_factory=list)

# --- PAGOS ---

class PagoBase(BaseModel):
    """Modelo base para pagos"""
    numero_pago: str = Field(..., max_length=100)
    orden_compra_id: UUID
    proveedor_id: UUID
    obra_id: UUID
    monto: Decimal = Field(..., gt=0)
    tipo_pago: TipoPago
    referencia_bancaria: Optional[str] = Field(None, max_length=255)
    banco: Optional[str] = Field(None, max_length=255)
    cuenta_bancaria: Optional[str] = Field(None, max_length=100)
    fecha_pago: date
    fecha_aplicacion: Optional[date] = None
    estado: EstadoPagoRegistro = EstadoPagoRegistro.PENDIENTE
    observaciones: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class PagoCreate(PagoBase):
    """Modelo para crear un pago"""
    pass

class PagoUpdate(BaseModel):
    """Modelo para actualizar un pago"""
    fecha_aplicacion: Optional[date] = None
    estado: Optional[EstadoPagoRegistro] = None
    observaciones: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class Pago(PagoBase):
    """Modelo completo de pago con ID y timestamps"""
    id: UUID
    created_at: datetime
    updated_at: datetime

# --- DESTAJOS ---

class DestajoBase(BaseModel):
    """Modelo base para destajos"""
    obra_id: UUID
    destajista: str = Field(..., max_length=255)
    destajista_rfc: Optional[str] = Field(None, max_length=20)
    destajista_telefono: Optional[str] = Field(None, max_length=20)
    concepto: str
    categoria: Optional[str] = Field(None, max_length=100)
    semana: str = Field(..., max_length=50)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    cantidad: Optional[Decimal] = Field(None, gt=0)
    unidad: Optional[str] = Field(None, max_length=50)
    precio_unitario: Optional[Decimal] = Field(None, ge=0)
    total: Decimal = Field(..., ge=0)
    estado: EstadoDestajo = EstadoDestajo.PENDIENTE
    fecha_pago: Optional[date] = None
    metodo_pago: Optional[str] = Field(None, max_length=50)
    referencia_pago: Optional[str] = Field(None, max_length=255)
    observaciones: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class DestajoCreate(DestajoBase):
    """Modelo para crear un destajo"""
    pass

class DestajoUpdate(BaseModel):
    """Modelo para actualizar un destajo"""
    estado: Optional[EstadoDestajo] = None
    fecha_pago: Optional[date] = None
    metodo_pago: Optional[str] = None
    referencia_pago: Optional[str] = None
    observaciones: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class Destajo(DestajoBase):
    """Modelo completo de destajo con ID y timestamps"""
    id: UUID
    created_at: datetime
    updated_at: datetime

# ==========================================
# MODELOS DE RESPUESTA AGREGADOS
# ==========================================

class ObraResumen(BaseModel):
    """Resumen de obra con estadísticas"""
    obra: Obra
    total_ordenes_compra: int
    monto_total_oc: Decimal
    saldo_pendiente_oc: Decimal
    total_requisiciones: int
    total_destajos: int

    model_config = ConfigDict(from_attributes=True)

class OrdenCompraCompleta(BaseModel):
    """Orden de compra con información de obra y proveedor"""
    orden: OrdenCompra
    obra_codigo: str
    obra_nombre: str
    proveedor_nombre: str
    proveedor_rfc: Optional[str]
    estado_vencimiento: str

    model_config = ConfigDict(from_attributes=True)

# ==========================================
# MODELOS DE RESPUESTA GENÉRICOS
# ==========================================

class MessageResponse(BaseModel):
    """Respuesta genérica con mensaje"""
    message: str
    success: bool = True
    data: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseModel):
    """Respuesta de error"""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class PaginatedResponse(BaseModel):
    """Respuesta paginada genérica"""
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

# ==========================================
# VALIDACIONES PERSONALIZADAS
# ==========================================

def validar_rfc(rfc: str) -> bool:
    """Valida formato de RFC mexicano"""
    import re
    # Formato básico RFC: 12 o 13 caracteres
    pattern = r'^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$'
    return bool(re.match(pattern, rfc.upper()))

def validar_email(email: str) -> bool:
    """Valida formato de email"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))
