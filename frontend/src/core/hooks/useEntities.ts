import { useCallback, useEffect, useState } from "react";
import type {
  Obra,
  ObraCreate,
  PaginatedResponse,
  ListParams,
  Proveedor,
  ProveedorCreate,
  ProveedorUpdate,
  Requisicion,
  RequisicionCreate,
  OrdenCompra,
  OrdenCompraCreate,
  OrdenCompraUpdate,
  Pago,
  PagoCreate,
} from "@/app/types/entities";
import { apiRequest, buildQuery } from "@/core/api/client";

interface ListState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface MutationState<TInput, TOutput> {
  loading: boolean;
  error: Error | null;
  mutate: (input: TInput) => Promise<TOutput | null>;
}

function useApiList<T>(endpoint: string, params?: ListParams): ListState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PaginatedResponse<T>>(
        `${endpoint}${buildQuery(params)}`
      );
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

function useApiCreate<TInput, TOutput>(
  endpoint: string
): MutationState<TInput, TOutput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (input: TInput) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest<TOutput>(endpoint, {
          method: "POST",
          body: JSON.stringify(input),
        });
        return response;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { loading, error, mutate };
}

function useApiUpdate<TInput, TOutput>(
  getEndpoint: (input: TInput) => string
): MutationState<TInput, TOutput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (input: TInput) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest<TOutput>(getEndpoint(input), {
          method: "PUT",
          body: JSON.stringify((input as { data: unknown }).data),
        });
        return response;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getEndpoint]
  );

  return { loading, error, mutate };
}

function useApiDelete<TInput>(
  getEndpoint: (input: TInput) => string
): MutationState<TInput, void> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (input: TInput) => {
      setLoading(true);
      setError(null);
      try {
        await apiRequest<void>(getEndpoint(input), { method: "DELETE" });
        return undefined;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getEndpoint]
  );

  return { loading, error, mutate };
}

export function useObras(params?: ListParams) {
  return useApiList<Obra>("/obras", params);
}

export function useCreateObra() {
  return useApiCreate<ObraCreate, Obra>("/obras");
}

export function useProveedores(params?: ListParams) {
  return useApiList<Proveedor>("/proveedores", params);
}

export function useCreateProveedor() {
  return useApiCreate<ProveedorCreate, Proveedor>("/proveedores");
}

export function useUpdateProveedor() {
  return useApiUpdate<{ id: string; data: ProveedorUpdate }, Proveedor>(
    (input) => `/proveedores/${input.id}`
  );
}

export function useDeleteProveedor() {
  return useApiDelete<{ id: string }>((input) => `/proveedores/${input.id}`);
}

export function useRequisiciones(params?: ListParams) {
  return useApiList<Requisicion>("/requisiciones", params);
}

export function useCreateRequisicion() {
  return useApiCreate<RequisicionCreate, Requisicion>("/requisiciones");
}

export function useOrdenesCompra(params?: ListParams) {
  return useApiList<OrdenCompra>("/ordenes-compra", params);
}

export function useCreateOrdenCompra() {
  return useApiCreate<OrdenCompraCreate, OrdenCompra>("/ordenes-compra");
}

export function useUpdateOrdenCompra() {
  return useApiUpdate<{ id: string; data: OrdenCompraUpdate }, OrdenCompra>(
    (input) => `/ordenes-compra/${input.id}`
  );
}

export function useDeleteOrdenCompra() {
  return useApiDelete<{ id: string }>((input) => `/ordenes-compra/${input.id}`);
}

export function usePagos(params?: ListParams) {
  return useApiList<Pago>("/pagos", params);
}

export function useCreatePago() {
  return useApiCreate<PagoCreate, Pago>("/pagos");
}
