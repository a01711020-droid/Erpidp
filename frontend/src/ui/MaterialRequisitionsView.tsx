import {
  MaterialRequisitionsStateEmpty,
  MaterialRequisitionsStateError,
  MaterialRequisitionsStateLoading,
} from "@/app/components/material-requisitions";
import type { RequisicionDto } from "@/core/types/entities";
import type { ReactNode } from "react";
import type { ViewState } from "./viewState";

interface MaterialRequisitionsViewProps {
  viewState: ViewState;
  data?: RequisicionDto[];
  onRetry: () => void;
  renderFull: (data: RequisicionDto[]) => ReactNode;
}

export function MaterialRequisitionsView({ viewState, data = [], onRetry, renderFull }: MaterialRequisitionsViewProps) {
  if (viewState === "loading") return <MaterialRequisitionsStateLoading />;
  if (viewState === "error") return <MaterialRequisitionsStateError onRetry={onRetry} />;
  if (viewState === "empty") return <MaterialRequisitionsStateEmpty />;
  return <>{renderFull(Array.isArray(data) ? data : [])}</>;
}
