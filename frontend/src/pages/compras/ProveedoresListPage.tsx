import { useProveedores } from "@/core/hooks/useResources";
import { SupplierManagementView } from "@/ui/SupplierManagementView";
import { resolveViewState } from "@/pages/viewState";

export default function ProveedoresListPage() {
  const { data, isLoading, error, refetch } = useProveedores();

  return (
    <SupplierManagementView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      errorMessage={error ?? undefined}
      onRetry={refetch}
    />
  );
}
