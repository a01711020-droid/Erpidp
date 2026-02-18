import { useObras } from "@/core/hooks/useResources";
import { GlobalDashboardView } from "@/ui/GlobalDashboardView";
import { resolveViewState } from "@/pages/viewState";

export default function GlobalDashboardPage() {
  const { data, isLoading, error, refetch } = useObras();

  return (
    <GlobalDashboardView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      errorMessage={error ?? undefined}
      onRetry={refetch}
      onCreateWork={() => undefined}
    />
  );
}
