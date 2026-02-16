import { usePagos } from "@/core/hooks/useResources";
import { PaymentManagementView } from "@/ui/PaymentManagementView";
import { resolveViewState } from "@/pages/viewState";

export default function PagosProgramacionPage() {
  const { data, isLoading, error, refetch } = usePagos();

  return (
    <PaymentManagementView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
    />
  );
}
