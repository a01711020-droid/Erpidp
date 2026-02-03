import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { OrdenCompra } from "../api/types";

export function useOrdenesCompra() {
  const [data, setData] = useState<OrdenCompra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<OrdenCompra[]>("/api/v1/ordenes-compra");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar órdenes de compra");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (payload: Partial<OrdenCompra>) => {
    const created = await apiRequest<OrdenCompra>("/api/v1/ordenes-compra", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await fetchData();
    return created;
  };

  const update = async (id: string, payload: Partial<OrdenCompra>) => {
    const updated = await apiRequest<OrdenCompra>(`/api/v1/ordenes-compra/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    await fetchData();
    return updated;
  };

  const remove = async (id: string) => {
    await apiRequest<void>(`/api/v1/ordenes-compra/${id}`, { method: "DELETE" });
    await fetchData();
  };

  return { data, isLoading, error, create, update, remove, refresh: fetchData };
}
