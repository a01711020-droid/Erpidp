from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class Pagination(BaseModel):
    total: int
    page: int
    pageSize: int
    totalPages: int


class PaginatedResponse(BaseModel):
    data: list
    total: int
    page: int
    pageSize: int
    totalPages: int


class ObraBase(BaseModel):
    codigo: str
    nombre: str
    numeroContrato: str = Field(alias="numero_contrato")
    cliente: str
    residente: str
    direccion: Optional[str] = None
    montoContratado: float = Field(alias="monto_contratado")
    fechaInicio: date = Field(alias="fecha_inicio")
    fechaFinProgramada: date = Field(alias="fecha_fin_programada")
    plazoEjecucion: int = Field(alias="plazo_ejecucion")
    estado: str


class ObraCreate(ObraBase):
    pass


class ObraUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    numeroContrato: Optional[str] = Field(default=None, alias="numero_contrato")
    cliente: Optional[str] = None
    residente: Optional[str] = None
    direccion: Optional[str] = None
    montoContratado: Optional[float] = Field(default=None, alias="monto_contratado")
    fechaInicio: Optional[date] = Field(default=None, alias="fecha_inicio")
    fechaFinProgramada: Optional[date] = Field(default=None, alias="fecha_fin_programada")
    plazoEjecucion: Optional[int] = Field(default=None, alias="plazo_ejecucion")
    estado: Optional[str] = None


class Obra(ObraBase):
    id: UUID
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class ProveedorBase(BaseModel):
    razonSocial: str = Field(alias="razon_social")
    nombreComercial: Optional[str] = Field(default=None, alias="nombre_comercial")
    rfc: str
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    codigoPostal: Optional[str] = Field(default=None, alias="codigo_postal")
    telefono: Optional[str] = None
    email: Optional[str] = None
    contactoPrincipal: Optional[str] = Field(default=None, alias="contacto_principal")
    banco: Optional[str] = None
    numeroCuenta: Optional[str] = Field(default=None, alias="numero_cuenta")
    clabe: Optional[str] = None
    tipoProveedor: Optional[str] = Field(default=None, alias="tipo_proveedor")
    creditoDias: int = Field(default=0, alias="credito_dias")
    limiteCredito: float = Field(default=0, alias="limite_credito")
    activo: bool = True


class ProveedorCreate(ProveedorBase):
    pass


class ProveedorUpdate(BaseModel):
    razonSocial: Optional[str] = Field(default=None, alias="razon_social")
    nombreComercial: Optional[str] = Field(default=None, alias="nombre_comercial")
    rfc: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    codigoPostal: Optional[str] = Field(default=None, alias="codigo_postal")
    telefono: Optional[str] = None
    email: Optional[str] = None
    contactoPrincipal: Optional[str] = Field(default=None, alias="contacto_principal")
    banco: Optional[str] = None
    numeroCuenta: Optional[str] = Field(default=None, alias="numero_cuenta")
    clabe: Optional[str] = None
    tipoProveedor: Optional[str] = Field(default=None, alias="tipo_proveedor")
    creditoDias: Optional[int] = Field(default=None, alias="credito_dias")
    limiteCredito: Optional[float] = Field(default=None, alias="limite_credito")
    activo: Optional[bool] = None


class Proveedor(ProveedorBase):
    id: UUID
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class RequisicionItemBase(BaseModel):
    cantidad: float
    unidad: str
    descripcion: str


class RequisicionItemCreate(RequisicionItemBase):
    pass


