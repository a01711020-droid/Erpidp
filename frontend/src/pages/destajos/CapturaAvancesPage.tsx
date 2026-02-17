import { useDestajos } from "@/core/hooks/useResources";
import { resolveViewState } from "@/pages/viewState";
import DestajosFull from "@/ui/destajos/DestajosFullView";
import { DestajosView } from "@/ui/DestajosView";

export default function CapturaAvancesPage() {
  const { data, isLoading, error, refetch } = useDestajos();

  return (
    <DestajosView
      viewState={resolveViewState(isLoading, error, data.length)}
      data={data}
      onRetry={refetch}
      renderFull={() => <DestajosFull destajistasData={[]} obrasData={[]} resumenObrasData={[]} />}
    />
  );
}
