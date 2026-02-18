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
  data?: ObraDto[];
  onRetry: () => void;
  onCreateWork: () => void;
}

export function GlobalDashboardView({ viewState, data, onRetry, onCreateWork }: GlobalDashboardViewProps) {
  if (viewState === "loading") return <DashboardStateLoading />;
  if (viewState === "error") return <DashboardStateError onRetry={onRetry} />;
  if (viewState === "empty") return <DashboardStateEmpty onCreateWork={onCreateWork} />;

  return (
    <DashboardStateData
      onCreateWork={onCreateWork}
      works={(data ?? []).map((obra) => ({
        code: obra.codigo,
        name: obra.nombre,
        client: "",
        resident: "",
        contractAmount: 0,
        actualBalance: 0,
        totalEstimates: 0,
        totalExpenses: 0,
        status: "",
        location: "",
        completionDate: "",
      }))}
    />
  );
}
