import { useCallback } from "react";
import { dataAdapter } from "@/core/data";
import type { CreateProveedorDTO, Proveedor, UpdateProveedorDTO } from "@/core/data/types";
import { useData } from "@/core/hooks/useData";

export function useProveedores() {
  const { data, state, error, reload } = useData<Proveedor>({
    fetcher: () => dataAdapter.listProveedores(),
    autoLoad: true,
  });

  const proveedores = Array.isArray(data) ? data : [];

  const createProveedor = useCallback(async (payload: CreateProveedorDTO) => {
    const result = await dataAdapter.createProveedor(payload);
    if (result.status === "success") {
      await reload();
    }
    return result;
  }, [reload]);

  const updateProveedor = useCallback(
    async (proveedorId: string, payload: UpdateProveedorDTO) => {
      const result = await dataAdapter.updateProveedor(proveedorId, payload);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  const deactivateProveedor = useCallback(
    async (proveedorId: string) => {
      const result = await dataAdapter.deactivateProveedor(proveedorId);
      if (result.status === "success") {
        await reload();
      }
      return result;
    },
    [reload]
  );

  return {
    proveedores,
    isLoading: state === "loading",
    error,
    refetch: reload,
    createProveedor,
    updateProveedor,
    deactivateProveedor,
  };
}