class RequisicionItem(RequisicionItemBase):
    id: UUID
    requisicionId: UUID = Field(alias="requisicion_id")
    createdAt: datetime = Field(alias="created_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class RequisicionBase(BaseModel):
    numeroRequisicion: str = Field(alias="numero_requisicion")
    obraId: UUID = Field(alias="obra_id")
    solicitadoPor: str = Field(alias="solicitado_por")
    urgencia: str
    estado: str
    observaciones: Optional[str] = None
    aprobadoPor: Optional[str] = Field(default=None, alias="aprobado_por")
    fechaAprobacion: Optional[datetime] = Field(default=None, alias="fecha_aprobacion")
    motivoRechazo: Optional[str] = Field(default=None, alias="motivo_rechazo")


class RequisicionCreate(RequisicionBase):
    items: List[RequisicionItemCreate]


class RequisicionUpdate(BaseModel):
    urgencia: Optional[str] = None
    estado: Optional[str] = None
    observaciones: Optional[str] = None
    aprobadoPor: Optional[str] = Field(default=None, alias="aprobado_por")
    fechaAprobacion: Optional[datetime] = Field(default=None, alias="fecha_aprobacion")
    motivoRechazo: Optional[str] = Field(default=None, alias="motivo_rechazo")


class Requisicion(RequisicionBase):
    id: UUID
    fechaSolicitud: datetime = Field(alias="fecha_solicitud")
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")
    items: List[RequisicionItem] = []

    model_config = {"from_attributes": True, "populate_by_name": True}


class OrdenCompraItemBase(BaseModel):
    cantidad: float
    unidad: str
    descripcion: str
    precioUnitario: float = Field(alias="precio_unitario")
    total: float


class OrdenCompraItemCreate(OrdenCompraItemBase):
    pass


class OrdenCompraItem(OrdenCompraItemBase):
    id: UUID
    ordenCompraId: UUID = Field(alias="orden_compra_id")
    createdAt: datetime = Field(alias="created_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class OrdenCompraBase(BaseModel):
    numeroOrden: str = Field(alias="numero_orden")
    obraId: UUID = Field(alias="obra_id")
    proveedorId: UUID = Field(alias="proveedor_id")
    requisicionId: Optional[UUID] = Field(default=None, alias="requisicion_id")
    fechaEntrega: date = Field(alias="fecha_entrega")
    estado: str
    tipoEntrega: Optional[str] = Field(default=None, alias="tipo_entrega")
    subtotal: float
    descuento: float = 0
    descuentoMonto: float = Field(default=0, alias="descuento_monto")
    iva: float = 0
    total: float
    observaciones: Optional[str] = None
    creadoPor: Optional[str] = Field(default=None, alias="creado_por")


class OrdenCompraCreate(OrdenCompraBase):
    items: List[OrdenCompraItemCreate]


class OrdenCompraUpdate(BaseModel):
    estado: Optional[str] = None
    fechaEntrega: Optional[date] = Field(default=None, alias="fecha_entrega")
    tipoEntrega: Optional[str] = Field(default=None, alias="tipo_entrega")
    subtotal: Optional[float] = None
    descuento: Optional[float] = None
    descuentoMonto: Optional[float] = Field(default=None, alias="descuento_monto")
    iva: Optional[float] = None
    total: Optional[float] = None
    observaciones: Optional[str] = None


class OrdenCompra(OrdenCompraBase):
    id: UUID
    fechaEmision: datetime = Field(alias="fecha_emision")
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")
    items: List[OrdenCompraItem] = []

    model_config = {"from_attributes": True, "populate_by_name": True}


class PagoBase(BaseModel):
    ordenCompraId: Optional[UUID] = Field(default=None, alias="orden_compra_id")
    proveedorId: Optional[UUID] = Field(default=None, alias="proveedor_id")
    obraId: Optional[UUID] = Field(default=None, alias="obra_id")
    fechaPago: Optional[date] = Field(default=None, alias="fecha_pago")
    fechaProgramada: Optional[date] = Field(default=None, alias="fecha_programada")
    monto: float
    metodoPago: Optional[str] = Field(default=None, alias="metodo_pago")
    referencia: Optional[str] = None
    estado: str
    observaciones: Optional[str] = None


class PagoCreate(PagoBase):
    pass


class PagoUpdate(BaseModel):
    fechaPago: Optional[date] = Field(default=None, alias="fecha_pago")
    fechaProgramada: Optional[date] = Field(default=None, alias="fecha_programada")
    monto: Optional[float] = None
    metodoPago: Optional[str] = Field(default=None, alias="metodo_pago")
    referencia: Optional[str] = None
    estado: Optional[str] = None
    observaciones: Optional[str] = None


class Pago(PagoBase):
    id: UUID
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")

    model_config = {"from_attributes": True, "populate_by_name": True}
