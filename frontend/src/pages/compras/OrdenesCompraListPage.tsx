import { useOrdenesCompra } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import { PurchaseOrderManagementView } from "@/ui/PurchaseOrderManagementView";
import PurchaseOrderManagementFull from "@/ui/compras/PurchaseOrderManagementFullView";

export default function OrdenesCompraListPage() {
  const { data, isLoading, error, refetch } = useOrdenesCompra();

  return (
    <PurchaseOrderManagementView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
      renderFull={(fullData) => (
        <PurchaseOrderManagementFull
          worksData={[]}
          buyersData={[]}
          suppliersData={[]}
        />
      )}
    />
  );
}
