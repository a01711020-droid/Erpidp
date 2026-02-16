import { EmptyState, ErrorState, LoadingState } from "@/app/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { ProveedorDto } from "@/core/types/entities";
import type { ViewState } from "./viewState";

interface SupplierManagementViewProps {
  viewState: ViewState;
  errorMessage?: string;
  data?: ProveedorDto[];
  onRetry: () => void;
}

export function SupplierManagementView({ viewState, data, errorMessage, onRetry }: SupplierManagementViewProps) {
  if (viewState === "loading") return <LoadingState title="Cargando proveedores" message="Estamos consultando proveedores" />;
  if (viewState === "error") return <ErrorState title="Error al cargar proveedores" message={errorMessage ?? "No fue posible cargar proveedores"} onRetry={onRetry} />;
  if (viewState === "empty") return <EmptyState title="Sin proveedores" message="No hay proveedores registrados aún" actionLabel="Crear proveedor" onAction={() => undefined} />;

  return (
    <Card>
      <CardHeader><CardTitle>Proveedores</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((supplier) => (
          <div key={supplier.id} className="rounded border p-3">
            <p className="font-semibold">{supplier.proveedor}</p>
            <p className="text-sm text-slate-500">{supplier.razonSocial}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
