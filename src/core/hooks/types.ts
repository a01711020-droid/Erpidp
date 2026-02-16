export interface ResourceHookResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (payload: unknown) => Promise<void>;
  update: (id: string, payload: unknown) => Promise<void>;
}

const notImplemented = async () => {
  throw new Error("Operación no implementada en Fase 1");
};

export const createEmptyResourceState = <T>(): ResourceHookResult<T> => ({
  data: [],
  isLoading: false,
  error: null,
  refetch: async () => undefined,
  create: notImplemented,
  update: notImplemented,
});
