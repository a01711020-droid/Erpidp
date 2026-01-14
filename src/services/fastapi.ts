/**
 * Servicio para conectarse al backend FastAPI
 * Maneja lógica compleja: distribución de gastos, validaciones, reportes
 * 
 * NOTA: Este servicio es OPCIONAL. Solo se usa si tienes el backend FastAPI deployado.
 * Si no lo tienes, el sistema funciona normalmente con los datos mock.
 */

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || "";

// Helper para verificar si FastAPI está configurado
const isFastAPIEnabled = () => {
  return FASTAPI_URL && FASTAPI_URL.length > 0;
};

// Helper para manejar errores de API
const handleAPIError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail || "Error en la petición");
  }
  return response.json();
};

export interface DistribucionGastosIndirectos {
  obra_id: string;
  obra_codigo: string;
  obra_nombre: string;
  gastos_directos: number;
  porcentaje_asignado: number;
  gastos_indirectos_asignados: number;
  total_gastos_obra: number;
}

export interface CalculoDistribucionResponse {
  mes: string;
  total_gastos_indirectos: number;
  total_gastos_directos: number;
  distribucion: DistribucionGastosIndirectos[];
}

export interface ReporteObraFinanciero {
  obra_id: string;
  obra_codigo: string;
  obra_nombre: string;
  cliente: string;
  periodo_inicio: string;
  periodo_fin: string;
  total_ordenes_compra: number;
  total_destajos: number;
  total_pagado: number;
  pendiente_pago: number;
  gastos_directos: number;
  gastos_indirectos_asignados: number;
  total_gastos: number;
}

export interface ValidacionLineaCredito {
  proveedor_id: string;
  proveedor_nombre: string;
  linea_credito_total: number;
  linea_credito_usada: number;
  linea_credito_disponible: number;
  monto_solicitado: number;
  disponible_despues_compra: number;
  aprobado: boolean;
  mensaje: string;
}

export interface AlertaVencimiento {
  orden_compra_id: string;
  numero_orden: string;
  obra_codigo: string;
  obra_nombre: string;
  proveedor: string;
  fecha_orden: string;
  dias_credito: number;
  fecha_vencimiento: string;
  dias_restantes: number;
  total_orden: number;
  monto_pagado: number;
  monto_pendiente: number;
  urgencia: "vencido" | "critico" | "urgente" | "normal";
}

export interface EstadisticasCompras {
  total_ordenes: number;
  total_monto: number;
  ordenes_por_estado: Record<string, { count: number; total: number }>;
  top_proveedores: Array<{ nombre: string; ordenes: number; total: number }>;
  top_obras: Array<{ codigo: string; nombre: string; ordenes: number; total: number }>;
  total_ahorrado_descuentos: number;
  periodo_inicio: string;
  periodo_fin: string;
}

export const fastApiService = {
  /**
   * Calcula y guarda la distribución de gastos indirectos entre obras
   */
  async calcularDistribucionGastosIndirectos(mes: string): Promise<CalculoDistribucionResponse> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(
      `${FASTAPI_URL}/api/gastos-indirectos/calcular-distribucion?mes=${mes}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleAPIError(response);
  },

  /**
   * Obtiene la distribución de gastos indirectos ya calculada
   */
  async obtenerDistribucionMes(mes: string): Promise<CalculoDistribucionResponse> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(`${FASTAPI_URL}/api/gastos-indirectos/distribucion/${mes}`);

    return handleAPIError(response);
  },

  /**
   * Genera reporte financiero completo de una obra
   */
  async obtenerReporteObraFinanciero(
    obraId: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ReporteObraFinanciero> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(
      `${FASTAPI_URL}/api/reportes/obra-financiero/${obraId}?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
    );

    return handleAPIError(response);
  },

  /**
   * Valida si un proveedor tiene línea de crédito disponible
   */
  async validarLineaCredito(
    proveedorId: string,
    montoNuevo: number
  ): Promise<ValidacionLineaCredito> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(`${FASTAPI_URL}/api/proveedores/validar-linea-credito`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proveedor_id: proveedorId,
        monto_nuevo: montoNuevo,
      }),
    });

    return handleAPIError(response);
  },

  /**
   * Obtiene alertas de órdenes próximas a vencer
   */
  async obtenerAlertasVencimiento(): Promise<AlertaVencimiento[]> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(`${FASTAPI_URL}/api/alertas/vencimientos-credito`);

    return handleAPIError(response);
  },

  /**
   * Obtiene estadísticas generales de compras
   */
  async obtenerEstadisticasCompras(
    fechaInicio: string,
    fechaFin: string
  ): Promise<EstadisticasCompras> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(
      `${FASTAPI_URL}/api/estadisticas/compras?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
    );

    return handleAPIError(response);
  },

  /**
   * Verifica que la API esté funcionando
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    if (!isFastAPIEnabled()) {
      throw new Error("FastAPI no está configurado");
    }

    const response = await fetch(`${FASTAPI_URL}/health`);

    if (!response.ok) {
      throw new Error("API no disponible");
    }

    return response.json();
  },
};