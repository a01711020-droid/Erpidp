import { useRequisiciones } from "@/core/hooks/useResources";
import { MaterialRequisitionsView } from "@/ui/MaterialRequisitionsView";
import { resolveViewState } from "@/pages/viewState";

export default function RequisicionesListPage() {
  const { data, isLoading, error, refetch } = useRequisiciones();

  return (
    <MaterialRequisitionsView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
    />
  );
}
