import type { ViewState } from "@/ui/viewState";

export function resolveViewState(isLoading: boolean, error: string | null, count: number): ViewState {
  if (isLoading) return "loading";
  if (error) return "error";
  if (count === 0) return "empty";
  return "data";
}
