import { useCallback } from "react";
import { dataAdapter } from "@/core/data";
import type { CreateOrdenCompraDTO, OrdenCompra } from "@/core/data/types";
import { useData } from "@/core/hooks/useData";

export function useOrdenesCompra() {
  const { data, state, error, reload } = useData<OrdenCompra>({
    fetcher: () => dataAdapter.listOrdenesCompra(),
    autoLoad: true,
  });

  const ordenes = Array.isArray(data) ? data : [];

  const createOrdenCompra = useCallback(async (payload: CreateOrdenCompraDTO) => {
    const result = await dataAdapter.createOrdenCompra(payload);
    if (result.status === "success") {
      await reload();
    }
    return result;
  }, [reload]);

  const updateEstatus = useCallback(
    async (ocId: string, estatus: string) => {
      const result = await dataAdapter.updateOrdenCompraEstatus(ocId, estatus);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  const cancelOrdenCompra = useCallback(
    async (ocId: string, motivo?: string) => {
      const result = await dataAdapter.cancelOrdenCompra(ocId, motivo);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  return {
    ordenes,
    isLoading: state === "loading",
    error,
    refetch: reload,
    createOrdenCompra,
    updateEstatus,
    cancelOrdenCompra,
  };
}
