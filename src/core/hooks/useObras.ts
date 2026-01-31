import { useCallback } from "react";
import { dataAdapter } from "@/core/data";
import type { CreateObraDTO, Obra, UpdateObraDTO } from "@/core/data/types";
import { useData } from "@/core/hooks/useData";

export function useObras() {
  const { data, state, error, reload } = useData<Obra>({
    fetcher: () => dataAdapter.listObras(),
    autoLoad: true,
  });

  const obras = Array.isArray(data) ? data : [];

  const createObra = useCallback(async (payload: CreateObraDTO) => {
    const result = await dataAdapter.createObra(payload);
    if (result.status === "success") {
      await reload();
    }
    return result;
  }, [reload]);

  const updateObra = useCallback(
    async (obraId: string, payload: UpdateObraDTO) => {
      const result = await dataAdapter.updateObra(obraId, payload);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  const deleteObra = useCallback(
    async (obraId: string) => {
      const result = await dataAdapter.deleteObra(obraId);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  return {
    obras,
    isLoading: state === "loading",
    error,
    refetch: reload,
    createObra,
    updateObra,
    deleteObra,
  };
}
