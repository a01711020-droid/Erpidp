"""
FastAPI Backend para Sistema de Gestión Constructora
Lógica de negocio compleja + Integración con Supabase
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from datetime import datetime, date
from decimal import Decimal
import os
from dotenv import load_dotenv

from database import get_db_connection
from schemas import (
    DistribucionGastosIndirectos,
    CalculoDistribucionResponse,
    ReporteObraFinanciero,
    ValidacionLineaCredito,
    AlertaVencimiento,
    EstadisticasCompras
)

# Cargar variables de entorno
load_dotenv()

# Inicializar FastAPI
app = FastAPI(
    title="API Constructora",
    description="Backend con lógica compleja para gestión de construcción",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seguridad
security = HTTPBearer()

# ================================================
# ENDPOINTS: DISTRIBUCIÓN DE GASTOS INDIRECTOS
# ================================================

@app.post("/api/gastos-indirectos/calcular-distribucion", response_model=CalculoDistribucionResponse)
async def calcular_distribucion_gastos_indirectos(mes: str):
    """
    Calcula la distribución proporcional de gastos indirectos entre obras
    según sus gastos directos del mes.
    
    Params:
        mes: Formato YYYY-MM (ejemplo: "2025-01")
    
    Returns:
        CalculoDistribucionResponse con distribución por obra
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Obtener total de gastos indirectos del mes
        cursor.execute(
            "SELECT COALESCE(SUM(monto), 0) FROM gastos_indirectos WHERE mes = %s",
            (mes,)
        )
        total_indirectos = float(cursor.fetchone()[0])
        
        # 2. Obtener gastos directos por obra
        cursor.execute("""
            SELECT 
                o.id,
                o.codigo,
                o.nombre,
                COALESCE(SUM(gd.monto), 0) as gastos_directos
            FROM obras o
            LEFT JOIN gastos_directos gd ON o.id = gd.obra_id AND gd.mes = %s
            WHERE o.estado = 'Activa'
            GROUP BY o.id, o.codigo, o.nombre
            HAVING COALESCE(SUM(gd.monto), 0) > 0
            ORDER BY o.codigo
        """, (mes,))
        
        obras_gastos = cursor.fetchall()
        
        if not obras_gastos:
            return CalculoDistribucionResponse(
                mes=mes,
                total_gastos_indirectos=total_indirectos,
                total_gastos_directos=0,
                distribucion=[]
            )
        
        # 3. Calcular total de gastos directos
        total_directos = sum(float(obra[3]) for obra in obras_gastos)
        
        # 4. Calcular distribución proporcional
        distribuciones = []
        for obra in obras_gastos:
            obra_id, codigo, nombre, gastos_directos = obra
            gastos_directos = float(gastos_directos)
            
            # Porcentaje proporcional
            porcentaje = (gastos_directos / total_directos) if total_directos > 0 else 0
            
            # Monto de gastos indirectos asignado
            indirectos_asignados = total_indirectos * porcentaje
            
            # Total de gastos de la obra
            total_obra = gastos_directos + indirectos_asignados
            
            distribuciones.append(DistribucionGastosIndirectos(
                obra_id=str(obra_id),
                obra_codigo=codigo,
                obra_nombre=nombre,
                gastos_directos=gastos_directos,
                porcentaje_asignado=porcentaje,
                gastos_indirectos_asignados=indirectos_asignados,
                total_gastos_obra=total_obra
            ))
            
            # 5. Guardar en la tabla de distribución
            cursor.execute("""
                INSERT INTO distribucion_gastos_indirectos 
                (obra_id, mes, total_gastos_directos, porcentaje_asignado, 
                 monto_indirecto_asignado, total_gastos_obra)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (obra_id, mes) 
                DO UPDATE SET
                    total_gastos_directos = EXCLUDED.total_gastos_directos,
                    porcentaje_asignado = EXCLUDED.porcentaje_asignado,
                    monto_indirecto_asignado = EXCLUDED.monto_indirecto_asignado,
                    total_gastos_obra = EXCLUDED.total_gastos_obra
            """, (
                obra_id, mes, gastos_directos, porcentaje,
                indirectos_asignados, total_obra
            ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return CalculoDistribucionResponse(
            mes=mes,
            total_gastos_indirectos=total_indirectos,
            total_gastos_directos=total_directos,
            distribucion=distribuciones
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al calcular distribución: {str(e)}")


@app.get("/api/gastos-indirectos/distribucion/{mes}", response_model=CalculoDistribucionResponse)
async def obtener_distribucion_mes(mes: str):
    """
    Obtiene la distribución de gastos indirectos ya calculada para un mes
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener distribución guardada
        cursor.execute("""
            SELECT 
                d.obra_id,
                o.codigo,
                o.nombre,
                d.total_gastos_directos,
                d.porcentaje_asignado,
                d.monto_indirecto_asignado,
                d.total_gastos_obra
            FROM distribucion_gastos_indirectos d
            JOIN obras o ON d.obra_id = o.id
            WHERE d.mes = %s
            ORDER BY o.codigo
        """, (mes,))
        
        resultados = cursor.fetchall()
        
        # Obtener total de gastos indirectos
        cursor.execute(
            "SELECT COALESCE(SUM(monto), 0) FROM gastos_indirectos WHERE mes = %s",
            (mes,)
        )
        total_indirectos = float(cursor.fetchone()[0])
        
        distribuciones = []
        total_directos = 0
        
        for row in resultados:
            distribuciones.append(DistribucionGastosIndirectos(
                obra_id=str(row[0]),
                obra_codigo=row[1],
                obra_nombre=row[2],
                gastos_directos=float(row[3]),
                porcentaje_asignado=float(row[4]),
                gastos_indirectos_asignados=float(row[5]),
                total_gastos_obra=float(row[6])
            ))
            total_directos += float(row[3])
        
        cursor.close()
        conn.close()
        
        return CalculoDistribucionResponse(
            mes=mes,
            total_gastos_indirectos=total_indirectos,
            total_gastos_directos=total_directos,
            distribucion=distribuciones
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener distribución: {str(e)}")


# ================================================
# ENDPOINTS: REPORTES FINANCIEROS
# ================================================

@app.get("/api/reportes/obra-financiero/{obra_id}", response_model=ReporteObraFinanciero)
async def reporte_financiero_obra(obra_id: str, fecha_inicio: str, fecha_fin: str):
    """
    Genera reporte financiero completo de una obra en un período
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener info de obra
        cursor.execute(
            "SELECT codigo, nombre, cliente FROM obras WHERE id = %s",
            (obra_id,)
        )
        obra_info = cursor.fetchone()
        if not obra_info:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        # Total órdenes de compra
        cursor.execute("""
            SELECT COALESCE(SUM(total), 0)
            FROM ordenes_compra
            WHERE obra_id = %s 
            AND created_at BETWEEN %s AND %s
            AND estado != 'Cancelada'
        """, (obra_id, fecha_inicio, fecha_fin))
        total_oc = float(cursor.fetchone()[0])
        
        # Total destajos
        cursor.execute("""
            SELECT COALESCE(SUM(total), 0)
            FROM destajos
            WHERE obra_id = %s 
            AND created_at BETWEEN %s AND %s
        """, (obra_id, fecha_inicio, fecha_fin))
        total_destajos = float(cursor.fetchone()[0])
        
        # Total pagos
        cursor.execute("""
            SELECT COALESCE(SUM(monto), 0)
            FROM pagos
            WHERE obra_id = %s 
            AND fecha_pago BETWEEN %s AND %s
            AND estado = 'Procesado'
        """, (obra_id, fecha_inicio, fecha_fin))
        total_pagado = float(cursor.fetchone()[0])
        
        # Gastos directos
        cursor.execute("""
            SELECT COALESCE(SUM(monto), 0)
            FROM gastos_directos
            WHERE obra_id = %s 
            AND created_at BETWEEN %s AND %s
        """, (obra_id, fecha_inicio, fecha_fin))
        gastos_directos = float(cursor.fetchone()[0])
        
        # Gastos indirectos asignados
        cursor.execute("""
            SELECT COALESCE(SUM(monto_indirecto_asignado), 0)
            FROM distribucion_gastos_indirectos
            WHERE obra_id = %s 
            AND created_at BETWEEN %s AND %s
        """, (obra_id, fecha_inicio, fecha_fin))
        gastos_indirectos = float(cursor.fetchone()[0])
        
        cursor.close()
        conn.close()
        
        # Calcular pendiente de pago
        pendiente_pago = total_oc - total_pagado
        
        # Total de gastos
        total_gastos = gastos_directos + gastos_indirectos
        
        return ReporteObraFinanciero(
            obra_id=obra_id,
            obra_codigo=obra_info[0],
            obra_nombre=obra_info[1],
            cliente=obra_info[2] or "",
            periodo_inicio=fecha_inicio,
            periodo_fin=fecha_fin,
            total_ordenes_compra=total_oc,
            total_destajos=total_destajos,
            total_pagado=total_pagado,
            pendiente_pago=pendiente_pago,
            gastos_directos=gastos_directos,
            gastos_indirectos_asignados=gastos_indirectos,
            total_gastos=total_gastos
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar reporte: {str(e)}")


# ================================================
# ENDPOINTS: VALIDACIÓN LÍNEAS DE CRÉDITO
# ================================================

@app.post("/api/proveedores/validar-linea-credito", response_model=ValidacionLineaCredito)
async def validar_linea_credito(proveedor_id: str, monto_nuevo: float):
    """
    Valida si un proveedor tiene línea de crédito disponible
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener info del proveedor
        cursor.execute("""
            SELECT nombre_completo, linea_credito, linea_credito_usada, dias_credito
            FROM proveedores
            WHERE id = %s
        """, (proveedor_id,))
        
        proveedor = cursor.fetchone()
        if not proveedor:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        
        nombre, linea_total, linea_usada, dias_credito = proveedor
        linea_total = float(linea_total or 0)
        linea_usada = float(linea_usada or 0)
        
        # Calcular disponible
        disponible = linea_total - linea_usada
        disponible_despues = disponible - monto_nuevo
        
        # Validar
        aprobado = disponible_despues >= 0
        
        cursor.close()
        conn.close()
        
        return ValidacionLineaCredito(
            proveedor_id=proveedor_id,
            proveedor_nombre=nombre,
            linea_credito_total=linea_total,
            linea_credito_usada=linea_usada,
            linea_credito_disponible=disponible,
            monto_solicitado=monto_nuevo,
            disponible_despues_compra=disponible_despues,
            aprobado=aprobado,
            mensaje=f"Aprobado. Disponible: ${disponible_despues:,.2f}" if aprobado 
                   else f"Rechazado. Excede línea de crédito por ${abs(disponible_despues):,.2f}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al validar línea de crédito: {str(e)}")


# ================================================
# ENDPOINTS: ALERTAS DE VENCIMIENTOS
# ================================================

@app.get("/api/alertas/vencimientos-credito", response_model=List[AlertaVencimiento])
async def obtener_alertas_vencimiento():
    """
    Obtiene alertas de órdenes próximas a vencer según días de crédito
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                oc.id,
                oc.numero_orden,
                o.codigo as obra_codigo,
                o.nombre as obra_nombre,
                p.nombre_completo as proveedor,
                p.dias_credito,
                oc.created_at,
                oc.total,
                COALESCE(SUM(pg.monto), 0) as pagado
            FROM ordenes_compra oc
            JOIN obras o ON oc.obra_id = o.id
            JOIN proveedores p ON oc.proveedor_id = p.id
            LEFT JOIN pagos pg ON oc.id = pg.orden_compra_id AND pg.estado = 'Procesado'
            WHERE oc.estado IN ('Aprobada', 'Entregada')
            AND p.dias_credito > 0
            GROUP BY oc.id, oc.numero_orden, o.codigo, o.nombre, p.nombre_completo, 
                     p.dias_credito, oc.created_at, oc.total
            HAVING oc.total > COALESCE(SUM(pg.monto), 0)
        """)
        
        alertas = []
        hoy = datetime.now().date()
        
        for row in cursor.fetchall():
            oc_id, numero_orden, obra_codigo, obra_nombre, proveedor, dias_credito, \
            fecha_oc, total, pagado = row
            
            # Calcular vencimiento
            fecha_oc = fecha_oc.date() if hasattr(fecha_oc, 'date') else fecha_oc
            fecha_vencimiento = fecha_oc + datetime.timedelta(days=dias_credito)
            dias_restantes = (fecha_vencimiento - hoy).days
            
            # Determinar nivel de urgencia
            if dias_restantes < 0:
                urgencia = "vencido"
            elif dias_restantes <= 7:
                urgencia = "critico"
            elif dias_restantes <= 15:
                urgencia = "urgente"
            else:
                urgencia = "normal"
            
            pendiente = float(total) - float(pagado)
            
            alertas.append(AlertaVencimiento(
                orden_compra_id=str(oc_id),
                numero_orden=numero_orden,
                obra_codigo=obra_codigo,
                obra_nombre=obra_nombre,
                proveedor=proveedor,
                fecha_orden=str(fecha_oc),
                dias_credito=dias_credito,
                fecha_vencimiento=str(fecha_vencimiento),
                dias_restantes=dias_restantes,
                total_orden=float(total),
                monto_pagado=float(pagado),
                monto_pendiente=pendiente,
                urgencia=urgencia
            ))
        
        cursor.close()
        conn.close()
        
        # Ordenar por urgencia
        orden_urgencia = {"vencido": 0, "critico": 1, "urgente": 2, "normal": 3}
        alertas.sort(key=lambda x: (orden_urgencia[x.urgencia], x.dias_restantes))
        
        return alertas
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alertas: {str(e)}")


# ================================================
# ENDPOINTS: ESTADÍSTICAS Y DASHBOARD
# ================================================

@app.get("/api/estadisticas/compras", response_model=EstadisticasCompras)
async def obtener_estadisticas_compras(fecha_inicio: str, fecha_fin: str):
    """
    Obtiene estadísticas generales de compras
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total órdenes
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ordenes_compra
            WHERE created_at BETWEEN %s AND %s
            AND estado != 'Cancelada'
        """, (fecha_inicio, fecha_fin))
        total_ordenes, total_monto = cursor.fetchone()
        
        # Por estado
        cursor.execute("""
            SELECT estado, COUNT(*), COALESCE(SUM(total), 0)
            FROM ordenes_compra
            WHERE created_at BETWEEN %s AND %s
            GROUP BY estado
        """, (fecha_inicio, fecha_fin))
        por_estado = {row[0]: {"count": row[1], "total": float(row[2])} for row in cursor.fetchall()}
        
        # Top 5 proveedores
        cursor.execute("""
            SELECT p.nombre_completo, COUNT(oc.id), COALESCE(SUM(oc.total), 0)
            FROM ordenes_compra oc
            JOIN proveedores p ON oc.proveedor_id = p.id
            WHERE oc.created_at BETWEEN %s AND %s
            AND oc.estado != 'Cancelada'
            GROUP BY p.id, p.nombre_completo
            ORDER BY SUM(oc.total) DESC
            LIMIT 5
        """, (fecha_inicio, fecha_fin))
        top_proveedores = [
            {"nombre": row[0], "ordenes": row[1], "total": float(row[2])}
            for row in cursor.fetchall()
        ]
        
        # Top 5 obras
        cursor.execute("""
            SELECT o.codigo, o.nombre, COUNT(oc.id), COALESCE(SUM(oc.total), 0)
            FROM ordenes_compra oc
            JOIN obras o ON oc.obra_id = o.id
            WHERE oc.created_at BETWEEN %s AND %s
            AND oc.estado != 'Cancelada'
            GROUP BY o.id, o.codigo, o.nombre
            ORDER BY SUM(oc.total) DESC
            LIMIT 5
        """, (fecha_inicio, fecha_fin))
        top_obras = [
            {"codigo": row[0], "nombre": row[1], "ordenes": row[2], "total": float(row[3])}
            for row in cursor.fetchall()
        ]
        
        # Total ahorrado en descuentos
        cursor.execute("""
            SELECT COALESCE(SUM(descuento_monto), 0)
            FROM ordenes_compra
            WHERE created_at BETWEEN %s AND %s
            AND estado != 'Cancelada'
        """, (fecha_inicio, fecha_fin))
        total_descuentos = float(cursor.fetchone()[0])
        
        cursor.close()
        conn.close()
        
        return EstadisticasCompras(
            total_ordenes=total_ordenes,
            total_monto=float(total_monto),
            ordenes_por_estado=por_estado,
            top_proveedores=top_proveedores,
            top_obras=top_obras,
            total_ahorrado_descuentos=total_descuentos,
            periodo_inicio=fecha_inicio,
            periodo_fin=fecha_fin
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")


# ================================================
# HEALTH CHECK
# ================================================

@app.get("/health")
async def health_check():
    """Verificar que la API está funcionando"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "API Constructora - Backend con FastAPI",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
