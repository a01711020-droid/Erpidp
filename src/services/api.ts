/**
 * Servicio de API - Todos los endpoints CRUD
 * Reemplaza database.ts como fuente de verdad
 */

import apiClient, { getErrorMessage } from './apiClient';
import type {
  Obra,
  Proveedor,
  Requisicion,
  OrdenCompra,
  Pago,
  CargaSemanal,
} from '@/types';

// ==========================================
// OBRAS
// ==========================================

export const obrasAPI = {
  /**
   * Obtener todas las obras
   */
  async getAll(): Promise<Obra[]> {
    try {
      const response = await apiClient.get<Obra[]>('/api/obras');
      return response.data;
    } catch (error) {
      console.error('Error al obtener obras:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Obtener obra por código
   */
  async getByCode(code: string): Promise<Obra> {
    try {
      const response = await apiClient.get<Obra>(`/api/obras/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener obra ${code}:`, getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Crear obra
   */
  async create(obra: Omit<Obra, 'id' | 'createdAt' | 'updatedAt'>): Promise<Obra> {
    try {
      const response = await apiClient.post<Obra>('/api/obras', obra);
      return response.data;
    } catch (error) {
      console.error('Error al crear obra:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Actualizar obra
   */
  async update(code: string, updates: Partial<Obra>): Promise<Obra> {
    try {
      const response = await apiClient.put<Obra>(`/api/obras/${code}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar obra ${code}:`, getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Eliminar obra
   */
  async delete(code: string): Promise<void> {
    try {
      await apiClient.delete(`/api/obras/${code}`);
    } catch (error) {
      console.error(`Error al eliminar obra ${code}:`, getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// PROVEEDORES
// ==========================================

export const proveedoresAPI = {
  async getAll(): Promise<Proveedor[]> {
    try {
      const response = await apiClient.get<Proveedor[]>('/api/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', getErrorMessage(error));
      throw error;
    }
  },

  async getById(id: string): Promise<Proveedor> {
    try {
      const response = await apiClient.get<Proveedor>(`/api/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener proveedor ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async create(proveedor: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Proveedor> {
    try {
      const response = await apiClient.post<Proveedor>('/api/proveedores', proveedor);
      return response.data;
    } catch (error) {
      console.error('Error al crear proveedor:', getErrorMessage(error));
      throw error;
    }
  },

  async update(id: string, updates: Partial<Proveedor>): Promise<Proveedor> {
    try {
      const response = await apiClient.put<Proveedor>(`/api/proveedores/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar proveedor ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/proveedores/${id}`);
    } catch (error) {
      console.error(`Error al eliminar proveedor ${id}:`, getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// REQUISICIONES
// ==========================================

export const requisicionesAPI = {
  async getAll(): Promise<Requisicion[]> {
    try {
      const response = await apiClient.get<Requisicion[]>('/api/requisiciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener requisiciones:', getErrorMessage(error));
      throw error;
    }
  },

  async getByObra(obraCode: string): Promise<Requisicion[]> {
    try {
      const response = await apiClient.get<Requisicion[]>(`/api/requisiciones/obra/${obraCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener requisiciones de obra ${obraCode}:`, getErrorMessage(error));
      throw error;
    }
  },

  async getById(id: string): Promise<Requisicion> {
    try {
      const response = await apiClient.get<Requisicion>(`/api/requisiciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener requisición ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async create(requisicion: Omit<Requisicion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Requisicion> {
    try {
      const response = await apiClient.post<Requisicion>('/api/requisiciones', requisicion);
      return response.data;
    } catch (error) {
      console.error('Error al crear requisición:', getErrorMessage(error));
      throw error;
    }
  },

  async update(id: string, updates: Partial<Requisicion>): Promise<Requisicion> {
    try {
      const response = await apiClient.put<Requisicion>(`/api/requisiciones/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar requisición ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/requisiciones/${id}`);
    } catch (error) {
      console.error(`Error al eliminar requisición ${id}:`, getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// ÓRDENES DE COMPRA
// ==========================================

export const ordenesCompraAPI = {
  async getAll(): Promise<OrdenCompra[]> {
    try {
      const response = await apiClient.get<OrdenCompra[]>('/api/ordenes-compra');
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes de compra:', getErrorMessage(error));
      throw error;
    }
  },

  async getByObra(obraCode: string): Promise<OrdenCompra[]> {
    try {
      const response = await apiClient.get<OrdenCompra[]>(`/api/ordenes-compra/obra/${obraCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener OCs de obra ${obraCode}:`, getErrorMessage(error));
      throw error;
    }
  },

  async getById(id: string): Promise<OrdenCompra> {
    try {
      const response = await apiClient.get<OrdenCompra>(`/api/ordenes-compra/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener OC ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async create(ordenCompra: Omit<OrdenCompra, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrdenCompra> {
    try {
      const response = await apiClient.post<OrdenCompra>('/api/ordenes-compra', ordenCompra);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden de compra:', getErrorMessage(error));
      throw error;
    }
  },

  async update(id: string, updates: Partial<OrdenCompra>): Promise<OrdenCompra> {
    try {
      const response = await apiClient.put<OrdenCompra>(`/api/ordenes-compra/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar OC ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/ordenes-compra/${id}`);
    } catch (error) {
      console.error(`Error al eliminar OC ${id}:`, getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// PAGOS
// ==========================================

export const pagosAPI = {
  async getAll(): Promise<Pago[]> {
    try {
      const response = await apiClient.get<Pago[]>('/api/pagos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pagos:', getErrorMessage(error));
      throw error;
    }
  },

  async getByOrdenCompra(ordenCompraId: string): Promise<Pago[]> {
    try {
      const response = await apiClient.get<Pago[]>(`/api/pagos/orden-compra/${ordenCompraId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pagos de OC ${ordenCompraId}:`, getErrorMessage(error));
      throw error;
    }
  },

  async getById(id: string): Promise<Pago> {
    try {
      const response = await apiClient.get<Pago>(`/api/pagos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pago ${id}:`, getErrorMessage(error));
      throw error;
    }
  },

  async create(pago: Omit<Pago, 'id' | 'createdAt'>): Promise<Pago> {
    try {
      const response = await apiClient.post<Pago>('/api/pagos', pago);
      return response.data;
    } catch (error) {
      console.error('Error al crear pago:', getErrorMessage(error));
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/pagos/${id}`);
    } catch (error) {
      console.error(`Error al eliminar pago ${id}:`, getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// DESTAJOS
// ==========================================

export const destajosAPI = {
  async getAll(): Promise<CargaSemanal[]> {
    try {
      const response = await apiClient.get<CargaSemanal[]>('/api/destajos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener destajos:', getErrorMessage(error));
      throw error;
    }
  },

  async getByObra(obraCode: string): Promise<CargaSemanal[]> {
    try {
      const response = await apiClient.get<CargaSemanal[]>(`/api/destajos/obra/${obraCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener destajos de obra ${obraCode}:`, getErrorMessage(error));
      throw error;
    }
  },

  async create(carga: Omit<CargaSemanal, 'id' | 'createdAt'>): Promise<CargaSemanal> {
    try {
      const response = await apiClient.post<CargaSemanal>('/api/destajos', carga);
      return response.data;
    } catch (error) {
      console.error('Error al crear destajo:', getErrorMessage(error));
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/destajos/${id}`);
    } catch (error) {
      console.error(`Error al eliminar destajo ${id}:`, getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// DASHBOARD / ESTADÍSTICAS
// ==========================================

export interface EstadisticasGlobales {
  totalObras: number;
  obrasActivas: number;
  totalOrdenes: number;
  totalRequisiciones: number;
  totalPagos: number;
  montoTotalOrdenes: number;
  montoTotalPagado: number;
  montoPendientePago: number;
}

export const dashboardAPI = {
  async getEstadisticasGlobales(): Promise<EstadisticasGlobales> {
    try {
      const response = await apiClient.get<EstadisticasGlobales>('/api/dashboard/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', getErrorMessage(error));
      throw error;
    }
  },
};

// ==========================================
// HEALTH CHECK
// ==========================================

export const healthAPI = {
  async check(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },
};
