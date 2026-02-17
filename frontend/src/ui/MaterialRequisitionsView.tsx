import {
  MaterialRequisitionsStateEmpty,
  MaterialRequisitionsStateError,
  MaterialRequisitionsStateLoading,
} from "@/app/components/material-requisitions";
import type { RequisicionDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface MaterialRequisitionsViewProps {
  viewState: ViewState;
  data?: RequisicionDto[];
  onRetry: () => void;
}

export function MaterialRequisitionsView({ viewState, onRetry }: MaterialRequisitionsViewProps) {
  if (viewState === "loading") return <MaterialRequisitionsStateLoading />;
  if (viewState === "error") return <MaterialRequisitionsStateError onRetry={onRetry} />;
  return <MaterialRequisitionsStateEmpty />;
}
