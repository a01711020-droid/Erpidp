import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Pago } from "../api/types";

export function usePagos() {
  const [data, setData] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<Pago[]>("/api/v1/pagos");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pagos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (payload: Partial<Pago>) => {
    const created = await apiRequest<Pago>("/api/v1/pagos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setData((prev) => [...prev, created]);
    return created;
  };

  return { data, isLoading, error, create, refresh: fetchData };
}
