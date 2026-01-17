/**
 * API PROVIDER
 * Implementación del DataProvider que se conecta con el backend de Supabase
 * Usa las rutas del servidor Hono configurado en /supabase/functions/server/
 */

import type { IDataProvider } from "./DataProvider.interface";
import type {
  Obra,
  Proveedor,
  Requisicion,
  RequisicionItem,
  OrdenCompra,
  OrdenCompraItem,
  Pago,
  Destajo,
  Usuario,
  PaginatedResponse,
  ListParams,
  ObraFinancialSummary,
  ExpenseByCategory,
  WeeklyExpense,
} from "@/app/types/entities";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ============================================================================
// UTILIDADES HTTP
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: ListParams): Promise<T> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) queryParams.append(`filter_${key}`, value.toString());
        });
      }
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// ============================================================================
// API PROVIDER IMPLEMENTATION
// ============================================================================

export class ApiProvider implements IDataProvider {
  private client: ApiClient;

  constructor(apiUrl?: string) {
    this.client = new ApiClient(apiUrl || API_BASE_URL);
  }

  // ========== OBRAS ==========
  obras = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Obra>> => {
      return this.client.get<PaginatedResponse<Obra>>("/api/obras", params);
    },

    getById: async (id: string): Promise<Obra> => {
      return this.client.get<Obra>(`/api/obras/${id}`);
    },

    create: async (data: Omit<Obra, "id" | "createdAt" | "updatedAt">): Promise<Obra> => {
      return this.client.post<Obra>("/api/obras", data);
    },

    update: async (id: string, data: Partial<Obra>): Promise<Obra> => {
      return this.client.patch<Obra>(`/api/obras/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/obras/${id}`);
    },

    getFinancialSummary: async (id: string): Promise<ObraFinancialSummary> => {
      return this.client.get<ObraFinancialSummary>(`/api/obras/${id}/financial-summary`);
    },

    getExpensesByCategory: async (id: string): Promise<ExpenseByCategory[]> => {
      return this.client.get<ExpenseByCategory[]>(`/api/obras/${id}/expenses-by-category`);
    },

