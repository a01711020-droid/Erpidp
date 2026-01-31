import { useCallback } from "react";
import { dataAdapter } from "@/core/data";
import type { CreateRequisicionDTO, RequisicionMaterial } from "@/core/data/types";
import { useData } from "@/core/hooks/useData";

export function useRequisiciones() {
  const { data, state, error, reload } = useData<RequisicionMaterial>({
    fetcher: () => dataAdapter.listRequisiciones(),
    autoLoad: true,
  });

  const requisiciones = Array.isArray(data) ? data : [];

  const createRequisicion = useCallback(async (payload: CreateRequisicionDTO) => {
    const result = await dataAdapter.createRequisicion(payload);
    if (result.status === "success") {
      await reload();
    }
    return result;
  }, [reload]);

  const updateEstatus = useCallback(
    async (requisicionId: string, estatus: string) => {
      const result = await dataAdapter.updateRequisicionEstatus(requisicionId, estatus);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  return {
    requisiciones,
    isLoading: state === "loading",
    error,
    refetch: reload,
    createRequisicion,
    updateEstatus,
  };
}
