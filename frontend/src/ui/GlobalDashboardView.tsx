import {
  DashboardStateData,
  DashboardStateEmpty,
  DashboardStateError,
  DashboardStateLoading,
} from "@/app/components/global-dashboard";
import type { ObraDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface GlobalDashboardViewProps {
  viewState: ViewState;
  errorMessage?: string;
  data?: ObraDto[];
  onRetry: () => void;
  onCreateWork: () => void;
}

export function GlobalDashboardView({ viewState, onRetry, onCreateWork }: GlobalDashboardViewProps) {
  if (viewState === "loading") return <DashboardStateLoading />;
  if (viewState === "error") return <DashboardStateError onRetry={onRetry} />;
  if (viewState === "empty") return <DashboardStateEmpty onCreateWork={onCreateWork} />;
  return <DashboardStateData onCreateWork={onCreateWork} />;
}
