/**
 * API PROVIDER - Conexión real con backend FastAPI
 */

import type { IDataProvider } from "./DataProvider.interface";
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
} from "../types/entities";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

interface ApiError {
  detail?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = (await response.json()) as ApiError;
      if (data?.detail) {
        errorMessage = data.detail;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function buildQuery(params?: ListParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("page_size", String(params.pageSize));
  if (params.sortBy) search.set("sort_by", params.sortBy);
  if (params.sortOrder) search.set("sort_order", params.sortOrder);
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        search.set(key, String(value));
      }
    });
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export class ApiProvider implements IDataProvider {
  async listObras(params?: ListParams): Promise<PaginatedResponse<Obra>> {
    return request(`/obras${buildQuery(params)}`);
  }

  async getObra(id: string): Promise<Obra> {
    return request(`/obras/${id}`);
  }

  async createObra(data: ObraCreate): Promise<Obra> {
    return request(`/obras`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateObra(id: string, data: ObraUpdate): Promise<Obra> {
    return request(`/obras/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteObra(id: string): Promise<void> {
    await request(`/obras/${id}`, { method: "DELETE" });
  }

  async listProveedores(
    params?: ListParams
  ): Promise<PaginatedResponse<Proveedor>> {
    return request(`/proveedores${buildQuery(params)}`);
  }

  async getProveedor(id: string): Promise<Proveedor> {
    return request(`/proveedores/${id}`);
  }

  async createProveedor(data: ProveedorCreate): Promise<Proveedor> {
    return request(`/proveedores`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor> {
    return request(`/proveedores/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProveedor(id: string): Promise<void> {
    await request(`/proveedores/${id}`, { method: "DELETE" });
  }

  async listRequisiciones(
    params?: ListParams
  ): Promise<PaginatedResponse<Requisicion>> {
    return request(`/requisiciones${buildQuery(params)}`);
  }

  async getRequisicion(id: string): Promise<Requisicion> {
    return request(`/requisiciones/${id}`);
  }

  async createRequisicion(data: RequisicionCreate): Promise<Requisicion> {
    return request(`/requisiciones`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRequisicion(
    id: string,
    data: RequisicionUpdate
  ): Promise<Requisicion> {
    return request(`/requisiciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRequisicion(id: string): Promise<void> {
    await request(`/requisiciones/${id}`, { method: "DELETE" });
  }

  async listOrdenesCompra(
    params?: ListParams
  ): Promise<PaginatedResponse<OrdenCompra>> {
    return request(`/ordenes-compra${buildQuery(params)}`);
  }

  async getOrdenCompra(id: string): Promise<OrdenCompra> {
    return request(`/ordenes-compra/${id}`);
  }

  async createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra> {
    return request(`/ordenes-compra`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrdenCompra(
    id: string,
    data: OrdenCompraUpdate
  ): Promise<OrdenCompra> {
    return request(`/ordenes-compra/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteOrdenCompra(id: string): Promise<void> {
    await request(`/ordenes-compra/${id}`, { method: "DELETE" });
  }

  async listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>> {
    return request(`/pagos${buildQuery(params)}`);
  }

  async getPago(id: string): Promise<Pago> {
    return request(`/pagos/${id}`);
  }

  async createPago(data: PagoCreate): Promise<Pago> {
    return request(`/pagos`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePago(id: string, data: PagoUpdate): Promise<Pago> {
    return request(`/pagos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePago(id: string): Promise<void> {
    await request(`/pagos/${id}`, { method: "DELETE" });
  }
}
