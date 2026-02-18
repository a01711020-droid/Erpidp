import {
  DestajosStateEmpty,
  DestajosStateError,
  DestajosStateLoading,
} from "@/app/components/destajos";
import type { DestajoSemanaDto } from "@/core/types/entities";
import type { ReactNode } from "react";
import type { ViewState } from "./viewState";

interface DestajosViewProps {
  viewState: ViewState;
  data?: DestajoSemanaDto[];
  onRetry: () => void;
  renderFull: (data: DestajoSemanaDto[]) => ReactNode;
}

export function DestajosView({ viewState, data = [], onRetry, renderFull }: DestajosViewProps) {
  if (viewState === "loading") return <DestajosStateLoading />;
  if (viewState === "error") return <DestajosStateError onRetry={onRetry} />;
  if (viewState === "empty") return <DestajosStateEmpty />;

  const safeData = Array.isArray(data) ? data : [];
  if (viewState === "data") return <>{renderFull(safeData)}</>;

  return <DestajosStateEmpty />;
}
