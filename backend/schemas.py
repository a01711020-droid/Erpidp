"""
Schemas Pydantic para validación de datos
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from decimal import Decimal


# ================================================
# DISTRIBUCIÓN DE GASTOS INDIRECTOS
# ================================================

class DistribucionGastosIndirectos(BaseModel):
    obra_id: str
    obra_codigo: str
    obra_nombre: str
    gastos_directos: float
    porcentaje_asignado: float
    gastos_indirectos_asignados: float
    total_gastos_obra: float

    class Config:
        json_encoders = {
            Decimal: float
        }


class CalculoDistribucionResponse(BaseModel):
    mes: str = Field(..., description="Mes en formato YYYY-MM")
    total_gastos_indirectos: float
    total_gastos_directos: float
    distribucion: List[DistribucionGastosIndirectos]


# ================================================
# REPORTES FINANCIEROS
# ================================================

class ReporteObraFinanciero(BaseModel):
    obra_id: str
    obra_codigo: str
    obra_nombre: str
    cliente: str
    periodo_inicio: str
    periodo_fin: str
    total_ordenes_compra: float
    total_destajos: float
    total_pagado: float
    pendiente_pago: float
    gastos_directos: float
    gastos_indirectos_asignados: float
    total_gastos: float


# ================================================
# VALIDACIÓN DE LÍNEAS DE CRÉDITO
# ================================================

class ValidacionLineaCredito(BaseModel):
    proveedor_id: str
    proveedor_nombre: str
    linea_credito_total: float
    linea_credito_usada: float
    linea_credito_disponible: float
    monto_solicitado: float
    disponible_despues_compra: float
    aprobado: bool
    mensaje: str


# ================================================
# ALERTAS DE VENCIMIENTOS
# ================================================

class AlertaVencimiento(BaseModel):
    orden_compra_id: str
    numero_orden: str
    obra_codigo: str
    obra_nombre: str
    proveedor: str
    fecha_orden: str
    dias_credito: int
    fecha_vencimiento: str
    dias_restantes: int
    total_orden: float
    monto_pagado: float
    monto_pendiente: float
    urgencia: str = Field(..., description="vencido, critico, urgente, normal")


# ================================================
# ESTADÍSTICAS
# ================================================

class EstadisticasCompras(BaseModel):
    total_ordenes: int
    total_monto: float
    ordenes_por_estado: Dict[str, Any]
    top_proveedores: List[Dict[str, Any]]
    top_obras: List[Dict[str, Any]]
    total_ahorrado_descuentos: float
    periodo_inicio: str
    periodo_fin: str


# ================================================
# ANÁLISIS DE DESTAJOS
# ================================================

class AnalisisDestajoPorObra(BaseModel):
    obra_id: str
    obra_codigo: str
    obra_nombre: str
    total_destajos: float
    cantidad_destajistas: int
    semanas_registradas: int
    top_destajistas: List[Dict[str, Any]]


class AnalisisDestajoPorDestajista(BaseModel):
    destajista: str
    total_cobrado: float
    obras_trabajadas: List[str]
    cantidad_obras: int
    promedio_semanal: float
    semanas_trabajadas: int


# ================================================
# PAGOS PARCIALES
# ================================================

class PagoParcial(BaseModel):
    pago_id: str
    orden_compra_id: str
    numero_orden: str
    monto: float
    fecha_pago: str
    referencia: Optional[str] = None
    observaciones: Optional[str] = None


class EstadoPagoOrden(BaseModel):
    orden_compra_id: str
    numero_orden: str
    total_orden: float
    total_pagado: float
    saldo_pendiente: float
    pagos: List[PagoParcial]
    estado_pago: str = Field(..., description="pagado, parcial, pendiente")


# ================================================
# CÁLCULOS AUTOMÁTICOS
# ================================================

class CalculoOrdenCompra(BaseModel):
    """Para cálculos automáticos de subtotal, IVA, descuentos"""
    items: List[Dict[str, Any]]
    tiene_iva: bool = True
    descuento_porcentaje: float = 0
    
    @validator('descuento_porcentaje')
    def validar_descuento(cls, v):
        if v < 0 or v > 100:
            raise ValueError('El descuento debe estar entre 0 y 100')
        return v


class ResultadoCalculoOrden(BaseModel):
    subtotal: float
    descuento_monto: float
    subtotal_con_descuento: float
    iva: float
    total: float


# ================================================
# GENERACIÓN DE CÓDIGOS AUTOMÁTICOS
# ================================================

class GenerarCodigoOCRequest(BaseModel):
    obra_codigo: str
    comprador_iniciales: str
    proveedor_codigo: str
    consecutivo: Optional[int] = None


class GenerarCodigoOCResponse(BaseModel):
    codigo_generado: str
    obra_codigo: str
    comprador_iniciales: str
    proveedor_codigo: str
    consecutivo: int


class GenerarCodigoRequisicionRequest(BaseModel):
    obra_codigo: str
    residente_iniciales: str
    consecutivo: Optional[int] = None


class GenerarCodigoRequisicionResponse(BaseModel):
    codigo_generado: str
    obra_codigo: str
    residente_iniciales: str
    consecutivo: int


# ================================================
# IMPORTACIÓN DE DATOS CSV/EXCEL
# ================================================

class ImportarDestajosRequest(BaseModel):
    obra_codigo: str
    semana: str
    datos: List[Dict[str, Any]]


class ResultadoImportacion(BaseModel):
    exitosos: int
    fallidos: int
    errores: List[str]
    registros_creados: List[str]


# ================================================
# CONCILIACIÓN BANCARIA
# ================================================

class ConciliacionBancariaItem(BaseModel):
    fecha: str
    referencia: str
    monto: float
    concepto: str
    orden_compra_sugerida: Optional[str] = None
    confianza_match: Optional[float] = None


class ResultadoConciliacion(BaseModel):
    total_procesados: int
    automaticos: int
    requieren_revision: int
    items: List[ConciliacionBancariaItem]
