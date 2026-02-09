/**
 * HOOKS PERSONALIZADOS PARA EL DATA PROVIDER
 * Facilita el uso del dataProvider en componentes React
 */

import { useState, useEffect, useCallback } from "react";
import { dataProvider } from "@/app/providers";
import type {
  Obra,
  Proveedor,
  Requisicion,
  OrdenCompra,
  Pago,
  PaginatedResponse,
  ListParams,
} from "@/app/types/entities";

// ============================================================================
// TIPOS DE ESTADO GENÉRICO
// ============================================================================

interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface ListState<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
}

// ============================================================================
// HOOK GENÉRICO PARA OBTENER UN ITEM POR ID
// ============================================================================

export function useDataItem<T>(
  fetcher: (id: string) => Promise<T>,
  id: string | null
): DataState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcher(id);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      console.error("Error fetching data:", error);
    }
  }, [id, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ============================================================================
// HOOK GENÉRICO PARA LISTAR ITEMS
// ============================================================================

export function useDataList<T>(
  fetcher: (params?: ListParams) => Promise<PaginatedResponse<T>>,
  params?: ListParams
): ListState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ListState<T>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetcher(params);
      setState({
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }));
      console.error("Error fetching list:", error);
    }
  }, [fetcher, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ============================================================================
// HOOKS ESPECÍFICOS POR ENTIDAD
// ============================================================================

// ---------- OBRAS ----------

export function useObra(id: string | null) {
  return useDataItem(dataProvider.getObra, id);
}

export function useObras(params?: ListParams) {
  return useDataList(dataProvider.listObras, params);
}

// ---------- PROVEEDORES ----------

export function useProveedor(id: string | null) {
  return useDataItem(dataProvider.getProveedor, id);
}

export function useProveedores(params?: ListParams) {
  return useDataList(dataProvider.listProveedores, params);
}

// ---------- REQUISICIONES ----------

export function useRequisicion(id: string | null) {
  return useDataItem(dataProvider.getRequisicion, id);
}

export function useRequisiciones(params?: ListParams) {
  return useDataList(dataProvider.listRequisiciones, params);
}

// ---------- ÓRDENES DE COMPRA ----------

export function useOrdenCompra(id: string | null) {
  return useDataItem(dataProvider.getOrdenCompra, id);
}

export function useOrdenesCompra(params?: ListParams) {
  return useDataList(dataProvider.listOrdenesCompra, params);
}

// ---------- PAGOS ----------

export function usePago(id: string | null) {
  return useDataItem(dataProvider.getPago, id);
}

export function usePagos(params?: ListParams) {
  return useDataList(dataProvider.listPagos, params);
}

// ============================================================================
// HOOK PARA MUTACIONES (CREATE, UPDATE, DELETE)
// ============================================================================

interface MutationState {
  loading: boolean;
  error: Error | null;
}

export function useMutation<TInput, TOutput>(
  mutator: (input: TInput) => Promise<TOutput>
) {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setState({ loading: true, error: null });
      try {
        const result = await mutator(input);
        setState({ loading: false, error: null });
        return result;
      } catch (error) {
        setState({ loading: false, error: error as Error });
        console.error("Mutation error:", error);
        return null;
      }
    },
    [mutator]
  );

  return { ...state, mutate };
}

// ============================================================================
// EJEMPLOS DE USO DE MUTACIONES
// ============================================================================

// Crear obra
export function useCreateObra() {
  return useMutation(dataProvider.createObra);
}

// Actualizar obra
export function useUpdateObra() {
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Obra> }) =>
      dataProvider.updateObra(id, data)
  );
}

// Crear requisición
export function useCreateRequisicion() {
  return useMutation(dataProvider.createRequisicion);
}

// Aprobar requisición
export function useApproveRequisicion() {
  return useMutation(
    ({ id, approvedBy }: { id: string; approvedBy: string }) =>
      dataProvider.updateRequisicion(id, {
        estado: "aprobada",
        aprobadoPor: approvedBy,
        fechaAprobacion: new Date().toISOString(),
      })
  );
}

// Crear orden de compra
export function useCreateOrdenCompra() {
  return useMutation(dataProvider.createOrdenCompra);
}

// Crear pago
export function useCreatePago() {
  return useMutation(dataProvider.createPago);
}

// Procesar pago
export function useProcessPago() {
  return useMutation(
    ({ id, processedBy }: { id: string; processedBy: string }) =>
      dataProvider.updatePago(id, {
        estado: "completado",
        procesadoPor: processedBy,
        fechaProcesado: new Date().toISOString(),
      })
  );
}
