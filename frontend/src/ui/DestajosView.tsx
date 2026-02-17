import {
  DestajosStateEmpty,
  DestajosStateError,
  DestajosStateLoading,
} from "@/app/components/destajos";
import type { DestajoSemanaDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface DestajosViewProps {
  viewState: ViewState;
  data?: DestajoSemanaDto[];
  onRetry: () => void;
}

export function DestajosView({ viewState, onRetry }: DestajosViewProps) {
  if (viewState === "loading") return <DestajosStateLoading />;
  if (viewState === "error") return <DestajosStateError onRetry={onRetry} />;
  return <DestajosStateEmpty />;
}
