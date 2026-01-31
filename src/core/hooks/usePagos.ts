import { useCallback } from "react";
import { dataAdapter } from "@/core/data";
import type { CreatePagoDTO, Pago } from "@/core/data/types";
import { useData } from "@/core/hooks/useData";

export function usePagos() {
  const { data, state, error, reload } = useData<Pago>({
    fetcher: () => dataAdapter.listPagos(),
    autoLoad: true,
  });

  const pagos = Array.isArray(data) ? data : [];

  const createPago = useCallback(async (payload: CreatePagoDTO) => {
    const result = await dataAdapter.createPago(payload);
    if (result.status === "success") {
      await reload();
    }
    return result;
  }, [reload]);

  return {
    pagos,
    isLoading: state === "loading",
    error,
    refetch: reload,
    createPago,
  };
}
