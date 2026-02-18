import { ErrorState, LoadingState } from "@/app/components/states";
import type { ProveedorDto } from "@/core/types/entities";
import type { ReactNode } from "react";
import type { ViewState } from "./viewState";

interface SupplierManagementViewProps {
  viewState: ViewState;
  data?: ProveedorDto[];
  errorMessage?: string;
  onRetry: () => void;
  renderFull: (data: ProveedorDto[]) => ReactNode;
  renderEmpty: () => ReactNode;
}

export function SupplierManagementView({
  viewState,
  data = [],
  errorMessage,
  onRetry,
  renderFull,
  renderEmpty,
}: SupplierManagementViewProps) {
  if (viewState === "loading") {
    return <LoadingState type="table" rows={6} />;
  }

  if (viewState === "error") {
    return (
      <ErrorState
        title="No fue posible cargar proveedores"
        message={errorMessage ?? "Intenta de nuevo"}
        onRetry={onRetry}
      />
    );
  }

  if (viewState === "empty") {
    return <>{renderEmpty()}</>;
  }

  return <>{renderFull(Array.isArray(data) ? data : [])}</>;
}
