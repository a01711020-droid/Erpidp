import { useRequisiciones } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import MaterialRequisitionsFull from "@/ui/requisiciones/MaterialRequisitionsFullView";
import { MaterialRequisitionsView } from "@/ui/MaterialRequisitionsView";

export default function RequisicionesListPage() {
  const { data, isLoading, error, refetch } = useRequisiciones();

  return (
    <MaterialRequisitionsView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
      renderFull={() => <MaterialRequisitionsFull residentsData={[]} requisitionsData={[]} />}
    />
  );
}