    getWeeklyExpenses: async (id: string): Promise<WeeklyExpense[]> => {
      return this.client.get<WeeklyExpense[]>(`/api/obras/${id}/weekly-expenses`);
    },
  };

  // ========== PROVEEDORES ==========
  proveedores = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Proveedor>> => {
      return this.client.get<PaginatedResponse<Proveedor>>("/api/proveedores", params);
    },

    getById: async (id: string): Promise<Proveedor> => {
      return this.client.get<Proveedor>(`/api/proveedores/${id}`);
    },

    create: async (data: Omit<Proveedor, "id" | "createdAt" | "updatedAt">): Promise<Proveedor> => {
      return this.client.post<Proveedor>("/api/proveedores", data);
    },

    update: async (id: string, data: Partial<Proveedor>): Promise<Proveedor> => {
      return this.client.patch<Proveedor>(`/api/proveedores/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/proveedores/${id}`);
    },
  };

  // ========== REQUISICIONES ==========
  requisiciones = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Requisicion>> => {
      return this.client.get<PaginatedResponse<Requisicion>>("/api/requisiciones", params);
    },

    getById: async (id: string): Promise<Requisicion> => {
      return this.client.get<Requisicion>(`/api/requisiciones/${id}`);
    },

    create: async (data: Omit<Requisicion, "id" | "createdAt" | "updatedAt">): Promise<Requisicion> => {
      return this.client.post<Requisicion>("/api/requisiciones", data);
    },

    update: async (id: string, data: Partial<Requisicion>): Promise<Requisicion> => {
      return this.client.patch<Requisicion>(`/api/requisiciones/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/requisiciones/${id}`);
    },

    approve: async (id: string, approvedBy: string): Promise<Requisicion> => {
      return this.client.put<Requisicion>(`/api/requisiciones/${id}/aprobar`, { aprobado_por: approvedBy });
    },

    reject: async (id: string, rejectionReason: string): Promise<Requisicion> => {
      return this.client.post<Requisicion>(`/api/requisiciones/${id}/reject`, { rejectionReason });
    },

    addItem: async (requisicionId: string, item: Omit<RequisicionItem, "id" | "requisicionId" | "createdAt">): Promise<RequisicionItem> => {
      return this.client.post<RequisicionItem>(`/api/requisiciones/${requisicionId}/items`, item);
    },

    updateItem: async (itemId: string, data: Partial<RequisicionItem>): Promise<RequisicionItem> => {
      return this.client.patch<RequisicionItem>(`/api/requisiciones/items/${itemId}`, data);
    },

    deleteItem: async (itemId: string): Promise<void> => {
      return this.client.delete<void>(`/api/requisiciones/items/${itemId}`);
    },
  };

  // ========== ÓRDENES DE COMPRA ==========
  ordenesCompra = {
    list: async (params?: ListParams): Promise<PaginatedResponse<OrdenCompra>> => {
      return this.client.get<PaginatedResponse<OrdenCompra>>("/api/ordenes-compra", params);
    },

    getById: async (id: string): Promise<OrdenCompra> => {
      return this.client.get<OrdenCompra>(`/api/ordenes-compra/${id}`);
    },

    create: async (data: Omit<OrdenCompra, "id" | "createdAt" | "updatedAt">): Promise<OrdenCompra> => {
      return this.client.post<OrdenCompra>("/api/ordenes-compra", data);
    },

    update: async (id: string, data: Partial<OrdenCompra>): Promise<OrdenCompra> => {
      return this.client.patch<OrdenCompra>(`/api/ordenes-compra/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/ordenes-compra/${id}`);
    },

    addItem: async (ordenCompraId: string, item: Omit<OrdenCompraItem, "id" | "ordenCompraId" | "createdAt">): Promise<OrdenCompraItem> => {
      return this.client.post<OrdenCompraItem>(`/api/ordenes-compra/${ordenCompraId}/items`, item);
    },

    updateItem: async (itemId: string, data: Partial<OrdenCompraItem>): Promise<OrdenCompraItem> => {
      return this.client.patch<OrdenCompraItem>(`/api/ordenes-compra/items/${itemId}`, data);
    },

    deleteItem: async (itemId: string): Promise<void> => {
      return this.client.delete<void>(`/api/ordenes-compra/items/${itemId}`);
    },
  };

  // ========== PAGOS ==========
  pagos = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Pago>> => {
      return this.client.get<PaginatedResponse<Pago>>("/api/pagos", params);
    },

    getById: async (id: string): Promise<Pago> => {
      return this.client.get<Pago>(`/api/pagos/${id}`);
    },

    create: async (data: Omit<Pago, "id" | "createdAt" | "updatedAt">): Promise<Pago> => {
      return this.client.post<Pago>("/api/pagos", data);
    },

    update: async (id: string, data: Partial<Pago>): Promise<Pago> => {
      return this.client.patch<Pago>(`/api/pagos/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/pagos/${id}`);
    },

    process: async (id: string, processedBy: string): Promise<Pago> => {
      return this.client.put<Pago>(`/api/pagos/${id}/procesar`, { procesado_por: processedBy });
    },

    complete: async (id: string): Promise<Pago> => {
      return this.client.post<Pago>(`/api/pagos/${id}/complete`, {});
    },

    cancel: async (id: string): Promise<Pago> => {
      return this.client.post<Pago>(`/api/pagos/${id}/cancel`, {});
    },
  };

  // ========== DESTAJOS ==========
  destajos = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Destajo>> => {
      return this.client.get<PaginatedResponse<Destajo>>("/api/destajos", params);
    },

    getById: async (id: string): Promise<Destajo> => {
      return this.client.get<Destajo>(`/api/destajos/${id}`);
    },

    create: async (data: Omit<Destajo, "id" | "createdAt" | "updatedAt">): Promise<Destajo> => {
      return this.client.post<Destajo>("/api/destajos", data);
    },

    update: async (id: string, data: Partial<Destajo>): Promise<Destajo> => {
      return this.client.patch<Destajo>(`/api/destajos/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/destajos/${id}`);
    },

    updateProgress: async (id: string, advancePercentage: number): Promise<Destajo> => {
      return this.client.patch<Destajo>(`/api/destajos/${id}/progress`, { advancePercentage });
    },
  };

  // ========== USUARIOS ==========
  usuarios = {
    list: async (params?: ListParams): Promise<PaginatedResponse<Usuario>> => {
      return this.client.get<PaginatedResponse<Usuario>>("/api/usuarios", params);
    },

    getById: async (id: string): Promise<Usuario> => {
      return this.client.get<Usuario>(`/api/usuarios/${id}`);
    },

    create: async (data: Omit<Usuario, "id" | "createdAt" | "updatedAt">): Promise<Usuario> => {
      return this.client.post<Usuario>("/api/usuarios", data);
    },

    update: async (id: string, data: Partial<Usuario>): Promise<Usuario> => {
      return this.client.patch<Usuario>(`/api/usuarios/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
      return this.client.delete<void>(`/api/usuarios/${id}`);
    },
  };
}