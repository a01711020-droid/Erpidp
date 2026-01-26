import { useCallback, useEffect, useMemo, useState } from "react";
import { dataProvider } from "../api";
import type {
  BankTransaction,
  ListParams,
  MetricasObra,
  Obra,
  OrdenCompra,
  Pago,
  Proveedor,
} from "../types/entities";

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function useAsync<T>(
  fetcher: () => Promise<T>,
  initial: T,
  deps: unknown[] = []
): AsyncState<T> {
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
}

export function useObras(params?: ListParams): AsyncState<Obra[]> {
  return useAsync(
    async () => (await dataProvider.listObras(params)).data,
    [],
    [JSON.stringify(params)]
  );
}

export function useObra(obraId?: string): AsyncState<Obra | null> {
  return useAsync(
    async () => {
      if (!obraId) return null;
      return dataProvider.getObra(obraId);
    },
    null,
    [obraId]
  );
}

export function useProveedores(params?: ListParams): AsyncState<Proveedor[]> {
  return useAsync(
    async () => (await dataProvider.listProveedores(params)).data,
    [],
    [JSON.stringify(params)]
  );
}

export function useProveedor(proveedorId?: string): AsyncState<Proveedor | null> {
  return useAsync(
    async () => {
      if (!proveedorId) return null;
      return dataProvider.getProveedor(proveedorId);
    },
    null,
    [proveedorId]
  );
}

export function useOrdenesCompra(params?: ListParams): AsyncState<OrdenCompra[]> {
  return useAsync(
    async () => (await dataProvider.listOrdenesCompra(params)).data,
    [],
    [JSON.stringify(params)]
  );
}

export function useOrdenCompra(ordenId?: string): AsyncState<OrdenCompra | null> {
  return useAsync(
    async () => {
      if (!ordenId) return null;
      return dataProvider.getOrdenCompra(ordenId);
    },
    null,
    [ordenId]
  );
}

export function usePagos(params?: ListParams): AsyncState<Pago[]> {
  return useAsync(async () => (await dataProvider.listPagos(params)).data, [], [JSON.stringify(params)]);
}

export function useMetricasObra(obraId?: string): AsyncState<MetricasObra | null> {
  return useAsync(
    async () => {
      if (!obraId) return null;
      return dataProvider.getMetricasObra(obraId);
    },
    null,
    [obraId]
  );
}

export function useBankTransactions(matched?: boolean): AsyncState<BankTransaction[]> {
  return useAsync(async () => dataProvider.listBankTransactions(matched), [], [matched]);
}
