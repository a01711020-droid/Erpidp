import { useDestajos } from "@/core/hooks/useResources";
import { DestajosView } from "@/ui/DestajosView";
import { resolveViewState } from "@/pages/viewState";

export default function CapturaAvancesPage() {
  const { data, isLoading, error, refetch } = useDestajos();

  return (
    <DestajosView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
    />
  );
}
