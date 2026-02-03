import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Obra } from "../api/types";

export function useObras() {
  const [data, setData] = useState<Obra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<Obra[]>("/api/v1/obras");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar obras");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (payload: Partial<Obra>) => {
    const created = await apiRequest<Obra>("/api/v1/obras", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setData((prev) => [...prev, created]);
    return created;
  };

  const update = async (id: string, payload: Partial<Obra>) => {
    const updated = await apiRequest<Obra>(`/api/v1/obras/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    setData((prev) => prev.map((obra) => (obra.id === id ? updated : obra)));
    return updated;
  };

  const remove = async (id: string) => {
    await apiRequest<void>(`/api/v1/obras/${id}`, { method: "DELETE" });
    setData((prev) => prev.filter((obra) => obra.id !== id));
  };

  return { data, isLoading, error, create, update, remove, refresh: fetchData };
}
