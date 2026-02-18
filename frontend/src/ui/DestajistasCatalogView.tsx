import {
  DestajistasStateEmpty,
  DestajistasStateLoading,
} from "@/app/components/destajistas-management";
import { ErrorState } from "@/app/components/states";
import type { DestajistaDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface DestajistasCatalogViewProps {
  viewState: ViewState;
  data?: DestajistaDto[];
  onRetry: () => void;
}

export function DestajistasCatalogView({ viewState, onRetry }: DestajistasCatalogViewProps) {
  if (viewState === "loading") return <DestajistasStateLoading onBack={() => undefined} />;
  if (viewState === "error") {
    return (
      <ErrorState
        title="No fue posible cargar destajistas"
        message="Intenta de nuevo"
        onRetry={onRetry}
      />
    );
  }

  return <DestajistasStateEmpty onBack={() => undefined} />;
}
