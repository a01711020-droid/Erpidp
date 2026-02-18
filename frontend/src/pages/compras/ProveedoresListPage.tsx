import { useProveedores } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import { SupplierManagementView } from "@/ui/SupplierManagementView";
import SupplierManagementFull from "@/ui/proveedores/SupplierManagementFullView";
import { EmptyState } from "@/app/components/states";
import { Users } from "lucide-react";

export default function ProveedoresListPage() {
  const { data, isLoading, error, refetch } = useProveedores();

  return (
    <SupplierManagementView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      errorMessage={error ?? undefined}
      onRetry={refetch}
      renderEmpty={() => (
        <EmptyState
          icon={Users}
          title="Sin proveedores"
          description="Cuando existan proveedores en el sistema aparecerán aquí."
        />
      )}
      renderFull={(fullData) => (
        <SupplierManagementFull
          suppliersData={fullData.map((supplier) => ({
            id: supplier.id,
            proveedor: supplier.proveedor,
            razonSocial: supplier.razonSocial,
            rfc: "",
            direccion: "",
            vendedor: "mostrador",
            telefono: "",
            correo: "",
          }))}
        />
      )}
    />
  );
}
