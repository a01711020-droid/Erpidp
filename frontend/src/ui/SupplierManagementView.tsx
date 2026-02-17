import { EmptyState, ErrorState, LoadingState } from "@/app/components/states";
import { Users } from "lucide-react";
import type { ProveedorDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface SupplierManagementViewProps {
  viewState: ViewState;
  data?: ProveedorDto[];
  errorMessage?: string;
  onRetry: () => void;
}

export function SupplierManagementView({ viewState, errorMessage, onRetry }: SupplierManagementViewProps) {
  if (viewState === "loading") {
    return <LoadingState title="Cargando proveedores" message="Consultando catálogo de proveedores" />;
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

  return (
    <EmptyState
      icon={Users}
      title="Sin proveedores"
      description="Cuando existan proveedores en el sistema aparecerán aquí."
    />
  );
}
