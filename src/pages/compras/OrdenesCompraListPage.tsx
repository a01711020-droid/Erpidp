import { useOrdenesCompra } from "@/core/hooks/useResources";
import { PurchaseOrderManagementView } from "@/ui/PurchaseOrderManagementView";
import { resolveViewState } from "@/pages/viewState";

export default function OrdenesCompraListPage() {
  const { data, isLoading, error, refetch } = useOrdenesCompra();

  return (
    <PurchaseOrderManagementView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      errorMessage={error ?? undefined}
      onRetry={refetch}
    />
  );
}
