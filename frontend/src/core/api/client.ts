import type { ListParams } from "@/app/types/entities";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

interface ApiError {
  detail?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
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

export function buildQuery(params?: ListParams): string {
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
