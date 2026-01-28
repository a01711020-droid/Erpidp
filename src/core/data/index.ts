/**
 * CORE DATA - INDEX
 * 
 * Punto de entrada central para la capa de datos
 * Exporta el adapter activo según configuración
 */

import type { IDataAdapter } from './dataAdapter';
import { mockAdapter } from './mockAdapter';

// Configuración
import { MOCK_MODE } from '../config';

// ============================================================================
// ADAPTER ACTIVO
// ============================================================================

/**
 * Adapter de datos activo
 * En MOCK_MODE usa mockAdapter
 * En producción usará apiAdapter (pendiente integración con Codex)
 */
export const dataAdapter: IDataAdapter = MOCK_MODE ? mockAdapter : mockAdapter;

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Types
export type {
  Obra,
  Proveedor,
  RequisicionMaterial,
  RequisicionMaterialItem,
  RequisicionComentario,
  OrdenCompra,
  OrdenCompraItem,
  Pago,
  Entrega,
  EntregaItem,
  MetricasObra,
  ResumenProveedorOC,
  EstadoRequisiciones,
  CreateObraDTO,
  UpdateObraDTO,
  CreateProveedorDTO,
  UpdateProveedorDTO,
  CreateRequisicionDTO,
  CreateOrdenCompraDTO,
  CreatePagoDTO,
} from './types';

// Interfaces
export type {
  IDataAdapter,
  DataResponse,
  ListResponse,
  DataStatus,
} from './dataAdapter';

// Helpers
export {
  createLoadingResponse,
  createSuccessResponse,
  createErrorResponse,
  createEmptyListResponse,
  createSuccessListResponse,
} from './dataAdapter';
