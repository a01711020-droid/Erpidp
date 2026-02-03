from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel


class ObraBase(BaseModel):
    codigo: str
    nombre: str
    cliente: str
    numero_contrato: str
    monto_contrato: float
    anticipo_porcentaje: float
    retencion_porcentaje: float
    fecha_inicio: date
    fecha_fin_estimada: date
    residente_nombre: str
    residente_iniciales: str
    estado: str
    balance_actual: Optional[float] = None
    total_estimaciones: Optional[float] = None
    total_gastos: Optional[float] = None


class ObraCreate(ObraBase):
    pass


class ObraUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    cliente: Optional[str] = None
    numero_contrato: Optional[str] = None
    monto_contrato: Optional[float] = None
    anticipo_porcentaje: Optional[float] = None
    retencion_porcentaje: Optional[float] = None
    fecha_inicio: Optional[date] = None
    fecha_fin_estimada: Optional[date] = None
    residente_nombre: Optional[str] = None
    residente_iniciales: Optional[str] = None
    estado: Optional[str] = None
    balance_actual: Optional[float] = None
    total_estimaciones: Optional[float] = None
    total_gastos: Optional[float] = None


class Obra(ObraBase):
    id: str

    class Config:
        from_attributes = True


class ProveedorBase(BaseModel):
    nombre_comercial: str
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
    dias_credito: float
    limite_credito: float
    activo: bool


class ProveedorCreate(ProveedorBase):
    pass


class ProveedorUpdate(BaseModel):
    nombre_comercial: Optional[str] = None
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
    dias_credito: Optional[float] = None
    limite_credito: Optional[float] = None
    activo: Optional[bool] = None


class Proveedor(ProveedorBase):
    id: str

    class Config:
        from_attributes = True


class OrdenCompraItemBase(BaseModel):
    descripcion: str
    cantidad: float
    precio_unitario: float
    total: float


class OrdenCompraItemCreate(OrdenCompraItemBase):
    id: Optional[str] = None


class OrdenCompraItem(OrdenCompraItemBase):
    id: str
    orden_compra_id: str

    class Config:
        from_attributes = True


class OrdenCompraBase(BaseModel):
    folio: str
    obra_id: str
    obra_codigo: str
    obra_nombre: str
    cliente: str
    proveedor_id: str
    proveedor_nombre: str
    proveedor_razon_social: str
    proveedor_contacto: Optional[str] = None
    proveedor_rfc: Optional[str] = None
    proveedor_direccion: Optional[str] = None
    proveedor_telefono: Optional[str] = None
    proveedor_banco: Optional[str] = None
    proveedor_cuenta: Optional[str] = None
    proveedor_clabe: Optional[str] = None
    comprador: str
    fecha_entrega: date
    tipo_entrega: str
    incluye_iva: bool
    descuento: float
    descuento_monto: float
    observaciones: Optional[str] = None
    subtotal: float
    iva: float
    total: float
    fecha_creacion: date
    estado: str


class OrdenCompraCreate(OrdenCompraBase):
    items: List[OrdenCompraItemCreate]


class OrdenCompraUpdate(BaseModel):
    folio: Optional[str] = None
    obra_id: Optional[str] = None
    obra_codigo: Optional[str] = None
    obra_nombre: Optional[str] = None
    cliente: Optional[str] = None
    proveedor_id: Optional[str] = None
    proveedor_nombre: Optional[str] = None
    proveedor_razon_social: Optional[str] = None
    proveedor_contacto: Optional[str] = None
    proveedor_rfc: Optional[str] = None
    proveedor_direccion: Optional[str] = None
    proveedor_telefono: Optional[str] = None
    proveedor_banco: Optional[str] = None
    proveedor_cuenta: Optional[str] = None
    proveedor_clabe: Optional[str] = None
    comprador: Optional[str] = None
    fecha_entrega: Optional[date] = None
    tipo_entrega: Optional[str] = None
    incluye_iva: Optional[bool] = None
    descuento: Optional[float] = None
    descuento_monto: Optional[float] = None
    observaciones: Optional[str] = None
    subtotal: Optional[float] = None
    iva: Optional[float] = None
    total: Optional[float] = None
    fecha_creacion: Optional[date] = None
    estado: Optional[str] = None
    items: Optional[List[OrdenCompraItemCreate]] = None


class OrdenCompra(OrdenCompraBase):
    id: str
    items: List[OrdenCompraItem]

    class Config:
        from_attributes = True


class PagoBase(BaseModel):
    orden_compra_id: str
    referencia: str
    monto: float
    fecha_pago: date
    metodo: str
    folio_factura: Optional[str] = None
    fecha_factura: Optional[date] = None
    monto_factura: Optional[float] = None


class PagoCreate(PagoBase):
    pass


class Pago(PagoBase):
    id: str

    class Config:
        from_attributes = True


class RequisicionItemBase(BaseModel):
    descripcion: str
    cantidad: float
    unidad: str


class RequisicionItemCreate(RequisicionItemBase):
    id: Optional[str] = None


class RequisicionItem(RequisicionItemBase):
    id: str
    requisicion_id: str

    class Config:
        from_attributes = True


class RequisicionComentarioBase(BaseModel):
    autor: str
    rol: str
    mensaje: str
    fecha: datetime


class RequisicionComentarioCreate(RequisicionComentarioBase):
    id: Optional[str] = None


class RequisicionComentario(RequisicionComentarioBase):
    id: str
    requisicion_id: str

    class Config:
        from_attributes = True


class RequisicionBase(BaseModel):
    folio: str
    obra_id: str
    obra_codigo: str
    obra_nombre: str
    residente_nombre: str
    estado: str
    fecha_creacion: date
    urgencia: str
    fecha_entrega: date


class RequisicionCreate(RequisicionBase):
    items: List[RequisicionItemCreate]
    comentarios: List[RequisicionComentarioCreate]


class RequisicionUpdate(BaseModel):
    folio: Optional[str] = None
    obra_id: Optional[str] = None
    obra_codigo: Optional[str] = None
    obra_nombre: Optional[str] = None
    residente_nombre: Optional[str] = None
    estado: Optional[str] = None
    fecha_creacion: Optional[date] = None
    urgencia: Optional[str] = None
    fecha_entrega: Optional[date] = None
    items: Optional[List[RequisicionItemCreate]] = None
    comentarios: Optional[List[RequisicionComentarioCreate]] = None


class Requisicion(RequisicionBase):
    id: str
    items: List[RequisicionItem]
    comentarios: List[RequisicionComentario]

    class Config:
        from_attributes = True


class AuthRequest(BaseModel):
    password: str
