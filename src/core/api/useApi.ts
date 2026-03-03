/**
 * useApi — hook reutilizable para fetch con 4 estados
 * Uso: const { status, data, error, reload } = useApi<T>(EP.ocs)
 */
import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from './client';

type Status = 'loading' | 'error' | 'empty' | 'data';

interface UseApiResult<T> {
  status: Status;
  data: T | null;
  error: string;
  reload: () => void;
}

export function useApi<T>(
  endpoint: string | null,
  isEmpty?: (d: T) => boolean,
): UseApiResult<T> {
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData]     = useState<T | null>(null);
  const [error, setError]   = useState('');
  const [tick, setTick]     = useState(0);

  const reload = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    setStatus('loading');
    api.get<T>(endpoint)
      .then(d => {
        if (cancelled) return;
        setData(d);
        const empty = isEmpty ? isEmpty(d) : Array.isArray((d as any).data ?? d) && ((d as any).data ?? d).length === 0;
        setStatus(empty ? 'empty' : 'data');
      })
      .catch(e => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : 'Error inesperado');
        setStatus('error');
      });
    return () => { cancelled = true; };
  }, [endpoint, tick]);

  return { status, data, error, reload };
}
