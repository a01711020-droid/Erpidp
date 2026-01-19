/**
 * API PROVIDER - Conexión real con FastAPI Backend
 * 
 * REGLAS:
 * - Usa el modelo unificado (codigo, nombre, estado)
 * - Sin traducciones, sin conversiones
 * - Conexión directa al backend FastAPI
 * - Manejo de errores apropiado
 * - Sin fallback a mock/localStorage
 */

import type { IDataProvider } from './DataProvider.interface';
import type {
  Obra,
  ObraCreate,
  ObraUpdate,
  Proveedor,
  ProveedorCreate,
  ProveedorUpdate,
  Requisicion,
  RequisicionCreate,
  RequisicionUpdate,
  OrdenCompra,
  OrdenCompraCreate,
  OrdenCompraUpdate,
  Pago,
  PagoCreate,
  PagoUpdate,
  PaginatedResponse,
  ListParams,
} from '../types/entities';

/**
 * URL base de la API
 * En desarrollo: http://localhost:8000
 * En producción: https://tu-backend.onrender.com
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Helper para construir query params
 */
function buildQueryParams(params?: ListParams): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  
  if (params.page !== undefined) searchParams.append('page', params.page.toString());
  if (params.pageSize !== undefined) searchParams.append('page_size', params.pageSize.toString());
  if (params.sortBy) searchParams.append('sort_by', params.sortBy);
  if (params.sortOrder) searchParams.append('sort_order', params.sortOrder);
  
  // Agregar filtros adicionales
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Helper para hacer requests HTTP
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Implementación del ApiProvider
 */
export class ApiProvider implements IDataProvider {
  // ===== OBRAS =====
  async listObras(params?: ListParams): Promise<PaginatedResponse<Obra>> {
    return fetchApi<PaginatedResponse<Obra>>(`/api/obras${buildQueryParams(params)}`);
  }

  async getObra(id: string): Promise<Obra> {
    return fetchApi<Obra>(`/api/obras/${id}`);
  }

  async createObra(data: ObraCreate): Promise<Obra> {
    return fetchApi<Obra>('/api/obras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateObra(id: string, data: ObraUpdate): Promise<Obra> {
    return fetchApi<Obra>(`/api/obras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteObra(id: string): Promise<void> {
    await fetchApi<void>(`/api/obras/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== PROVEEDORES =====
  async listProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>> {
    return fetchApi<PaginatedResponse<Proveedor>>(`/api/proveedores${buildQueryParams(params)}`);
  }

  async getProveedor(id: string): Promise<Proveedor> {
    return fetchApi<Proveedor>(`/api/proveedores/${id}`);
  }

  async createProveedor(data: ProveedorCreate): Promise<Proveedor> {
    return fetchApi<Proveedor>('/api/proveedores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor> {
    return fetchApi<Proveedor>(`/api/proveedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProveedor(id: string): Promise<void> {
    await fetchApi<void>(`/api/proveedores/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== REQUISICIONES =====
  async listRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>> {
    return fetchApi<PaginatedResponse<Requisicion>>(`/api/requisiciones${buildQueryParams(params)}`);
  }

  async getRequisicion(id: string): Promise<Requisicion> {
    return fetchApi<Requisicion>(`/api/requisiciones/${id}`);
  }

  async createRequisicion(data: RequisicionCreate): Promise<Requisicion> {
    return fetchApi<Requisicion>('/api/requisiciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRequisicion(id: string, data: RequisicionUpdate): Promise<Requisicion> {
    return fetchApi<Requisicion>(`/api/requisiciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRequisicion(id: string): Promise<void> {
    await fetchApi<void>(`/api/requisiciones/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== ÓRDENES DE COMPRA =====
  async listOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>> {
    return fetchApi<PaginatedResponse<OrdenCompra>>(`/api/ordenes-compra${buildQueryParams(params)}`);
  }

  async getOrdenCompra(id: string): Promise<OrdenCompra> {
    return fetchApi<OrdenCompra>(`/api/ordenes-compra/${id}`);
  }

  async createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra> {
    return fetchApi<OrdenCompra>('/api/ordenes-compra', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrdenCompra(id: string, data: OrdenCompraUpdate): Promise<OrdenCompra> {
    return fetchApi<OrdenCompra>(`/api/ordenes-compra/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrdenCompra(id: string): Promise<void> {
    await fetchApi<void>(`/api/ordenes-compra/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== PAGOS =====
  async listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>> {
    return fetchApi<PaginatedResponse<Pago>>(`/api/pagos${buildQueryParams(params)}`);
  }

  async getPago(id: string): Promise<Pago> {
    return fetchApi<Pago>(`/api/pagos/${id}`);
  }

  async createPago(data: PagoCreate): Promise<Pago> {
    return fetchApi<Pago>('/api/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePago(id: string, data: PagoUpdate): Promise<Pago> {
    return fetchApi<Pago>(`/api/pagos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePago(id: string): Promise<void> {
    await fetchApi<void>(`/api/pagos/${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Instancia singleton del ApiProvider
 */
export const apiProvider = new ApiProvider();
