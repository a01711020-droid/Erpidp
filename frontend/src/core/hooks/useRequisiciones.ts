import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Requisicion } from "../api/types";

export function useRequisiciones() {
  const [data, setData] = useState<Requisicion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<Requisicion[]>("/api/v1/requisiciones");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar requisiciones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (payload: Partial<Requisicion>) => {
    const created = await apiRequest<Requisicion>("/api/v1/requisiciones", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setData((prev) => [...prev, created]);
    return created;
  };

  const update = async (id: string, payload: Partial<Requisicion>) => {
    const updated = await apiRequest<Requisicion>(`/api/v1/requisiciones/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  return { data, isLoading, error, create, update, refresh: fetchData };
}
