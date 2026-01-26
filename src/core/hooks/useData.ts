import { useCallback, useEffect, useMemo, useState } from "react";
import { dataProvider, ApiError } from "../api";
import type {
  ListParams,
  Obra,
  ObraCreate,
  ObraUpdate,
  OrdenCompra,
  OrdenCompraCreate,
  OrdenCompraUpdate,
  Pago,
  PagoCreate,
  PagoUpdate,
  Proveedor,
  ProveedorCreate,
  ProveedorUpdate,
  MetricasObra,
} from "../types/entities";
import { invalidate, useInvalidationKey } from "./cache";

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

interface MutationState<TPayload, TResult> {
  mutate: (payload: TPayload) => Promise<TResult | null>;
  loading: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

const useAsync = <T,>(fetcher: () => Promise<T>, initial: T, deps: unknown[]): AsyncState<T> => {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      reload,
    }),
    [data, loading, error, reload]
  );
};

const useMutation = <TPayload, TResult>(
  action: (payload: TPayload) => Promise<TResult>,
  onSuccess?: (result: TResult, payload: TPayload) => void
): MutationState<TPayload, TResult> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined);

  const mutate = useCallback(
    async (payload: TPayload) => {
      setLoading(true);
      setError(null);
      setFieldErrors(undefined);
      try {
        const result = await action(payload);
        onSuccess?.(result, payload);
        return result;
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
          setFieldErrors(err.fieldErrors);
        } else {
          setError((err as Error).message);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [action, onSuccess]
  );

  return { mutate, loading, error, fieldErrors };
};

const invalidateObras = (obraId?: string) => {
  invalidate("obras");
  if (obraId) invalidate(`obra:${obraId}`);
};

const invalidateProveedores = (proveedorId?: string) => {
  invalidate("proveedores");
  if (proveedorId) invalidate(`proveedor:${proveedorId}`);
};

const invalidateOrdenes = (ordenId?: string, obraId?: string) => {
  invalidate("ordenes-compra");
  if (ordenId) invalidate(`orden-compra:${ordenId}`);
  if (obraId) invalidate(`obra-metricas:${obraId}`);
};

const invalidatePagos = (pagoId?: string, obraId?: string) => {
  invalidate("pagos");
  if (pagoId) invalidate(`pago:${pagoId}`);
  if (obraId) invalidate(`obra-metricas:${obraId}`);
};

export const useObrasList = (params?: ListParams): AsyncState<Obra[]> => {
  const version = useInvalidationKey("obras");
  return useAsync(async () => (await dataProvider.listObras(params)).data, [], [
    JSON.stringify(params),
    version,
  ]);
};

export const useObra = (obraId?: string): AsyncState<Obra | null> => {
  const version = useInvalidationKey(`obra:${obraId ?? ""}`);
  return useAsync(
    async () => {
      if (!obraId) return null;
      return dataProvider.getObra(obraId);
    },
    null,
    [obraId, version]
  );
};

export const useCreateObra = (): MutationState<ObraCreate, Obra> =>
  useMutation(async (payload) => dataProvider.createObra(payload), (result) => {
    invalidateObras(result.id);
  });

export const useUpdateObra = (): MutationState<{ id: string; data: ObraUpdate }, Obra> =>
  useMutation(
    async ({ id, data }) => dataProvider.updateObra(id, data),
    (result) => invalidateObras(result.id)
  );

export const useDeleteObra = (): MutationState<string, void> =>
  useMutation(async (id) => dataProvider.deleteObra(id), (_, id) => invalidateObras(id));

export const useProveedoresList = (params?: ListParams): AsyncState<Proveedor[]> => {
  const version = useInvalidationKey("proveedores");
  return useAsync(async () => (await dataProvider.listProveedores(params)).data, [], [
    JSON.stringify(params),
    version,
  ]);
};

export const useProveedor = (proveedorId?: string): AsyncState<Proveedor | null> => {
  const version = useInvalidationKey(`proveedor:${proveedorId ?? ""}`);
  return useAsync(
    async () => {
      if (!proveedorId) return null;
      return dataProvider.getProveedor(proveedorId);
    },
    null,
    [proveedorId, version]
  );
};

export const useCreateProveedor = (): MutationState<ProveedorCreate, Proveedor> =>
  useMutation(async (payload) => dataProvider.createProveedor(payload), (result) => {
    invalidateProveedores(result.id);
  });

export const useUpdateProveedor = (): MutationState<{ id: string; data: ProveedorUpdate }, Proveedor> =>
  useMutation(
    async ({ id, data }) => dataProvider.updateProveedor(id, data),
    (result) => invalidateProveedores(result.id)
  );

export const useDeleteProveedor = (): MutationState<string, void> =>
  useMutation(async (id) => dataProvider.deleteProveedor(id), (_, id) =>
    invalidateProveedores(id)
  );

export const useOrdenesCompraList = (params?: ListParams): AsyncState<OrdenCompra[]> => {
  const version = useInvalidationKey("ordenes-compra");
  return useAsync(async () => (await dataProvider.listOrdenesCompra(params)).data, [], [
    JSON.stringify(params),
    version,
  ]);
};

export const useOrdenCompra = (ordenId?: string): AsyncState<OrdenCompra | null> => {
  const version = useInvalidationKey(`orden-compra:${ordenId ?? ""}`);
  return useAsync(
    async () => {
      if (!ordenId) return null;
      return dataProvider.getOrdenCompra(ordenId);
    },
    null,
    [ordenId, version]
  );
};

export const useCreateOrdenCompra = (): MutationState<OrdenCompraCreate, OrdenCompra> =>
  useMutation(async (payload) => dataProvider.createOrdenCompra(payload), (result) => {
    invalidateOrdenes(result.id, result.obraId);
  });

export const useUpdateOrdenCompra = (): MutationState<
  { id: string; data: OrdenCompraUpdate },
  OrdenCompra
> =>
  useMutation(
    async ({ id, data }) => dataProvider.updateOrdenCompra(id, data),
    (result) => invalidateOrdenes(result.id, result.obraId)
  );

export const useDeleteOrdenCompra = (): MutationState<{ id: string; obraId?: string }, void> =>
  useMutation(async ({ id }) => dataProvider.deleteOrdenCompra(id), (_, payload) =>
    invalidateOrdenes(payload.id, payload.obraId)
  );

export const usePagosList = (params?: ListParams): AsyncState<Pago[]> => {
  const version = useInvalidationKey("pagos");
  return useAsync(async () => (await dataProvider.listPagos(params)).data, [], [
    JSON.stringify(params),
    version,
  ]);
};

export const usePago = (pagoId?: string): AsyncState<Pago | null> => {
  const version = useInvalidationKey(`pago:${pagoId ?? ""}`);
  return useAsync(
    async () => {
      if (!pagoId) return null;
      return dataProvider.getPago(pagoId);
    },
    null,
    [pagoId, version]
  );
};

export const useCreatePago = (): MutationState<PagoCreate, Pago> =>
  useMutation(async (payload) => dataProvider.createPago(payload), (result) => {
    invalidatePagos(result.id, result.obraId);
  });

export const useUpdatePago = (): MutationState<{ id: string; data: PagoUpdate }, Pago> =>
  useMutation(
    async ({ id, data }) => dataProvider.updatePago(id, data),
    (result) => invalidatePagos(result.id, result.obraId)
  );

export const useDeletePago = (): MutationState<{ id: string; obraId?: string }, void> =>
  useMutation(async ({ id }) => dataProvider.deletePago(id), (_, payload) =>
    invalidatePagos(payload.id, payload.obraId)
  );

export const useMetricasObra = (obraId?: string): AsyncState<MetricasObra | null> => {
  const version = useInvalidationKey(`obra-metricas:${obraId ?? ""}`);
  return useAsync(
    async () => {
      if (!obraId) return null;
      return dataProvider.getMetricasObra(obraId);
    },
    null,
    [obraId, version]
  );
};
