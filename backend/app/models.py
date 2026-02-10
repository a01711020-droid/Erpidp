from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .db import Base


class Obra(Base):
    __tablename__ = "obras"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    codigo = Column(String, unique=True, nullable=False)
    nombre = Column(String, nullable=False)
    cliente = Column(String, nullable=False)
    numero_contrato = Column(String, nullable=False)
    monto_contrato = Column(Numeric, nullable=False)
    anticipo_porcentaje = Column(Numeric, nullable=False, default=0)
    retencion_porcentaje = Column(Numeric, nullable=False, default=0)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin_estimada = Column(Date, nullable=False)
    residente_nombre = Column(String, nullable=False)
    residente_iniciales = Column(String, nullable=False)
    estado = Column(String, nullable=False, default="Activa")
    balance_actual = Column(Numeric)
    total_estimaciones = Column(Numeric)
    total_gastos = Column(Numeric)


class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre_comercial = Column(String, nullable=False)
    razon_social = Column(String, nullable=False)
    rfc = Column(String, nullable=False)
    direccion = Column(String)
    ciudad = Column(String)
    codigo_postal = Column(String)
    telefono = Column(String)
    email = Column(String)
    contacto_principal = Column(String)
    banco = Column(String)
    numero_cuenta = Column(String)
    clabe = Column(String)
    tipo_proveedor = Column(String)
    dias_credito = Column(Numeric, nullable=False, default=0)
    limite_credito = Column(Numeric, nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)


class OrdenCompra(Base):
    __tablename__ = "ordenes_compra"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    folio = Column(String, unique=True, nullable=False)
    obra_id = Column(UUID(as_uuid=True), ForeignKey("obras.id"), nullable=False)
    obra_codigo = Column(String, nullable=False)
    obra_nombre = Column(String, nullable=False)
    cliente = Column(String, nullable=False)
    proveedor_id = Column(UUID(as_uuid=True), ForeignKey("proveedores.id"), nullable=False)
    proveedor_nombre = Column(String, nullable=False)
    proveedor_razon_social = Column(String, nullable=False)
    proveedor_contacto = Column(String)
    proveedor_rfc = Column(String)
    proveedor_direccion = Column(String)
    proveedor_telefono = Column(String)
    proveedor_banco = Column(String)
    proveedor_cuenta = Column(String)
    proveedor_clabe = Column(String)
    comprador = Column(String, nullable=False)
    fecha_entrega = Column(Date, nullable=False)
    tipo_entrega = Column(String, nullable=False)
    incluye_iva = Column(Boolean, nullable=False, default=True)
    descuento = Column(Numeric, nullable=False, default=0)
    descuento_monto = Column(Numeric, nullable=False, default=0)
    observaciones = Column(Text)
    subtotal = Column(Numeric, nullable=False, default=0)
    iva = Column(Numeric, nullable=False, default=0)
    total = Column(Numeric, nullable=False, default=0)
    fecha_creacion = Column(Date, nullable=False)
    estado = Column(String, nullable=False, default="Pendiente")

    items = relationship("OrdenCompraItem", back_populates="orden_compra", cascade="all, delete-orphan")


class OrdenCompraItem(Base):
    __tablename__ = "ordenes_compra_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    orden_compra_id = Column(UUID(as_uuid=True), ForeignKey("ordenes_compra.id"), nullable=False)
    descripcion = Column(String, nullable=False)
    cantidad = Column(Numeric, nullable=False)
    precio_unitario = Column(Numeric, nullable=False)
    total = Column(Numeric, nullable=False)

    orden_compra = relationship("OrdenCompra", back_populates="items")


class Pago(Base):
    __tablename__ = "pagos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    orden_compra_id = Column(UUID(as_uuid=True), ForeignKey("ordenes_compra.id"), nullable=False)
    referencia = Column(String, nullable=False)
    monto = Column(Numeric, nullable=False)
    fecha_pago = Column(Date, nullable=False)
    metodo = Column(String, nullable=False)
    folio_factura = Column(String)
    fecha_factura = Column(Date)
    monto_factura = Column(Numeric)


class Requisicion(Base):
    __tablename__ = "requisiciones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    folio = Column(String, unique=True, nullable=False)
    obra_id = Column(UUID(as_uuid=True), ForeignKey("obras.id"), nullable=False)
    obra_codigo = Column(String, nullable=False)
    obra_nombre = Column(String, nullable=False)
    residente_nombre = Column(String, nullable=False)
    estado = Column(String, nullable=False, default="En Revisión")
    fecha_creacion = Column(Date, nullable=False)
    urgencia = Column(String, nullable=False)
    fecha_entrega = Column(Date, nullable=False)

    items = relationship("RequisicionItem", back_populates="requisicion", cascade="all, delete-orphan")
    comentarios = relationship("RequisicionComentario", back_populates="requisicion", cascade="all, delete-orphan")


class RequisicionItem(Base):
    __tablename__ = "requisiciones_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requisicion_id = Column(UUID(as_uuid=True), ForeignKey("requisiciones.id"), nullable=False)
    descripcion = Column(String, nullable=False)
    cantidad = Column(Numeric, nullable=False)
    unidad = Column(String, nullable=False)

    requisicion = relationship("Requisicion", back_populates="items")


class RequisicionComentario(Base):
    __tablename__ = "requisiciones_comentarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requisicion_id = Column(UUID(as_uuid=True), ForeignKey("requisiciones.id"), nullable=False)
    autor = Column(String, nullable=False)
    rol = Column(String, nullable=False)
    mensaje = Column(Text, nullable=False)
    fecha = Column(DateTime, nullable=False, default=datetime.utcnow)

    requisicion = relationship("Requisicion", back_populates="comentarios")
