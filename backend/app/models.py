from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .db import Base


class Obra(Base):
    __tablename__ = "obras"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    codigo = Column(String(50), unique=True, nullable=False)
    nombre = Column(String(255), nullable=False)
    numero_contrato = Column(String(100), unique=True, nullable=False)
    cliente = Column(String(255), nullable=False)
    residente = Column(String(255), nullable=False)
    direccion = Column(Text)
    monto_contratado = Column(Numeric(15, 2), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin_programada = Column(Date, nullable=False)
    plazo_ejecucion = Column(Integer, nullable=False)
    estado = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "estado IN ('activa','suspendida','terminada','cancelada')",
            name="obras_estado_check",
        ),
    )

    requisiciones = relationship("Requisicion", back_populates="obra")
    ordenes_compra = relationship("OrdenCompra", back_populates="obra")
    pagos = relationship("Pago", back_populates="obra")


class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    razon_social = Column(String(255), nullable=False)
    nombre_comercial = Column(String(255))
    rfc = Column(String(13), unique=True, nullable=False)
    direccion = Column(Text)
    ciudad = Column(String(100))
    codigo_postal = Column(String(10))
    telefono = Column(String(20))
    email = Column(String(255))
    contacto_principal = Column(String(255))
    banco = Column(String(100))
    numero_cuenta = Column(String(50))
    clabe = Column(String(18))
    tipo_proveedor = Column(String(20))
    credito_dias = Column(Integer, server_default="0", nullable=False)
    limite_credito = Column(Numeric(15, 2), server_default="0", nullable=False)
    activo = Column(Boolean, server_default="true", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "tipo_proveedor IN ('material','servicio','renta','mixto')",
            name="proveedores_tipo_check",
        ),
    )

    ordenes_compra = relationship("OrdenCompra", back_populates="proveedor")
    pagos = relationship("Pago", back_populates="proveedor")


class Requisicion(Base):
    __tablename__ = "requisiciones"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    numero_requisicion = Column(String(50), unique=True, nullable=False)
    obra_id = Column(UUID(as_uuid=True), ForeignKey("obras.id"), nullable=False)
    solicitado_por = Column(String(255), nullable=False)
    fecha_solicitud = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    urgencia = Column(String(20), nullable=False)
    estado = Column(String(20), nullable=False)
    observaciones = Column(Text)
    aprobado_por = Column(String(255))
    fecha_aprobacion = Column(DateTime(timezone=True))
    motivo_rechazo = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "urgencia IN ('normal','urgente','muy_urgente')",
            name="requisiciones_urgencia_check",
        ),
        CheckConstraint(
            "estado IN ('pendiente','aprobada','rechazada','en_proceso','completada')",
            name="requisiciones_estado_check",
        ),
    )

    obra = relationship("Obra", back_populates="requisiciones")
    items = relationship("RequisicionItem", back_populates="requisicion", cascade="all, delete-orphan")
    ordenes_compra = relationship("OrdenCompra", back_populates="requisicion")


class RequisicionItem(Base):
    __tablename__ = "requisicion_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    requisicion_id = Column(UUID(as_uuid=True), ForeignKey("requisiciones.id"), nullable=False)
    cantidad = Column(Numeric(10, 2), nullable=False)
    unidad = Column(String(20), nullable=False)
    descripcion = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    requisicion = relationship("Requisicion", back_populates="items")


class OrdenCompra(Base):
    __tablename__ = "ordenes_compra"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    numero_orden = Column(String(50), unique=True, nullable=False)
    obra_id = Column(UUID(as_uuid=True), ForeignKey("obras.id"), nullable=False)
    proveedor_id = Column(UUID(as_uuid=True), ForeignKey("proveedores.id"), nullable=False)
    requisicion_id = Column(UUID(as_uuid=True), ForeignKey("requisiciones.id"))
    fecha_emision = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_entrega = Column(Date, nullable=False)
    estado = Column(String(20), nullable=False)
    tipo_entrega = Column(String(20))
    subtotal = Column(Numeric(15, 2), nullable=False)
    descuento = Column(Numeric(5, 2), server_default="0", nullable=False)
    descuento_monto = Column(Numeric(15, 2), server_default="0", nullable=False)
    iva = Column(Numeric(15, 2), server_default="0", nullable=False)
    total = Column(Numeric(15, 2), nullable=False)
    observaciones = Column(Text)
    creado_por = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "estado IN ('borrador','emitida','recibida','facturada','pagada','cancelada')",
            name="ordenes_compra_estado_check",
        ),
        CheckConstraint(
            "tipo_entrega IN ('en_obra','bodega','recoger')",
            name="ordenes_compra_tipo_entrega_check",
        ),
    )

    obra = relationship("Obra", back_populates="ordenes_compra")
    proveedor = relationship("Proveedor", back_populates="ordenes_compra")
    requisicion = relationship("Requisicion", back_populates="ordenes_compra")
    items = relationship("OrdenCompraItem", back_populates="orden_compra", cascade="all, delete-orphan")
    pagos = relationship("Pago", back_populates="orden_compra")


class OrdenCompraItem(Base):
    __tablename__ = "orden_compra_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    orden_compra_id = Column(UUID(as_uuid=True), ForeignKey("ordenes_compra.id"), nullable=False)
    cantidad = Column(Numeric(10, 2), nullable=False)
    unidad = Column(String(20), nullable=False)
    descripcion = Column(Text, nullable=False)
    precio_unitario = Column(Numeric(15, 2), nullable=False)
    total = Column(Numeric(15, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    orden_compra = relationship("OrdenCompra", back_populates="items")


class Pago(Base):
    __tablename__ = "pagos"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    orden_compra_id = Column(UUID(as_uuid=True), ForeignKey("ordenes_compra.id"))
    proveedor_id = Column(UUID(as_uuid=True), ForeignKey("proveedores.id"))
    obra_id = Column(UUID(as_uuid=True), ForeignKey("obras.id"))
    fecha_pago = Column(Date)
    fecha_programada = Column(Date)
    monto = Column(Numeric(15, 2), nullable=False)
    metodo_pago = Column(String(20))
    referencia = Column(String(255))
    estado = Column(String(20), nullable=False)
    observaciones = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "metodo_pago IN ('transferencia','cheque','efectivo')",
            name="pagos_metodo_check",
        ),
        CheckConstraint(
            "estado IN ('programado','procesando','completado','cancelado')",
            name="pagos_estado_check",
        ),
    )

    orden_compra = relationship("OrdenCompra", back_populates="pagos")
    proveedor = relationship("Proveedor", back_populates="pagos")
    obra = relationship("Obra", back_populates="pagos")
