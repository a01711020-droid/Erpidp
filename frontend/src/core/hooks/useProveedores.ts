import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Proveedor } from "../api/types";

export function useProveedores() {
  const [data, setData] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<Proveedor[]>("/api/v1/proveedores");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proveedores");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (payload: Partial<Proveedor>) => {
    const created = await apiRequest<Proveedor>("/api/v1/proveedores", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setData((prev) => [...prev, created]);
    return created;
  };

  const update = async (id: string, payload: Partial<Proveedor>) => {
    const updated = await apiRequest<Proveedor>(`/api/v1/proveedores/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const remove = async (id: string) => {
    await apiRequest<void>(`/api/v1/proveedores/${id}`, { method: "DELETE" });
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, isLoading, error, create, update, remove, refresh: fetchData };
}
