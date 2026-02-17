import { usePagos } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import { PaymentManagementView } from "@/ui/PaymentManagementView";

export default function PagosProgramacionPage() {
  const { data, isLoading, error, refetch } = usePagos();

  return (
    <PaymentManagementView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
      renderFull={() => null}
    />
  );
}
