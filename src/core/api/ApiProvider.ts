/**
 * API PROVIDER - Conexión real con FastAPI Backend
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
  BankTransaction,
  BankTransactionCreate,
  BankTransactionMatch,
  MetricasObra,
  PaginatedResponse,
  ListParams,
} from "../types/entities";

const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === "[object Object]";

const toSnakeKey = (key: string): string => key.replace(/([A-Z])/g, "_$1").toLowerCase();

const toCamelKey = (key: string): string =>
  key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

const transformKeys = (value: unknown, transformer: (key: string) => string): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transformer));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [transformer(key), transformKeys(val, transformer)])
    );
  }
  return value;
};

function buildQueryParams(params?: ListParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.append("page", params.page.toString());
  if (params.pageSize !== undefined) searchParams.append("page_size", params.pageSize.toString());
  if (params.sortBy) searchParams.append("sort_by", toSnakeKey(params.sortBy));
  if (params.sortOrder) searchParams.append("sort_order", params.sortOrder);
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(toSnakeKey(key), String(value));
      }
    });
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function convertPaginatedResponse<T>(response: any): PaginatedResponse<T> {
  return {
    data: response.data,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
  };
}

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function extractFieldErrors(detail: any): Record<string, string[]> | undefined {
  if (!Array.isArray(detail)) return undefined;
  const errors: Record<string, string[]> = {};
  detail.forEach((item) => {
    const loc = Array.isArray(item.loc) ? item.loc.filter((entry: any) => entry !== "body") : [];
    const field = loc.join(".") || "general";
    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(item.msg || "Error de validación");
  });
  return Object.keys(errors).length ? errors : undefined;
}

function formatValidationErrors(detail: any): string {
  if (!detail) return "Validation error";
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const loc = Array.isArray(item.loc) ? item.loc.filter((entry: any) => entry !== "body") : [];
        const field = loc.join(".");
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join("; ");
  }
  if (typeof detail === "string") return detail;
  return JSON.stringify(detail);
}

interface FetchOptions extends RequestInit {
  body?: any;
}

async function fetchApi<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_URL no está configurado. Crea el archivo .env con VITE_API_URL=http://localhost:8000"
    );
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const body =
    options?.body && typeof options.body === "string"
      ? options.body
      : options?.body
      ? JSON.stringify(transformKeys(options.body, toSnakeKey))
      : undefined;

  try {
    const response = await fetch(url, {
      ...options,
      body,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      if (response.status === 422) {
        const message = formatValidationErrors(errorData.detail);
        const fieldErrors = extractFieldErrors(errorData.detail);
        throw new ApiError(message, response.status, fieldErrors);
      }
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return transformKeys(data, toCamelKey) as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export class ApiProvider implements IDataProvider {
  async listObras(params?: ListParams): Promise<PaginatedResponse<Obra>> {
    const response = await fetchApi<any>(`/api/obras${buildQueryParams(params)}`);
    return convertPaginatedResponse<Obra>(response);
  }

  async getObra(id: string): Promise<Obra> {
    return fetchApi<Obra>(`/api/obras/${id}`);
  }

  async createObra(data: ObraCreate): Promise<Obra> {
    return fetchApi<Obra>("/api/obras", {
      method: "POST",
      body: data,
    });
  }

  async updateObra(id: string, data: ObraUpdate): Promise<Obra> {
    return fetchApi<Obra>(`/api/obras/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteObra(id: string): Promise<void> {
    await fetchApi<void>(`/api/obras/${id}`, {
      method: "DELETE",
    });
  }

  async listProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>> {
    const response = await fetchApi<any>(`/api/proveedores${buildQueryParams(params)}`);
    return convertPaginatedResponse<Proveedor>(response);
  }

  async getProveedor(id: string): Promise<Proveedor> {
    return fetchApi<Proveedor>(`/api/proveedores/${id}`);
  }

  async createProveedor(data: ProveedorCreate): Promise<Proveedor> {
    return fetchApi<Proveedor>("/api/proveedores", {
      method: "POST",
      body: data,
    });
  }

  async updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor> {
    return fetchApi<Proveedor>(`/api/proveedores/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteProveedor(id: string): Promise<void> {
    await fetchApi<void>(`/api/proveedores/${id}`, {
      method: "DELETE",
    });
  }

  async listRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>> {
    const response = await fetchApi<any>(`/api/requisiciones${buildQueryParams(params)}`);
    return convertPaginatedResponse<Requisicion>(response);
  }

  async getRequisicion(id: string): Promise<Requisicion> {
    return fetchApi<Requisicion>(`/api/requisiciones/${id}`);
  }

  async createRequisicion(data: RequisicionCreate): Promise<Requisicion> {
    return fetchApi<Requisicion>("/api/requisiciones", {
      method: "POST",
      body: data,
    });
  }

  async updateRequisicion(id: string, data: RequisicionUpdate): Promise<Requisicion> {
    return fetchApi<Requisicion>(`/api/requisiciones/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteRequisicion(id: string): Promise<void> {
    await fetchApi<void>(`/api/requisiciones/${id}`, {
      method: "DELETE",
    });
  }

  async listOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>> {
    const response = await fetchApi<any>(`/api/ordenes-compra${buildQueryParams(params)}`);
    return convertPaginatedResponse<OrdenCompra>(response);
  }

  async getOrdenCompra(id: string): Promise<OrdenCompra> {
    return fetchApi<OrdenCompra>(`/api/ordenes-compra/${id}`);
  }

  async createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra> {
    return fetchApi<OrdenCompra>("/api/ordenes-compra", {
      method: "POST",
      body: data,
    });
  }

  async updateOrdenCompra(id: string, data: OrdenCompraUpdate): Promise<OrdenCompra> {
    return fetchApi<OrdenCompra>(`/api/ordenes-compra/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deleteOrdenCompra(id: string): Promise<void> {
    await fetchApi<void>(`/api/ordenes-compra/${id}`, {
      method: "DELETE",
    });
  }

  async listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>> {
    const response = await fetchApi<any>(`/api/pagos${buildQueryParams(params)}`);
    return convertPaginatedResponse<Pago>(response);
  }

  async getPago(id: string): Promise<Pago> {
    return fetchApi<Pago>(`/api/pagos/${id}`);
  }

  async createPago(data: PagoCreate): Promise<Pago> {
    return fetchApi<Pago>("/api/pagos", {
      method: "POST",
      body: data,
    });
  }

  async updatePago(id: string, data: PagoUpdate): Promise<Pago> {
    return fetchApi<Pago>(`/api/pagos/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async deletePago(id: string): Promise<void> {
    await fetchApi<void>(`/api/pagos/${id}`, {
      method: "DELETE",
    });
  }

  async listBankTransactions(matched?: boolean): Promise<BankTransaction[]> {
    const query = matched === undefined ? "" : `?matched=${matched}`;
    return fetchApi<BankTransaction[]>(`/api/bank-transactions${query}`);
  }

  async importBankTransactions(data: BankTransactionCreate[]): Promise<BankTransaction[]> {
    return fetchApi<BankTransaction[]>("/api/bank-transactions/import", {
      method: "POST",
      body: data,
    });
  }

  async matchBankTransaction(id: string, data: BankTransactionMatch): Promise<BankTransaction> {
    return fetchApi<BankTransaction>(`/api/bank-transactions/${id}/match`, {
      method: "PUT",
      body: data,
    });
  }

  async getMetricasObra(obraId: string): Promise<MetricasObra> {
    return fetchApi<MetricasObra>(`/api/dashboard/obras/${obraId}/metricas`);
  }
}

export const apiProvider = new ApiProvider();
